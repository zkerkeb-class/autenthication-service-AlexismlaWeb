# Mise à jour des dépendances

## Vue d'ensemble

Ce document décrit le processus de mise à jour des dépendances pour le service d'authentification.

## Fréquence

- **Automatique:** Hebdomadaire (tous les lundis à 9h00 UTC)
- **Manuel:** Selon les besoins (vulnérabilités critiques, nouvelles fonctionnalités)

## Périmètre

### Dépendances surveillées
- **npm:** Toutes les dépendances du package.json
- **Docker:** Images de base et dépendances système

### Dépendances exclues
- **express:** Mises à jour majeures (risque de breaking changes)
- **jsonwebtoken:** Mises à jour majeures (sécurité critique)
- **bcryptjs:** Mises à jour majeures (sécurité critique)

## Type de mise à jour

### Automatique via PR
- Dependabot crée automatiquement des Pull Requests
- Tests CI/CD automatiques
- Review manuelle obligatoire
- Merge après validation

### Merge manuel
- Pour les dépendances critiques
- Tests approfondis requis
- Déploiement en staging obligatoire

## Contrôle d'impact

### Tests automatiques
- `npm ci` - Installation propre
- `npm test` - Tests unitaires
- `npm run lint` - Vérification du code
- `npm audit` - Audit de sécurité

### Tests manuels
- Tests d'intégration
- Tests de performance
- Tests de sécurité

## Rollback

### Procédure de rollback
1. **Revert du commit** de mise à jour
2. **Création d'un tag** de rollback
3. **Déploiement** de la version précédente
4. **Notification** de l'équipe

### Exemple de rollback
```bash
# Revert du commit
git revert <commit-hash>

# Création du tag
git tag -a v1.0.0-rollback -m "Rollback to stable version"

# Push des changements
git push origin main --tags
```

## Monitoring

### Métriques surveillées
- Taux d'erreur des tests
- Temps de build
- Taille du bundle
- Vulnérabilités de sécurité

### Alertes
- Échec des tests CI/CD
- Nouvelles vulnérabilités critiques
- Augmentation du temps de build > 20%

## Responsabilités

- **Dependabot:** Création automatique des PR
- **Développeur:** Review et validation
- **DevOps:** Déploiement et monitoring
- **Sécurité:** Audit des vulnérabilités
