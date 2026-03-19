Digital Twin AI – Cloud Version

💡 Un jumeau numérique conversationnel enrichi, déployé sur AWS : interagissez avec une IA qui reflète votre personnalité et vos données professionnelles, avec un backend serverless, une API REST, et une diffusion mondiale sécurisée grâce à CloudFront.

✅ Enrichissement du Digital Twin avec des données personnelles et une mémoire contextuelle

✅ Déploiement d’un backend entièrement serverless avec AWS Lambda

✅ Création d’une API REST via API Gateway

✅ Configuration de S3 pour l’hébergement du site statique et la persistance des conversations

✅ Mise en place de CloudFront pour la diffusion globale des contenus en HTTPS

✅ Architecture cloud robuste, prête pour la production





1️⃣ S3 Bucket

Frontend : stockage des fichiers statiques du site (HTML, JS, CSS).

Memory : stockage des historiques de conversation JSON pour le Digital Twin.

Fonction clé : persistance des données et hébergement statique.

2️⃣ CloudFront

Rôle : CDN qui distribue le site statique globalement via HTTPS.

Fonction clé : améliore la vitesse de chargement, gère le caching et assure la sécurité HTTPS.

3️⃣ API Gateway

Rôle : point d’entrée HTTP pour le backend Lambda.

Fonction clé : gère les routes (/chat, /health), le CORS et redirige les requêtes vers Lambda.

4️⃣ AWS Lambda

Rôle : backend serverless exécutant le code Python FastAPI.

Fonction clé : réception des requêtes du frontend, appel à OpenAI, gestion de la mémoire dans S3, renvoi des réponses.

5️⃣ CloudWatch

Rôle : monitoring et collecte de logs.

Fonction clé : visualiser les erreurs, logs des conversations, temps d’exécution Lambda et faciliter le débogage.
Fonctionnalités clés du projet

professional AWS infrastructure!
Utilisateur → CloudFront → S3 Frontend (static files)
        → API Gateway → Lambda → OpenAI / S3 Memory
        → Lambda Response → API Gateway → CloudFront → Utilisateur
Logs et monitoring → CloudWatch



updated architecture:

```
User Browser
    ↓ HTTPS
CloudFront (CDN)
    ↓ 
S3 Static Website (Frontend)
    ↓ HTTPS API Calls
API Gateway
    ↓
Lambda Function (Backend)
    ↓
    ├── AWS Bedrock (AI responses)  ← NEW!
    └── S3 Memory Bucket (persistence)
```

this project shows:
- **Terraform fundamentals** - Infrastructure as Code concepts
- **State management** - How Terraform tracks resources
- **Workspaces** - Managing multiple environments
- **Automated deployment** - One-command infrastructure provisioning
- **Environment isolation** - Separate dev, test, and production
- **Optional: Custom domains** - Professional DNS configuration


