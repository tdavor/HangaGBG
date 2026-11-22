"use strict";

const copy = {
  googleLogin:["Fortsätt med Google","Continue with Google"], googleComplete:["Slutför din profil","Complete your profile"],
  googleProfileHelp:["Välj ett ledigt namn och ditt område. Din e-post visas inte för andra medlemmar.","Choose an available name and your area. Your email stays hidden from other members."],
  googleSetup:["Google-inloggning är inte aktiverad för den här appversionen. Använd e-post eller kontakta support.","Google sign-in is not configured for this app version. Use email or contact support."],
  googleFailed:["Google-inloggningen misslyckades. Försök igen eller använd e-post.","Google sign-in failed. Try again or use email."],
  googleCancelled:["Google-inloggningen avbröts.","Google sign-in was cancelled."], googleBusy:["Google-inloggning pågår redan.","Google sign-in is already in progress."],
  googleWrongAccount:["Välj samma Google-konto som du är inloggad med i HängaGBG.","Choose the same Google account you use in HängaGBG."],
  googleAccountExists:["Adressen har redan ett konto. Logga in med din tidigare metod. Kontakta support om du behöver hjälp att koppla kontona.","This email already has an account. Sign in using your original method. Contact support for help linking accounts."],
  googleManageAccount:["E-post och lösenord för ditt Google-konto hanteras hos Google.","Your Google account email and password are managed by Google."],
  googleDeleteHelp:["Bekräfta med ditt Google-konto i nästa steg för att radera kontot och dina uppgifter.","Confirm with your Google account in the next step to delete your account and data."],

  company:["Tillgängliga idag","Available today"], offer:["Föreslå en träff","Suggest a meetup"],
  suggestMeetup:["Föreslå en träff","Suggest a meetup"], allAvailable:["Alla tillgängliga idag","Everyone available today"], offerHelp:["Skicka ett privat förslag inom personens angivna tid. Mottagaren kan svara i chatten. Ingen vänskap eller anmälan skapas automatiskt.","Send a private suggestion within the person's available time. They can reply in chat. No friendship or event registration is created automatically."], offerPending:["Du har redan skickat ett förslag för den här tillgängligheten.","You have already sent a suggestion for this availability."], offerPendingHelp:["Ditt förslag är skickat. Du kan fortsätta skriva när mottagaren har svarat.","Your suggestion has been sent. You can continue messaging once the recipient replies."], availabilityChatHelp:["Ni kan svara privat på förslaget här.","You can discuss the suggestion privately here."], availabilityEnded:["Tillgängligheten har upphört eller tiden räcker inte längre för ett nytt förslag.","This availability has ended or there is no longer enough time for a new suggestion."], takePhoto:["Ta en bild","Take a photo"],

  nextCompany:["Nästa 3","Next 3"], availableTodayBadge:["Tillgänglig idag","Available today"], companyBatch:["Visar","Showing"],
  profilePhoto:["Profilbild","Profile photo"], changePhoto:["Välj profilbild","Choose profile photo"], removePhoto:["Ta bort bild","Remove photo"], photoHelp:["Välj en bild från telefonen. Den beskärs till en kvadrat och visas på din offentliga profil.","Choose a photo from your phone. It is cropped to a square and shown on your public profile."], photoSaved:["Profilbilden har sparats.","Profile photo saved."], photoInvalid:["Välj en JPG-, PNG- eller WebP-bild på högst 10 MB.","Choose a JPG, PNG or WebP image up to 10 MB."], photoSaving:["Sparar bilden…","Saving photo…"], organizedMeetups:["Organiserade träffar","Meetups organized"], participatingMeetups:["Deltar i","Meetups attending"], noPublicMeetups:["Inga offentliga träffar att visa.","No public meetups to show."], contactRule:["Du kan skriva när ni är vänner eller deltar i samma träff. Tidigare konversationer kan fortfarande läsas.","You can send messages when you are friends or attend the same meetup. Previous conversations remain readable."], privateEmail:["Din e-post visas aldrig på den offentliga profilen.","Your email is never shown on your public profile."],

  userCreatedMeetups:["Träffar skapade av användare","Meetups created by users"], mixedSourcesHint:["Även Göteborgs stadskalender visas. Välj källa i filtren.","Göteborg’s city calendar is also included. Choose a source in the filters."],
  noFriendRequests:["Inga nya vänförfrågningar.","No new friend requests."],
  homeTitle:["Hitta ditt sällskap","Find your company"], homeIntro:["Små möten. Nya vänner. Nära dig.","Small meetups. New friends. Close to you."], explore:["Upptäck","Discover"], createShort:["Skapa","Create"], profileShort:["Profil","Profile"], mainNavigation:["Huvudnavigation","Main navigation"], supportCoffee:["Bjud på en kaffe","Buy me a coffee"], nearbyMeetups:["Träffar nära dig","Meetups near you"], searchFriends:["Sök bland vänner","Search friends"], myFriends:["Mina vänner","My friends"], noFriendsFound:["Inga vänner matchar din sökning.","No friends match your search."], viewMeetup:["Visa träffen","View meetup"], filterShort:["Filter","Filters"], searchMeetups:["Vad vill du hitta på?","What would you like to do?"],

  adminMessage:["Skriv meddelande","Message user"], adminSender:["Från administratören","From the administrator"],
  adminChatHelp:["Privat kontakt mellan administratören och användaren. Användaren kan svara här utan en gemensam träff eller vänskap.","Private contact between the administrator and the user. The user can reply here without a shared meetup or friendship."],

  messageOptions:["Meddelandealternativ","Message options"], conversationOptions:["Konversationsalternativ","Conversation options"], appMenu:["Appmeny","App menu"], chatPlaceholder:["Skriv ett meddelande…","Write a message…"],
  friends:["Vänner","Friends"], friendsHelp:["Håll kontakten efter träffen. Vänskap är ömsesidig och finns kvar även om träffen raderas.","Stay in touch after a meetup. Friendship is mutual and stays even if the meetup is deleted."],
  addFriend:["Lägg till vän","Add friend"], friendPending:["Vänförfrågan skickad","Friend request sent"],
  friendRequest:["Ny vänförfrågan","New friend request"], friendAccepted:["Vänförfrågan accepterad","Friend request accepted"],
  friendRequests:["Vänförfrågningar","Friend requests"], friendOutgoing:["Skickade förfrågningar","Sent requests"],
  acceptFriend:["Acceptera","Accept"], declineFriend:["Avböj","Decline"], withdrawFriend:["Ta tillbaka förfrågan","Withdraw request"],
  removeFriend:["Ta bort vän","Remove friend"], manageFriend:["Hantera vänskap","Manage friendship"],
  removeFriendConfirm:["Ta bort vänskapen? Era tidigare meddelanden finns kvar. Använd blockering om du vill stoppa kontakt.","Remove this friendship? Your previous messages stay. Use blocking if you want to stop contact."],
  friendsEmpty:["Inga vänner ännu. Öppna en tidigare deltagares profil och skicka en vänförfrågan, eller välj Ses igen efter en träff.","No friends yet. Open a past participant's profile and send a friend request, or choose Meet again after a meetup."],
  pastParticipants:["Hitta tidigare deltagare","Find past participants"], inviteFriend:["Bjud med på en träff","Invite to a meetup"],
  chooseInvite:["Vilken träff vill du bjuda med din vän till?","Which meetup would you like to invite your friend to?"],
  inviteHelp:["Välj en kommande träff som du ordnar eller är anmäld till. Din vän får en privat inbjudan och väljer själv om hen vill anmäla sig.","Choose an upcoming meetup you organize or have joined. Your friend receives a private invitation and chooses whether to join."],
  sendInvite:["Skicka inbjudan","Send invitation"], inviteSent:["Inbjudan har skickats i er konversation.","The invitation has been sent in your conversation."],
  noInviteEvents:["Du har inga kommande träffar att bjuda med till. Anmäl dig till en träff eller skapa en egen först.","You have no upcoming meetups to invite someone to. Join a meetup or create one first."],
  inviteUnavailable:["Den här träffen är inte längre tillgänglig.","This meetup is no longer available."],
  firstFriendMessage:["Skriv ett meddelande för att börja prata.","Write a message to start chatting."],
  friendChatHelp:["Ni är vänner och kan fortsätta skriva även när tidigare träffar har raderats.","You are friends and can keep messaging even when earlier meetups have been deleted."],

  meetupMode:["Vad vill du skapa?","What would you like to create?"], standardMeetup:["En bestämd träff","A planned meetup"],
  ideaMode:["Ett förslag som behöver fler","An idea needing more people"],
  proposal:["Förslag","Meetup idea"], minPeople:["Minsta antal personer, inklusive dig","Minimum people, including you"],
  proposalHelp:["Intresse är ingen anmälan. När minimiantalet är uppnått får alla en inbjudan att bekräfta. Träffen blir bestämd när arrangören och tillräckligt många deltagare tackat ja. Antal platser nedan avser gäster utöver dig, högst 20.","Interest is not an RSVP. Once the minimum is reached, everyone is invited to confirm. The meetup is confirmed when the organizer and enough participants accept. The capacity below counts guests in addition to you, up to 20."],
  proposalExpired:["Förslaget blev inte bekräftat i tid","The idea was not confirmed before its start"],
  proposalCollecting:["Vi samlar intresse","Gathering interest"], proposalReady:["Tillräckligt många är intresserade – bekräfta","Enough people are interested – please confirm"],
  proposalActive:["Nu blir träffen av!","The meetup is confirmed!"], interested:["Jag är intresserad","I'm interested"], withdrawInterest:["Ta bort mitt intresse","Withdraw my interest"],
  interestCount:["intresserade, inklusive arrangören","interested, including the organizer"], confirmProposal:["Ja, jag kommer om träffen blir av","Yes, I'll come if the meetup goes ahead"],
  proposalConfirmed:["Du har tackat ja. Vi inväntar fler bekräftelser.","You've accepted. Waiting for the remaining confirmations."],
  confirmedPeople:["bekräftade, inklusive arrangören","confirmed, including the organizer"], proposalPlans:["Förslag jag är intresserad av","Meetup ideas I'm interested in"],
  proposalFixed:["Minimiantalet gäller detta förslag och kan inte ändras efter publicering.","The minimum for this idea cannot be changed after publication."],
  atmosphereHelp:["Välj hur ni vill umgås. Det är en förväntan på träffen, inte en etikett på dig.","Choose how you'd like to spend time together. This describes the meetup, not you."],
  atmosphereFilter:["Vilken stämning passar dig?","What kind of meetup suits you?"],
  again:["Ses igen","Meet again"], againHelp:["Välj privat vilka du gärna träffar igen. Bara ett ömsesidigt val visas – ingen ser ett nej eller ett obesvarat val. Vid ett ömsesidigt val blir ni också vänner och kan fortsätta skriva. Du kan ändra ditt val tills ni matchar.","Privately choose who you'd like to meet again. Only mutual choices are revealed; no one sees a rejection or an unanswered choice. A mutual choice also connects you as friends so you can keep messaging. You can change your choice until you match."],
  againSelect:["Jag vill gärna ses igen","I'd like to meet again"], againSelected:["Valt privat – ångra","Selected privately – undo"],
  againMatch:["Ni vill båda ses igen","You both want to meet again"], againEmpty:["Inga andra deltagare att välja just nu.","There are no other participants to choose right now."],
  planNext:["Planera nästa träff","Plan your next meetup"], afterMeetup:["Efter träffen","After the meetup"],
  walkIdeas:["Promenader med ett litet mål","Walks with a small goal"], walkIdeasHelp:["Ett gemensamt mål ger något att prata om. Välj en idé och anpassa plats, tid och beskrivning.","A shared goal gives you something to talk about. Pick an idea and adapt the location, time and description."],
  walkGoal:["Promenadens mål","The walk's goal"],
  walk_view:["Hitta en fin utsikt","Find a great view"], walk_photo:["Fotopromenad vid vattnet","Photo walk by the water"],
  walk_cafe:["Upptäck ett nytt kafé","Discover a new café"], walk_discover:["Hitta kvarterets gömda pärlor","Find the neighbourhood's hidden gems"],

  deleteConversation:["Radera konversation","Delete conversation"], deleteMessage:["Radera för mig","Delete for me"],
  deleteConversationConfirm:["Radera tidigare meddelanden i den här konversationen för dig? Den andra personen behåller sin historik. Nya meddelanden kan visas igen.","Delete the current conversation history for you? The other person keeps their history. New messages can appear again."],
  deleteMessageConfirm:["Radera meddelandet för dig? Det finns kvar hos den andra personen.","Delete this message for you? It remains visible to the other person."],
  retainedChatHelp:["Din historik finns kvar även om träffen raderas. Vänner kan fortsätta skriva direkt. Andra konversationer kräver en gemensam träff.","Your history stays even if the meetup is deleted. Friends can keep messaging directly. Other conversations require a shared meetup."],

  editAvailability:["Ändra min tillgänglighet","Edit my availability"], myAvailability:["Din tillgänglighet idag","Your availability today"],
  availabilitySaved:["Din tillgänglighet har sparats.","Your availability has been saved."], availabilityRemoved:["Din tillgänglighet har tagits bort.","Your availability has been removed."],
  removeAvailabilityConfirm:["Ta bort din tillgänglighet för idag?","Remove your availability for today?"],
  todayCompany:["Sällskap idag","Company today"], availableToday:["Jag vill ses idag","I'm available today"], viewAvailability:["Visa alla tillgängliga","View everyone available"],
  availabilityTime:["Tillgänglig från","Available from"], availableUntil:["Till","Until"],
  removeAvailability:["Ta bort min tillgänglighet","Remove my availability"],
  availabilityHelp:["Syns för inloggade medlemmar och försvinner senast vid midnatt. Starta en träff och dela den med den du vill möta.","Visible to signed-in members until midnight at the latest. Create a meetup and share it with the person you want to meet."],
  todayEmpty:["Ingen har angett tillgänglighet än.","No one has posted availability yet."],
  activity:["Aktivitet","Activity"], groupChat:["Gruppchatt","Group chat"], groupHelp:["Bara arrangören och anmälda deltagare kan läsa och skriva här.","Only the organizer and joined participants can read and write here."],
  meetingPoint:["Mötesplats","Meeting point"], meetingNote:["Så hittar vi varandra","How to recognize each other"],
  meetingMap:["Google Maps-länk till mötespunkten","Google Maps link to the meeting point"],
  meetingHelp:["Öppna Google Maps, sätt en nål på platsen och klistra in länken från Dela.","Open Google Maps, drop a pin at the meeting point, and paste its Share link."],
  endTime:["Sluttid","End time"], recurrence:["Upprepa varje vecka","Repeat weekly"],
  occurrences:["Antal tillfällen","Number of occurrences"], recurrenceHelp:["Varje tillfälle får egna anmälningar. Redigering och avbokning gäller det valda tillfället.","Each occurrence has its own RSVPs. Edits and cancellations apply to the selected occurrence."],
  follow:["Följ arrangören","Follow organizer"], unfollow:["Sluta följa","Unfollow"], following:["Ny träff från en arrangör du följer","New meetup from an organizer you follow"],
  followingTitle:["Arrangörer jag följer","Organizers I follow"], attendance:["Bekräfta att du kommer","Confirm you are coming"],
  confirmAttendance:["Jag kommer","I'm coming"], confirmed:["Du har bekräftat att du kommer","You have confirmed attendance"],
  confirmationHelp:["Bekräfta under det sista dygnet. Om du inte kan komma, lämna din plats så att någon annan kan anmäla sig.","Confirm during the last 24 hours. If you cannot come, release your place so someone else can join."],
  feedback:["Hur var träffen?","How was the meetup?"], feedbackHelp:["Ditt svar är privat och används av appens administratör för att förbättra träffarna.","Your response is private and used by the app administrator to improve meetups."],
  welcomed:["Kände du dig välkommen?","Did you feel welcome?"], comeAgain:["Skulle du komma igen?","Would you attend again?"],
  chooseAnswer:["Välj ett svar","Choose an answer"], yes:["Ja","Yes"], partly:["Delvis","Partly"], no:["Nej","No"], maybe:["Kanske","Maybe"],
  feedbackAdmin:["Privata omdömen","Private feedback"],
  feedbackNote:["Berätta mer (valfritt)","Tell us more (optional)"], yourFeedback:["Ditt sparade svar","Your saved response"],
  group:["Nytt meddelande i gruppchatten","New group chat message"],
  repeated:["Återkommande träff","Recurring meetup"], pastAttended:["Tidigare träffar jag deltog i","Past meetups I attended"],
  groupReport:["Anmäl gruppmeddelande","Report group message"],

  cityOngoing:["Pågår nu","Ongoing now"],
  cityCalendar:["Göteborgs Stad","City of Gothenburg"],
  cityCalendarUnavailable:["Stadens kalendarium är tillfälligt otillgängligt.","The city calendar is temporarily unavailable."],
  eventSource:["Visa träffar från","Show events from"],
  communityEvents:["Hänga Gbg","Hänga Gbg"],
  arrangeCityMeetup:["Ordna en träff","Arrange a meetup"],
  cityMeetups:["Träffar för evenemanget","Meetups for this event"],
  cityMeetupHelp:["Välj tid och mötesplats. Efter publicering kan du bjuda in andra och skriva till deltagare i Hänga Gbg. Kontrollera eventuell bokning på Göteborgs Stads webbplats.","Choose a time and meeting point. After publishing, invite others and message participants in Hänga Gbg. Check any booking requirements on the city website."],
  cityShare:["Dela / bjud in","Share / invite"],
  cityInvite:["Vill du följa med?","Want to come along?"],
  conversations:["Konversationer","Conversations"],
  unreadMessages:["Olästa meddelanden","Unread messages"],
  memberProfile:["Profil","Profile"],
  nameTaken:["Namnet används redan. Välj ett annat namn.","That name is already in use. Choose another one."],
  spokenLanguages:["Språk jag talar","Languages I speak"],
  downloadApp:["Ladda ner Hänga Gbg","Download Hänga Gbg"],
  about:["Om","About"], appVersion:["Version","Version"], author:["Skapad av","Author"], interfaceLanguage:["Appens språk","App language"],
  contact:["Kontakta Hänga Gbg","Contact Hänga Gbg"], expired:["Avslutade träffar","Past meetups"],
  repeat:["Skapa en ny träff från denna","Repeat this meetup"], deleteEvent:["Ta bort träffen","Delete meetup"],
  keepMeetup:["Behåll träffen","Keep meetup"],
  eventDeleted:["Träffen togs bort.","The meetup was deleted."],
  eventDeleteIncomplete:["Träffen finns fortfarande kvar. Försök igen eller kontakta support.","The meetup is still listed. Try again or contact support."],
  confirmEventDelete:["Ta bort träffen permanent?","Permanently delete this meetup?"],
  passwordShow:["Visa lösenord","Show password"], passwordHide:["Dölj lösenord","Hide password"],
  alertsFailed:["Det gick inte att starta aviseringar. Försök igen.","Couldn't start notifications. Try again."],
  authDeletion:["Kontot kunde inte tas bort. Försök igen.","The account couldn't be deleted. Try again."],
  walk:["Promenader","Walks"],
  reminderTitle:["Påminnelse","Reminder"], reminderMinutes:["Minuter före start","Minutes before start"],
  reminderOff:["Ingen påminnelse","No reminder"], preciseReminder:["Tillåt exakta påminnelser","Allow precise reminders"],
  allowReminder:["Tillåt Android-aviseringar","Allow Android notifications"],
  reminderNote:["Standard: 120 minuter före start. Inställningen gäller på den här enheten.",
    "Default: 120 minutes before the start. This setting applies on this device."],
  browseEvents:["Kommande träffar","Upcoming meetups"], searchFilters:["Sök och filtrera","Search and filter"],
  previous:["Föregående","Previous"], next:["Nästa","Next"], page:["Sida","Page"],
  simulateVacancy:["Simulera en ledig plats","Simulate an open spot"],
  quick:["Snabbträff","Quick meetup"], createQuick:["Skapa en snabbträff","Create a quick meetup"], quickBadge:["Spontant","Spontaneous"],
  quickTime:["Välj en tid inom 24 timmar.","Choose a time within the next 24 hours."],
  newcomers:["Nya deltagare välkomna","First-timers welcome"], share:["Dela inbjudan","Share invitation"],
  shareFailed:["Kunde inte dela inbjudan.","Could not share invitation."],
  waitlist:["Gå med i väntelistan","Join waitlist"], leaveWaitlist:["Lämna väntelistan","Leave waitlist"],
  seatAvailable:["En plats är ledig. Uppdatera och anmäl dig.","A spot is available. Refresh and join."],
  vacancy:["En plats har blivit ledig","A spot opened up"], changed:["Tid eller plats har ändrats","Time or place changed"],
  cancelled:["Träffen är inställd","Meetup cancelled"], cancelEvent:["Ställ in träffen","Cancel meetup"],
  confirmCancel:["Vill du ställa in träffen och meddela deltagarna?","Cancel the meetup and notify attendees?"],
  reminder:["Träffen börjar inom en timme","Meetup starts within an hour"],
  report:["Anmäl innehåll","Report content"], reportReason:["Vad vill du anmäla?","What would you like to report?"],
  reported:["Det här har redan anmälts.","You have already reported this."],
  blockPerson:["Blockera meddelanden","Block messages"], unblockPerson:["Avblockera meddelanden","Unblock messages"],
  blockedPeople:["Blockerade konton","Blocked accounts"], messageBlocked:["Meddelanden mellan dessa konton är blockerade.","Messages between these accounts are blocked."],
  reportPerson:["Anmäl konto","Report account"], reportEvent:["Anmäl träff","Report meetup"], reportMessage:["Anmäl meddelande","Report message"],
  eventTemplates:["Förslag att publicera","Starter meetup drafts"],
  templateDate:["Välj datum, tid och exakt mötesplats innan publicering.","Choose a date, time and exact meeting point before publishing."],
  reports:["Anmälningar","Reports"], resolve:["Markera behandlad","Mark resolved"], resolved:["Behandlad","Resolved"],
  checkUpdates:["Sök efter uppdatering","Check for updates"],
  accountMenu:["Kontomeny","Account menu"],
  discover:["Upptäck","Discover"], plans:["Mina planer","My plans"], create:["Skapa","Create"],
  messages:["Meddelanden","Messages"], profile:["Mitt konto","My account"], admin:["Adminpanel","Admin panel"],
  notices:["Aviseringar","Notifications"], login:["Logga in","Log in"], register:["Skapa konto","Sign up"],
  logout:["Logga ut","Log out"], settings:["Anslutning","Connection"], browse:["Vad vill du göra i Göteborg?","What are you up for in Gothenburg?"],
  intro:["Hitta något att göra i kväll eller bjud in andra till en egen träff.","Find something to do tonight or invite others to your own meetup."],
  search:["Till exempel: promenad i Haga","For example: a walk in Haga"], keyword:["Vad är du sugen på?","What do you feel like doing?"],
  all:["Alla","All"], today:["I dag","Today"], upcoming:["Kommande","Upcoming"],
  tonight:["Ikväll","Tonight"], anyArea:["Alla områden","All areas"], category:["Kategori","Category"], mood:["Så vill vi umgås","How we want to spend time"],
  area:["Område","Area"], other:["Övrigt","Other"], customArea:["Skriv ditt område","Enter your area"], none:["Inga träffar hittades.","No events found."],
  noPlans:["Du har inga sparade träffar eller anmälningar än.","You have no saved events or RSVPs yet."],
  own:["Mina egna träffar","My meetups"], saved:["Sparade och anmälda","Saved and joined"], savePlan:["Spara","Save"],
  removePlan:["Ta bort sparad","Unsave"], join:["Jag kommer","I’m in"], leave:["Avanmäl","Leave"],
  attendees:["Deltagare","Attendees"], waiting:["Ingen har anmält sig ännu.","Nobody has joined yet."],
  edit:["Redigera","Edit"], delete:["Ta bort","Delete"], confirmDelete:["Vill du ta bort detta permanent?","Permanently delete this?"],
  hide:["Dölj","Hide"], show:["Visa","Show"], hidden:["Dold","Hidden"], block:["Blockera","Block"], unblock:["Avblockera","Unblock"],
  map:["Öppna karta","Open map"], source:["Källa / bokning","Source / booking"], organizer:["Arrangör","Organizer"],
  title:["Titel","Title"], description:["Beskrivning","Description"], place:["Mötesplats eller adress","Meeting place or address"],
  date:["Datum och tid (Göteborg)","Date and time (Gothenburg)"], price:["Pris (kr)","Price (SEK)"], capacity:["Max antal deltagare","Maximum attendees"],
  free:["Gratis","Free"], publish:["Publicera träff","Publish meetup"], save:["Spara ändringar","Save changes"],
  name:["Visningsnamn","Display name"], email:["E-post","Email"], passwordLabel:["Lösenord","Password"],
  newPassword:["Nytt lösenord","New password"], current:["Nuvarande lösenord","Current password"],
  bio:["Om mig","About me"], interests:["Intressen","Interests"], languages:["Språk","Languages"],
  adultLabel:["Jag är minst 18 år","I am at least 18"], deleteAccount:["Ta bort mitt konto","Delete my account"],
  send:["Skicka","Send"], message:["Meddelande","Message"], reply:["Svara","Reply"], noMessages:["Inga meddelanden ännu.","No messages yet."],
  noNotices:["Inga aviseringar ännu.","No notifications yet."],
  registration:["Tillåt registrering","Allow registration"], accounts:["Användare","Users"], events:["Träffar","Events"],
  demo:["Prova demo","Try demo"], details:["Visa detaljer","View details"], connect:["Anslut backend","Connect backend"],
  demoBanner:["Demoläge · Exempelträffar sparas på den här enheten.","Demo mode · Sample events are stored on this device."],
  connectionHelp:["Ange API-adressen och Firebase-projektets webbnyckel.","Enter the API URL and Firebase project’s web API key."],
  url:["Serveradress","Server URL"], refresh:["Uppdatera","Refresh"], done:["Klart","Done"], loading:["Laddar …","Loading …"],
  joined:["har anmält sig","joined your meetup"], messageNotice:["skickade ett meddelande","sent a message"],
  invalid:["Kontrollera uppgifterna.","Check your entries."], network:["Servern kan inte nås.","The server is unreachable."],
  past:["Välj en tid i framtiden.","Choose a future date and time."], full:["Det finns inte tillräckligt med platser.","There aren’t enough spaces."],
  password:["Minst 8 tecken. Inga specialtecken krävs.","At least 8 characters. No special characters required."],
  adult:["Bekräfta att du är minst 18 år.","Confirm that you are at least 18."], closed:["Registreringen är stängd.","Registration is closed."],
  emailUsed:["E-postadressen används redan.","That email address is already in use."],
  forbidden:["Du saknar behörighet.","You don’t have permission."], loginRequired:["Logga in för att fortsätta.","Sign in to continue."],
  badLogin:["Inloggningen misslyckades.","Sign-in failed."], missing:["Detta är inte längre tillgängligt.","This is no longer available."],
  server:["Serverfel. Försök igen.","Server error. Try again."],
  configured:["Firebase är anslutet.","Firebase is connected."],
  key:["Firebase Web API key","Firebase Web API key"],
  setup:["Anslut ditt Firebase-projekt för att använda appen.","Connect your Firebase project to use the app."],
  invalidConnection:["Kontrollera API-adressen och Firebase-nyckeln.","Check the API URL and Firebase key."],
  schemaMissing:["Kontrollera Firebase- och API-konfigurationen.","Check the Firebase and API configuration."],
  confirmEmail:["Öppna verifieringslänken i din e-post och logga sedan in igen.","Open the verification link in your email, then sign in again."],
  code:["Kod från din e-post","Code from your email"], verify:["Bekräfta konto","Verify account"],
  forgotPassword:["Glömt lösenord?","Forgot password?"],
  resetPassword:["Återställ lösenord","Reset password"],
  resetHelp:["Ange e-postadressen som du använder för Hänga Gbg.","Enter the email address you use for Hänga Gbg."],
  resetSend:["Skicka återställningslänk","Send reset link"],
  resetSent:["Om det finns ett konto för adressen får du en återställningslänk. Kontrollera även skräpposten. Logga in här när du har valt ett nytt lösenord.","If an account exists for that address, you’ll receive a reset link. Check your spam folder too. Sign in here after choosing a new password."],
  resend:["Skicka ny länk","Resend link"], codeSent:["Kontrollera din e-post.","Check your email."],
  badCode:["Koden är ogiltig eller har löpt ut.","The code is invalid or expired."],
  blocked:["Kontot är blockerat.","This account is blocked."],
  mailRate:["För många försök. Vänta en stund och försök igen.","Too many attempts. Wait a moment and try again."],
  smtpRequired:["Serverns e-posttjänst är inte konfigurerad för din adress.","The server email service is not configured for your address."],
  samePassword:["Välj ett annat lösenord.","Choose a different password."],
  reauth:["Bekräfta ditt lösenord igen.","Confirm your password again."],
  emailPending:["Bekräfta ändringen via e-post.","Confirm the change by email."],
  messageDemo:["Demomeddelanden stannar på den här enheten.","Demo messages stay on this device."],
  fika:["Fika","Coffee"], food:["Mat & dryck","Food & drink"], music:["Musik","Music"], games:["Spel","Games"],
  sport:["Sport","Sports"], nature:["Natur","Outdoors"], culture:["Kultur","Culture"], nightlife:["Nattliv","Nightlife"],
  chill:["Lugnt och kravlöst","Quiet and relaxed"], social:["Prata och lära känna","Talk and get to know people"], active:["Göra något tillsammans","Do something together"]
};
const areas = [
  "Centrum","Lorensberg","Vasastaden","Johanneberg","Haga","Linné","Järntorget","Masthugget","Majorna","Kungsladugård",
  "Sandarna","Högsbo","Frölunda","Tynnered","Askim","Hovås","Billdal","Näset","Fiskebäck","Älvsborg","Saltholmen",
  "Guldheden","Krokslätt","Örgryte","Bö","Lunden","Olskroken","Redbergsplatsen","Gårda","Stampen","Bagaregården",
  "Kålltorp","Härlanda","Björkekärr","Torpa","Gamlestaden","Kviberg","Utby","Kortedala","Bergsjön","Angered",
  "Hammarkullen","Hjällbo","Gårdsten","Lövgärdet","Rannebergen","Agnesberg","Gunnilse","Olofstorp",
  "Hisingen","Brunnsbo","Backa","Hisings Backa","Bäckebol","Skälltorp","Kvillebäcken","Kvilledalen","Lundby",
  "Ramberget","Brämaregården","Ringön","Frihamnen","Lindholmen","Eriksberg","Sannegården","Färjenäs","Kyrkbyn",
  "Biskopsgården","Länsmansgården","Svartedalen","Jättesten","Tuve","Säve","Kärra","Torslanda","Amhult",
  "Arendal","Björlanda","Hjuvik","Öckerö","Styrsö","Donsö","Vrångö","Brännö",
  "Mölndal","Kållered","Lindome","Partille","Sävedalen","Jonsered","Landvetter","Mölnlycke","Härryda",
  "Lerum","Floda","Kungälv","Ytterby","Surte","Bohus","Nödinge","Kungsbacka","Särö","Alingsås"
];
const cats = ["fika","food","music","games","sport","walk","nature","culture","nightlife","other"];
const starterMeetups = [
  {title:["Fika vid Vågmästareplatsen","Coffee at Vågmästareplatsen"],area:"Kvillebäcken",place:"Vågmästareplatsen",category:"fika",capacity:5},
  {title:["Promenad på Ramberget","Walk on Ramberget"],area:"Ramberget",place:"Keillers park",category:"walk",capacity:8},
  {title:["Brädspel i centrum","Board games in the centre"],area:"Centrum",place:"",category:"games",capacity:6}
];
const moods = ["","chill","social","active"];
const zone = "Europe/Stockholm";
let lang = localStorage.lang === "en" ? "en" : "sv";
const demo = window.HANGA_DEMO === true;
const downloadUrl = "https://github.com/tdavor/HangaGBG/releases/latest/download/HangaGBG.apk";
const supportUrl = "https://buymeacoffee.com/wjkrddbhyx";
let base = demo ? "" : (hangaCloud.configuration.url && hangaCloud.configuration.key ? hangaCloud.configuration.url : "");
let token = demo ? localStorage.hangaDemoToken || "" : hangaCloud.signedIn ? "firebase" : "";
let pendingEmail = "";
let blockedPeople=[];
let memberProfile = null;
let companyPhotoCache=new Map(),companyPhotoLoads=new Map();
let companyOrder=[],companyOffset=0,companyDay="",companyOwner=0;
let availabilityRevision=0,availabilityRequest,availabilityTimer;
let availability=[],followingPeople=[],groupRows=[],groupEventId=0,feedbackData={},againRows=[],againEventId=0;
let friends=[],friendContext=null,chatPeer=null;
let friendSearch="",friendTab="friends";
let user = null, events = [], messageList = [], noticeList = [], admin = null;
let cityItems = [], cityRequest, cityLoadedAt = 0, cityUnavailable = false, cityExpiryTimer;
const cityId = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const cityPortal = "https://goteborg.se/wps/portal/kalendarium/kalendarium-start?activityId=";
function validCityEvent(item) {
  return item && cityId.test(item.id) && item.source===cityPortal+item.id
    && [item.title,item.place,item.organizer].every(value=>typeof value==="string")
    && Number.isFinite(Date.parse(item.start)) && Date.parse(item.end)>=Date.parse(item.start) && Date.parse(item.end)>Date.now();
}

