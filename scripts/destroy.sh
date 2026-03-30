#!/bin/bash
set -e

# Check if environment parameter is provided
if [ $# -eq 0 ]; then
    echo "❌ Error: Environment parameter is required"
    echo "Usage: $0 <environment>"
    echo "Example: $0 dev"
    echo "Available environments: dev, test, prod"
    exit 1
fi

ENVIRONMENT=$1
PROJECT_NAME=${2:-twin}
GITHUB_REPOSITORY=${GITHUB_REPOSITORY:-"VinceBmmrt/digital-twin-V2"}

echo "🗑️ Preparing to destroy ${PROJECT_NAME}-${ENVIRONMENT} infrastructure..."

# Navigate to terraform directory
cd "$(dirname "$0")/../terraform"

# Get AWS Account ID and Region for backend configuration
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${DEFAULT_AWS_REGION:-eu-west-1}

# Initialize terraform with S3 backend
echo "🔧 Initializing Terraform with S3 backend..."
terraform init -input=false \
  -backend-config="bucket=twin-terraform-state-${AWS_ACCOUNT_ID}" \
  -backend-config="key=${ENVIRONMENT}/terraform.tfstate" \
  -backend-config="region=${AWS_REGION}" \
  -backend-config="dynamodb_table=twin-terraform-locks" \
  -backend-config="encrypt=true"

# Check if workspace exists
if ! terraform workspace list | grep -q "$ENVIRONMENT"; then
    echo "❌ Error: Workspace '$ENVIRONMENT' does not exist"
    echo "Available workspaces:"
    terraform workspace list
    exit 1
fi

# Select the workspace
terraform workspace select "$ENVIRONMENT"

# Remove global IAM resources from state before destroy
# These resources are shared across all environments and must not be deleted from AWS
echo "🔓 Removing global IAM resources from state (they will NOT be deleted from AWS)..."
terraform state rm aws_iam_openid_connect_provider.github 2>/dev/null || true
terraform state rm aws_iam_role.github_actions 2>/dev/null || true

echo "📦 Emptying S3 buckets..."

# Get bucket names with account ID (matching Day 4 naming)
FRONTEND_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-frontend-${AWS_ACCOUNT_ID}"
MEMORY_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-memory-${AWS_ACCOUNT_ID}"

# Empty frontend bucket if it exists
if aws s3 ls "s3://$FRONTEND_BUCKET" 2>/dev/null; then
    echo "  Emptying $FRONTEND_BUCKET..."
    aws s3 rm "s3://$FRONTEND_BUCKET" --recursive
else
    echo "  Frontend bucket not found or already empty"
fi

# Empty memory bucket if it exists
if aws s3 ls "s3://$MEMORY_BUCKET" 2>/dev/null; then
    echo "  Emptying $MEMORY_BUCKET..."
    aws s3 rm "s3://$MEMORY_BUCKET" --recursive
else
    echo "  Memory bucket not found or already empty"
fi

echo "🔥 Running terraform destroy..."

# Create a dummy lambda zip if it doesn't exist (needed for destroy in GitHub Actions)
if [ ! -f "../backend/lambda-deployment.zip" ]; then
    echo "Creating dummy lambda package for destroy operation..."
    echo "dummy" | zip ../backend/lambda-deployment.zip -
fi

# Run terraform destroy with auto-approve
if [ "$ENVIRONMENT" = "prod" ] && [ -f "prod.tfvars" ]; then
    terraform destroy -var-file=prod.tfvars \
                     -var="project_name=$PROJECT_NAME" \
                     -var="environment=$ENVIRONMENT" \
                     -var="github_repository=$GITHUB_REPOSITORY" \
                     -auto-approve
else
    terraform destroy -var="project_name=$PROJECT_NAME" \
                     -var="environment=$ENVIRONMENT" \
                     -var="github_repository=$GITHUB_REPOSITORY" \
                     -auto-approve
fi

# Re-import global IAM resources into state so next deployment works seamlessly
echo "🔁 Re-importing global IAM resources into state..."
terraform import \
  -var="github_repository=$GITHUB_REPOSITORY" \
  -var="project_name=$PROJECT_NAME" \
  -var="environment=$ENVIRONMENT" \
  aws_iam_openid_connect_provider.github \
  arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com 2>/dev/null || true

terraform import \
  -var="github_repository=$GITHUB_REPOSITORY" \
  -var="project_name=$PROJECT_NAME" \
  -var="environment=$ENVIRONMENT" \
  aws_iam_role.github_actions \
  github-actions-twin-deploy 2>/dev/null || true

echo "✅ Infrastructure for ${ENVIRONMENT} has been destroyed!"
echo ""
echo "💡 To remove the workspace completely, run:"
echo "   terraform workspace select default"
echo "   terraform workspace delete $ENVIRONMENT"