# 🎈 Blank app template

A simple Streamlit app template for you to modify!

[![Open in Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://blank-app-template.streamlit.app/)

### How to run it on your own machine

1. Install the requirements

   ```
   $ pip install -r requirements.txt
   ```

2. Run the app

   ```
   $ streamlit run streamlit_app.py
   ```

---

## 🍸 Shaker – l'appli cocktails (dossier `docs/`)

Application web installable (PWA) pensée pour téléphone : tu coches les bouteilles
de ton bar, elle te propose parmi **79 cocktails** (shaker, mélangés comme le Negroni,
ou directement dans le verre) ceux réalisables, ceux auxquels il ne manque qu'un ou
deux ingrédients, et ce qu'il faut acheter pour en débloquer le plus.

- **Puissance** : chaque cocktail affiche un niveau (Léger → Très fort), son degré
  estimé et son nombre de verres standard. Un réglage **Léger / Normal / Fort**
  ajuste les doses d'alcool (×0,6 / ×1 / ×1,4), et tout est recalculé.
- **Pas à pas** adapté à la méthode (avec chronos de shake et de mélange).
- Fonctionne hors ligne et mémorise ton inventaire sur le téléphone.

### Mise en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages**.
2. *Source* : **Deploy from a branch**, branche choisie, dossier **/docs**.
3. L'adresse sera de la forme `https://<utilisateur>.github.io/blank-app/`.

### Installation sur téléphone et tablette

L'appli s'adapte à l'écran : une colonne sur téléphone, plusieurs colonnes sur tablette
(portrait ou paysage).

- **Android (Pixel, tablette Samsung…)** : ouvre l'adresse dans **Chrome**, puis touche
  **📲 Installer** dans l'encart de l'onglet *Mon bar* (ou menu ⋮ → *Installer l'application*).
- **iPhone / iPad** : ouvre l'adresse dans **Safari**, touche le bouton Partager ⎙,
  puis **Sur l'écran d'accueil**.
- **Ordinateur** : dans Chrome ou Edge, icône d'installation à droite de la barre d'adresse.

### Publier une version (Release)

```
$ git tag -a v1.0.0 -m "Version 1.0.0"
$ git push origin v1.0.0
```

Le workflow `.github/workflows/release.yml` crée alors la Release GitHub avec l'appli en
`.zip`. Penser à augmenter `APP_VERSION` (`docs/app.js`) et `VERSION` (`docs/sw.js`).

### Fichier .apk (optionnel)

L'appli est une PWA, donc sans `.apk`. Si tu en veux un, le site gratuit
[pwabuilder.com](https://www.pwabuilder.com) en génère un à partir de l'adresse du site.

### Tester en local

```
$ cd docs && python3 -m http.server 8000
```

Puis ouvre `http://localhost:8000`.

### Ajouter un cocktail ou un ingrédient

Tout est dans `docs/data.js`. Après une modification, rouvre l'appli en ligne :
le service worker récupère les nouveaux fichiers.
