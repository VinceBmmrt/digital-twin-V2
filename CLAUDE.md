# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

An AI "digital twin" chatbot: a Next.js frontend talks to a FastAPI backend that calls AWS Bedrock, answering as Vincent (the site owner) using his CV, GitHub history, and personal notes as context. The whole stack is serverless on AWS and deployed via Terraform + GitHub Actions.

This is a two-stack monorepo:
- `frontend/` — Next.js 16 / React 19 app, statically exported and served from S3 + CloudFront.
- `backend/` — Python FastAPI app, run locally with uvicorn, packaged and run in production as an AWS Lambda function (via Mangum).
- `terraform/` — all AWS infra (S3, Lambda, API Gateway, CloudFront, IAM, optional Route53/ACM custom domain).
- `scripts/` — deploy/destroy scripts (bash for CI/Linux, `.ps1` mirrors for local Windows use).
- `.github/workflows/` — CI: `deploy.yml` (push to `main` or manual dispatch, choose dev/test/prod) and `destroy.yml`.

## Commands

### Frontend (`frontend/`)
```
npm install
npm run dev      # local dev server, http://localhost:3000
npm run build    # static export to frontend/out (next.config.ts has output: 'export')
npm run lint      # eslint
```
No test suite exists yet.

### Backend (`backend/`)
Uses `uv`, not pip/venv directly.
```
uv sync                     # install deps from pyproject.toml / uv.lock
uv run server.py            # local dev server, http://localhost:8000 (needs .env, see below)
uv run deploy.py            # builds lambda-deployment.zip via Docker (public.ecr.aws/lambda/python:3.12)
```
`requirements.txt` at the backend root exists only for the Docker-based Lambda packaging step in `deploy.py` (`pip install -r requirements.txt` inside the Lambda container); day-to-day dependency management is via `pyproject.toml`/`uv`, and the two should be kept in sync manually.
No test suite exists yet.

### Full deploy (what CI runs)
```
scripts/deploy.sh <environment>     # dev | test | prod, defaults to dev
scripts/destroy.sh <environment>
```
Windows-local equivalents: `scripts/deploy.ps1` / `scripts/destroy.ps1`. These scripts: build the Lambda zip, ensure the Terraform S3 state bucket + DynamoDB lock table exist, run `terraform apply` in the right workspace, then build the frontend with `NEXT_PUBLIC_API_URL` pointed at the deployed API Gateway URL and sync it to the frontend S3 bucket.

## Architecture

### Request flow
```
Browser → CloudFront → S3 (static Next.js export)
Browser → API Gateway (HTTP API) → Lambda (FastAPI via Mangum) → Bedrock (chat) + S3 or local disk (conversation memory)
```

### Backend internals
- `server.py` — FastAPI app, all routes (`/`, `/health`, `/chat`, `/conversation/{id}`). Rate-limited to 20 requests/day per IP via `slowapi`. Reads/writes conversation history either to local disk (`MEMORY_DIR`, default `../memory`) or S3 (`USE_S3=true` + `S3_BUCKET`), selected by env var — S3 is only used in the deployed Lambda.
- `context.py` — builds the Bedrock system prompt (`prompt()`) that instructs the model to answer *as* Vincent, in French by default, never admitting to being Bedrock/an AI model by name.
- `resources.py` — loads the raw knowledge base at import time: `data/cv.pdf` (parsed with pypdf), `data/summary.txt`, `data/style.txt`, `data/github.txt`, `data/facts.json`. To update what the twin "knows," edit these files, not the prompt logic.
- `lambda_handler.py` — thin Mangum wrapper (`handler = Mangum(app)`), the actual Lambda entry point.
- `deploy.py` — builds `lambda-deployment.zip` by pip-installing `requirements.txt` inside the official `amazon/lambda-python:3.12` Docker image (needed for correct manylinux binary wheels), then bundling it with the app files and `data/`.
- Bedrock model ID and CORS origins are injected as Lambda env vars by Terraform, not hardcoded.

### Frontend internals
- Statically exported (`output: 'export'` in `next.config.ts`) since it's hosted from a plain S3 bucket, not a Node server, so no server components/API routes/ISR are usable.
- `hooks/useChatSession.ts` owns all chat state and the fetch to `${NEXT_PUBLIC_API_URL}/chat`; `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000` and is baked in at build time from the Terraform-produced API Gateway URL during deploy.
- `components/` is a flat list of presentational pieces (chat UI, 3D/canvas background effects like `NeuralCanvas`, `VectorSpace3D`, `CursorTrail`) composed in `app/page.tsx`.

### Infra (`terraform/`)
- One AWS account, isolated via **Terraform workspaces** (`dev`/`test`/`prod`), not separate state files — `variables.tf` enforces `environment` is one of those three.
- Remote state: S3 bucket `twin-terraform-state-<account-id>` + DynamoDB lock table `twin-terraform-locks`, both created on-demand by `deploy.sh` if missing.
- `github-oidc.tf` sets up keyless GitHub Actions → AWS auth (OIDC provider + `github_actions` IAM role assumed via `AWS_ROLE_ARN`).
- **Important gotcha (see README):** the OIDC provider and `github_actions` IAM role are global/shared across all three environments and must never be destroyed with a single environment. Before running `destroy` on any environment, first run:
  ```
  terraform state rm aws_iam_openid_connect_provider.github
  terraform state rm aws_iam_role.github_actions
  ```
  `deploy.sh` re-imports these two resources into state if they're missing (`import_if_missing`), so they survive a per-environment destroy/recreate cycle.
- Custom domain (Route53 + ACM) is entirely optional, gated by `use_custom_domain` (default `false`); when off, CloudFront just uses its default `*.cloudfront.net` cert/domain.

## Known upgrade watch-list
(from a September 2026 dependency audit — re-check before assuming still current)
- Safe minor/patch bumps already applied on both sides (frontend: next/react/tailwindcss/eslint/three; backend: fastapi/boto3/pypdf/uvicorn/mangum/slowapi/python-dotenv/python-multipart), each validated with a build/lint (frontend) and a live `/health` check (backend).
- Still pending, deliberately not bumped because they're major/breaking: `typescript` 5.9→7.0, `lucide-react` 0.577→1.44 (frontend); `openai` 2.29→3.13 (backend). Note `server.py` currently calls Bedrock directly via `boto3`, not through the `openai` package, so check where/whether `openai` is actually used before upgrading or dropping it.
