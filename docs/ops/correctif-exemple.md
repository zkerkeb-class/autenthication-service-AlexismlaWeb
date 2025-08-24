# Exemple de correctif - Service d'authentification

## Contexte

**Date:** 24 août 2024  
**Sévérité:** S2 - High  
**Impact:** 15% des utilisateurs affectés  

## Description du problème

### Symptômes
- Les utilisateurs recevaient des erreurs 401 "Token expired" même avec des tokens valides
- Le problème affectait principalement les sessions de plus de 24h
- Les logs montraient des erreurs de validation JWT

### Cause racine
```javascript
// Problème dans authMiddleware.js
const token = req.headers.authorization?.split(' ')[1];
if (!token) {
  return res.status(401).json({ error: "Token manquant" });
}

// Erreur: pas de vérification de la validité du token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

Le middleware ne vérifiait pas correctement la validité du token avant de le décoder.

## Solution

### Fix appliqué
```javascript
// Correction dans authMiddleware.js
const token = req.headers.authorization?.split(' ')[1];
if (!token) {
  return res.status(401).json({ error: "Token manquant" });
}

try {
  // Vérification explicite de la validité du token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Vérification de l'expiration
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    return res.status(401).json({ error: "Token expiré" });
  }
  
  req.user = decoded;
  next();
} catch (error) {
  return res.status(401).json({ error: "Token invalide" });
}
```

### Tests ajoutés
```javascript
// tests/authMiddleware.spec.js
describe('Token validation', () => {
  test('should reject expired tokens', () => {
    const expiredToken = jwt.sign(
      { userId: '123', exp: Math.floor(Date.now() / 1000) - 3600 },
      process.env.JWT_SECRET
    );
    
    const req = {
      headers: { authorization: `Bearer ${expiredToken}` }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    authMiddleware(req, res, jest.fn());
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token expiré" });
  });
});
```

## Processus de déploiement

### 1. Branche de développement
```bash
git checkout -b fix/jwt-token-validation
```

### 2. Développement et tests
```bash
# Correction du code
# Ajout des tests
npm test
npm run lint
```

### 3. Pull Request
- **Titre:** "fix: resolve JWT token validation issue"
- **Description:** Correction de la validation des tokens JWT expirés
- **Tests:** 3 nouveaux tests ajoutés
- **Review:** 2 approbations obtenues

### 4. Déploiement
```bash
# Merge en main
git checkout main
git merge fix/jwt-token-validation

# Tag de version
git tag -a v1.0.2 -m "Fix JWT token validation"

# Push
git push origin main --tags
```

### 5. Monitoring post-déploiement
- **Métriques surveillées:**
  - Taux d'erreur 401: < 1%
  - Temps de réponse: < 200ms
  - Sessions actives: stable

## Résultats

### Avant le fix
- **Taux d'erreur 401:** 15%
- **Tickets support:** 25 par jour
- **Satisfaction utilisateur:** 75%

### Après le fix
- **Taux d'erreur 401:** 0.5%
- **Tickets support:** 2 par jour
- **Satisfaction utilisateur:** 95%

## Leçons apprises

### Améliorations process
1. **Tests de régression:** Ajout de tests pour les cas d'expiration
2. **Monitoring:** Alertes automatiques sur les taux d'erreur 401
3. **Documentation:** Mise à jour du guide de développement

### Prévention
1. **Code review:** Vérification obligatoire de la gestion d'erreur
2. **Tests:** Couverture minimale 90% pour les middlewares critiques
3. **Monitoring:** Dashboards dédiés aux métriques d'authentification

## Tags et versions

- **Version:** v1.0.2
- **Commit:** `abc123def456`
- **Déploiement:** 24 août 2024, 14:30 UTC
- **Rollback:** Disponible si nécessaire
