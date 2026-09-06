#!/usr/bin/env bash
# =============================================================================
# setup-gcp.sh — One-time GCP setup for GitHub Actions CI/CD
#
# Run this ONCE from your local machine with gcloud CLI authenticated.
# Usage:
#   chmod +x setup-gcp.sh
#   ./setup-gcp.sh
# =============================================================================

set -euo pipefail

# ── Configuration — edit these before running ─────────────────────────────────
PROJECT_ID="user-info-390317"
REGION="us-central1"
AR_REPO="cloud_app"
SA_NAME="github-actions-deployer"
GITHUB_ORG="krishna-gitAcc"
GITHUB_REPO="cloudApp"
POOL_NAME="github-pool"
PROVIDER_NAME="github-provider"
# ─────────────────────────────────────────────────────────────────────────────

SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "▶ Setting project to ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

echo "▶ Enabling required GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com

echo "▶ Creating Artifact Registry repository: ${AR_REPO}"
gcloud artifacts repositories create "${AR_REPO}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Docker images for sample-app" \
  || echo "  (already exists, skipping)"

echo "▶ Creating service account: ${SA_NAME}"
gcloud iam service-accounts create "${SA_NAME}" \
  --display-name="GitHub Actions Deployer" \
  || echo "  (already exists, skipping)"

echo "▶ Granting IAM roles to service account..."
# Push images to Artifact Registry
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer"

# Deploy to Cloud Run
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

# Allow Cloud Run to pull images
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

echo "▶ Creating Workload Identity Pool: ${POOL_NAME}"
gcloud iam workload-identity-pools create "${POOL_NAME}" \
  --location="global" \
  --display-name="GitHub Actions Pool" \
  || echo "  (already exists, skipping)"

POOL_ID=$(gcloud iam workload-identity-pools describe "${POOL_NAME}" \
  --location="global" \
  --format="value(name)")

echo "▶ Creating Workload Identity Provider: ${PROVIDER_NAME}"
gcloud iam workload-identity-pools providers create-oidc "${PROVIDER_NAME}" \
  --location="global" \
  --workload-identity-pool="${POOL_NAME}" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository_owner == '${GITHUB_ORG}'" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  || echo "  (already exists, skipping)"

echo "▶ Binding service account to Workload Identity Pool..."
gcloud iam service-accounts add-iam-policy-binding "${SA_EMAIL}" \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_ORG}/${GITHUB_REPO}"

PROVIDER_NAME_FULL=$(gcloud iam workload-identity-pools providers describe "${PROVIDER_NAME}" \
  --location="global" \
  --workload-identity-pool="${POOL_NAME}" \
  --format="value(name)")

echo ""
echo "============================================================"
echo " ✅ Setup complete! Add these as GitHub repository secrets:"
echo "============================================================"
echo ""
echo "  GCP_PROJECT_ID                 = ${PROJECT_ID}"
echo "  GCP_REGION                     = ${REGION}"
echo "  GCP_AR_REPO                    = ${AR_REPO}"
echo "  GCP_SERVICE_ACCOUNT            = ${SA_EMAIL}"
echo "  GCP_WORKLOAD_IDENTITY_PROVIDER = ${PROVIDER_NAME_FULL}"
echo "  BACKEND_URL                    = https://<backend-cloud-run-url>  (after 1st backend deploy)"
echo "  FRONTEND_URL                   = https://<frontend-cloud-run-url> (after 1st frontend deploy)"
echo ""
echo " GitHub Secrets UI:"
echo "   https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/settings/secrets/actions"
echo "============================================================"
