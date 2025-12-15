
export const name = "ready";
export const once = true;
export function execute(client){
  console.log(`🤖 Online como ${client.user.tag}`);
}
