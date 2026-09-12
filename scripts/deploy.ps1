param(
    [string]$Environment = "dev",   # dev | test | prod
    [string]$ProjectName = "twin"
)
$ErrorActionPreference = "Stop"

$GithubRepository = if ($env:GITHUB_REPOSITORY) { $env:GITHUB_REPOSITORY } else { "VinceBmmrt/digital-twin-V2" }

Write-Host "Deploying $ProjectName to $Environment ..." -ForegroundColor Green

# 1. Build Lambda package
Set-Location (Split-Path $PSScriptRoot -Parent)   # project root
Write-Host "Building Lambda package..." -ForegroundColor Yellow
Set-Location backend
uv run deploy.py
Set-Location ..

# 2. Terraform workspace & apply
Set-Location terraform

$awsAccountId = aws sts get-caller-identity --query Account --output text
$awsRegion = if ($env:DEFAULT_AWS_REGION) { $env:DEFAULT_AWS_REGION } else { "eu-west-1" }
$stateBucket = "twin-terraform-state-$awsAccountId"
$lockTable = "twin-terraform-locks"

# Ensure the Terraform remote-state bucket exists (mirrors deploy.sh so a
# fresh AWS account/environment works from this script too, not just CI).
Write-Host "Ensuring Terraform state bucket exists..." -ForegroundColor Yellow
aws s3api head-bucket --bucket $stateBucket 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  -> Creating bucket $stateBucket..."
    if ($awsRegion -eq "us-east-1") {
        aws s3api create-bucket --bucket $stateBucket --region $awsRegion
    } else {
        aws s3api create-bucket --bucket $stateBucket --region $awsRegion --create-bucket-configuration LocationConstraint=$awsRegion
    }
    aws s3api put-bucket-versioning --bucket $stateBucket --versioning-configuration Status=Enabled
    aws s3api put-bucket-encryption --bucket $stateBucket --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
    Write-Host "  Bucket created" -ForegroundColor Green
} else {
    Write-Host "  Bucket already exists" -ForegroundColor Green
}

# Ensure the DynamoDB lock table exists.
Write-Host "Ensuring DynamoDB lock table exists..." -ForegroundColor Yellow
aws dynamodb describe-table --table-name $lockTable --region $awsRegion 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  -> Creating DynamoDB table $lockTable..."
    aws dynamodb create-table --table-name $lockTable --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $awsRegion
    aws dynamodb wait table-exists --table-name $lockTable --region $awsRegion
    Write-Host "  Table created" -ForegroundColor Green
} else {
    Write-Host "  Table already exists" -ForegroundColor Green
}

terraform init -input=false `
  -backend-config="bucket=$stateBucket" `
  -backend-config="key=$Environment/terraform.tfstate" `
  -backend-config="region=$awsRegion" `
  -backend-config="dynamodb_table=$lockTable" `
  -backend-config="encrypt=true"

if (-not (terraform workspace list | Select-String $Environment)) {
    terraform workspace new $Environment
} else {
    terraform workspace select $Environment
}

# Import global IAM resources if they exist in AWS but not yet in this
# workspace's state (they are shared across all three environments and
# never destroyed, see README).
Write-Host "Importing global IAM resources if needed..." -ForegroundColor Yellow
function Import-IfMissing {
    param([string]$Resource, [string]$Id)
    $inState = terraform state list | Select-String -SimpleMatch $Resource
    if (-not $inState) {
        Write-Host "  -> Importing $Resource..."
        try {
            terraform import "-var=project_name=$ProjectName" "-var=environment=$Environment" "-var=github_repository=$GithubRepository" $Resource $Id
        } catch {
            # Already exists outside state, or import not applicable; continue.
        }
    } else {
        Write-Host "  $Resource already in state" -ForegroundColor Green
    }
}

Import-IfMissing "aws_iam_openid_connect_provider.github" "arn:aws:iam::${awsAccountId}:oidc-provider/token.actions.githubusercontent.com"
Import-IfMissing "aws_iam_role.github_actions" "github-actions-twin-deploy"

$tfCommonVars = @(
    "-var=project_name=$ProjectName",
    "-var=environment=$Environment",
    "-var=github_repository=$GithubRepository"
)

if ($Environment -eq "prod") {
    terraform apply -var-file="prod.tfvars" @tfCommonVars -auto-approve
} else {
    terraform apply @tfCommonVars -auto-approve
}

$ApiUrl        = terraform output -raw api_gateway_url
$FrontendBucket = terraform output -raw s3_frontend_bucket
try { $CustomUrl = terraform output -raw custom_domain_url } catch { $CustomUrl = "" }

# 3. Build + deploy frontend
Set-Location ..\frontend

# Create production environment file with API URL
Write-Host "Setting API URL for production..." -ForegroundColor Yellow
"NEXT_PUBLIC_API_URL=$ApiUrl" | Out-File .env.production -Encoding utf8

npm install
npm run build
aws s3 sync .\out "s3://$FrontendBucket/" --delete
Set-Location ..

# 4. Final summary
$CfUrl = terraform -chdir=terraform output -raw cloudfront_url
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "CloudFront URL : $CfUrl" -ForegroundColor Cyan
if ($CustomUrl) {
    Write-Host "Custom domain  : $CustomUrl" -ForegroundColor Cyan
}
Write-Host "API Gateway    : $ApiUrl" -ForegroundColor Cyan
