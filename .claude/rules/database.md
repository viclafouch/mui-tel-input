## Database & Prisma Migrations

### Principe

- **Dev** : `prisma migrate dev` crée les fichiers de migration ET les applique à la DB locale
- **Prod** : `prisma migrate deploy` applique les migrations pendantes (safe, idempotent, jamais de perte de données)
- **JAMAIS `prisma db push` en production** — aucun tracking, peut dropper des colonnes silencieusement

### Règles de sécurité (production)

L'app est en production avec des utilisateurs et des données réelles.

- **Migrations additives uniquement** : nouveaux champs optionnels (`?`), nouveaux index, nouvelles tables
- **JAMAIS** de suppression/renommage de colonnes, tables ou enums
- **JAMAIS** de `prisma migrate reset` en production
- **JAMAIS** de `prisma db push` en production
- Nouveaux champs obligatoires (`NOT NULL`) : toujours ajouter un `@default()` pour ne pas casser les lignes existantes

### Workflow — Modification du schema

#### 1. Modifier le schema localement

Éditer `prisma/schema.prisma`.

#### 2. Créer la migration

**Important** : Prisma lit `DATABASE_URL` depuis l'environnement. Le fichier `prisma/prisma.config.ts` ne charge pas `.env` automatiquement. Il faut toujours préfixer avec `dotenv -e` pour injecter les variables.

```bash
pnpm exec dotenv -e .env.development -- pnpm exec prisma migrate dev --name <nom_descriptif>
```

Cela :
- Crée le fichier SQL dans `prisma/migrations/<timestamp>_<nom>/migration.sql`
- Applique la migration à la DB locale
- Régénère le Prisma Client

Conventions de nommage : `add_rate_limit`, `add_user_avatar`, `add_index_meme_status` (snake_case, descriptif).

#### 3. Vérifier le SQL généré

Toujours relire le fichier `migration.sql` généré pour s'assurer qu'il ne contient aucune opération destructive (DROP, ALTER COLUMN type change, etc.).

#### 4. Commit & push

Le push déclenche le deploy Vercel automatiquement.

#### 5. Appliquer en production

Après le deploy Vercel, appliquer les migrations contre la base Neon :

```bash
# 1. Tirer les variables d'environnement de prod depuis Vercel
vercel env pull .env.production

# 2. Appliquer les migrations pendantes
pnpm run prisma:migrate:prod
```

Le script `prisma:migrate:prod` utilise `dotenv -e .env.production -- prisma migrate deploy`. `migrate deploy` est safe : il n'applique que les migrations non encore appliquées et ne touche jamais au schema directement.

**Toujours tirer `.env.production` avant d'appliquer** pour avoir la `DATABASE_URL` à jour.

### Commandes de référence

| Commande | Environnement | Usage |
|----------|--------------|-------|
| `pnpm exec dotenv -e .env.development -- pnpm exec prisma migrate dev --name <nom>` | Local | Créer + appliquer une migration |
| `pnpm exec dotenv -e .env.development -- pnpm exec prisma generate` | Local | Régénérer le client (aussi dans `postinstall`) |
| `pnpm run prisma:migrate:dev` | Local | Appliquer les migrations pendantes (via `.env.development`) |
| `vercel env pull .env.production` | — | Tirer les env de prod depuis Vercel |
| `pnpm run prisma:migrate:prod` | Production | Appliquer les migrations pendantes (via `.env.production`) |

### Ce que Claude Code ne doit JAMAIS faire

- Exécuter `prisma migrate dev` (nécessite la DB locale, c'est l'utilisateur qui le fait)
- Exécuter `prisma db push`
- Créer des migrations destructives (DROP, renommage)
- Modifier manuellement les fichiers `migration.sql` générés