function pruneCityEvents() {
  cityItems=cityItems.filter(validCityEvent);
}
function scheduleCityExpiry() {
  clearTimeout(cityExpiryTimer);
  const next=Math.min(...cityItems.map(item=>Date.parse(item.end)));
  if(!Number.isFinite(next)) return;
  cityExpiryTimer=setTimeout(()=>{
    pruneCityEvents();
    if(route()[0]==="discover" && $("results")) refreshResults();
    else if(route()[0]==="city") render();
    scheduleCityExpiry();
  },Math.max(1,Math.min(2147483647,next-Date.now()+20)));
}
function loadCityCalendar(force=false) {
  pruneCityEvents();
  scheduleCityExpiry();
  if (demo || !base || (!force && Date.now()-cityLoadedAt<(cityUnavailable?60000:300000))) return;
  if (cityRequest) return cityRequest;
  const origin=base;
  cityRequest=(async()=>{
    try {
      const response=await fetch(origin+"/city-events",{cache:"no-store",redirect:"error",credentials:"omit",signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error("cityCalendarUnavailable");
      const items=await response.json();
      if (!Array.isArray(items)) throw new Error("cityCalendarUnavailable");
      if (origin===base) {
        cityItems=items.filter(validCityEvent).map(item=>({...item,city:true,area:"Göteborg",category:"other"}));
        cityLoadedAt=Date.now();
        cityUnavailable=false;
        scheduleCityExpiry();
      }
    } catch {
      if (origin===base) {
        cityUnavailable=true;
        cityLoadedAt=Date.now();
      }
    }
  })().finally(()=>{cityRequest=undefined;});
  return cityRequest;
}
const findCity = id => cityItems.find(event=>event.id===id && !isPast(event));

const defaultFilters = { query:"", area:"", category:"", period:"upcoming", eventSource:"", mood:"" };
let filters = {...defaultFilters};
let renderedResults;
const PAGE_SIZE = 5;
const browseOrder = new Map();
let eventPageIndex = 0;
let refreshId = 0, statusTimeout;
const t = key => copy[key]?.[lang === "en" ? 1 : 0] || key;
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const $ = id => document.getElementById(id);
const action = (text, extra="", klass="") => `<button type="button" class="${klass}" ${extra}>${esc(text)}</button>`;
const link = (key, url, klass="") => `<a class="action ${klass}" href="${esc(url)}">${esc(t(key))}</a>`;
const field = (key, name, value="", type="text", attrs="") => `<label>${t(key)}<input name="${name}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
function passwordField(label,name,{policy=false,hint=policy,required=false,autocomplete="current-password"}={}) {
  const help=hint?`<small class="muted">${t("password")}</small>`:"";
  return `<label>${t(label)}${help}<span class="password-field">
    <input name="${name}" type="password" autocomplete="${autocomplete}" ${required?"required":""} ${policy?'minlength="8"':""}>
    <button type="button" data-password-toggle aria-pressed="false" aria-label="${t("passwordShow")}">👁</button>
  </span></label>`;
}
const passwordValid = value => value.length>=8;
const textArea = (key,name,value,attrs="") => `<label>${t(key)}<textarea name="${name}" ${attrs}>${esc(value)}</textarea></label>`;
const option = (value,label,current) => `<option value="${esc(value)}" ${value===current?"selected":""}>${esc(label)}</option>`;
const select = (label,name,choices,current) => `<label>${t(label)}<select name="${name}">${choices.map(([v,l])=>option(v,l,current)).join("")}</select></label>`;
const route = () => (location.hash.slice(1) || "discover").split("/");
const calendar = new Intl.DateTimeFormat("sv-SE",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
const localDate = date => calendar.format(date).replace(" ","T");
function stockholmDate(value) {
  const wanted = Date.parse(value+"Z");
  let epoch = wanted;
  for (let i=0; i<3; i++) epoch += wanted - Date.parse(localDate(new Date(epoch))+"Z");
  const result = new Date(epoch);
  if (localDate(result)!==value) throw new Error("invalid");
  return result.toISOString();
}
function dateLabel(value) {
  return new Date(value).toLocaleString(lang==="en" ? "en-GB" : "sv-SE",{timeZone:zone,dateStyle:"medium",timeStyle:"short"});
}
function status(key) {
  const el = $("status");
  clearTimeout(statusTimeout);
  el.textContent = t(copy[key] ? key : "invalid");
  el.hidden = false;
  statusTimeout = setTimeout(()=>{el.hidden=true},3800);
}
async function api(path, body) {
  if (demo) return demoApi(path,body);
  if (!base) throw new Error("setup");
  return hangaCloud.request(path,body);
}
const DEFAULT_REMINDER_MINUTES = 120;
function reminderScope() { return user ? (demo?"demo":base)+":"+user.id : ""; }
function reminderKey(id) { return "hangaReminder:"+reminderScope()+":"+id; }
function reminderMinutes(id) {
  const saved=localStorage.getItem(reminderKey(id));
  return saved===null?DEFAULT_REMINDER_MINUTES:Number(saved);
}
function eligibleReminder(event) {
  return user && event.joined && (!event.minPeople||event.proposalPhase==="active") && !event.hidden && !event.cancelled && Date.parse(event.start)>Date.now();
}
function syncReminders(items=events) {
  if (!window.HangaAndroid) return;
  const scope=reminderScope();
  const entries=scope?items.filter(eligibleReminder).flatMap(event=>{
    const minutes=reminderMinutes(event.id);
    const start=Date.parse(event.start);
    return minutes>0?[{id:Number(event.id),title:eventTitle(event),start,at:start-minutes*60000}]:[];
  }):[];
  window.HangaAndroid.syncReminders(JSON.stringify(entries),scope,lang);
}
window.hangaRefreshReminders=async ()=>{
  const scope=reminderScope();
  const version=refreshId;
  if (!scope) return;
  try {
    const current=await api("/events");
    if (scope===reminderScope() && version===refreshId) syncReminders(current);
  } catch(error) {
    if (scope===reminderScope() && ["loginRequired","blocked"].includes(error.message)) session();
  }
};
let alertSetup;
let pushRegistration, registeredPush;
function syncFirebasePush() {
  const android=window.HangaAndroid;
  const scope=reminderScope();
  const deviceToken=localStorage.hangaAlertToken;
  const fcmToken=android?.firebasePushToken?.();
  if (demo || !base || !scope || !deviceToken || !fcmToken || !android.notificationsEnabled()
      || !android.alertsScheduled(deviceToken) || pushRegistration) return;
  const key=`${scope}:${deviceToken}:${fcmToken}`;
  if (key===registeredPush) return;
  pushRegistration=api("/push/register",{deviceToken,fcmToken}).then(()=>{
    if (scope===reminderScope()) registeredPush=key;
  }).catch(()=>{}).finally(()=>{pushRegistration=undefined;});
}
window.hangaSyncPush=syncFirebasePush;
function syncAlertProfile() {
  const android=window.HangaAndroid;
  const scope=reminderScope();
  if (demo || !scope || !base || !android?.notificationsEnabled?.()) return;
  const existing=localStorage.hangaAlertToken||"";
  if (android.alertsScheduled(existing)) {
    android.syncAlertProfile(existing,String(user.id),user.area||"",lang);
    syncFirebasePush();
    return;
  }
  if (alertSetup) return;
  alertSetup=(async()=>{
    const currentEvents=await api("/events");
    if (scope!==reminderScope() || !android.notificationsEnabled()) return;
    const latest=currentEvents.reduce((max,event)=>Math.max(max,Number(event.id)),0);
    const registration=await api("/alerts/on",{});
    if (scope!==reminderScope()) return;
    localStorage.hangaAlertToken=registration.token;
    android.startAlerts(base,registration.token,String(registration.cursor),lang,String(user.id),user.area||"",String(latest));
  })().catch(error=>{
    if (scope===reminderScope()) status(error.message);
  }).finally(()=>{
    alertSetup=undefined;
    if (scope!==reminderScope()) syncAlertProfile();
  });
}
window.hangaSyncAlerts=syncAlertProfile;
function session(result) {
  companyPhotoCache.clear();companyPhotoLoads.clear();
  availabilityRevision++;clearTimeout(availabilityTimer);companyOrder=[];companyOffset=0;companyDay="";companyOwner=0;
  messageList=[];
  availability=[];followingPeople=[];groupRows=[];groupEventId=0;feedbackData={};againRows=[];againEventId=0;friends=[];friendContext=null;chatPeer=null;friendSearch="";friendTab="friends";
  token=result?.token || "";
  user=result?.user || null;
  if (demo) {
    if (token) localStorage.hangaDemoToken=token;
    else localStorage.removeItem("hangaDemoToken");
  } else if (!token) hangaCloud.forget();
  if (!user) { syncReminders([]); void disableAlerts(); }
  else syncAlertProfile();
}
async function disableAlerts() {
  if (demo || !window.HangaAndroid) return;
  window.HangaAndroid.stopAlerts();
  const pushToken=localStorage.hangaAlertToken;
  localStorage.removeItem("hangaAlertToken");
  registeredPush=undefined;
  if (pushToken && base && user) {
    try { await api("/alerts/off",{token:pushToken}); } catch {}
  }
}
window.hangaAlertFailed=()=>{ disableAlerts(); status("alertsFailed"); };
function seed() {
  const data = JSON.parse(localStorage.demoData || "null");
  const extra = [
    ["Kvällspromenad i Slottsskogen","Evening walk in Slottsskogen","Linné","Slottsskogen","nature"],
    ["Fika vid Vågmästareplatsen","Coffee at Vågmästareplatsen","Kvillebäcken","Vågmästareplatsen","fika"],
    ["Fotopromenad i Eriksberg","Photo walk in Eriksberg","Eriksberg","Eriksbergstorget","culture"],
    ["Söndagspromenad vid Delsjön","Sunday walk by Delsjön","Kålltorp","Delsjöbadet","nature"],
    ["Brädspel i centrum","Board games in the centre","Centrum","Götaplatsen","games"]
  ];
  if (data && data.sampleEdition===2) return data;
  const samples = [
    ["Fika i Haga","Coffee in Haga","Haga","Haga Nygata","fika",0],["Promenad på Ramberget","Walk on Ramberget","Hisingen","Keillers park","nature",0],
    ["Brädspel vid Järntorget","Board games by Järntorget","Järntorget","Järntorget 4","games",60]
  ];
  const seeded = data || { next:4, events:samples.map(([sv,en,area,place,category,price],i)=>({
    id:i+1,owner:2,title:sv,titleEn:en,description:"",area,place,category,price,start:new Date(Date.now()+(i+1)*86400000).toISOString(),
    capacity:i===2?2:8,count:i,newcomers:i!==2,quick:i===1,joined:0,saved:0,hidden:0,mood:"social",source:"",organizer:"Hänga Gbg"
  })), user:{id:1,name:"Demo",email:"demo@example.invalid",admin:1} };
  for (const [i,[title,titleEn,area,place,category]] of extra.entries()) {
    seeded.events.push({id:seeded.next++,owner:2,title,titleEn,area,place,category,price:0,
      start:new Date(Date.now()+(4+i)*86400000).toISOString(),capacity:6,count:0,
      organizer:"Hänga Gbg",newcomers:true});
  }
  seeded.sampleEdition=2;
  return seeded;
}
function demoApi(path, body) {
  const data=seed();
  let result={};
  const match=path.match(/^\/events\/(\d+)\/(\w+)$/);
  const event=match&&data.events.find(row=>row.id===Number(match[1]));
  if (path==="/events" && !body) result=data.events;
  else if (path==="/demo") result={token:"demo", user:data.user};
  else if (!token) throw new Error("loginRequired");
  else if (path==="/me") {
    if (body) {
      const {name,email,area,bio,interests,languages}=body;
      Object.assign(data.user,{name,email,area,bio,interests,languages});
    }
    result=data.user;
  } else if(path==="/me/photo") {data.user.photo=body.photo;result={photo:body.photo};
  } else if (path==="/account/delete") {
    localStorage.removeItem("demoData");
    return {};
  } else if (path==="/events") {
    data.events.push({...body,id:data.next++,owner:1,organizer:data.user.name,count:0,joined:0,saved:0});
  } else if (path==="/messages") result=(data.messages||[]).filter(m=>!(data.blocks||[]).includes(m.recipient)).slice().reverse();
  else if (path==="/chats/delete") {
    const selected=(data.messages||[]).find(m=>m.id===(body.message||body.through));
    if(!selected || ![selected.sender,selected.recipient].includes(body.peer)) throw new Error("missing");
    data.messages=(data.messages||[]).filter(m=>body.message?m.id!==body.message:
      !((m.sender===body.peer||m.recipient===body.peer)&&m.id<=body.through));
  }
  else if (path==="/notices") result=(data.notices||[]).slice().reverse();
  else if (path==="/blocks") result=(data.blocks||[]).map(id=>({id,name:"Hänga Gbg"}));
  else if (path==="/blocks/change") {
    data.blocks=(data.blocks||[]).filter(id=>id!==body.id);
    if (body.enabled) data.blocks.push(body.id);
  } else if (path==="/report") {
    const event=data.events.find(e=>e.id===body.id);
    const message=(data.messages||[]).find(m=>m.id===body.message);
    (data.reports ||= []).push({id:data.next++,context:event?.title||message?.body||"Hänga Gbg",reason:body.reason,event_id:body.id});
  } else if (path==="/reports/resolve") {
    const report=(data.reports||[]).find(r=>r.id===body.id);
    if (report) report.resolved=true;
  }
  else if (path==="/admin") result={users:[data.user],registration:data.registration??1,reports:data.reports||[]};
  else if (path==="/admin/settings") data.registration=Number(body.registration);
  else if (event) {
    const operation=match[2];
    const notice=kind=>(data.notices ||= []).push({title:event.title,event_id:event.id,kind,name:"",created:new Date().toISOString()});
    if (operation==="edit") {
      if (event.joined && (event.start!==body.start || event.place!==body.place || event.area!==body.area)) notice("changed");
      Object.assign(event,body);
      delete event.titleEn;
    }
    if (operation==="cancel") { event.cancelled=true; notice("cancelled"); }
    if (operation==="waitlist") event.waitlisted=body.enabled;
    if (operation==="simulate") {
      if (event.waitlisted && event.count>=event.capacity && event.capacity>0) {
        event.count--;
        notice("vacancy");
      }
    }
    if (operation==="delete") data.events=data.events.filter(row=>row.id!==event.id);
    if (operation==="moderate") event.hidden=Number(body.hidden);
    if (operation==="join") {
      if (body.enabled&&event.cancelled) throw new Error("cancelled");
      if (body.enabled&&!event.joined&&event.count>=event.capacity) throw new Error("full");
      event.count+=Number(body.enabled)-Number(Boolean(event.joined));
      event.joined=Number(body.enabled);
      if (body.enabled) event.waitlisted=false;
    }
    if (operation==="save") event.saved=Number(body.enabled);
    if (operation==="participants") result=event.owner===1?[]:[{id:event.owner,name:event.organizer}];
    if (operation==="message") {
      if (!body.body?.trim()) throw new Error("invalid");
      if ((data.blocks||[]).includes(body.recipient)) throw new Error("messageBlocked");
      (data.messages ||= []).push({id:data.next++,event_id:event.id,title:event.title,sender:1,recipient:body.recipient,
        sender_name:data.user.name,recipient_name:event.organizer,body:body.body.trim(),created:new Date().toISOString()});
    }
  } else if (path!=="/logout") throw new Error("missing");
  localStorage.demoData=JSON.stringify(data);
  return result;
}
async function load() {
  const version=++refreshId;
  const [page,detail]=route();
  const cityLoad=page==="discover"||page==="city"||(page==="create"&&detail==="city")?loadCityCalendar():undefined;
  try {
    if (token && !user) {
      try {
        user=await api("/me");
        syncAlertProfile();
        if (version===refreshId && page==="discover") render();
      }
      catch(error) { if (["loginRequired","blocked"].includes(error.message)) {
        session();
        if (error.message==="blocked") status("blocked");
      } else throw error; }
    }
    if (!demo && user) {
      const owner=user.id;
      await refreshAvailability();
      if(version!==refreshId||user?.id!==owner)return;
    }
    if (!demo && user && page==="profile") followingPeople=await api("/follows");
    if(!demo&&user&&page==="friends") {
      const owner=user.id,entries=await api("/friends");
      if(version!==refreshId||user?.id!==owner)return;
      friends=entries;
    }
    if (!demo && user && page==="group") {
      const rows=await api("/groups",{id:Number(detail)});
      if(version!==refreshId) return;
      groupRows=rows;groupEventId=Number(detail);
    }
    if (!demo && user && page==="again") {
      const rows=await api("/again",{id:Number(detail)});
      if(version!==refreshId) return;
      againRows=rows;againEventId=Number(detail);
    }
    if (!demo && user && page==="feedback") {
      const value=await api("/feedback",{id:Number(detail)});
      if(version!==refreshId) return;
      feedbackData={...value,event_id:Number(detail)};
    }
    if ((demo || base) && ["discover","plans","event","create","admin","city","group","feedback","again","friends"].includes(page)) {
      const current=await api("/events");
      if (version!==refreshId) return;
      events=current;
      syncReminders();
      if (page==="discover" && $("results")) {
        refreshResults();
        await cityLoad;
        if (version===refreshId && $("results")) refreshResults();
        return;
      }
    }
    await cityLoad;
    if (version!==refreshId) return;
    if (page==="messages" && user) {
      await refreshChats();
      if (version===refreshId && $("chat-content")) return;
    }
    if (page==="member" && user) {
      memberProfile=null;
      const owner=user.id,member=await api("/members/"+Number(detail));
      if (version!==refreshId||user?.id!==owner) return;
      const context=demo||Number(detail)===owner?null:await api("/friends/status",{peer:Number(detail)});
      if(version!==refreshId||user?.id!==owner)return;
      memberProfile=member;friendContext=context;
    }
    if (page!=="messages" && user) window.hangaRefreshChats();
    if (page==="profile" && user) blockedPeople=await api("/blocks");
    if (page==="notices" && user) noticeList=(await api("/notices")).filter(notice=>notice.kind!=="reminder");
    if (page==="admin" && user?.admin) admin=await api("/admin");
  } catch(error) {
    if (["loginRequired","blocked"].includes(error.message)) session();
    status(error.message);
  }
  if (version===refreshId) render();
}
function areaSelect(value="") {
  const custom=Boolean(value && !areas.includes(value));
  return select("area","area",[["",t("anyArea")],...areas.map(area=>[area,area]),["other",t("other")]],custom?"other":value)+
    `<div id="customArea" ${custom?"":"hidden"}>${field("customArea","customArea",custom?value:"","text",'maxlength="100"')}</div>`;
}
function hasArea(event,area) {
  if (!area) return true;
  if (area==="other") return !areas.includes(event.area);
  return event.area===area;
}
function icon(name) {
  const paths={camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3z"/><circle cx="12" cy="13" r="4"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>',plus:'<path d="M12 4v16M4 12h16"/>',person:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',friends:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v2"/>',message:'<path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/>',gear:'<path d="m9 3 1-2h4l1 2 3 2 2 .5 2 3-1 2v3l1 2-2 3-2 .5-3 2-1 2h-4l-1-2-3-2-2-.5-2-3 1-2v-3l-1-2 2-3L6 5z"/><circle cx="12" cy="12" r="3"/>',walk:'<circle cx="14" cy="4" r="2"/><path d="m7 21 4-8 4 3 1 5M4 11l5-3 4 1 3 4h4M11 8l-1 6"/>',fika:'<path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 9h2a3 3 0 0 1 0 6h-2M7 2v3m5-3v3M2 23h17"/>',culture:'<path d="m2 8 10-6 10 6zM5 10v9m7-9v9m7-9v9M2 22h20"/>',other:'<path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z"/>'};
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.other}</svg>`;
}
function avatar(name,photo="") {
  if(typeof photo==="string"&&photo.length<=65536&&/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(photo))return `<img class="avatar avatar-photo" src="${esc(photo)}" alt="">`;
  return `<span class="avatar" aria-hidden="true">${esc(String(name||"?").trim().split(/\s+/).slice(0,2).map(x=>[...x][0]||"").join("").toUpperCase())}</span>`;}
function bottomNavigation(page) {
  return `<nav class="bottom-nav" aria-label="${t("mainNavigation")}">${[["discover","search","explore"],["plans","calendar","plans"],["create","plus","createShort"],["profile","person","profileShort"]].map(([key,symbol,label])=>`<a href="#${key}" ${page===key?'aria-current="page"':""}>${icon(symbol)}<span>${t(label)}</span></a>`).join("")}</nav>`;
}
function headerNavigation(page) {
  const pages=["notices","about"];
  if(user?.admin) pages.push("admin");
  return `<a class="messages-shortcut action" href="#messages" aria-label="${t("messages")}" title="${t("messages")}" ${page==="messages"?'aria-current="page"':""}>${icon("message")}<span id="unread-messages" class="message-count" hidden></span></a><a class="friends-shortcut action" href="#friends" aria-label="${t("friends")}" title="${t("friends")}" ${page==="friends"?'aria-current="page"':""}>${icon("friends")}</a><details class="account-menu settings-menu"><summary aria-label="${t("appMenu")}" title="${t("appMenu")}">${icon("gear")}</summary><nav class="account-menu-panel" aria-label="${t("appMenu")}">${pages.map(key=>`<a class="action" href="#${key}" ${page===key?'aria-current="page"':""}>${t(key)}</a>`).join("")}<a class="action" href="${supportUrl}">${icon("fika")}${t("supportCoffee")}</a></nav></details>`;
}
function render() {
  const [page,id,recipient]=route();
  document.documentElement.lang=lang;
  $("header-actions").innerHTML=headerNavigation(page);
  if($("bottom-navigation")) $("bottom-navigation").innerHTML=bottomNavigation(page);
  $("main").className=page==="messages"&&Number(id)>0?"conversation-page":"";
  updateChatBadge();
  let html;
  if (page==="about") html=aboutPage();
  else if (page==="connect" && !demo && !base) html=connectionPage();
  else if (page==="discover") html=discoverPage();
  else if (page==="auth") html=authPage(id);
  else if (page==="city") html=cityPage(findCity(id));
  else if (page==="profile") html=profilePage();
  else if (page==="member") html=user?memberPage(Number(id)):`<h1>${t("memberProfile")}</h1><p>${t("loginRequired")}</p>${link("login","#auth","primary")}`;
  else if (page==="event") html=eventPage(events.find(item=>item.id===Number(id)),recipient);
  else if (page==="messages" && !user) html=`<h1>${t("messages")}</h1><p>${t("loginRequired")}</p>
    ${link("login",Number(id)>0?`#auth/login/chat/${Number(id)}`:"#auth","primary")}`;
  else if (!user) html=`<h1>${t(page)}</h1><p>${t("loginRequired")}</p>${link("login","#auth","primary")}`;
  else if (page==="availability") html=availabilityPage();
  else if(page==="company")html=companyPage();
  else if(page==="offer")html=offerPage(Number(id));
  else if (page==="group") html=groupPage(Number(id));
  else if (page==="feedback") html=feedbackPage(Number(id));
  else if (page==="again") html=againPage(Number(id));
  else if(page==="friends") html=id==="invite"?friendInvitePage(Number(recipient)):friendsPage();
  else if (page==="create") {
    const draft=user.admin&&id==="draft"?starterMeetups[Number(recipient)]:null;
    const repeat=id==="repeat"?events.find(item=>item.id===Number(recipient)&&item.owner===user.id&&isPast(item)):null;
    const walkDraft=id==="walk"?walkTemplates()[recipient]:null;
    html=id==="walk"?(walkDraft?eventForm(null,walkDraft):`<p>${t("missing")}</p>`):id==="repeat"&&!repeat?`<h1>${t("missing")}</h1>`:
      id==="city"?(findCity(recipient)?eventForm(null,null,null,findCity(recipient)):`<h1>${t("missing")}</h1>`):
      id==="quick"?quickForm():eventForm(events.find(item=>item.id===Number(id)),draft,repeat);
  }
  else if (page==="report") html=reportPage(id,recipient);
  else if (page==="plans") html=plansPage();
  else if (page==="admin") html=user.admin && admin ? adminPage() : `<h1>${t("admin")}</h1><p>${t("forbidden")}</p>`;
  else if (page==="messages") html=messagesPage(Number(id));
  else if (page==="notices") html=noticesPage();
  else html=discoverPage();
  $("main").innerHTML=html;
  if(["discover","company","availability"].includes(page))void refreshCompanyPhotos();
  if (page==="messages") scrollChatToLatest();
  if (page==="group" && $("group-content")) $("group-content").scrollTop=$("group-content").scrollHeight;
}
function aboutPage() {
  const version=window.HangaAndroid?.appVersion?.()||"";
  return `<h1>${t("about")}</h1><section class="card">
    <h2>Hänga Gbg</h2>
    ${version?`<p>${t("appVersion")} ${esc(version)}</p>`:""}
    <p>${t("author")} · T.Davor</p>
    <div class="actions">
      ${!demo&&window.HangaAndroid?.checkForUpdate?action(t("checkUpdates"),"data-check-updates"):""}
      ${link("contact","mailto:t.davor@gmail.com")}
      <a class="action" href="${supportUrl}">☕ Buy me a coffee</a>
    </div></section>`;
}
function connectionPage() {
  return `<h1>${t("connect")}</h1><p>${t("connectionHelp")}</p><form data-form="connect">
    ${field("url","url",base,"url",'required placeholder="https://hanga-gbg.ditt-konto.workers.dev"')}
    ${field("key","key",hangaCloud.configuration.key,"text",'required autocomplete="off" spellcheck="false"')}
    <button class="primary" type="submit">${t("connect")}</button></form>`;
}
function authPage(mode) {
  const register=mode==="register";
  if (user) return `<h1>${t("profile")}</h1>${link("profile","#profile","primary")}`;
  if (demo) return `<h1>${t("login")}</h1><p>${t("demoBanner")}</p>${action(t("demo"),"data-demo","primary")}`;
  if (!base) return `<h1>${t("login")}</h1><p>${t("setup")}</p>${link("connect","#connect","primary")}`;
  if(mode==="google" && hangaCloud.needsGoogleProfile) return `<h1>${t("googleComplete")}</h1><p>${t("googleProfileHelp")}</p>
    <form data-form="googleProfile">
      ${field("name","name","","text",'required maxlength="80"')}${areaSelect()}
      ${field("spokenLanguages","languages","","text",'maxlength="150"')}
      <label class="check"><input name="adult" type="checkbox" required> ${t("adultLabel")}</label>
      <button class="primary">${t("save")}</button>
    </form>${action(t("logout"),"data-logout")}`;
  if (mode==="reset") return `<h1>${t("resetPassword")}</h1><p>${t("resetHelp")}</p>
    <form data-form="reset">
      ${field("email","email",pendingEmail,"email",'required autocomplete="email"')}
      <button class="primary" type="submit">${t("resetSend")}</button>
    </form><div class="actions">${link("login","#auth")}</div>`;
  if (mode==="reset-sent") return `<h1>${t("resetPassword")}</h1><p>${t("resetSent")}</p>
    <div class="actions">${link("login","#auth","primary")}</div>`;
  if (mode==="confirm") return `<h1>${t("verify")}</h1><p>${t("confirmEmail")}</p>
    <div class="actions">${action(t("resend"),"data-resend")} ${link("login","#auth","primary")}</div>`;
  return `<h1>${t(register?"register":"login")}</h1>
    ${!demo&&window.HangaAndroid?.googleSignInAvailable?.()?`<div class="actions">${action(t("googleLogin"),"data-google-login","google-login")}</div>`:""}
    ${hangaCloud.needsGoogleProfile?link("googleComplete","#auth/google"):""}
    <form data-form="${register?"register":"login"}">
    ${register?field("name","name","","text",'required maxlength="80"')+areaSelect()+field("spokenLanguages","languages","","text",'maxlength="150"'):""}
    ${field("email","email",pendingEmail,"email",'required autocomplete="email"')}
    ${passwordField("passwordLabel","password",{policy:register,hint:true,required:true,autocomplete:register?"new-password":"current-password"})}
    ${register?`<label class="check"><input name="adult" type="checkbox" required> ${t("adultLabel")}</label>`:""}
    <button class="primary">${t(register?"register":"login")}</button></form>
    <div class="actions">${register?"":action(t("forgotPassword"),"data-forgot-password")} ${link(register?"login":"register",register?"#auth":"#auth/register")}
    </div>`;
}
function availableToday(entry) {
  return Number.isFinite(Date.parse(entry.from))&&Date.parse(entry.until)>Date.now()&&
    localDate(new Date(entry.from)).slice(0,10)===localDate(new Date()).slice(0,10);
}
function ownAvailability() {
  return availability.find(entry=>Number(entry.user_id)===Number(user?.id)&&availableToday(entry));
}
function availabilityIndicator(id) {
  const active=availability.some(entry=>Number(entry.user_id)===Number(id)&&availableToday(entry));
  return `<span class="availability-dot" data-availability-id="${Number(id)}" role="img" aria-label="${t("availableTodayBadge")}" title="${t("availableTodayBadge")}" ${active?"":"hidden"}></span>`;
}
function updateAvailabilityViews() {
  if(route()[0]==="discover"&&$("today-company"))$("today-company").innerHTML=todayCompany();
  if(route()[0]==="availability"&&$("availability-people"))$("availability-people").innerHTML=todayCompany(true);
  if(route()[0]==="company"&&$("company-list"))$("company-list").innerHTML=todayCompany(true);
  if(["discover","company","availability"].includes(route()[0]))void refreshCompanyPhotos();
  document.querySelectorAll("[data-availability-id]").forEach(dot=>{
    dot.hidden=!availability.some(entry=>Number(entry.user_id)===Number(dot.dataset.availabilityId)&&availableToday(entry));
  });
}
function scheduleAvailabilityExpiry() {
  clearTimeout(availabilityTimer);
  const ends=availability.filter(availableToday).map(entry=>Date.parse(entry.until));
  if(ends.length)availabilityTimer=setTimeout(()=>{updateAvailabilityViews();scheduleAvailabilityExpiry();},Math.min(2147483647,Math.max(1,Math.min(...ends)-Date.now()+1)));
}
function refreshAvailability() {
  if(demo||!user)return Promise.resolve();
  const owner=user.id,revision=availabilityRevision;
  if(availabilityRequest?.owner===owner&&availabilityRequest.revision===revision)return availabilityRequest.promise;
  const request={owner,revision};
  request.promise=(async()=>{
    const entries=await api("/availability");
    if(user?.id!==owner||revision!==availabilityRevision)return;
    availability=entries;updateAvailabilityViews();scheduleAvailabilityExpiry();
  })().finally(()=>{if(availabilityRequest===request)availabilityRequest=undefined;});
  availabilityRequest=request;return request.promise;
}
function availabilitySummary(entry) {
  return `${esc(t(entry.activity))} · ${esc(entry.area)}<small>${esc(localDate(new Date(entry.from)).slice(11))}–${esc(localDate(new Date(entry.until)).slice(11))}</small>`;
}
function companyCandidates() {
  return [...new Map(availability.filter(entry=>Number(entry.user_id)!==Number(user?.id)&&availableToday(entry)).map(entry=>[Number(entry.user_id),entry])).values()];
}
function companySelection(current) {
  const day=localDate(new Date()).slice(0,10),owner=Number(user?.id)||0;
  if(day!==companyDay||owner!==companyOwner){companyOrder=[];companyOffset=0;companyDay=day;companyOwner=owner;}
  const ids=new Set(current.map(entry=>Number(entry.user_id)));
  companyOrder=companyOrder.filter(id=>ids.has(id));
  const added=[...ids].filter(id=>!companyOrder.includes(id));
  for(let i=added.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[added[i],added[j]]=[added[j],added[i]];}
  companyOrder.push(...added);
  companyOffset=Math.min(companyOffset,Math.max(0,(Math.ceil(companyOrder.length/3)-1)*3));
  const byId=new Map(current.map(entry=>[Number(entry.user_id),entry]));
  return companyOrder.slice(companyOffset,companyOffset+3).map(id=>byId.get(id));
}
function nextCompany() {
  const current=companyCandidates();companySelection(current);
  companyOffset=companyOffset+3>=companyOrder.length?0:companyOffset+3;
  updateAvailabilityViews();
  $("today-company")?.querySelector("[data-next-company]")?.focus();
}
function todayCompany(all=false) {
  const own=ownAvailability(),current=companyCandidates(),selected=all?current:companySelection(current);
  return `${all?"":`<div class="rows between"><h2>${t("todayCompany")}</h2>${!own?link("availableToday","#availability"):""}</div>`}
    ${own&&!all?`<section class="my-availability"><strong>${t("myAvailability")}</strong><p>${memberLink(user.id,user.name)}</p><p>${availabilitySummary(own)}</p>
      <div class="actions">${link("editAvailability","#availability")}${action(t("removeAvailability"),"data-remove-availability","danger")}</div></section>`:""}
    ${current.length?`<ul class="availability-list company-grid ${all?"company-all":""}" aria-live="polite">${selected.map(entry=>`<li>
      <a data-company-photo="${Number(entry.user_id)}" href="#member/${Number(entry.user_id)}" aria-label="${esc(entry.name)}">${avatar(entry.name,companyPhotoCache.get(Number(entry.user_id))?.photo)}</a><div>${memberLink(entry.user_id,entry.name)}<p>${availabilitySummary(entry)}</p><a class="action company-offer" href="#offer/${Number(entry.user_id)}">${t("suggestMeetup")}</a></div>
      </li>`).join("")}</ul>${!all&&current.length>3?`<div class="company-pagination"><small class="muted">${t("companyBatch")} ${companyOffset+1}–${companyOffset+selected.length} / ${current.length}</small>${action(t("nextCompany"),"data-next-company")}</div>`:""}${!all?link("allAvailable","#company"):""}`:!own?`<p class="muted">${t("todayEmpty")}</p>`:""}`;
}
async function refreshCompanyPhotos() {
  if(demo||!user)return;
  const owner=user.id,revision=availabilityRevision,tasks=[];
  const ids=[...new Set([...document.querySelectorAll("[data-company-photo]")].map(node=>Number(node.dataset.companyPhoto)))];
  for(const id of ids) {
    if(!availability.some(entry=>Number(entry.user_id)===id&&availableToday(entry))||companyPhotoLoads.has(id)||Date.now()-(companyPhotoCache.get(id)?.checked||0)<120000)continue;
    const task=api("/members/photo",{id}).then(result=>{
      if(user?.id===owner&&availabilityRevision===revision)companyPhotoCache.set(id,{photo:result.photo,checked:Date.now()});
    }).catch(()=>{
      if(user?.id===owner&&availabilityRevision===revision)companyPhotoCache.set(id,{photo:"",checked:Date.now()});
    }).finally(()=>{if(companyPhotoLoads.get(id)===task)companyPhotoLoads.delete(id);});
    companyPhotoLoads.set(id,task);tasks.push(task);
  }
  if(tasks.length){await Promise.allSettled(tasks);if(user?.id===owner&&availabilityRevision===revision)updateAvailabilityViews();}
}
function companyPage() {
  return `<h1>${t("allAvailable")}</h1><div class="actions">${link(ownAvailability()?"editAvailability":"availableToday","#availability")}</div><section id="company-list">${todayCompany(true)}</section>`;
}
function offerPage(peer) {
  const person=availability.find(entry=>Number(entry.user_id)===peer&&availableToday(entry));
  const start=person?Math.ceil(Math.max(Date.now()+60000,Date.parse(person.from))/60000)*60000:0;
  if(!person||peer===user.id||start>=Date.parse(person.until))return `<h1>${t("suggestMeetup")}</h1><p>${t("availabilityEnded")}</p>${link("allAvailable","#company")}`;
  return `<h1>${t("suggestMeetup")}</h1><p>${memberLink(peer,person.name)}</p><p>${availabilitySummary(person)}</p><p class="muted">${t("offerHelp")}</p>
    <form data-form="availability-offer" data-peer="${peer}">${select("activity","activity",["fika","walk","food","other"].map(key=>[key,t(key)]),person.activity)}
    ${field("start","start",localDate(new Date(start)),"datetime-local",`required min="${localDate(new Date(start))}" max="${localDate(new Date(Date.parse(person.until)-60000))}"`)}
    ${field("place","place","","text",'required maxlength="180"')}${textArea("message","note","",'maxlength="700"')}<button class="primary">${t("send")}</button></form>`;
}
function availabilityPage() {
  const own=ownAvailability();
  const date=localDate(new Date()).slice(0,10);
  const from=own?localDate(new Date(own.from)).slice(11):localDate(new Date()).slice(11);
  return `<h1>${t(own?"editAvailability":"availableToday")}</h1><p>${t("availabilityHelp")}</p><form data-form="availability">
    ${areaSelect(own?.area||user.area)}
    ${select("activity","activity",["fika","walk","other"].map(v=>[v,t(v)]),own?.activity||"fika")}
    <div class="grid">${field("availabilityTime","from",from,"time","required")}${field("availableUntil","until",own?localDate(new Date(own.until)).slice(11):"23:59","time","required")}</div>
    <input name="day" type="hidden" value="${date}">
    <div class="actions"><button class="primary">${t("save")}</button>
      ${own?action(t("removeAvailability"),"data-remove-availability","danger"):""}</div></form>
    <section class="card" id="availability-people">${todayCompany(true)}</section><div class="actions">${link("quick","#create/quick","primary")}</div>`;
}
async function saveAvailability(data) {
  const owner=user.id,revision=++availabilityRevision;
  const endDay=data.until==="00:00"&&data.from!=="00:00"?
    new Date(Date.parse(data.day+"T00:00:00Z")+86400000).toISOString().slice(0,10):data.day;
  await api("/availability",{area:data.area,activity:data.activity,from:stockholmDate(data.day+"T"+data.from),until:stockholmDate(endDay+"T"+data.until)});
  const entries=await api("/availability");
  if(user?.id!==owner||revision!==availabilityRevision)return;
  availability=entries;scheduleAvailabilityExpiry();
  location.hash="discover";
  render();
  status("availabilitySaved");
}
async function removeAvailability() {
  if(!confirm(t("removeAvailabilityConfirm"))) return;
  const owner=user.id,revision=++availabilityRevision;
  await api("/availability",{enabled:false});
  const entries=await api("/availability");
  if(user?.id!==owner||revision!==availabilityRevision)return;
  availability=entries;scheduleAvailabilityExpiry();
  if(ownAvailability()) throw new Error("server");
  location.hash="discover";
  render();
  status("availabilityRemoved");
}
function groupContent() {
  const rows=groupEventId===Number(route()[1])?groupRows:[];
  return rows.length?rows.map(row=>`<section class="group-entry">
    <strong>${memberLink(row.sender,row.name)}</strong><p>${esc(row.body)}</p><small class="muted">${esc(dateLabel(row.created))}</small>
    ${row.sender!==user.id?link("groupReport",`#report/group/${Number(row.id)}`):""}</section>`).join(""):`<p class="muted">${t("noMessages")}</p>`;
}
let groupRequest;
async function refreshGroup() {
  const [page,id]=route();
  if(page!=="group"||!user||demo||groupRequest) return;
  const owner=user.id;
  groupRequest=api("/groups",{id:Number(id)});
  try {
    const rows=await groupRequest;
    if(user?.id!==owner||route().join("/")!==page+"/"+id) return;
    groupRows=rows;groupEventId=Number(id);
    const panel=$("group-content");
    if(panel) {
      const html=groupContent();
      if(panel.dataset.last!==html) {
        const scroll=panel.scrollTop,atEnd=panel.scrollHeight-scroll-panel.clientHeight<48;
        panel.innerHTML=html;panel.dataset.last=html;
        panel.scrollTop=atEnd?panel.scrollHeight:scroll;
      }
    }
  } finally {groupRequest=undefined;}
}
setInterval(()=>{
  if(document.visibilityState!=="hidden") void refreshGroup().catch(()=>{});
},15000);
function groupPage(id) {
  const e=events.find(e=>e.id===id);
  if(!e||!(e.joined||e.owner===user.id)||e.hidden||e.cancelled) return `<p>${t("forbidden")}</p>`;
  return `<h1>${t("groupChat")}</h1><p>${link("details",`#event/${id}`)} · ${esc(e.title)}</p>
    <p class="muted">${t("groupHelp")}</p><div id="group-content" class="card chat-timeline">${groupContent()}</div>
    <form data-form="group" data-id="${id}">${textArea("message","body","","required maxlength=1500")}<button class="primary">${t("send")}</button></form>`;
}
function feedbackPage(id) {
  const e=events.find(e=>e.id===id);
  if(!e||!(e.joined||e.owner===user.id)||Date.parse(e.end||e.start)>Date.now()) return `<p>${t("forbidden")}</p>`;
  const value=feedbackData.event_id===id?feedbackData:{};
  return `<h1>${t("feedback")}</h1><p>${esc(e.title)}</p><p class="muted">${t("feedbackHelp")}</p><div class="actions">${link("again",`#again/${id}`)}</div>
    <form data-form="feedback" data-id="${id}">
      ${select("welcomed","welcome",[["",t("chooseAnswer")],...["yes","partly","no"].map(v=>[v,t(v)])],value.welcome||"")}
      ${select("comeAgain","again",[["",t("chooseAnswer")],...["yes","maybe","no"].map(v=>[v,t(v)])],value.again||"")}
      ${textArea("feedbackNote","note",value.note||"","maxlength=1500")}
      <button class="primary">${t("save")}</button></form>`;
}
function discoverPage() {
  return `<section class="home-intro"><h1>${t("homeTitle")}</h1><p>${t("homeIntro")}</p><a class="action primary create-meetup" href="#create">${icon("plus")}${t("create")}</a></section>
    ${demo?`<p class="muted">${t("demoBanner")}</p>`:!base?`<p>${t("setup")}</p>${link("connect","#connect")}`:""}
    <h2 class="search-heading">${t("userCreatedMeetups")}</h2>${!demo?`<p class="source-hint muted">${t("mixedSourcesHint")}</p>`:""}
    <form id="filter" class="discovery-search" role="search"><div class="search-row"><label class="search-field">${icon("search")}<span class="sr-only">${t("keyword")}</span><input name="query" type="search" value="${esc(filters.query)}" placeholder="${t("searchMeetups")}"></label><button type="button" data-toggle-filters aria-label="${t("searchFilters")}" aria-expanded="${hasFilters()}">${icon("gear")}</button></div>
    <div class="category-chips" aria-label="${t("category")}">${[["","all"],...cats.map(key=>[key,key])].map(([key,label])=>action(t(label),`data-category="${key}" aria-pressed="${filters.category===key}"`)).join("")}</div>
    <details id="advanced-filters" class="discover-filters" ${hasFilters()?"open":""}><summary>${t("searchFilters")}</summary><div class="grid">
      ${select("area","area",[["",t("anyArea")],...areas.map(x=>[x,x]),["other",t("other")]],filters.area)}
      ${select("category","category",[["",t("all")],...cats.map(x=>[x,t(x)])],filters.category)}
      ${select("atmosphereFilter","mood",[["",t("all")],...moods.filter(Boolean).map(x=>[x,t(x)])],filters.mood)}
      ${demo?"":select("eventSource","eventSource",[["",t("all")],["community",t("communityEvents")],["city",t("cityCalendar")]],filters.eventSource)}
      ${select("events","period",["upcoming","today","tonight"].map(x=>[x,t(x)]),filters.period)}
      <label class="check wide"><input type="checkbox" name="newcomers" ${filters.newcomers?"checked":""}> ${t("newcomers")}</label>
    </div></details></form>
    ${!demo&&user?`<section id="today-company" class="company-section">${todayCompany()}</section>`:""}
    <div class="section-heading"><h2 id="browse-heading" tabindex="-1">${t("nearbyMeetups")}</h2>${action(t("browseEvents"),"data-browse-events","text-action")}</div>
    <section id="results" aria-live="polite">${renderedResults=results()}</section>`;
}
function refreshResults() {
  const markup=results();
  if (markup===renderedResults) return;
  $("results").innerHTML=markup;
  renderedResults=markup;
}
function focusEventList() {
  const heading=$("browse-heading");
  heading.focus({preventScroll:true});
  heading.scrollIntoView({block:"start"});
}
function syncCategoryChips() {
  document.querySelectorAll("[data-category]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.category===filters.category)));
}
function hasFilters() {
  return Boolean(filters.query.trim() || filters.area || filters.category ||
    filters.period!=="upcoming" || filters.newcomers || filters.eventSource || filters.mood);
}
function results() {
  const term=filters.query.trim().toLowerCase();
  const today=localDate(new Date()).slice(0,10);
  const matching=[...events,...cityItems].filter(event=>{
    if (filters.eventSource && filters.eventSource!==(event.city?"city":"community")) return false;
    const date=localDate(new Date(event.start));
    if (event.hidden || event.cancelled || (filters.newcomers && !event.newcomers) || isPast(event) || !hasArea(event,filters.area)) return false;
    if (filters.category && event.category!==filters.category) return false;
    if (filters.mood && event.mood!==filters.mood) return false;
    if (filters.period!=="upcoming" && !date.startsWith(today)
        && !(event.city && date<today && localDate(new Date(event.end)).slice(0,10)>=today)) return false;
    if (filters.period==="tonight" && date.slice(11,13)<"17") return false;
    const words=[event.title,event.titleEn,event.description,event.area,event.place,t(event.category),
      copy[event.category]?.[0],copy[event.category]?.[1]].filter(Boolean).join(" ").toLowerCase();
    return !term || term.split(/\s+/).every(word=>words.includes(word));
  });
  if (!matching.length) {
    eventPageIndex=0;
    return `<p class="muted">${t(cityUnavailable&&filters.eventSource==="city"?"cityCalendarUnavailable":"none")}</p>`;
  }
  if (!hasFilters()) {
    for (const event of matching.filter(event=>!event.city)) {
      if (!browseOrder.has(event.id)) browseOrder.set(event.id,Math.random());
    }
    const community=matching.filter(event=>!event.city).sort((a,b)=>browseOrder.get(a.id)-browseOrder.get(b.id));
    const municipal=matching.filter(event=>event.city);
    matching.length=0;
    while (community.length && municipal.length) matching.push(...community.splice(0,2),municipal.shift());
    matching.push(...community,...municipal);
  }
  const pageCount=Math.ceil(matching.length/PAGE_SIZE);
  eventPageIndex=Math.max(0,Math.min(eventPageIndex,pageCount-1));
  const start=eventPageIndex*PAGE_SIZE;
  const page=matching.slice(start,start+PAGE_SIZE).map(event=>event.city?cityCard(event):card(event)).join("");
  if (pageCount===1) return page;
  return page+`<div class="event-pages">
    ${action(t("previous"),`data-event-page="-1" ${eventPageIndex===0?"disabled":""}`)}
    <span>${t("page")} ${eventPageIndex+1} / ${pageCount}</span>
    ${action(t("next"),`data-event-page="1" ${eventPageIndex===pageCount-1?"disabled":""}`)}
  </div>`;
}
function isPast(event) { return Date.parse(event.city?event.end:event.start)<=Date.now(); }
function eventTitle(e) { return lang==="en" && e.titleEn ? e.titleEn : e.title; }
function price(e) { return e.price ? esc(e.price)+" kr" : t("free"); }
function googleMapsUrl(event) {
  const query=[event.place,event.area,"Sverige"].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function eventAddress(event) {
  const address=[event.place,event.area].filter(Boolean).join(", ");
  return `<a href="${esc(googleMapsUrl(event))}">${esc(address)}</a>`;
}
function cityActions(event) {
  return `<div class="actions">${action(t("cityShare"),`data-share-city="${esc(event.id)}"`)}
    ${link("arrangeCityMeetup",user?`#create/city/${esc(event.id)}`:`#auth/login/${esc(event.id)}`,"primary")}</div>`;
}
function cityCard(event) {
  return `<article class="card event-card city-card"><a class="event-cover cover-culture" href="#city/${esc(event.id)}" tabindex="-1" aria-hidden="true">${icon("culture")}</a><span class="pill">${t("cityCalendar")}</span>
    <h2><a href="#city/${esc(event.id)}">${esc(event.title)}</a></h2>
    <p class="muted">${esc(dateLabel(event.start))}${event.end!==event.start?" – "+esc(dateLabel(event.end)):""}${event.place?" · "+esc(event.place):""}</p>
    ${Date.parse(event.start)<=Date.now()?`<span class="pill">${t("cityOngoing")}</span>`:""}</article>`;
}
function cityPage(event) {
  if (!event) return `<h1>${t("cityCalendar")}</h1><p>${t(cityUnavailable?"cityCalendarUnavailable":"missing")}</p>`;
  const meetups=events.filter(e=>e.source===event.source&&!e.hidden&&!e.cancelled&&!isPast(e));
  return `<span class="pill">${t("cityCalendar")}</span><h1>${esc(event.title)}</h1>
    <p>${esc(dateLabel(event.start))}${event.end!==event.start?" – "+esc(dateLabel(event.end)):""}</p>
    ${event.place?`<p>${eventAddress(event)}</p>`:""}${event.organizer?`<p>${esc(event.organizer)}</p>`:""}
    <div class="actions">${link("source",event.source)}</div>${cityActions(event)}
    ${meetups.length?`<h2>${t("cityMeetups")}</h2>${meetups.map(e=>card(e)).join("")}`:""}`;
}
function card(e,controls="") {
  return `<article class="card event-card"><a class="event-cover cover-${cats.includes(e.category)?e.category:"other"}" href="#event/${Number(e.id)}" tabindex="-1" aria-hidden="true">${icon(e.category)}</a><div class="rows between"><span class="pill">${esc(t(e.category))}</span><span class="pill">${price(e)}</span></div>
    ${eventBadges(e)}<h2><a href="#event/${Number(e.id)}">${esc(eventTitle(e))}</a></h2>
    <p class="muted">${esc(dateLabel(e.start))} · ${eventAddress(e)}</p>
    <p>${e.minPeople&&e.proposalPhase!=="active"?`${Number(e.interestCount||0)+1}/${Number(e.minPeople)} ${t("interestCount")}`:`${Number(e.count)}/${Number(e.capacity)} ${t("attendees").toLowerCase()}`}${e.hidden?" · "+t("hidden"):""}</p>${e.mood?`<span class="pill">${t(e.mood)}</span>`:""}${e.walkGoal?`<span class="pill"> · ${t("walk_"+e.walkGoal)}</span>`:""}${controls}<a class="action primary event-open" href="#event/${Number(e.id)}">${t("viewMeetup")}</a></article>`;
}
function eventBadges(e) {
  return `<div class="rows">${["quick","newcomers","cancelled"].filter(key=>e[key]).map(key=>
    `<span class="pill">${t(key==="quick"?"quickBadge":key)}</span>`).join("")}${e.minPeople?`<span class="pill">${t(e.proposalPhase==="active"?"proposalActive":Date.parse(e.start)<=Date.now()?"proposalExpired":"proposal")}</span>`:""}</div>`;
}
function safetyActions(person, type, id) {
  if (!user || Number(person)===user.id) return "";
  return `<div class="actions">${link({event:"reportEvent",person:"reportPerson",message:"reportMessage",group:"groupReport"}[type],`#report/${type}/${Number(id)}`)}
    ${type==="person"?"":link("reportPerson",`#report/person/${Number(person)}`)}
    ${action(t("blockPerson"),`data-block-person="${Number(person)}" data-value="true"`)}</div>`;
}
function reportPage(type,id) {
  if (!["event","person","message","group"].includes(type)||!Number(id)) return `<h1>${t("missing")}</h1>`;
  return `<h1>${t("report")}</h1><form data-form="report" data-type="${type}" data-id="${Number(id)}">
    ${textArea("reportReason","reason","","required maxlength=500")}<button class="primary">${t("report")}</button></form>`;
}
function quickForm() {
  return `<h1>${t("quick")}</h1><form data-form="event">
    <input type="hidden" name="quick" value="on">
    ${field("title","title","","text",'required maxlength="120"')}
    ${select("category","category",cats.map(key=>[key,t(key)]))}
    ${areaSelect(user.area)}${field("place","place","","text",'required maxlength="180"')}
    ${field("date","start",localDate(new Date(Date.now()+3600000)),"datetime-local",'required')}
    <label class="check"><input type="checkbox" name="newcomers" checked> ${t("newcomers")}</label>
    <button class="primary">${t("publish")}</button></form>`;
}
function reminderForm(event) {
  if (!eligibleReminder(event)) return "";
  const minutes=reminderMinutes(event.id);
  return `<form data-form="reminder" data-id="${Number(event.id)}"><h2>${t("reminderTitle")}</h2>
    <p class="muted">${t("reminderNote")}</p>
    ${field("reminderMinutes","minutes",minutes||DEFAULT_REMINDER_MINUTES,"number",'required min="1" max="10080" step="1"')}
    <label class="check"><input type="checkbox" name="off" ${minutes===0?"checked":""}> ${t("reminderOff")}</label>
    <div class="actions"><button class="primary" type="submit">${t("save")}</button>
      ${window.HangaAndroid && !window.HangaAndroid.notificationsEnabled()?action(t("allowReminder"),"data-allow-reminder"):""}
      ${window.HangaAndroid?.preciseReminderAccessNeeded()?action(t("preciseReminder"),"data-precise-reminder"):""}
    </div></form>`;
}
let socialRequest;
async function refreshSocialPage() {
  const [page,id]=route(),hash=route().join("/"),eventId=Number(id),version=refreshId;
  const current=events.find(row=>row.id===eventId);
  if(demo||!user||socialRequest||!(page==="again"||(page==="friends"&&!id)||(page==="event"&&current?.minPeople&&current.proposalPhase!=="active"))) return;
  const owner=user.id;
  socialRequest=page==="again"?api("/again",{id:eventId}):page==="friends"?api("/friends"):api("/events");
  try {
    const rows=await socialRequest;
    if(user?.id!==owner||version!==refreshId||route().join("/")!==hash) return;
    if(page==="again") {
      if(againEventId===eventId&&JSON.stringify(againRows)===JSON.stringify(rows)) return;
      againRows=rows;againEventId=eventId;
    } else if(page==="friends") {
      if(JSON.stringify(friends)===JSON.stringify(rows)) return;
      friends=rows;
    } else {
      const next=rows.find(row=>row.id===eventId);
      if(JSON.stringify(current)===JSON.stringify(next)) return;
      events=events.filter(row=>row.id!==eventId);
      if(next) events.push(next);
      syncReminders();
    }
    render();
  } finally {socialRequest=undefined;}
}
setInterval(()=>{if(document.visibilityState!=="hidden") void refreshSocialPage().catch(()=>{});},15000);
function proposalPanel(e) {
  if(!e.minPeople||e.proposalPhase==="active") return "";
  const own=user?.id===e.owner,canJoin=user&&!e.cancelled&&!e.hidden&&Date.parse(e.start)>Date.now();
  return `<section class="card proposal-panel"><h2>${t(Date.parse(e.start)<=Date.now()?"proposalExpired":e.proposalPhase==="confirming"?"proposalReady":"proposalCollecting")}</h2>
    <p>${Number(e.interestCount||0)+1}/${Number(e.minPeople)} ${t("interestCount")}</p><p class="muted">${t("proposalHelp")}</p>
    ${e.proposalPhase==="confirming"?`<p>${Number(e.count||0)+Number(!!e.ownerConfirmed)}/${Number(e.minPeople)} ${t("confirmedPeople")}</p>`:""}
    <div class="actions">${canJoin&&!own?action(t(e.interested?"withdrawInterest":"interested"),`data-interest="${e.id}" data-enabled="${!e.interested}"`,e.interested?"":"primary"):""}
    ${canJoin&&e.proposalPhase==="confirming"&&(own||e.interested)?e.proposalConfirmed?`<p class="pill">${t("proposalConfirmed")}</p>`:action(t("confirmProposal"),`data-confirm-proposal="${e.id}"`,"primary"):""}</div></section>`;
}
function againPage(id) {
  const e=events.find(row=>row.id===id);
  if(!e||!(e.joined||e.owner===user.id)||Date.parse(e.end||e.start)>Date.now()) return `<p>${t("forbidden")}</p>`;
  const rows=againEventId===id?againRows:[];
  return `<h1>${t("again")}</h1><p>${esc(e.title)}</p><p class="muted">${t("againHelp")}</p>
    ${rows.map(person=>`<section class="card"><h2>${memberLink(person.id,person.name)}</h2>
      ${person.matched?`<p class="pill">${t("againMatch")}</p><div class="actions">${link("message",`#messages/${person.id}`,"primary")}${link("inviteFriend",`#friends/invite/${person.id}`)}</div>`:
        action(t(person.selected?"againSelected":"againSelect"),`data-again="${id}" data-peer="${person.id}" data-enabled="${!person.selected}"`,person.selected?"":"primary")}</section>`).join("")||`<p>${t("againEmpty")}</p>`}`;
}
function walkTemplates() {
  const descriptions={
    view:["Gå tillsammans och hitta en utsiktsplats. Stanna och berätta vad ni gillar med utsikten. Bestäm startpunkt och en enkel väg som passar gruppen.","Walk together to a viewpoint. Stop and share what you like about the view. Agree on a starting point and an easy route that suits the group."],
    photo:["Ta en promenad vid vattnet och leta efter tre fotomotiv: en detalj, en reflektion och något oväntat. Mobilkamera räcker. Fråga innan du fotograferar någon.","Walk by the water and find three photo subjects: a detail, a reflection and something unexpected. A phone camera is enough. Ask before photographing anyone."],
    cafe:["Promenera till ett kafé som är nytt för gruppen. Välj tillsammans och kontrollera öppettider. Var och en betalar sitt eget fika; det går också bra att bara promenera.","Walk to a café that's new to the group. Choose together and check opening hours. Everyone pays for their own refreshments; joining just the walk is fine too."],
    discover:["Upptäck tre små saker i kvarteret: ett konstverk, en intressant byggnad och en plats ni vill besöka igen. Dela era upptäckter under promenaden.","Discover three small things in the neighbourhood: an artwork, an interesting building and a place you'd like to visit again. Share your discoveries as you walk."]};
  return Object.fromEntries(Object.entries(descriptions).map(([goal,description])=>[goal,{title:copy['walk_'+goal],description,walkGoal:goal,category:'walk',capacity:5}]));
}
function walkPicker() {
  return `<details class="card"><summary>${t("walkIdeas")}</summary><p class="muted">${t("walkIdeasHelp")}</p><div class="actions">${Object.keys(walkTemplates()).map(goal=>link('walk_'+goal,'#create/walk/'+goal)).join('')}</div></details>`;
}
function eventPage(e, recipient) {
  if (!e) return `<h1>${t("missing")}</h1>`;
  const manager = user&&(e.owner===user.id||user.admin);
  const target=Number(recipient)||e.owner;
  const form=user&&(e.joined||e.owner===user.id)&&user.id!==target&&!e.cancelled?`<form data-form="message" data-id="${Number(e.id)}" data-recipient="${Number(target)}">
    ${textArea("message","body","","required maxlength=1500")}<button class="primary">${t("send")}</button></form>`:"";
  const endpoint=googleMapsUrl(e);
  const member=user&&(e.joined||e.owner===user.id);
  const command=(name,op,enabled,klass="")=>action(t(name),`data-event="${Number(e.id)}" data-op="${op}" data-value="${enabled}"`,klass);
  const open=!e.cancelled && !e.hidden && new Date(e.start)>new Date();
  const pending=e.minPeople&&e.proposalPhase!=="active";
  const joinButton=pending?"":e.joined?command("leave","join",false):
    !open?"":e.count<e.capacity?command("join","join",true,"primary"):
    !e.waitlisted?command("waitlist","waitlist",true,"primary"):"";
  const waitingButton=!pending&&e.waitlisted?command("leaveWaitlist","waitlist",false):"";
  return `<h1>${esc(eventTitle(e))}</h1>${eventBadges(e)}<p class="pill">${esc(t(e.category))} · ${price(e)}${e.mood?" · "+esc(t(e.mood)):""}</p>
    <p>${esc(dateLabel(e.start))} · ${eventAddress(e)}</p><p>${t("organizer")} · ${memberLink(e.owner,e.organizer)}</p>
    ${!pending?`<p>${Number(e.count)}/${Number(e.capacity)} ${t("attendees").toLowerCase()}</p>`:""}
    ${e.walkGoal?`<p class="pill">${t("walk_"+e.walkGoal)}</p>`:""}<p>${esc(e.description)}</p>${proposalPanel(e)}
    <div class="actions">${link("map",endpoint)}${typeof e.source==="string"&&e.source.startsWith("https://")?link("source",e.source):""}
    ${!e.cancelled?action(t("share"),`data-share="${Number(e.id)}"`):""}
    ${user?`${joinButton}${waitingButton}${demo&&e.waitlisted&&e.count>=e.capacity?command("simulateVacancy","simulate",true):""}${command(e.saved?"removePlan":"savePlan","save",!e.saved)}`:open?link("login","#auth","primary"):""}</div>
    ${e.meetingNote||e.meetingMap?`<section class="card"><h2>${t("meetingPoint")}</h2><p>${esc(e.meetingNote||"")}</p>${e.meetingMap?link("map",e.meetingMap):""}</section>`:""}
    ${e.series?`<p class="muted">${t("repeated")}</p>`:""}
    ${!demo&&member&&!e.cancelled&&!pending?`<section class="card event-participation"><h2>${t(Date.parse(e.end||e.start)<=Date.now()?"afterMeetup":"plans")}</h2>
      <div class="actions">${Date.parse(e.end||e.start)<=Date.now()?`${link("again",`#again/${e.id}`,"primary")}${link("feedback",`#feedback/${e.id}`)}${link("groupChat",`#group/${e.id}`)}`:link("groupChat",`#group/${e.id}`,"primary")}</div>
      ${e.joined&&open&&Date.parse(e.start)-Date.now()<=86400000?`<p>${t("confirmationHelp")}</p>
        ${e.confirmed?`<p class="pill">${t("confirmed")}</p>`:action(t("confirmAttendance"),`data-confirm-attendance="${e.id}"`,"primary")}
        ${command("leave","join",false)}`:""}</section>`:""}
    ${reminderForm(e)}
    ${manager?`<div class="card"><div class="actions">${e.cancelled?"":link("edit","#create/"+e.id)}${open?command("cancelEvent","cancel",true,"danger"):""}${command("deleteEvent","delete",true,"danger")}
       ${user.admin?command(e.hidden?"show":"hide","moderate",!e.hidden):""}</div></div>`:""}${user&&(manager||e.joined)?`<div class="card">${command("attendees","participants",true)}<div id="participants"></div></div>`:""}${form}${safetyActions(target,recipient?"person":"event",recipient?target:e.id)}`;
}
function quickMeetupSection() {
  return `<section aria-labelledby="quick-meetup-heading">
    <h2 id="quick-meetup-heading">${t("quick")}</h2>
    <div class="actions">${link("createQuick","#create/quick")}</div>
    ${walkPicker()}
  </section><h2>${t("standardMeetup")}</h2>`;
}
function eventForm(e,draft,repeat,city) {
  const values=e||repeat|| (city&&{title:city.title,place:city.place,source:city.source,category:"other"});
  const cityStart=city?new Date(Math.max(Date.parse(city.start),Date.now()+60000)):null;
  if (e && e.owner!==user.id && !user.admin) return `<h1>${t("forbidden")}</h1>`;
  return `<h1>${t(city?"arrangeCityMeetup":repeat?"repeat":e?"edit":"create")}</h1>${draft?`<p>${t("templateDate")}</p>`:""}${!e&&!draft&&!repeat&&!city?quickMeetupSection():""}${city?`<p>${t("cityMeetupHelp")}</p>`:""}<form data-form="event" data-id="${e?.id ? Number(e.id) : ""}">
    ${!demo&&!e?select("meetupMode","meetupMode",[["meetup",t("standardMeetup")],["idea",t("ideaMode")]],"meetup"):""}
    ${!demo&&!e?`<div id="proposal-options" hidden>${field("minPeople","minPeople",3,"number",'min="2" max="21" step="1" disabled')}<p class="muted">${t("proposalHelp")}</p></div>`:e?.minPeople?`<p>${t("minPeople")}: ${e.minPeople}</p><p class="muted">${t("proposalFixed")}</p>`:""}
    ${field("title","title",values?.title||draft?.title[lang==="en"?1:0],"text",'required maxlength="120"')}
    ${textArea("description","description",values?.description||(draft?.description?.[lang==="en"?1:0]),'maxlength="3000"')}
    <div class="grid">${select("category","category",cats.map(x=>[x,t(x)]),values?.category||draft?.category)}
    ${select("mood","mood",moods.map(x=>[x,x?t(x):"—"]),values?.mood)}</div><p class="muted">${t("atmosphereHelp")}</p>
    <div id="walk-goal" ${values?.category==="walk"||draft?.category==="walk"?"":"hidden"}>${select("walkGoal","walkGoal",[["","—"],...Object.keys(walkTemplates()).map(goal=>[goal,t("walk_"+goal)])],values?.walkGoal||draft?.walkGoal||"")}</div>
    ${areaSelect(values?.area||draft?.area||user.area)}${field("place","place",values?.place||draft?.place,"text",'required maxlength="180"')}
    ${field("date","start",draft||repeat?"":localDate(cityStart||(e?new Date(e.start):new Date(Date.now()+86400000))),"datetime-local",'required')}
    ${field("endTime","end",draft||repeat?"":localDate(e?.end?new Date(e.end):new Date((cityStart?cityStart.getTime():e?Date.parse(e.start):Date.now()+86400000)+7200000)),"datetime-local","required")}
    <details><summary>${t("meetingPoint")}</summary><p class="muted">${t("meetingHelp")}</p>
      ${textArea("meetingNote","meetingNote",values?.meetingNote||"","maxlength=400")}
      ${field("meetingMap","meetingMap",values?.meetingMap||"","url",'maxlength="750" placeholder="https://maps.app.goo.gl/…"')}</details>
    ${!demo&&!e&&!city?`<details><summary>${t("recurrence")}</summary><p class="muted">${t("recurrenceHelp")}</p>
      ${select("occurrences","repeatCount",Array.from({length:12},(_,i)=>[String(i+1),String(i+1)]),"1")}</details>`:""}
    <div class="grid">${field("price","price",values?.price??0,"number",'required min="0" max="100000"')}
    ${field("capacity","capacity",values?.capacity??draft?.capacity??6,"number",'required min="1" max="5000"')}</div>
    ${e?.quick?'<input type="hidden" name="quick" value="on">':""}
    <label class="check"><input type="checkbox" name="newcomers" ${(values?.newcomers||draft)?"checked":""}> ${t("newcomers")}</label>
    ${field("source","source",values?.source,"url",'maxlength="750" placeholder="https://"')}
    <button class="primary">${t(e?"save":"publish")}</button>
    </form>`;
}
function plansPage() {
  const owned=events.filter(event=>event.owner===user.id);
  const active=owned.filter(event=>!isPast(event));
  const archived=owned.filter(isPast).reverse();
  const attendedPast=events.filter(event=>isPast(event)&&event.joined&&event.owner!==user.id);
  const plans=events.filter(event=>!isPast(event)&&(event.joined||event.saved||event.waitlisted));
  return `<h1>${t("plans")}</h1><h2>${t("own")}</h2>${active.map(event=>card(event)).join("")||`<p>${t("none")}</p>`}
    ${link("create","#create","primary")}
    <details class="card"><summary>${t("proposalPlans")}</summary>${events.filter(event=>event.interested&&!isPast(event)).map(event=>card(event)).join("")||`<p>${t("none")}</p>`}</details>
    <div class="card"><h2>${t("pastAttended")}</h2>${attendedPast.map(event=>card(event)).join("")||`<p>${t("none")}</p>`}</div>
    <div class="card"><h2>${t("expired")}</h2>${archived.map(event=>card(event,link("repeat",`#create/repeat/${Number(event.id)}`))).join("")||`<p>${t("none")}</p>`}</div>
    <div class="card"><h2>${t("saved")}</h2>${plans.map(event=>card(event)).join("")||`<p>${t("noPlans")}</p>`}</div>`;
}
function memberLink(id,name) {
  return user && !demo && Number(id)>0 ? `<a href="#member/${Number(id)}">${esc(name)}${availabilityIndicator(id)}</a>` : esc(name);
}
function memberMeetupCard(e) {
  const title=`<strong>${esc(eventTitle(e))}</strong>`;
  return `<article class="member-meetup">${events.some(row=>row.id===e.id)?`<a href="#event/${Number(e.id)}">${title}</a>`:title}<p class="muted">${esc(dateLabel(e.start))} · ${esc(e.area)}</p><small>${esc(e.organizer)}</small></article>`;
}
function memberPage(id) {
  const member=memberProfile?.id===id?memberProfile:null;
  if(!member)return `<h1>${t("memberProfile")}</h1>`;
  const organized=(member.meetups||[]).filter(e=>e.organized),participating=(member.meetups||[]).filter(e=>!e.organized);
  return `<section class="member-heading">${avatar(member.name,member.photo)}<h1>${esc(member.name)}${availabilityIndicator(id)}</h1>
    ${user.id!==id&&availability.some(entry=>Number(entry.user_id)===id&&availableToday(entry))?link("suggestMeetup",`#offer/${id}`,"primary"):""}
    ${user.id!==id?`<a class="action primary" href="#messages/${Number(id)}">${icon("message")}${t("message")}</a>${member.canMessage===false?`<p class="muted contact-rule">${t("contactRule")}</p>`:""}`:""}</section>
    <section class="card">${member.bio?`<h2>${t("bio")}</h2><p>${esc(member.bio)}</p>`:""}
    <h2>${t("spokenLanguages")}</h2><p>${esc(member.languages)||t("none")}</p>
    ${!demo&&user.id!==id?`<div class="actions">${action(t(member.following?"unfollow":"follow"),`data-follow="${id}" data-enabled="${!member.following}"`)}${friendControls(id)}</div>`:""}</section>
    <section class="card"><h2>${t("organizedMeetups")} · ${organized.length}</h2>${organized.map(memberMeetupCard).join("")||`<p class="muted">${t("noPublicMeetups")}</p>`}</section>
    <section class="card"><h2>${t("participatingMeetups")} · ${participating.length}</h2>${participating.map(memberMeetupCard).join("")||`<p class="muted">${t("noPublicMeetups")}</p>`}</section>
    ${safetyActions(id,"person",id)}`;
}
function photoEditor() {
  return `<h2>${t("profilePhoto")}</h2><p><strong>${esc(user.name)}</strong>${availabilityIndicator(user.id)}</p><div class="photo-editor-row">${avatar(user.name,user.photo)}<div><label class="photo-choose">${t("changePhoto")}<input id="profile-photo-input" type="file" accept="image/jpeg,image/png,image/webp"></label><label class="photo-choose camera-choose">${icon("camera")}${t("takePhoto")}<input id="profile-camera-input" type="file" accept="image/jpeg,image/png,image/webp" capture="user"></label>${user.photo?action(t("removePhoto"),"data-remove-photo","danger"):""}</div></div><p class="muted">${t("photoHelp")}</p>`;
}
async function prepareProfilePhoto(file) {
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)throw new Error("photoInvalid");
  const source=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error("photoInvalid"));reader.readAsDataURL(file);});
  const image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error("photoInvalid"));img.src=source;});
  if(!image.naturalWidth||!image.naturalHeight)throw new Error("photoInvalid");
  const canvas=document.createElement("canvas");canvas.width=256;canvas.height=256;
  const context=canvas.getContext("2d");context.fillStyle="#fff";context.fillRect(0,0,256,256);
  const size=Math.min(image.naturalWidth,image.naturalHeight);
  context.drawImage(image,(image.naturalWidth-size)/2,(image.naturalHeight-size)/2,size,size,0,0,256,256);
  for(const quality of [.85,.7,.5]){const data=canvas.toDataURL("image/jpeg",quality);if(data.length<=65536)return data;}
  throw new Error("photoInvalid");
}
let photoBusy=false;
async function saveProfilePhoto(file,remove=false) {
  if(photoBusy||!user)return;
  photoBusy=true;const owner=user.id;
  const input=$("profile-photo-input"),camera=$("profile-camera-input"),button=document.querySelector("[data-remove-photo]");
  if(input)input.disabled=true;if(camera)camera.disabled=true;if(button)button.disabled=true;
  try {
    status("photoSaving");
    const photo=remove?"":await prepareProfilePhoto(file);
    if(user?.id!==owner)return;
    const result=await api("/me/photo",{photo});
    if(user?.id!==owner)return;
    user.photo=result.photo;
    if(route()[0]==="profile"&&$("profile-photo-editor"))$("profile-photo-editor").innerHTML=photoEditor();
    status("photoSaved");
  } catch(error){if(user?.id===owner)status(error.message);}
  finally {photoBusy=false;if(input){input.disabled=false;input.value="";}if(camera){camera.disabled=false;camera.value="";}if(button)button.disabled=false;window.HangaAndroid?.clearCameraPhoto?.();}
}

function profilePage() {
  const language=`<div class="card">${select("interfaceLanguage","appLanguage",[["sv","Svenska"],["en","English"]],lang)}</div>`;
  if (!user) return `<h1>${t("profile")}</h1>${language}<p>${t("loginRequired")}</p>${link("login","#auth","primary")}`;
  return `<div class="rows between account-heading"><h1>${t("profile")}</h1>
    <details class="account-menu"><summary aria-label="${t("accountMenu")}"><span aria-hidden="true">☰</span></summary>
      <div class="account-menu-panel">

        ${!hangaCloud.googleAccount?action(t("passwordLabel"),'data-account-section="profile-password"'):""}
        ${blockedPeople.length?action(t("blockedPeople"),'data-account-section="profile-blocked"'):""}
        ${base?action(t("deleteAccount"),'data-account-section="profile-delete"',"danger"):""}
        ${action(t("logout"),"data-logout")}
      </div>
    </details></div>
    ${language}
    <section class="card" id="profile-photo-editor">${photoEditor()}</section>
    ${!demo?`<details class="card"><summary>${t("followingTitle")}</summary>${followingPeople.map(p=>`<p>${memberLink(p.id,p.name)}</p>`).join("")||`<p>${t("none")}</p>`}</details>`:""}
    ${blockedPeople.length?`<details id="profile-blocked" hidden><summary>${t("blockedPeople")}</summary>${blockedPeople.map(p=>
      `<p>${esc(p.name)} ${action(t("unblockPerson"),`data-block-person="${Number(p.id)}" data-value="false"`)}</p>`).join("")}</details>`:""}
    <form data-form="profile">
      ${field("name","name",user.name,"text",'required maxlength="80"')}${field("email","email",user.email,"email",hangaCloud.googleAccount?"required readonly":"required")}<small class="muted">${t("privateEmail")}</small>
      ${areaSelect(user.area)}${textArea("bio","bio",user.bio,'maxlength="1500"')}
      ${field("interests","interests",user.interests,"text",'maxlength="300"')}
      ${field("spokenLanguages","languages",user.languages,"text",'maxlength="150"')}

      ${hangaCloud.googleAccount?`<p class="muted">${t("googleManageAccount")}</p>`:`<details id="profile-password" hidden><summary>${t("passwordLabel")}</summary>${passwordField("current","current")}
      ${passwordField("newPassword","newPassword",{policy:true,autocomplete:"new-password"})}</details>`}
      <button class="primary">${t("save")}</button></form>
      ${base?`<details id="profile-delete" hidden><summary class="danger">${t("deleteAccount")}</summary><form data-form="deleteAccount">
        ${hangaCloud.googleAccount?`<p>${t("googleDeleteHelp")}</p>`:passwordField("current","password",{required:true})}<button class="danger">${t("deleteAccount")}</button>
      </form></details>`:""}`;
}
function adminPage() {
  return `<h1>${t("admin")}</h1><section class="card"><h2>${t("eventTemplates")}</h2>
    <div class="actions">${starterMeetups.map((draft,index)=>`<a class="action" href="#create/draft/${index}">${esc(draft.title[lang==="en"?1:0])}</a>`).join("")}</div></section>
    <form data-form="registration"><label class="check">
    <input type="checkbox" name="registration" ${admin.registration?"checked":""}> ${t("registration")}
    </label><button class="primary">${t("save")}</button></form>
    <h2>${t("reports")} · ${(admin.reports||[]).filter(r=>!r.resolved).length}</h2>
    ${(admin.reports||[]).map(r=>`<article class="card"><strong>${esc(r.context)}</strong>
      <p>${esc(r.reason)}</p><p>#${Number(r.subject||0)} · ${esc((admin.users.find(u=>u.id===r.subject)||{}).name||"")}</p>
      <div class="actions">${r.event_id?link("details",`#event/${Number(r.event_id)}`):""}
      ${r.resolved?t("resolved"):action(t("resolve"),`data-resolve="${Number(r.id)}"`)}</div></article>`).join("")}
    <h2>${t("accounts")} · ${admin.users.length}</h2>${admin.users.map(u=>`<article class="card">
    <strong>${esc(u.name)}</strong><p class="muted">${esc(u.email)} · ${esc(u.area)}</p>
    ${u.id!==user.id&&!u.blocked&&!u.deleted?`<div class="actions">${link("adminMessage",`#messages/${Number(u.id)}`,"primary")}</div>`:""}
    ${u.admin?t("admin"):`<div class="actions">${action(t(u.blocked?"unblock":"block"),`data-account="${Number(u.id)}" data-op="block" data-value="${!u.blocked}"`)}
    ${action(t("delete"),`data-account="${Number(u.id)}" data-op="delete"`,"danger")}</div>`}</article>`).join("")}
    <details class="card"><summary>${t("feedbackAdmin")} · ${(admin.feedback||[]).length}</summary>
      ${(admin.feedback||[]).map(row=>`<article><p><a href="#event/${Number(row.event_id)}">#${Number(row.event_id)}</a> · ${t("welcomed")} ${t(row.welcome)} · ${t("comeAgain")} ${t(row.again)}</p><p>${esc(row.note)}</p></article>`).join("")}</details>
    <h2>${t("events")} · ${events.length}</h2>${events.map(e=>card(e,action(t("deleteEvent"),`data-event="${Number(e.id)}" data-op="delete"`,"danger"))).join("")}`;
}
function friendControls(id) {
  if(friendContext?.id!==id) return "";
  const state=friendContext.status;
  if(state==="accepted") return link("inviteFriend",`#friends/invite/${id}`);
  if(state==="incoming") return `${action(t("acceptFriend"),`data-friend-reply="${id}" data-accept="true"`,"primary")}${action(t("declineFriend"),`data-friend-reply="${id}" data-accept="false"`)}`;
  if(state==="outgoing") return `<span class="muted">${t("friendPending")}</span>`;
  return friendContext.canRequest?action(t("addFriend"),`data-add-friend="${id}"`):"";
}
function messageNavigation(active) {
  if(demo) return "";
  return `<nav class="message-tabs actions" aria-label="${t("messages")}"><a class="action" href="#messages" ${active==="messages"?'aria-current="page"':""}>${t("conversations")}</a><a class="action" href="#friends" ${active==="friends"?'aria-current="page"':""}>${t("friends")}</a></nav>`;
}
function friendsPage() {
  if(demo) return `<h1>${t("friends")}</h1><p>${t("messageDemo")}</p>`;
  const incoming=friends.filter(p=>p.status==="pending"&&p.direction==="incoming");
  const outgoing=friends.filter(p=>p.status==="pending"&&p.direction==="outgoing");
  const accepted=friends.filter(p=>p.status==="accepted");
  const request=(person,received)=>`<article class="card"><h3>${memberLink(person.id,person.name)}</h3><div class="actions">${received?`${action(t("acceptFriend"),`data-friend-reply="${person.id}" data-accept="true"`,"primary")}${action(t("declineFriend"),`data-friend-reply="${person.id}" data-accept="false"`)}`:action(t("withdrawFriend"),`data-remove-friend="${person.id}" data-withdraw="true"`)}</div></article>`;
  return `<h1>${t("friends")}</h1><div class="message-tabs actions" aria-label="${t("friends")}">${action(t("myFriends"),`data-friend-tab="friends" aria-pressed="${friendTab==="friends"}"`)}${action(t("friendRequests")+" · "+incoming.length,`data-friend-tab="requests" aria-pressed="${friendTab==="requests"}"`)}</div><p class="muted">${t("friendsHelp")}</p><div data-friend-section="requests" ${friendTab==="requests"?"":"hidden"}>
    ${incoming.length?`<section class="friend-requests"><h2>${t("friendRequests")} · ${incoming.length}</h2>${incoming.map(p=>request(p,true)).join("")}</section>`:`<p>${t("noFriendRequests")}</p>`}</div>
    <div data-friend-section="friends" ${friendTab==="friends"?"":"hidden"}><label class="search-field friend-search">${icon("search")}<span class="sr-only">${t("searchFriends")}</span><input type="search" id="friend-search" placeholder="${t("searchFriends")}" value="${esc(friendSearch)}"></label>
    <section class="friend-list" aria-label="${t("myFriends")}">${accepted.map(p=>`<article class="friend-row" data-friend-name="${esc(p.name.toLowerCase())}" ${p.name.toLowerCase().includes(friendSearch.toLowerCase())?"":"hidden"}>${avatar(p.name)}<div class="friend-description"><h2>${memberLink(p.id,p.name)}</h2>${p.bio?`<p>${esc(p.bio.slice(0,160))}</p>`:""}${p.languages?`<small class="muted">${esc(p.languages)}</small>`:""}</div><a class="action friend-message" href="#messages/${p.id}" aria-label="${t("message")} · ${esc(p.name)}">${icon("message")}</a><details class="account-menu"><summary aria-label="${t("manageFriend")}">⋮</summary><div class="account-menu-panel">${link("inviteFriend",`#friends/invite/${p.id}`)}${action(t("removeFriend"),`data-remove-friend="${p.id}"`,"danger")}</div></details></article>`).join("")||`<p>${t("friendsEmpty")}</p>`}</section>
    <p id="friends-no-match" class="muted" ${accepted.length&&!accepted.some(p=>p.name.toLowerCase().includes(friendSearch.toLowerCase()))?"":"hidden"}>${t("noFriendsFound")}</p>
    <section class="friend-invite-panel"><h2>${t("inviteFriend")}</h2><p>${t("inviteHelp")}</p>${link("plans","#plans")}</section></div>
    ${link("pastParticipants","#plans")}${outgoing.length?`<details class="card"><summary>${t("friendOutgoing")} · ${outgoing.length}</summary>${outgoing.map(p=>request(p,false)).join("")}</details>`:""}`;
}
function inviteEvents() {return events.filter(e=>!e.hidden&&!e.cancelled&&Date.parse(e.start)>Date.now()&&(!e.minPeople||e.proposalPhase==="active")&&(e.owner===user.id||e.joined));}
function friendInvitePage(peer) {
  const person=friends.find(p=>p.id===peer&&p.status==="accepted");
  if(!person) return `<h1>${t("inviteFriend")}</h1><p>${t("missing")}</p>${link("friends","#friends")}`;
  const upcoming=inviteEvents();
  return `<h1>${t("inviteFriend")}</h1><p>${memberLink(peer,person.name)}</p>${messageNavigation("friends")}<p class="muted">${t("inviteHelp")}</p>
    ${upcoming.length?`<form data-form="friendInvite" data-peer="${peer}">${select("chooseInvite","id",upcoming.map(e=>[String(e.id),eventTitle(e)+" · "+dateLabel(e.start)]),String(upcoming[0].id))}<button class="primary">${t("sendInvite")}</button></form>`:`<p>${t("noInviteEvents")}</p>`}
    <div class="actions">${link("browseEvents","#discover")}${link("create","#create")}</div>`;
}
function canCompose(peer) {
  return demo?chatThreads().has(peer):chatPeer?.id===peer?chatPeer.canSend:friends.some(p=>p.id===peer&&p.status==="accepted");
}
function chatThreads() {
  const threads=new Map();
  for (const message of messageList) {
    const outgoing=message.sender===user.id;
    const peer=outgoing?message.recipient:message.sender;
    if (!threads.has(peer)) threads.set(peer,{peer,name:outgoing?message.recipient_name:message.sender_name,items:[],unread:0});
    const thread=threads.get(peer);
    thread.items.push(message);
    if (message.unread) thread.unread++;
  }
  return threads;
}
function updateChatBadge() {
  const badge=$("unread-messages");
  if (!badge) return;
  const count=user?messageList.filter(m=>m.unread).length:0;
  badge.hidden=count===0;
  badge.textContent=String(count);
  badge.parentElement.setAttribute("aria-label",count?`${t("messages")}. ${t("unreadMessages")} ${count}`:t("messages"));
}
function chatContent(peer) {
  const threads=chatThreads();
  if (!peer) return threads.size?`<div class="chat-list">${[...threads.values()].map(thread=>`<a class="card chat-preview" href="#messages/${Number(thread.peer)}">
    ${avatar(thread.name)}<strong>${esc(thread.name)}${availabilityIndicator(thread.peer)}</strong>${thread.unread?`<span class="message-count">${thread.unread}</span>`:""}
    <p class="muted">${esc(thread.items[0].body)}</p><small>${esc(dateLabel(thread.items[0].created))}</small>
    </a>`).join("")}</div>`:`<p>${t("noMessages")}</p>`;
  const thread=threads.get(peer);
  if (!thread) {
    const person=chatPeer?.id===peer?chatPeer:friends.find(p=>p.id===peer&&p.status==="accepted");
    return person?.name?`${link("conversations","#messages")}<h2>${memberLink(peer,person.name)}</h2><p>${t(person.adminContact?"adminChatHelp":person.friend||person.status==="accepted"?"friendChatHelp":"retainedChatHelp")}</p><p class="muted">${t("firstFriendMessage")}</p>`:`<p>${t("noMessages")}</p>`;
  }
  const groups=[];
  for (const message of [...thread.items].reverse()) {
    const previous=groups[groups.length-1];
    if (previous?.sender===message.sender) previous.items.push(message);
    else groups.push({sender:message.sender,items:[message]});
  }
  return `<div class="chat-heading"><a class="action chat-back" href="#messages" aria-label="${t("conversations")}">←</a>${avatar(thread.name)}<h2>${memberLink(peer,thread.name)}</h2><details class="account-menu chat-options"><summary aria-label="${t("conversationOptions")}" title="${t("conversationOptions")}">⋮</summary><div class="account-menu-panel">${action(t("deleteConversation"),`data-delete-chat="${peer}" data-through="${Number(thread.items[0].id)}"`,"danger")}${safetyActions(peer,"person",peer)}</div></details></div><div class="chat-timeline" role="log" aria-label="${t("messages")}">${groups.map(({sender,items})=>`
    <section class="chat-group ${sender===user.id?"chat-own":""}">
      ${items.map(m=>`<div class="chat-entry">${m.admin_message?`<span class="pill">${t("adminSender")}</span>`:""}<p>${esc(m.body)}</p>${m.invite_event?m.invite_available?link("details",`#event/${Number(m.invite_event)}`):`<p class="muted">${t("inviteUnavailable")}</p>`:""}<div class="chat-meta"><small class="muted">${esc(dateLabel(m.created))}</small><details class="message-options"><summary aria-label="${t("messageOptions")}" title="${t("messageOptions")}">⋮</summary><div class="message-options-panel">${sender===peer?link("reportMessage",`#report/message/${Number(m.id)}`):""}${action(t("deleteMessage"),`data-delete-message="${Number(m.id)}" data-peer="${peer}"`)}</div></details></div></div>`).join("")}</section>`).join("")}</div>`;
}
function scrollChatToLatest() {
  const timeline=document.querySelector(".chat-timeline");
  if (timeline) timeline.scrollTop=timeline.scrollHeight;
}
function messagesPage(peer) {
  return `${peer?"":`<h1>${t("messages")}</h1>${messageNavigation("messages")}`}${demo?`<p class="muted">${t("messageDemo")}</p>`:""}
    <div class="chat-shell"><div id="chat-content">${chatContent(peer)}</div>
    ${peer&&!canCompose(peer)&&chatThreads().get(peer)?.items.some(m=>m.availability_offer&&m.sender===user.id)?`<p class="muted">${t("offerPendingHelp")}</p>`:""}
    ${peer?`<form id="chat-compose" data-form="chat" data-peer="${peer}" ${canCompose(peer)?"":"hidden"}>
      <label class="sr-only" for="chat-body">${t("message")}</label><textarea id="chat-body" name="body" rows="2" placeholder="${t("chatPlaceholder")}" required maxlength="1500"></textarea><button class="primary" aria-label="${t("send")}" title="${t("send")}">➤</button></form>`:""}</div>`;
}
let chatsRequest;
function refreshChats() {
  if (!user || (!demo&&!base)) return Promise.resolve();
  if (chatsRequest) return chatsRequest;
  const owner=user.id;
  chatsRequest=(async()=>{
    const rows=await api(demo?"/messages":"/chats");
    if (user?.id!==owner) return;
    const [page,id]=route();
    if(page==="messages"&&Number(id)>0&&!demo) {
      let info;
      try {info=await api("/chats/peer",{peer:Number(id)});}
      catch(error){if(!["missing","forbidden","messageBlocked"].includes(error.message))throw error;info={id:Number(id),canSend:false,friend:false};}
      if(user?.id!==owner||route().join("/")!==page+"/"+id) return;
      chatPeer=info;
    }
    if (page==="messages" && id && !demo && document.visibilityState!=="hidden") {
      const peer=Number(id);
      const unread=rows.filter(m=>m.sender===peer&&m.recipient===owner&&m.unread);
      if (unread.length) {
        await api("/chats/read",{peer,through:unread.reduce((latest,m)=>Math.max(latest,m.id),0)});
        if (user?.id!==owner) return;
        for (const message of unread) message.unread=false;
      }
    }
    messageList=rows;
    updateChatBadge();
    const pane=$("chat-content");
    if (route()[0]==="messages" && pane) {
      const peer=Number(route()[1]);
      const html=chatContent(peer);
      if (pane.dataset.last!==html) {
        const previous=pane.querySelector(".chat-timeline");
        const scroll=previous?.scrollTop||0;
        const atEnd=!previous||previous.scrollHeight-scroll-previous.clientHeight<48;
        pane.innerHTML=html;
        pane.dataset.last=html;
        const timeline=pane.querySelector(".chat-timeline");
        if (timeline) timeline.scrollTop=atEnd?timeline.scrollHeight:scroll;
      }
      if ($("chat-compose")) $("chat-compose").hidden=!canCompose(peer);
    }
  })().finally(()=>{chatsRequest=undefined;});
  return chatsRequest;
}
window.hangaRefreshChats=()=>{void refreshChats().catch(()=>{});};
document.addEventListener("visibilitychange",()=>{
  if (document.visibilityState!=="hidden") {
    window.hangaRefreshChats();
    updateAvailabilityViews();void refreshAvailability().catch(()=>{});
    pruneCityEvents();
    const page=route()[0];
    if(page==="discover" && $("results")) refreshResults();
    else if(page==="city") render();
    if(["discover","city"].includes(page)) void loadCityCalendar(true)?.then(()=>{
      if(route()[0]==="discover" && $("results")) refreshResults();
      else if(route()[0]==="city") render();
    });
  }
});
setInterval(()=>{
  if (document.visibilityState!=="hidden") {
    window.hangaRefreshChats();
    syncFirebasePush();
  }
},15000);
function noticesPage() {
  return `<h1>${t("notices")}</h1>${action(t("refresh"),"data-refresh")}`+
    (noticeList.length?noticeList.map(n=>`<article class="card"><h2><a href="${["friendRequest","friendAccepted"].includes(n.kind)?"#friends":n.kind==="again"?"#again/"+Number(n.event_id):n.kind==="group"?"#group/"+Number(n.event_id):n.kind==="feedback"?"#feedback/"+Number(n.event_id):n.kind==="message"?(n.sender_id?"#messages/"+Number(n.sender_id):"#messages"):"#event/"+Number(n.event_id)}">${esc(n.title)}</a></h2>
      <p>${esc(n.name)} ${t(n.kind==="message"?"messageNotice":n.kind)} · ${esc(dateLabel(n.created))}</p></article>`).join(""):`<p>${t("noNotices")}</p>`);
}
document.addEventListener("input",event=>{
  if(event.target.id==="friend-search") {
    friendSearch=event.target.value;
    const term=friendSearch.toLowerCase();let matches=0;
    document.querySelectorAll("[data-friend-name]").forEach(row=>{row.hidden=!row.dataset.friendName.includes(term);if(!row.hidden)matches++;});
    $("friends-no-match").hidden=matches>0||!friends.some(p=>p.status==="accepted");
  }

  if (event.target.form?.id==="filter") {
    filters=Object.fromEntries(new FormData(event.target.form));
    eventPageIndex=0;
    syncCategoryChips();
    refreshResults();
  }
  if (event.target.name==="area" && $("customArea") && event.target.form?.id!=="filter") {
    const custom=event.target.value==="other";
    $("customArea").hidden=!custom;
    $("customArea").querySelector("input").required=custom;
  }
});
document.addEventListener("submit",async event=>{
  event.preventDefault();
  const form=event.target, mode=form.dataset.form;
  if (!mode) return;
  const data=Object.fromEntries(new FormData(form));
  if (data.area==="other") data.area=data.customArea?.trim()||"";
  delete data.customArea;
  const button=form.querySelector("button:not([type=button])");
  button.disabled=true;
  try {
    if(mode==="googleProfile") {
      data.adult=data.adult==="on";
      const response=await api("/google/complete",data);
      session(response);location.hash="profile";
    } else if (mode==="connect") {
      await disableAlerts();
      await hangaCloud.connect(data.url,data.key.trim());
      if (!hangaCloud.signedIn) session();
      base=hangaCloud.configuration.url;
      cityItems=[];
      cityLoadedAt=0;
      cityUnavailable=false;
      events=[];
      browseOrder.clear();
      eventPageIndex=0;
      location.hash="discover";
    } else if (mode==="login"||mode==="register") {
      if (mode==="register" && !passwordValid(data.password)) throw new Error("password");
      data.adult=data.adult==="on";
      pendingEmail=data.email.trim().toLowerCase();
      const response=await api("/"+mode,data);
      if (response.confirmation) {
        location.hash="auth/confirm";
        return status("codeSent");
      }
      session(response);
      pendingEmail="";
      const [,,context,peer]=route();
      location.hash=mode==="login" && cityId.test(context||"")?`create/city/${context}`:
        mode==="login" && context==="chat" && /^\d+$/.test(peer||"")?`messages/${peer}`:"profile";
    } else if (mode==="reset") {
      pendingEmail=data.email.trim().toLowerCase();
      await api("/password/reset",{email:pendingEmail,locale:lang});
      if (form.isConnected) location.hash="auth/reset-sent";
      return;
    } else if (mode==="report") {
      const {type,id}=form.dataset;
      await api("/report",{[{event:"id",person:"person",message:"message",group:"group"}[type]]:Number(id),reason:data.reason});
      history.back();
    } else if (mode==="reminder") {
      const e=events.find(event=>event.id===Number(form.dataset.id));
      if (!e || !eligibleReminder(e)) throw new Error("missing");
      const minutes=data.off==="on"?0:Number(data.minutes);
      if (!Number.isInteger(minutes) || minutes<0 || minutes>10080) throw new Error("invalid");
      localStorage.setItem(reminderKey(e.id),String(minutes));
      syncReminders();
    } else if(mode==="availability-offer") {
      await api("/availability/offer",{peer:Number(form.dataset.peer),activity:data.activity,start:stockholmDate(data.start),place:data.place,note:data.note,lang});
      location.hash="messages/"+Number(form.dataset.peer);
    } else if(mode==="availability") {
      await saveAvailability(data);
      return;
    } else if(mode==="group") {
      await api("/groups/send",{id:Number(form.dataset.id),body:data.body});
      form.reset();
      await refreshGroup();
      return;
    } else if(mode==="feedback") {
      feedbackData=await api("/feedback",{...data,id:Number(form.dataset.id),save:true});
      return status("done");
    } else if (mode==="event") {
      const original=events.find(entry=>entry.id===Number(form.dataset.id));
      data.start=original && localDate(new Date(original.start))===data.start ? original.start : stockholmDate(data.start);
      if(data.end) data.end=stockholmDate(data.end);
      data.minPeople=original?.minPeople||(!demo&&data.meetupMode==="idea"?Number(data.minPeople):0);
      data.walkGoal=data.category==="walk"?data.walkGoal||"":"";
      data.repeatCount=data.minPeople?1:Number(data.repeatCount||1);
      data.quick=data.quick==="on";
      data.newcomers=data.newcomers==="on";
      data.price=Number(data.price||0);
      data.capacity=Number(data.capacity||6);
      if (data.quick && (new Date(data.start)>new Date(Date.now()+86400000) || new Date(data.start)<=new Date())) throw new Error("quickTime");
      const id=form.dataset.id;
      const result=await api(id?`/events/${id}/edit`:"/events",data);
      location.hash=id||result.id?`event/${id||result.id}`:"plans";
    } else if (mode==="profile") {
      if (data.newPassword && !passwordValid(data.newPassword)) throw new Error("password");
      if (!demo && (data.email.toLowerCase()!==user.email || data.newPassword) && !data.current) {
        $("profile-password").hidden=false;
        $("profile-password").open=true;
        form.querySelector('[name="current"]').focus();
        throw new Error("badLogin");
      }
      user=await api("/me",data);
      syncAlertProfile();
      if (user.emailPending) {
        render();
        return status("emailPending");
      }
    } else if (mode==="registration") {
      await api("/admin/settings",{registration:data.registration==="on"});
    } else if (mode==="deleteAccount") {
      if (!confirm(t("confirmDelete"))) return;
      await disableAlerts();
      await api("/account/delete",{...data,email:user.email});
      session();
      location.hash="discover";
    } else if(mode==="friendInvite") {
      await api("/friends/invite",{peer:Number(form.dataset.peer),id:Number(data.id),lang});
      location.hash="messages/"+Number(form.dataset.peer);
      status("inviteSent");
      return;
    } else if (mode==="chat") {
      const peer=Number(form.dataset.peer);
      if (demo) {
        const latest=chatThreads().get(peer)?.items[0];
        if (!latest) throw new Error("missing");
        await api(`/events/${latest.event_id}/message`,{recipient:peer,body:data.body});
      } else await api("/chats/send",{peer,body:data.body});
      form.reset();
      if (chatsRequest) await chatsRequest;
      await refreshChats();
      scrollChatToLatest();
      return;
    } else if (mode==="message") {
      await api(`/events/${form.dataset.id}/message`,{recipient:Number(form.dataset.recipient),body:data.body});
      location.hash="messages/"+Number(form.dataset.recipient);
    }
    status("done");
    await load();
  } catch(error) {
    status(error.message);
  }
  finally { button.disabled=false; }
});
function confirmMeetupDeletion(meetup) {
  const dialog=$("delete-meetup-dialog");
  if (dialog.open) return Promise.resolve(false);
  $("delete-meetup-title").textContent=t("confirmEventDelete");
  $("delete-meetup-name").textContent=eventTitle(meetup);
  $("keep-meetup").textContent=t("keepMeetup");
  $("delete-meetup").textContent=t("deleteEvent");
  dialog.returnValue="";
  return new Promise(resolve=>{
    dialog.addEventListener("close",()=>resolve(dialog.returnValue==="delete"),{once:true});
    dialog.showModal();
  });
}
$("keep-meetup").addEventListener("click",()=>$("delete-meetup-dialog").close());
$("delete-meetup").addEventListener("click",()=>$("delete-meetup-dialog").close("delete"));

async function deleteMeetup(id) {
  const meetup=events.find(event=>event.id===id);
  if (!meetup) throw new Error("missing");
  if (!await confirmMeetupDeletion(meetup)) return;
  try {
    await api(`/events/${id}/delete`,{});
  } catch (error) {
    if (error.message!=="missing") throw error;
  }
  events=await api("/events");
  syncReminders();
  if (events.some(event=>event.id===id)) {
    render();
    throw new Error("eventDeleteIncomplete");
  }
  if (route()[0]==="event" && Number(route()[1])===id) location.hash=user.admin?"admin":"plans";
  else render();
  status("eventDeleted");
}

document.addEventListener("click",async event=>{
  if (event.target.closest('.settings-menu a[href="#discover"]') && route()[0]==="discover") {
    event.preventDefault();
    event.target.closest("details").open=false;
    window.scrollTo(0,0);
    void load();
    return;
  }
  document.querySelectorAll(".account-menu[open]").forEach(menu=>{
    if (!menu.contains(event.target) || event.target.closest("a")) menu.open=false;
  });
  const button=event.target.closest("button[type=button]");
  if (!button) return;
  const d=button.dataset;
  if("nextCompany" in d){nextCompany();return;}
  if("removePhoto" in d){await saveProfilePhoto(null,true);return;}
  if (d.friendTab) {
    friendTab=d.friendTab;
    document.querySelectorAll("[data-friend-section]").forEach(section=>section.hidden=section.dataset.friendSection!==friendTab);
    document.querySelectorAll("[data-friend-tab]").forEach(tab=>tab.setAttribute("aria-pressed",String(tab.dataset.friendTab===friendTab)));
    return;
  }
  if ("toggleFilters" in d) {
    const panel=$("advanced-filters");panel.open=!panel.open;
    button.setAttribute("aria-expanded",String(panel.open));
    if(panel.open)panel.querySelector("select").focus();
    return;
  }
  if ("category" in d) {
    filters.category=d.category;$("filter").elements.category.value=d.category;
    eventPageIndex=0;syncCategoryChips();refreshResults();return;
  }
  if (d.accountSection) {
    button.closest(".account-menu").open=false;
    const section=$(d.accountSection);
    section.hidden=false;
    section.open=true;
    section.querySelector("summary").focus();
    return;
  }
  if ("passwordToggle" in d) {
    const input=button.parentElement.querySelector("input");
    const show=input.type==="password";
    input.type=show?"text":"password";
    button.setAttribute("aria-pressed",String(show));
    button.setAttribute("aria-label",t(show?"passwordHide":"passwordShow"));
    return;
  }
  if ("forgotPassword" in d) {
    pendingEmail=document.querySelector('[data-form="login"] [name="email"]').value.trim();
    location.hash="auth/reset";
    return;
  }
  if ("browseEvents" in d) {
    filters={...defaultFilters};
    const filterForm=$("filter");
    filterForm.elements.query.value=filters.query;
    filterForm.elements.area.value=filters.area;
    filterForm.elements.category.value=filters.category;
    filterForm.elements.mood.value=filters.mood;
    filterForm.elements.period.value=filters.period;
    if (filterForm.elements.eventSource) filterForm.elements.eventSource.value="";
    filterForm.elements.newcomers.checked=false;
    $("advanced-filters").open=false;
    syncCategoryChips();
    eventPageIndex=0;
    refreshResults();
    focusEventList();
    void load();
    return;
  }
  if (d.eventPage) {
    eventPageIndex+=Number(d.eventPage);
    refreshResults();
    focusEventList();
    return;
  }
  if ("checkUpdates" in d) {
    window.HangaAndroid.checkForUpdate(lang);
    return;
  }
  button.disabled=true;
  try {
    if("googleLogin" in d) {
      const response=await api("/google/login",{});
      if(response.onboarding){location.hash="auth/google";return;}
      session(response);location.hash="profile";
    } else if(d.addFriend||d.friendReply||d.removeFriend) {
      if(d.addFriend) await api("/friends/request",{peer:Number(d.addFriend)});
      else if(d.friendReply) await api("/friends/reply",{peer:Number(d.friendReply),accept:d.accept==="true"});
      else {if(!d.withdraw&&!confirm(t("removeFriendConfirm")))return;await api("/friends/remove",{peer:Number(d.removeFriend)});}
      status("done");
    } else if(d.interest||d.confirmProposal||d.again) {
      if(d.interest) await api("/interest",{id:Number(d.interest),enabled:d.enabled==="true"});
      else if(d.confirmProposal) await api("/proposals/confirm",{id:Number(d.confirmProposal)});
      else await api("/again/change",{id:Number(d.again),peer:Number(d.peer),enabled:d.enabled==="true"});
      status("done");
    } else if(d.deleteChat||d.deleteMessage) {
      if(!confirm(t(d.deleteChat?"deleteConversationConfirm":"deleteMessageConfirm"))) return;
      // Finish an older refresh before applying the deletion so it cannot restore stale history.
      if(chatsRequest) await chatsRequest;
      await api("/chats/delete",d.deleteChat?{peer:Number(d.deleteChat),through:Number(d.through)}:{peer:Number(d.peer),message:Number(d.deleteMessage)});
      await refreshChats();
      return;
    } else if(d.follow) {
      await api("/follows",{id:Number(d.follow),enabled:d.enabled==="true"});
    } else if("removeAvailability" in d) {
      await removeAvailability();
      return;
    } else if(d.confirmAttendance) {
      await api("/attendance",{id:Number(d.confirmAttendance)});
    } else if ("allowReminder" in d) {
      window.HangaAndroid.allowReminders();
      return;
    } else if ("preciseReminder" in d) {
      window.HangaAndroid.allowPreciseReminders();
      return;
    } else if (d.share || d.shareCity) {
      const e=d.shareCity?findCity(d.shareCity):events.find(entry=>entry.id===Number(d.share));
      if (!e) throw new Error("missing");
      const details=e.city?`${t("cityInvite")}\n${e.title}\n${dateLabel(e.start)}${e.place?" · "+e.place:""}\n${e.source}`:
        `${eventTitle(e)}\n${dateLabel(e.start)} · ${e.place}, ${e.area}\n${e.description||""}${e.source?"\n"+e.source:""}`;
      const invite=`Hänga Gbg\n${details}\n\n${t("downloadApp")}\n${downloadUrl}`;
      if (window.HangaAndroid) window.HangaAndroid.shareText(invite);
      else if (navigator.share) await navigator.share({text:invite});
      else throw new Error("shareFailed");
      return;
    } else if (d.blockPerson) {
      await api("/blocks/change",{id:Number(d.blockPerson),enabled:d.value==="true"});
    } else if (d.resolve) {
      await api("/reports/resolve",{id:Number(d.resolve)});
    } else if ("resend" in d) {
      await api("/resend",{});
      return status("codeSent");
    } else if ("demo" in d && demo) {
      session(await api("/demo"));
      location.hash="discover";
    } else if ("logout" in d) {
      try { await disableAlerts(); await api("/logout",{}); }
      finally { session(); location.hash="discover"; }
    } else if (d.event || d.account) {
      if (d.event && d.op==="delete") {
        await deleteMeetup(Number(d.event));
        return;
      }
      if (d.op==="delete" && !confirm(t("confirmDelete"))) return;
      if (d.op==="cancel" && !confirm(t("confirmCancel"))) return;
      const value=d.value==="true";
      const result=await api(d.event?`/events/${d.event}/${d.op}`:`/admin/users/${d.account}/${d.op}`,
        d.op==="participants"?undefined:{enabled:value,hidden:value,blocked:value});
      if (d.op==="participants") {
        const e=events.find(item=>item.id===Number(d.event));
        const canMessage=e&&!e.cancelled&&!e.hidden&&(e.joined||e.owner===user.id);
        if ($("participants")) $("participants").innerHTML=result.length?result.map(person=>
          `<div class="card"><p>${memberLink(person.id,person.name)}</p>${person.id!==user.id&&canMessage?link("message",`#event/${d.event}/${Number(person.id)}`):""}${safetyActions(person.id,"person",person.id)}</div>`).join(""):`<p>${t("waiting")}</p>`;
        return;
      }
      status("done");
    }
    await load();
  } catch(error) { status(error.message); }
  finally { button.disabled=false; }
});
document.addEventListener("change",event=>{
  if(["profile-photo-input","profile-camera-input"].includes(event.target.id)&&event.target.files?.[0]){void saveProfilePhoto(event.target.files[0]);return;}
  const form=event.target.form;
  if(form?.dataset.form==="event") {
    if(event.target.name==="meetupMode") {
      const idea=event.target.value==="idea";
      $("proposal-options").hidden=!idea;
      form.elements.minPeople.required=idea;
      form.elements.minPeople.disabled=!idea;
      form.elements.capacity.max=idea?20:5000;
      form.elements.minPeople.max=Math.min(21,Number(form.elements.capacity.value)+1);
      if(form.elements.repeatCount){form.elements.repeatCount.disabled=idea;if(idea)form.elements.repeatCount.value="1";}
    }
    if(event.target.name==="capacity" && form.elements.minPeople) form.elements.minPeople.max=Math.min(21,Number(event.target.value)+1);
    if(event.target.name==="category" && $("walk-goal")) $("walk-goal").hidden=event.target.value!=="walk";
  }
  if(event.target.name==="start" && form?.dataset.form==="event" && form.elements.end) {
    try {
      const input=event.target, previous=input.dataset.previous||input.defaultValue;
      const duration=previous?Date.parse(stockholmDate(form.elements.end.value))-Date.parse(stockholmDate(previous)):7200000;
      const start=Date.parse(stockholmDate(input.value));
      form.elements.end.value=localDate(new Date(start+(duration>0&&duration<=7*86400000?duration:7200000)));
      input.dataset.previous=input.value;
    } catch {} // Keep the entered values so native form validation can highlight them.
  }
  if (event.target.name!=="appLanguage" || !["sv","en"].includes(event.target.value)) return;
  localStorage.lang=lang=event.target.value;
  syncAlertProfile();
  window.hangaRefreshReminders();
  render();
});
setInterval(()=>{
  if(document.visibilityState!=="hidden")void refreshAvailability().catch(()=>{});
  if (route()[0]!=="discover" || !$("results")) return;
  if($("today-company")) $("today-company").innerHTML=todayCompany();
  refreshResults();
  if (document.visibilityState!=="hidden") loadCityCalendar()?.then(()=>{
    if ($("results")) refreshResults();
  });
},30000);
window.addEventListener("hashchange",()=>{ memberProfile=null; window.scrollTo(0,0); render(); load(); });
render();
load();
