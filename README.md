# JP2 Hub Android

Application Android WebView native pour JP2 Hub, propriété de JP2 Création.

Le login, le shell mobile, les parametres propres a l'app, la localisation
native et la connexion rapide restent integres dans l'app. Les pages et modules
du HUB sont charges en WebView depuis le serveur Laravel.

Le code metier reste dans le HUB Laravel. Les mises a jour des modules web sont
visibles dans l'app sans reconstruire l'APK, tant que le cadre mobile ne change
pas.

## URL du Hub

L'URL du Hub n'est pas inscrite dans le depot public. Elle est injectee au build
avec la variable ou le secret `JP2_HUB_ANDROID_URL`.

Pour une compilation locale :

```bash
JP2_HUB_ANDROID_URL="https://votre-domaine-hub.example/?mobile_app=1" npm run apk:debug
```

Pour une release GitHub, ajouter `JP2_HUB_ANDROID_URL` dans les secrets du depot
avec l'adresse d'installation du Hub. L'APK embarque alors cette adresse, sans
qu'elle apparaisse dans GitHub.

## Fonctionnalites app

- Animation d'entree JP2 Création embarquee dans l'APK.
- Navigateur integre avec retour, avance, actualisation et conservation des
  liens dans l'app.
- Parametres app : URL du serveur HUB, localisation, dernier module et
  commandes navigateur.
- Localisation native Capacitor avec permissions Android fine/coarse.
- Etat reseau et informations version/appareil visibles dans les parametres.

## Commandes

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

## APK debug

```bash
npm run apk:debug
```

APK genere :

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Release GitHub

Le workflow `.github/workflows/android-release.yml` construit l'APK signee,
publie la release GitHub et actualise `releases/jp2-hub-android-update.json`.

Secrets requis dans le depot `jp2creation/hub_android` :

- `JP2_CREATION_ANDROID_KEYSTORE_BASE64`
- `JP2_CREATION_ANDROID_KEYSTORE_PASSWORD`
- `JP2_CREATION_ANDROID_KEY_ALIAS`
- `JP2_CREATION_ANDROID_KEY_PASSWORD`
- `JP2_HUB_ANDROID_URL`

## Licence

Cette application Android fait partie de JP2 Hub et suit la licence du depot.
Les sources peuvent etre consultees et testees pour evaluation personnelle, mais
toute compilation, distribution, installation client, exploitation
professionnelle, revente ou publication d'un APK demande l'accord ecrit
prealable de Jean-Philippe DEGERT / JP2 Création.
