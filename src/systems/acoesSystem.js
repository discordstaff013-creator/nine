
export class AcoesSystem {
  constructor(client){ this.client = client; }
  registrar(data){ this.client.logger.logAcao(data); }
}
