# Versioning - Service d'authentification

## Vue d'ensemble

Ce document décrit la stratégie de versioning pour le service d'authentification.

## Semantic Versioning (SemVer)

Nous suivons le standard [Semantic Versioning 2.0.0](https://semver.org/):

### Format: `MAJOR.MINOR.PATCH`

- **MAJOR:** Changements incompatibles avec les versions précédentes
- **MINOR:** Nouvelles fonctionnalités compatibles avec les versions précédentes
- **PATCH:** Corrections de bugs compatibles avec les versions précédentes

### Exemples
- `1.0.0` → `1.0.1` (patch - correction de bug)
- `1.0.1` → `1.1.0` (minor - nouvelle fonctionnalité)
- `1.1.0` → `2.0.0` (major - breaking change)

## Règles de versioning

### Chaque PR met à jour CHANGELOG

**Obligatoire:** Toute Pull Request doit inclure une mise à jour du CHANGELOG.md.

#### Format des entrées
```markdown
## [Unreleased]

### Added
- Nouvelle fonctionnalité de refresh token

### Changed
- Amélioration de la validation des emails

### Fixed
- Correction du bug de validation JWT

### Security
- Mise à jour de bcryptjs pour corriger CVE-2024-XXXX
```

#### Types de changements
- **Added:** Nouvelles fonctionnalités
- **Changed:** Modifications de fonctionnalités existantes
- **Deprecated:** Fonctionnalités marquées pour suppression
- **Removed:** Fonctionnalités supprimées
- **Fixed:** Corrections de bugs
- **Security:** Corrections de vulnérabilités

## Tags Git

### Format des tags
- **Préfixe:** `v` (ex: `v1.0.0`)
- **Format:** `vMAJOR.MINOR.PATCH`
- **Message:** Description concise

### Exemples de tags
```bash
# Tag de version
git tag -a v1.0.0 -m "Initial release"

# Tag de hotfix
git tag -a v1.0.1 -m "Fix JWT validation issue"

# Tag de feature
git tag -a v1.1.0 -m "Add refresh token functionality"
```

## Processus de release

### 1. Préparation de la release

#### Mise à jour du CHANGELOG
```bash
# Éditer CHANGELOG.md
# Déplacer les entrées [Unreleased] vers la nouvelle version
# Ajouter la date de release
```

#### Mise à jour du package.json
```bash
# Mettre à jour la version dans package.json
npm version patch|minor|major
```

### 2. Création de la release

#### Tag automatique
```bash
# Le workflow CI/CD crée automatiquement le tag
# lors du merge en main
```

#### Release GitHub
- **Titre:** `Release v1.0.1`
- **Description:** Copier le contenu du CHANGELOG
- **Assets:** Inclure les artefacts de build si nécessaire

### 3. Déploiement

#### Pipeline automatisé
1. **Tests:** Exécution de tous les tests
2. **Build:** Compilation et packaging
3. **Deploy:** Déploiement en staging puis production
4. **Validation:** Tests de smoke et monitoring

## Gestion des branches

### Branches principales
- **main:** Code stable, toujours déployable
- **develop:** Branche de développement
- **hotfix/***: Corrections urgentes
- **feature/***: Nouvelles fonctionnalités

### Workflow Git Flow
```bash
# Feature branch
git checkout -b feature/new-auth-method
# ... développement ...
git checkout develop
git merge feature/new-auth-method

# Release branch
git checkout -b release/v1.1.0
# ... finalisation ...
git checkout main
git merge release/v1.1.0
git tag -a v1.1.0 -m "Release v1.1.0"

# Hotfix branch
git checkout -b hotfix/critical-bug
# ... correction ...
git checkout main
git merge hotfix/critical-bug
git tag -a v1.0.1 -m "Hotfix v1.0.1"
```

## Automatisation

### GitHub Actions
Le workflow CI/CD automatise:
- **Versioning:** Bump automatique lors des hotfix
- **Tagging:** Création automatique des tags
- **Release:** Création automatique des releases GitHub
- **Deployment:** Déploiement automatique

### Scripts utiles
```bash
# Bump de version
npm version patch|minor|major

# Création de tag
git tag -a v$(npm run version) -m "Release $(npm run version)"

# Push des tags
git push origin --tags
```

## Monitoring des versions

### Métriques surveillées
- **Versions déployées:** Suivi des versions en production
- **Rollbacks:** Fréquence et causes
- **Temps de déploiement:** Durée du processus de release
- **Qualité:** Taux de bugs par version

### Alertes
- **Breaking changes:** Notification automatique
- **Vulnérabilités:** Alerte sur les nouvelles CVE
- **Performance:** Dégradation des métriques

## Documentation

### Changelog
- **Format:** Keep a Changelog
- **Langue:** Français
- **Détail:** Suffisant pour comprendre les changements

### API Versioning
- **URL:** `/api/v1/auth/*`
- **Headers:** `Accept: application/vnd.auth.v1+json`
- **Deprecation:** Notification 6 mois à l'avance

## Responsabilités

- **Développeur:** Mise à jour du CHANGELOG
- **Tech Lead:** Validation des breaking changes
- **DevOps:** Gestion des déploiements
- **Product:** Validation des releases
