// An offer lets its recipient reply. The sender gets regular chat only after a reply.
export async function availabilityContact(db,uid,peer) {
  const joins=await db.getMany('availability_acceptances',[uid+'-'+peer,peer+'-'+uid]);
  if(joins.size)return true;
  const [sent,received]=await Promise.all([
    db.query('messages',[['sender','EQUAL',uid],['recipient','EQUAL',peer]]),
    db.query('messages',[['sender','EQUAL',peer],['recipient','EQUAL',uid]])
  ]);
  if(received.some(m=>m.availability_offer===true))return true;
  return sent.some(offer=>offer.availability_offer===true&&received.some(reply=>reply.id>offer.id));
}
