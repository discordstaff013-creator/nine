
export default function setupErrorHandler(){
  const log = (err) => console.error("ERRO:", err);
  process.on("unhandledRejection", log);
  process.on("uncaughtException", log);
  console.log("🛡 Anti-crash carregado");
}
