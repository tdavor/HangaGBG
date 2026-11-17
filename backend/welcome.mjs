const welcome = `Välkommen till Hänga Gbg!

Hänga Gbg hjälper dig att hitta sällskap och skapa träffar i Göteborg med omnejd. Hitta en fikakompis, ta en promenad tillsammans eller bjud in andra till något du gillar.

• Upptäck: hitta träffar och filtrera på område, kategori och tid.
• Jag kommer: anmäl dig eller gå med i väntelistan om det är fullt.
• Mina planer: se dina träffar och ändra påminnelser.
• Skapa: välj tid och plats och publicera din egen träff.
• Meddelanden: skriv till andra som deltar i samma träff.

Schysst användning
Var snäll och respektfull mot andra. Respektera ett nej, undvik spam och välj gärna en offentlig mötesplats. Om du inte kan komma, avanmäl dig så att någon annan får plats. Du kan anmäla innehåll i appen om något känns fel.

Frågor eller feedback? Skriv till t.davor@gmail.com.

Vi ses i Göteborg!
Hänga Gbg`;

export async function sendWelcome(env,identity) {
  if (!env.RESEND_API_KEY || !env.WELCOME_FROM) return;
  const response=await fetch("https://api.resend.com/emails",{
    method:"POST",
    headers:{Authorization:"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json",
      "Idempotency-Key":"hanga-welcome/"+identity.uid},
    body:JSON.stringify({from:env.WELCOME_FROM,to:[identity.email],reply_to:"t.davor@gmail.com",
      subject:"Välkommen till Hänga Gbg!",text:welcome})
  });
  if (!response.ok) throw new Error("Resend HTTP "+response.status);
}
