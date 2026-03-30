#!/bin/bash
set -e

ENVIRONMENT=${1:-dev}
PROJECT_NAME=${2:-twin}
GITHUB_REPOSITORY=${GITHUB_REPOSITORY:-"VinceBmmrt/digital-twin-V2"}

echo "🚀 Deploying ${PROJECT_NAME} to ${ENVIRONMENT}..."

cd "$(dirname "$0")/.."

echo "📦 Building Lambda package..."
(cd backend && uv run deploy.py)

cd terraform

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${DEFAULT_AWS_REGION:-eu-west-1}
STATE_BUCKET="twin-terraform-state-${AWS_ACCOUNT_ID}"
LOCK_TABLE="twin-terraform-locks"

# ✅ Créer le bucket S3 s'il n'existe pas
echo "🪣 Ensuring Terraform state bucket exists..."
if ! aws s3api head-bucket --bucket "$STATE_BUCKET" 2>/dev/null; then
  echo "  → Creating bucket $STATE_BUCKET..."
  if [ "$AWS_REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$STATE_BUCKET" --region "$AWS_REGION"
  else
    aws s3api create-bucket --bucket "$STATE_BUCKET" --region "$AWS_REGION" \
      --create-bucket-configuration LocationConstraint="$AWS_REGION"
  fi
  aws s3api put-bucket-versioning --bucket "$STATE_BUCKET" \
    --versioning-configuration Status=Enabled
  aws s3api put-bucket-encryption --bucket "$STATE_BUCKET" \
    --server-side-encryption-configuration '{
      "Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]
    }'
  echo "  ✅ Bucket créé"
else
  echo "  ✅ Bucket déjà existant"
fi

# ✅ Créer la table DynamoDB pour les locks si elle n'existe pas
echo "🔒 Ensuring DynamoDB lock table exists..."
if ! aws dynamodb describe-table --table-name "$LOCK_TABLE" --region "$AWS_REGION" 2>/dev/null; then
  echo "  → Creating DynamoDB table $LOCK_TABLE..."
  aws dynamodb create-table \
    --table-name "$LOCK_TABLE" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "$AWS_REGION"
  aws dynamodb wait table-exists --table-name "$LOCK_TABLE" --region "$AWS_REGION"
  echo "  ✅ Table créée"
else
  echo "  ✅ Table déjà existante"
fi

terraform init -input=false \
  -backend-config="bucket=$STATE_BUCKET" \
  -backend-config="key=${ENVIRONMENT}/terraform.tfstate" \
  -backend-config="region=${AWS_REGION}" \
  -backend-config="dynamodb_table=$LOCK_TABLE" \
  -backend-config="encrypt=true"

if ! terraform workspace list | grep -q "$ENVIRONMENT"; then
  terraform workspace new "$ENVIRONMENT"
else
  terraform workspace select "$ENVIRONMENT"
fi

# ✅ Import global IAM resources if they exist in AWS but not in state
# These resources are global and never deleted from AWS, even after a destroy
echo "🔁 Importing global IAM resources if needed..."
TF_IMPORT_VARS="-var=project_name=$PROJECT_NAME -var=environment=$ENVIRONMENT -var=github_repository=$GITHUB_REPOSITORY"

import_if_missing() {
  RESOURCE=$1
  ID=$2
  if ! terraform state list | grep -q "^${RESOURCE}$"; then
    echo "  → Importing ${RESOURCE}..."
    terraform import $TF_IMPORT_VARS "$RESOURCE" "$ID" 2>/dev/null || true
  else
    echo "  ✅ ${RESOURCE} already in state"
  fi
}

import_if_missing "aws_iam_openid_connect_provider.github" \
  "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"

import_if_missing "aws_iam_role.github_actions" \
  "github-actions-twin-deploy"

# ✅ Toutes les vars communes incluant github_repository
TF_COMMON_VARS=(
  -var="project_name=$PROJECT_NAME"
  -var="environment=$ENVIRONMENT"
  -var="github_repository=$GITHUB_REPOSITORY"
)

if [ "$ENVIRONMENT" = "prod" ]; then
  TF_APPLY_CMD=(terraform apply -var-file=prod.tfvars "${TF_COMMON_VARS[@]}" -auto-approve)
else
  TF_APPLY_CMD=(terraform apply "${TF_COMMON_VARS[@]}" -auto-approve)
fi

echo "🎯 Applying Terraform..."
"${TF_APPLY_CMD[@]}"

API_URL=$(terraform output -raw api_gateway_url)
FRONTEND_BUCKET=$(terraform output -raw s3_frontend_bucket)
CUSTOM_URL=$(terraform output -raw custom_domain_url 2>/dev/null || true)

# 3. Build + deploy frontend
cd ../frontend

echo "📝 Setting API URL for production..."
echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.production

npm install
npm run build
aws s3 sync ./out "s3://$FRONTEND_BUCKET/" --delete
cd ..

# 4. Final messages
echo -e "\n✅ Deployment complete!"
echo "🌐 CloudFront URL : $(terraform -chdir=terraform output -raw cloudfront_url)"
if [ -n "$CUSTOM_URL" ]; then
  echo "🔗 Custom domain  : $CUSTOM_URL"
fi
echo "📡 API Gateway    : $API_URL"