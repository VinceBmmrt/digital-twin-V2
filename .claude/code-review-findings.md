# Code review findings (2026-09-11, fixes applied 2026-09-12)

Full-repo audit (frontend, backend, terraform, scripts) plus a diff review of the
VectorSpace3D rewrite. All items below are FIXED in the working tree except the
two explicitly marked DEFERRED. Nothing has been committed or pushed yet.

## Security (fix first)

- [x] **terraform/github-oidc.tf:107** — CI role's inline policy allowed
  `iam:CreateRole`, `iam:PassRole`, `iam:AttachRolePolicy`, `iam:UpdateAssumeRolePolicy`
  on `Resource "*"`. **Fixed:** scoped to this project's own `twin-*-lambda-role` ARNs,
  and `iam:PassRole` further restricted with an `iam:PassedToService = lambda.amazonaws.com`
  condition. Verified with a real `terraform plan` against `dev` state.
- [x] **backend/server.py:69** — `session_id` was never validated. **Fixed:** both
  `ChatRequest.session_id` (pydantic validator) and the `/conversation/{session_id}`
  path param now require a valid UUID, rejecting path-traversal payloads and arbitrary
  string probing. Tested locally with curl (path-traversal payload → 422/400).
  Full per-user auth/ownership is out of scope for this app's threat model.
- [x] **terraform/main.tf:112** — Lambda role had `AmazonBedrockFullAccess` +
  `AmazonS3FullAccess`. **Fixed:** replaced with least-privilege inline policies
  (`bedrock:InvokeModel`/`InvokeModelWithResponseStream` on foundation-model/
  inference-profile ARNs; `s3:GetObject`/`PutObject` scoped to the memory bucket only).
  Verified with `terraform plan`.
- [x] **terraform/main.tf:51** — Frontend S3 bucket was fully public, CloudFront used
  http-only origin. **Fixed:** migrated to CloudFront Origin Access Control (OAC);
  bucket is now fully private, website-hosting config removed, bucket policy only
  allows the specific CloudFront distribution via `aws:SourceArn`. Verified with
  `terraform plan` (also caught and fixed a knock-on break in `.github/workflows/deploy.yml`,
  which looked up the CloudFront distribution by matching the old S3-website domain name;
  replaced with a direct `cloudfront_distribution_id` Terraform output).
- [ ] **DEFERRED — backend/memory/70123ea5-d0d9-4884-a927-72047b91729c.json** — a real
  visitor's chat transcript is committed to git history despite `.gitignore` excluding
  `memory/`. Needs a history rewrite (`git filter-repo` + force-push) to actually remove,
  not just `git rm`. Too destructive to do without a separate explicit go-ahead.

## Reliability

- [ ] **DEFERRED — backend/server.py:21** — `slowapi` rate limiter ("20/day") uses the
  default in-memory store; doesn't share state across Lambda instances. Fixing properly
  needs new infra (Redis/ElastiCache, or a custom DynamoDB-backed storage backend for
  `limits`) — a real scoping decision, not a drop-in fix.
- [x] **scripts/deploy.ps1:36** — was missing the required `-var="github_repository=..."`
  and had none of `deploy.sh`'s state-bucket/DynamoDB-lock bootstrap or OIDC
  `import_if_missing` logic. **Fixed:** ported all of that from `deploy.sh`. Verified:
  PowerShell parser reports no syntax errors, and the exists/already-in-state checks
  were confirmed against the real bucket/table/state (read-only calls only — did not
  run a full `terraform apply` from the script).

## Frontend quality (VectorSpace3D.tsx)

- [x] **:249** — highlight-line geometries/materials now disposed before being replaced
  on hover change (was leaking GPU memory).
- [x] **:85** — `OrbitControls` touch rotation disabled (`touches.ONE/TWO = null`) and
  `touchAction` restored to `pan-y`, so mobile page-scroll works through the canvas again.
- [x] **:323** — unmount cleanup no longer disposes `THREE.Sprite`'s shared singleton
  geometry; only `THREE.Line` geometries (unique per instance) are disposed.
- [x] **:243** — raycast sprite array hoisted once after setup instead of rebuilt every
  animation frame.
- [x] **:293** — em dash removed from the comment.
- Verified with `npm run lint` and `npm run build` (TypeScript caught a real issue:
  `THREE.TOUCH.NONE` doesn't exist in this three.js version — used `null` instead, which
  the type definitions do support).

## Dead code

- [x] **frontend/components/ChatArea.tsx** — deleted (empty, never imported).
- [x] **backend/me.txt** — deleted (unused, superseded by `context.py`/`data/*`).
- [x] **backend/pyproject.toml:9** — removed unused `openai` dependency, re-locked and
  synced `uv.lock`, confirmed backend still starts and `/health` responds.

## Lower severity (not addressed this pass)

- Raw exception text (`str(e)`) leaked to API clients (`server.py` ~161/217/227).
- Unchecked Bedrock response shape can raise `KeyError`/`IndexError` (`server.py:148`).
- `useChatSession.ts` trusts the `/chat` response shape with no runtime validation.
- Duplicate CSS `@keyframes`/font `@import` in both `pageStyle.css` and `twinStyle.tsx`.
- `README.md` duplicated verbatim in French and English.
- `USE_S3` branching repeated in 4 places in `server.py` instead of one storage abstraction.
