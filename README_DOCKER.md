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
