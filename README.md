# Davide Carusio Portfolio — Full Reverse Engineered Clone (A to Z)

Reconstitution complète et fidèle du site vitrine primé de **Davide Carusio** ([davidecarusio.it](https://www.davidecarusio.it)), web designer freelance basé à Reggio Emilia, Italie.

---

## 🎯 Aperçu des Fonctionnalités & Architecture

### 1. Frontend & Animations (100% Identique)
- **WebGL Interactive Shader** : Scène de dégradé interactive propulsée par **UnicornStudio 2.2.7** avec le fichier de scène `flow_gradient_remix_scene.json.txt`.
- **GSAP Suite 3.15.0** :
  - `CustomEase` & `ScrollTrigger` pour les déclenchements fluides au défilement.
  - `SplitText` pour les révélations typographiques lettre par lettre et mot par mot.
  - Curseur dynamique contextuel (`data-cursor`, `data-cursor-hover`, `data-cursor-text`) avec effet magnétique et détection des images.
  - Parallaxe multi-breakpoints (`data-parallax="trigger"`).
  - Transition en volet / persienne (`data-shutter-scroll-transition`).
  - Effet Parallaxe fluide sur le footer.
  - Highlight text scrub animation au scroll.
- **Lenis Smooth Scroll v1.3.26** : Défilement ultra-fluide avec inertie synchronisé avec GSAP Ticker.
- **Service Video Switcher** : Survol interactif des services avec préchargement dynamique et lecture des vidéos showreel.
- **Accordeon FAQ** : Système accordéon exclusif (fermeture automatique des autres questions).
- **Multi-langue** : Support complet Italien (`/`) et Anglais (`/en`).

### 2. Assets 100% Localisés & Hors-ligne
- **Vidéos MP4 Showreel** (5 vidéos au total, téléchargées et servies en local) :
  - *Casa Vergnani*
  - *Jesuisvir*
  - *Luca Maglierie*
  - *Omar Essam*
  - *Team App*
- **Typographies & Webfonts** : `Geist-Medium`, `Geist-Bold`, `GeistMono-SemiBold`, `FunnelDisplay-VariableFont`, `Geist-SemiBold`.
- **Images Haute Résolution** : Plus de 50 images WebP, AVIF, PNG et SVG incluant les déclinaisons responsives (`srcset` 500w, 800w, 1080w, 1600w, 2000w).
- **Scripts et Librairies JS** : Aucun lien CDN cassé, tous les fichiers sont embarqués en local dans `/js`.

### 3. Backend Node.js / Express
- **Serveur Haute Performance** (`server.js`) :
  - Support natif des types MIME modernes (`image/avif`, `image/webp`, `font/woff2`, `video/mp4` avec support HTTP 206 Partial Content / Range requests pour un streaming fluide des vidéos).
  - Routage bilingue propre (`/` pour l'italien, `/en` pour l'anglais).
- **API REST Backend** :
  - `GET /api/health` : Statut de santé et uptime du serveur.
  - `GET /api/projects` : Données structurées des 5 projets avec liens et métadonnées.
  - `POST /api/contact` : Réception des demandes de devis/contact avec validation et persistance locale dans `data/contacts.json`.
  - `GET /api/contact` : Consultation des messages reçus.

---

## 📂 Structure du Projet

```text
├── assets/
│   └── flow_gradient_remix_scene.json.txt  # Scène WebGL UnicornStudio
├── css/
│   ├── davidecarusio-it-v3.webflow.css     # Styles principaux & mise en page
│   ├── normalize.css                       # Normalisation CSS
│   └── webflow.css                         # Composants de base Webflow
├── data/
│   └── contacts.json                       # Base de données locale des contacts
├── en/
│   └── index.html                          # Version anglaise (/en)
├── fonts/                                  # Polices Geist et FunnelDisplay
├── images/                                 # 50+ images WebP, AVIF, SVG, PNG
├── js/                                     # GSAP, Lenis, UnicornStudio, Webflow runtime
├── scripts/                                # Scripts de crawling et tests
├── videos/                                 # 5 vidéos showreels MP4
├── en.html                                 # Version anglaise alternative
├── index.html                              # Page d'accueil Italienne (/)
├── package.json                            # Configuration npm
└── server.js                               # Serveur backend Express
```

---

## 🚀 Démarrage Rapide

### 1. Lancer avec le serveur Backend Express (Recommandé)
```bash
npm start
```
Ou en mode développement (rechargement automatique) :
```bash
npm run dev
```

Accédez ensuite à :
- **Version Italienne** : [http://localhost:3001/](http://localhost:3001/)
- **Version Anglaise** : [http://localhost:3001/en](http://localhost:3001/en)
- **API Projets** : [http://localhost:3001/api/projects](http://localhost:3001/api/projects)
- **API Health** : [http://localhost:3001/api/health](http://localhost:3001/api/health)

### 2. Tester l'API de contact
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Client Test","email":"client@example.com","message":"Besoin d un site Webflow","service":"Webflow"}'
```

### 3. Exécuter la suite de tests automatisée
```bash
python scripts/test_server.py
```

