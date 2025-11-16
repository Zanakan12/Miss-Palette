# Déploiement Docker pour Miss-Palette

Ce fichier décrit comment construire et lancer l'application Next.js en production à l'aide de Docker Compose.

Prérequis

- Docker et Docker Compose installés sur la machine (ou sur la Freebox si elle supporte Docker)

Variables importantes

- DATABASE_URL: chaîne de connexion MySQL (ex: mysql://root:password@db:3306/misspalette)

Build et lancement

1. Construire l'image et lancer les services:

```bash
docker compose up -d --build
```

2. Logs:

```bash
docker compose logs -f app
```

Accès

- Le serveur Next sera exposé sur le port 3000 de la machine hôte (http://<IP_FREEBOX>:3000)
- Le serveur Next sera exposé sur le port 3000 de l'application, et par défaut nous publions le service sur le port hôte 8080 (http://<IP_FREEBOX>:8080)

Changer le port hôte (si 8080 est déjà utilisé)

- Tu peux surcharger la variable d'environnement `HOST_PORT` lors du lancement:

```bash
HOST_PORT=8080 docker compose up -d --build
```

Comment vérifier quel processus utilise le port 3000 (macOS):

```bash
sudo lsof -i :3000
# puis tuer le processus si souhaité
sudo kill -9 <PID>
```

Sur la Freebox, si tu ne peux pas tuer le processus, choisis un `HOST_PORT` différent.

Notes Freebox

- Certaines Freebox (Delta/Pop) supportent Docker via l'interface ou une application, d'autres non. Si ta Freebox ne supporte pas Docker, considère un VPS ou Vercel.
- Configure une redirection de port (80/443) si tu veux un accès public et place un reverse proxy (Caddy/Traefik) pour SSL.

Sécurité

- Change les mots de passe par défaut dans `docker-compose.yml`.
- N'expose pas MySQL sur Internet en production. Utilise des règles de firewall ou n'expose pas le port 3306 publiquement.

## CI / CD

Un workflow GitHub Actions a été ajouté pour automatiser le build et le déploiement sur ton serveur : `.github/workflows/ci-cd.yml`.

Fonctionnement résumé :

- À chaque push sur `main`, le workflow : installe les dépendances, construit l'app (`npm run build`), archive les fichiers suivis par git puis copie l'archive sur le serveur via SCP et enfin exécute `docker compose up -d --build` via SSH.

Secrets GitHub requis (Repository > Settings > Secrets and variables > Actions) :

- SSH_HOST : adresse IP ou hostname du serveur (ex: 100.111.60.79)
- SSH_USER : utilisateur SSH (ex: `zanakan`)
- SSH_PRIVATE_KEY : clé privée SSH (format PEM) correspondant à un utilisateur autorisé sur le serveur
- SSH_PORT : port SSH (optionnel, ex: `22`)
- DEPLOY_PATH : chemin sur le serveur où extraire le projet (optionnel, défaut `/home/<SSH_USER>/miss-palette`)

Notes et recommandations :

- Assure-toi que Docker et Docker Compose sont installés et configurés sur le serveur.
- Mets à jour les mots de passe et variables d'environnement (ex: `DATABASE_URL`) sur le serveur dans un fichier `.env` non poussé dans le repo.
- Pour plus de robustesse, tu peux modifier le workflow pour pousser une image vers un registry (GitHub Container Registry ou Docker Hub) et simplement `docker pull`/`docker compose up` sur le serveur.

## Configuration locale (Prisma & DATABASE_URL)

Si tu obtiens l'erreur "Environment variable not found: DATABASE_URL" (Prisma), c'est que la variable d'environnement n'est pas définie pour l'environnement d'exécution. Deux options courantes :

- Développement local (rapide) : utiliser SQLite. Crée un fichier `.env` à la racine du projet contenant :

	```text
	DATABASE_URL="file:./dev.db"
	```

	Cela crée une base SQLite locale (`dev.db`) utilisable par Prisma pour le développement.

- Production / Docker Compose : utiliser MySQL (tel que configuré dans `docker-compose.yml`). Définis la variable `DATABASE_URL` sur le serveur (ou via Docker Compose) par exemple :

	```text
	DATABASE_URL="mysql://root:password@db:3306/misspalette"
	```

Après avoir défini `DATABASE_URL`, exécute les commandes Prisma si nécessaire :

```bash
# Générer le client Prisma
npx prisma generate

# Créer une migration et appliquer (si tu utilises migrations)
npx prisma migrate dev --name init
```

Ne place jamais les mots de passe réels dans le repo. Utilise `.env.example` (fourni) pour documenter les formats acceptés et ajoute `.env` au `.gitignore`.
