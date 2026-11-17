# Hänga Gbg 1.3.0 · Android i Firebase

Glavni APK koristi Firebase Authentication i Cloud Firestore. API na Cloudflare Workers provjerava kapacitet događaja, prava organizatora i administratora te pristup privatnim porukama. Firebase Spark i Workers Free mogu se koristiti unutar njihovih besplatnih kvota. Demo je zaseban APK i radi lokalno. Oba APK-a zahtijevaju Android 8.0 ili noviji.

## Firebase projekt

1. U [Firebase konzoli](https://console.firebase.google.com/) napravi zaseban projekt **Hänga Gbg** i odaberi **Spark**. Analytics je opcionalan.
2. Uključi **Authentication → Sign-in method → Email/Password**. Postavi politiku lozinke na najmanje 10 znakova, u načinu **Require**. Firebase šalje poveznice za potvrdu adrese i promjenu e-pošte. Korisnik nakon potvrde ponovno ulazi u aplikaciju s e-mailom i lozinkom.
3. Uključi **Cloud Firestore** u načinu **Native** i odaberi europsku lokaciju. Koristi bazu `(default)` i pokreni je s pravilima za produkciju.
4. U **Project settings** kopiraj **Project ID** i **Web API Key**. Ako web ključ još nije prikazan, registriraj web aplikaciju u projektu kako bi dobio konfiguraciju s poljem `apiKey`. Android WebView koristi Firebase REST API pa mu ne treba `google-services.json`.
5. Iz korijena repozitorija objavi Firestore pravila i indekse. Pričekaj da svi indeksi u konzoli prijeđu u stanje **Enabled**.

```sh
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project TVOJ_PROJECT_ID
```

Pravila blokiraju izravan klijentski pristup dokumentima. API pristupa Firestoreu sa zasebnim servisnim računom.

## Cloudflare Workers

1. U [Google Cloud konzoli](https://console.cloud.google.com/) odaberi isti Firebase projekt. Kreiraj servisni račun namijenjen samo ovom API-ju. Dodijeli `roles/datastore.user` za Firestore. Za brisanje korisnika dodijeli mu i IAM ulogu s dozvolom `firebaseauth.users.delete`. Za precizno ograničenje možeš izraditi prilagođenu ulogu samo s tom dozvolom.
2. Izradi JSON ključ za servisni račun i spremi ga **izvan Git repozitorija**. Koristi Cloudflare Workers Free. Pokreni naredbe u direktoriju `backend`. Umjesto apsolutne putanje u primjeru upiši put do svojeg JSON ključa.

```sh
cd backend
npx wrangler login
npx wrangler secret put FIREBASE_PROJECT
npx wrangler secret put FIREBASE_API_KEY
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT < /putanja/izvan-repozitorija/worker-service-account.json
npx wrangler deploy
```

3. Spremi prikazanu adresu u obliku `https://hanga-gbg.TVOJ-PODDOMEN.workers.dev`. Iz APK-a otvori **Anslutning / Connection** i upiši tu adresu te **Firebase Web API Key**. Za javnu distribuciju stavi te dvije javne vrijednosti u `app/src/main/assets/config.js` prije izgradnje. Za korisnike tako nema ručnog konfiguriranja.
4. Registriraj se iz APK-a, potvrdi e-mail i prijavi se. U Firebase **Authentication → Users** kopiraj UID svojeg računa. Dodaj ga u Worker iz direktorija `backend` naredbom `npx wrangler secret put ADMIN_UID`. Ponovno otvori aplikaciju. U izborniku će se pojaviti **Adminpanel / Admin panel**.

Web API ključ ide u Android konfiguraciju. Privatni ključ servisnog računa ostaje u zaštićenoj postavci Workera. Firestore sprema profile, događaje, prijave, spremljene planove, liste čekanja, poruke, prijave zloupotrebe i obavijesti.

## GitHub i APK

Raspakiraj sadržaj ZIP-a u GitHub repozitorij, uključujući `.github`. Pokreni **Actions → Build Android APKs → Run workflow**. U **Artifacts** preuzmi `Hanga-Gbg-Firebase.apk` ili `Hanga-Gbg-Demo.apk`.

Za lokalni build koristi JDK 21, Android SDK Platform 35 i Build Tools 35.0.0.

```sh
bash scripts/build-apk.sh firebase
bash scripts/build-apk.sh demo
```

Buildovi su u `app/build/manual/firebase` i `app/build/manual/demo`. Za javne nadogradnje koristi isti potpisni ključ pri svakom buildu. Skripta prima `HANGA_KEYSTORE`, `HANGA_KEY_ALIAS`, `HANGA_STOREPASS` i `HANGA_KEYPASS`. GitHub workflow koristi novi testni ključ pri svakom pokretanju. Android će odbiti nadogradnju preko instalacije s drugim potpisom. Uklanjanje prethodne aplikacije briše njezine lokalne postavke.

## Podsjetnici i provjera

Nakon prijave na događaj Android zakazuje podsjetnik dva sata prije početka. U **Mina planer / My plans** otvori događaj i u **Påminnelse / Reminder** zadaj vrijeme ili isključi podsjetnik. Za podsjetnike dopusti Android obavijesti. Gumb za precizne podsjetnike otvara odgovarajuću sistemsku postavku. Kod promjene termina ponovno otvori aplikaciju radi usklađivanja.

Opcionalne Android obavijesti o porukama, popunjenosti i promjenama uključuju se pod **Mitt konto**. JobScheduler periodički provjerava API, a vrijeme provjere određuje Android. Otkazivanje može ukloniti zakazani podsjetnik čim stigne do uređaja. Uređaj se može ponovno registrirati nakon isteka od 30 dana. Pri prelasku sa stare verzije ponovno uključi obavijesti i provjeri postavke podsjetnika na uređaju.

Testiraj s dva računa. Objavi događaj, neka se drugi račun prijavi, pa provjeri popis sudionika, podsjetnik i poruke u oba smjera. Pokušaj popuniti zadnje mjesto s više računa, zatim se odjavi i provjeri obavijest korisniku na listi čekanja.

## Ako već imaš podatke u Supabaseu

Ako je Supabase projekt prazan, preskoči ovaj korak. Za prijenos koristi zaseban prazan Firebase projekt. Za vrijeme izvoza i prijenosa zaustavi nove upise u staru aplikaciju. Skripte očekuju izvornu shemu 1.2.x i prijave e-mailom s BCRYPT hashom. Stare sesije se ponovno prijavljuju, a Android uređaji ponovno uključuju obavijesti. Firebase učitava postojeće BCRYPT hashove kako bi korisnici zadržali lozinke.

Izvezi podatke na svojem računalu. Postavi `PGHOST`, `PGPORT`, `PGUSER` i `PGDATABASE` na podatke iz Supabase **Connect**. Lozinku možeš unijeti u psql upit za lozinku. Izvoz sadrži privatne podatke i hashove pa ga spremi izvan repozitorija i nemoj ga slati u chat.

```sh
umask 077
psql -XAt -v ON_ERROR_STOP=1 -f migration/export-supabase.sql > /sigurna/putanja/hanga-backup.json
npm install --prefix migration
node migration/import-firebase.mjs /sigurna/putanja/hanga-backup.json TVOJ_PROJECT_ID --check
```

Za stvarni uvoz postavi Google Application Default Credentials s pravima upravljanja Firebase Authenticationom i upisa u Firestore. Možeš koristiti odvojeni servisni račun s ulogama **Firebase Authentication Admin** i **Cloud Datastore User**. Za uvoz koristi isti provjereni backup i zamijeni `--check` s `--apply`. Ako se uvoz prekine, ponovi istu naredbu s istom datotekom prije puštanja aplikacije u upotrebu. Provjeri prijavu postojećeg računa, broj događaja, prijave i poruke prije nego obustaviš stari projekt.

Službena dokumentacija za [Firebase planove](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans), [Cloudflare Workers kvote](https://developers.cloudflare.com/workers/platform/limits/) i [Firebase uvoz BCRYPT korisnika](https://firebase.google.com/docs/auth/admin/import-users).
