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
de ton bar, elle te propose les cocktails **au shaker** réalisables, ceux auxquels
il ne manque qu'un ou deux ingrédients, ce qu'il faut acheter pour en débloquer
le plus, puis un **pas à pas** (avec chrono de shake) une fois le cocktail choisi.
Elle fonctionne hors ligne et mémorise ton inventaire sur le téléphone.

### Mise en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages**.
2. *Source* : **Deploy from a branch**, branche choisie, dossier **/docs**.
3. L'adresse sera de la forme `https://<utilisateur>.github.io/blank-app/`.

### Installation sur le Pixel 7

Ouvre l'adresse dans Chrome → menu ⋮ → **Installer l'application**
(ou « Ajouter à l'écran d'accueil »).

### Tester en local

```
$ cd docs && python3 -m http.server 8000
```

Puis ouvre `http://localhost:8000`.

### Ajouter un cocktail ou un ingrédient

Tout est dans `docs/data.js`. Après une modification, rouvre l'appli en ligne :
le service worker récupère les nouveaux fichiers.
