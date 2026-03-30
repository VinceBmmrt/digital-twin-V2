param(
    [Parameter(Mandatory=$true)]
    [string]$Environment,
    [string]$ProjectName = "twin",
    [string]$GithubRepository = "VinceBmmrt/digital-twin-V2"
)

# Validate environment parameter
if ($Environment -notmatch '^(dev|test|prod)$') {
    Write-Host "Error: Invalid environment '$Environment'" -ForegroundColor Red
    Write-Host "Available environments: dev, test, prod" -ForegroundColor Yellow
    exit 1
}

Write-Host "Preparing to destroy $ProjectName-$Environment infrastructure..." -ForegroundColor Yellow

# Navigate to terraform directory
Set-Location (Join-Path (Split-Path $PSScriptRoot -Parent) "terraform")

# Get AWS Account ID for backend configuration
$awsAccountId = aws sts get-caller-identity --query Account --output text
$awsRegion = if ($env:DEFAULT_AWS_REGION) { $env:DEFAULT_AWS_REGION } else { "eu-west-1" }

# Initialize terraform with S3 backend
Write-Host "Initializing Terraform with S3 backend..." -ForegroundColor Yellow
terraform init -input=false `
  -backend-config="bucket=twin-terraform-state-$awsAccountId" `
  -backend-config="key=$Environment/terraform.tfstate" `
  -backend-config="region=$awsRegion" `
  -backend-config="dynamodb_table=twin-terraform-locks" `
  -backend-config="encrypt=true"

# Check if workspace exists
$workspaces = terraform workspace list
if (-not ($workspaces | Select-String $Environment)) {
    Write-Host "Error: Workspace '$Environment' does not exist" -ForegroundColor Red
    Write-Host "Available workspaces:" -ForegroundColor Yellow
    terraform workspace list
    exit 1
}

# Select the workspace
terraform workspace select $Environment

# Remove global IAM resources from state — they are shared across all environments
# and must never be destroyed. They will be re-imported on next deployment if needed.
Write-Host "Removing global IAM resources from state (they will NOT be deleted from AWS)..." -ForegroundColor Yellow
$resourcesToRemove = @(
    "aws_iam_openid_connect_provider.github",
    "aws_iam_role.github_actions",
    "aws_iam_role_policy.github_additional",
    "aws_iam_role_policy_attachment.github_lambda",
    "aws_iam_role_policy_attachment.github_s3",
    "aws_iam_role_policy_attachment.github_apigateway",
    "aws_iam_role_policy_attachment.github_cloudfront",
    "aws_iam_role_policy_attachment.github_iam_read",
    "aws_iam_role_policy_attachment.github_bedrock",
    "aws_iam_role_policy_attachment.github_dynamodb",
    "aws_iam_role_policy_attachment.github_acm",
    "aws_iam_role_policy_attachment.github_route53"
)
foreach ($resource in $resourcesToRemove) {
    terraform state rm $resource 2>$null
}

Write-Host "Emptying S3 buckets..." -ForegroundColor Yellow

# Define bucket names with account ID (matching Day 4 naming)
$FrontendBucket = "$ProjectName-$Environment-frontend-$awsAccountId"
$MemoryBucket = "$ProjectName-$Environment-memory-$awsAccountId"

# Empty frontend bucket if it exists
try {
    aws s3 ls "s3://$FrontendBucket" 2>$null | Out-Null
    Write-Host "  Emptying $FrontendBucket..." -ForegroundColor Gray
    aws s3 rm "s3://$FrontendBucket" --recursive
} catch {
    Write-Host "  Frontend bucket not found or already empty" -ForegroundColor Gray
}

# Empty memory bucket if it exists
try {
    aws s3 ls "s3://$MemoryBucket" 2>$null | Out-Null
    Write-Host "  Emptying $MemoryBucket..." -ForegroundColor Gray
    aws s3 rm "s3://$MemoryBucket" --recursive
} catch {
    Write-Host "  Memory bucket not found or already empty" -ForegroundColor Gray
}

Write-Host "Running terraform destroy..." -ForegroundColor Yellow

# Run terraform destroy with auto-approve
if ($Environment -eq "prod" -and (Test-Path "prod.tfvars")) {
    terraform destroy -var-file=prod.tfvars `
                     -var="project_name=$ProjectName" `
                     -var="environment=$Environment" `
                     -var="github_repository=$GithubRepository" `
                     -auto-approve
} else {
    terraform destroy -var="project_name=$ProjectName" `
                     -var="environment=$Environment" `
                     -var="github_repository=$GithubRepository" `
                     -auto-approve
}

Write-Host "Infrastructure for $Environment has been destroyed!" -ForegroundColor Green
Write-Host ""
Write-Host "  To remove the workspace completely, run:" -ForegroundColor Cyan
Write-Host "   terraform workspace select default" -ForegroundColor White
Write-Host "   terraform workspace delete $Environment" -ForegroundColor White