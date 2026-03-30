# 🤖 Digital Twin AI – Cloud Version

> Un jumeau numérique conversationnel déployé sur AWS : interagissez avec une IA qui reflète votre personnalité et vos données professionnelles, avec un backend serverless, une API REST et une diffusion mondiale sécurisée via CloudFront.

---

## 🇫🇷 Français

### 📋 Description

Ce projet déploie un **jumeau numérique intelligent** sur AWS. L'utilisateur peut converser avec une IA enrichie de ses données personnelles et professionnelles. L'architecture est entièrement serverless, déployée sur 3 environnements distincts (dev, test, prod) via Terraform et GitHub Actions.

### ✅ Fonctionnalités

- Enrichissement du Digital Twin avec des données personnelles et une mémoire contextuelle
- Backend entièrement serverless avec AWS Lambda
- API REST via API Gateway
- Hébergement statique du frontend et persistance des conversations sur S3
- Diffusion mondiale en HTTPS via CloudFront
- Infrastructure as Code avec Terraform
- Pipeline CI/CD automatisé avec GitHub Actions
- Isolation des environnements : dev, test, production

### 🏗️ Architecture

```
Navigateur utilisateur
    ↓ HTTPS
CloudFront (CDN)
    ↓
S3 Static Website (Frontend Next.js)
    ↓ Appels API HTTPS
API Gateway
    ↓
Lambda Function (Backend Python / FastAPI)
    ↓
    ├── AWS Bedrock (réponses IA)
    └── S3 Memory Bucket (persistance des conversations)

Logs et monitoring → CloudWatch
```

### 🧩 Composants AWS

**1️⃣ S3 Bucket**

- `frontend` : stockage des fichiers statiques du site (HTML, JS, CSS)
- `memory` : stockage des historiques de conversation JSON
- Fonction clé : persistance des données et hébergement statique

**2️⃣ CloudFront**

- Rôle : CDN qui distribue le site statique globalement via HTTPS
- Fonction clé : améliore la vitesse de chargement, gère le caching et assure la sécurité HTTPS

**3️⃣ API Gateway**

- Rôle : point d'entrée HTTP pour le backend Lambda
- Fonction clé : gère les routes (`/chat`, `/health`), le CORS et redirige les requêtes vers Lambda

**4️⃣ AWS Lambda**

- Rôle : backend serverless exécutant le code Python FastAPI
- Fonction clé : réception des requêtes du frontend, appel à AWS Bedrock, gestion de la mémoire dans S3, renvoi des réponses

**5️⃣ CloudWatch**

- Rôle : monitoring et collecte de logs
- Fonction clé : visualiser les erreurs, logs des conversations, temps d'exécution Lambda et faciliter le débogage

### 🛠️ Concepts DevOps illustrés

- **Terraform** : Infrastructure as Code, gestion de l'état, workspaces
- **Gestion des états** : synchronisation Terraform ↔ AWS via S3 + DynamoDB
- **Workspaces** : isolation des environnements dev / test / prod
- **Déploiement automatisé** : provisionnement complet en une commande
- **GitHub Actions** : pipeline CI/CD déclenché à chaque push
- **OIDC** : authentification sans clé AWS stockée dans GitHub

### 🚀 Déploiement

Le déploiement est entièrement automatisé via GitHub Actions. Il suffit de déclencher le workflow manuellement en choisissant l'environnement cible :

```
GitHub → Actions → Deploy Digital Twin → Run workflow → [dev | test | prod]
```
## ⚠️ Notes importantes

### Destruction de l'infrastructure

Avant de lancer le script de destroy sur un environnement, retire d'abord les ressources IAM globales du state Terraform — elles sont partagées entre tous les environnements et protégées contre la suppression accidentelle :
```bash
terraform state rm aws_iam_openid_connect_provider.github
terraform state rm aws_iam_role.github_actions
```

Ensuite lance le destroy normalement :
```bash
./scripts/destroy.sh dev
```
---

## 🇬🇧 English

### 📋 Description

This project deploys an **intelligent digital twin** on AWS. Users can converse with an AI enriched with their personal and professional data. The architecture is fully serverless, deployed across 3 isolated environments (dev, test, prod) using Terraform and GitHub Actions.

### ✅ Features

- Digital Twin enriched with personal data and contextual memory
- Fully serverless backend with AWS Lambda
- REST API via API Gateway
- Static frontend hosting and conversation persistence on S3
- Global HTTPS delivery via CloudFront
- Infrastructure as Code with Terraform
- Automated CI/CD pipeline with GitHub Actions
- Environment isolation: dev, test, production

### 🏗️ Architecture

```
User Browser
    ↓ HTTPS
CloudFront (CDN)
    ↓
S3 Static Website (Next.js Frontend)
    ↓ HTTPS API Calls
API Gateway
    ↓
Lambda Function (Python / FastAPI Backend)
    ↓
    ├── AWS Bedrock (AI responses)
    └── S3 Memory Bucket (conversation persistence)

Logs & monitoring → CloudWatch
```

### 🧩 AWS Components

**1️⃣ S3 Bucket**

- `frontend`: stores static website files (HTML, JS, CSS)
- `memory`: stores JSON conversation histories
- Key role: data persistence and static hosting

**2️⃣ CloudFront**

- Role: CDN that distributes the static site globally over HTTPS
- Key role: improves load speed, handles caching and enforces HTTPS security

**3️⃣ API Gateway**

- Role: HTTP entry point for the Lambda backend
- Key role: manages routes (`/chat`, `/health`), CORS, and forwards requests to Lambda

**4️⃣ AWS Lambda**

- Role: serverless backend running Python FastAPI code
- Key role: receives frontend requests, calls AWS Bedrock, manages memory in S3, returns responses

**5️⃣ CloudWatch**

- Role: monitoring and log collection
- Key role: visualize errors, conversation logs, Lambda execution times and facilitate debugging

### 🛠️ DevOps Concepts Demonstrated

- **Terraform fundamentals**: Infrastructure as Code concepts
- **State management**: How Terraform tracks and synchronizes resources with AWS
- **Workspaces**: Managing multiple isolated environments
- **Automated deployment**: One-command infrastructure provisioning
- **GitHub Actions**: CI/CD pipeline triggered on every push
- **OIDC authentication**: Keyless AWS authentication from GitHub

### 🚀 Deployment

Deployment is fully automated via GitHub Actions. Simply trigger the workflow manually and choose the target environment:

```
GitHub → Actions → Deploy Digital Twin → Run workflow → [dev | test | prod]
```
