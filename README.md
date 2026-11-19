# Hänga Gbg 1.5.3 · Android

[**Ladda ner / Download Hänga Gbg för Android (.apk)**](https://github.com/tdavor/HangaGBG/releases/latest/download/HangaGBG.apk)


Svenska

Idén till Hänga Gbg föddes ur något jag ofta såg på sociala medier. Många i Göteborg känner sig ensamma och söker någon att ta en fika med, gå en promenad med eller bara umgås med. Efter att ha sett sådana inlägg många gånger skapade jag appen för att göra det enklare att hitta sällskap och faktiskt ses.

I Hänga Gbg kan du hitta träffar som andra ordnar, bläddra bland aktiviteter från Göteborgs Stads kalendarium eller skapa en egen träff. Hittar du något du vill gå på kan du dela aktiviteten, bjuda med andra och skriva till deltagarna för att bestämma var och när ni ska ses.

En fika, en promenad eller ett besök på en utställning kan vara ett enkelt första steg till att lära känna någon ny i Göteborg.

English

The idea for Hänga Gbg came from something I kept seeing on social media. Many people in Gothenburg feel lonely and post looking for someone to grab a coffee with, go for a walk with, or simply hang out with. After seeing posts like these again and again, I built the app to make it easier for people to find company and meet in person.

With Hänga Gbg, you can find meetups organised by other users, browse activities from the City of Gothenburg’s calendar, or organise a meetup of your own. If you find something you’d like to go to, you can share the event, invite others along, and message participants to agree on where and when to meet.

A coffee, a walk, or a visit to an exhibition can be a simple first step towards getting to know someone new in Gothenburg.

## Community features in 1.5.0

- **Home:** Company today, neighborhood and time, automatically hidden at Stockholm midnight. Members can start a quick meetup and share it.
- **Meetup:** participant-only group chat alongside private messages; Google Maps meeting-point link and recognition instructions; attendance confirmation during the last 24 hours. Leaving a meetup releases the place and notifies the waitlist.
- **Create meetup:** optional weekly recurrence, up to 12 independent occurrences, preserving local Stockholm time across daylight-saving changes. Edits and cancellations affect one occurrence.
- **Organizer profile / My account:** follow organizers and manage the followed list. Followers receive a notification when an organizer creates a meetup (one notification for a recurring series).
- **Past meetups:** optional private feedback after the end time; only its author and the app administrator can read it. Admin feedback is under a collapsed section.

Deploy the Worker using the repository's existing Cloudflare deployment. Both Wrangler configurations include a 15-minute Cron Trigger for attendance and feedback notifications (up to four meetups per invocation, with unfinished work picked up by the next run). Existing Firebase service credentials remain in Cloudflare secrets; no new secret or public Firestore access is needed. Group and community notices use the existing Android background alert polling; private chat keeps its FCM delivery. The offline demo hides community features that require an account and backend.

Validation: `node --test backend/test/*.mjs`. GitHub Actions builds the Android APKs for pull requests; the existing tagged-release workflow publishes signed APKs.


Private chat history survives meetup deletion. Each member can delete a message or the current conversation history for themselves; the other member's copy is unchanged. New messages after a conversation deletion appear normally. New messages still require a shared meetup and respect blocks. Messages already physically removed by older Worker deployments are not restored by this change.

City-calendar entries are filtered by their Stockholm-aware end time on both the Worker and Android UI, including cached responses. Ended entries are removed when the app resumes and at the next event-end timer while open. Calendar cards show the end time and label ongoing activities. City content is a live feed, not copied into member-event records.


## Tickster event source

The Worker combines the existing city calendar with Tickster Event API v1.0. Cards identify their source and retain sharing and meetup creation. Tickster entries are scoped to Göteborg; cancelled events and production/collection containers are excluded. Unknown end times expire at the start rather than inventing a duration. Matching title, exact start instant and nonempty venue suppress duplicate imported occurrences; different dates and venues remain separate. Member meetups are never deduplicated against imported events. Both backend and device remove ended entries, including cached results.

Request an API key at https://developer.tickster.com/ and confirm the provider's access and reuse terms. Configure it only as a Cloudflare Worker secret:

```sh
npx wrangler secret put TICKSTER_API_KEY
npx wrangler deploy
```

Run these from the repository root using the existing Cloudflare account. Never put the key in Android assets, source control or public configuration. With no key, only the city calendar is fetched. Each provider has a separate cache (city 5 minutes, Tickster 15 minutes); a failed provider does not suppress the other provider's results. The `X-Event-Sources` response header reports missing configuration or partial outages without exposing credentials. Tickster pagination is capped at 2,000 results and an overall 10-second fetch budget. Images are not imported or hotlinked.

Validation: `node --test backend/test/*.mjs` and `node --check app/src/main/assets/app.js`. Real Tickster access and production deployment require the API key and Cloudflare deployment access; mocked tests do not establish live access.
