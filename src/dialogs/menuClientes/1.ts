import { Message, Whatsapp } from "venom-bot";
import IDialog from "../../@types/IDialog";
import { getRepository } from "typeorm";
import Dialog from "../../models/Dialog";
import ixc from "../../service/ixc_functions";

export default class MenuClientesOption1 implements IDialog
{
    async execute(client: Whatsapp, message: Message) {
        const option = parseInt(message.body);
        
        const repo = getRepository(Dialog);
        const dialog = await repo.findOneOrFail({ number: message.from });

        if ( dialog.awating ) {
            await client.sendText(message.from, "Por favor aguarde, ainda estamos verificando em nosso sistema.");
            return
        }

        switch(option)
        {
            // sem conexão
            case 1:
                
                dialog.awating = true;
                await repo.save(dialog)
                await client.sendText(message.from, "Aguarde que vamos verificar em nosso sistema.");
                
                const cliente = await ixc.getClient(dialog.cliente_cpf);

                const cliente_login = await ixc.getClientLogin(cliente.id);
                console.log(cliente_login);

                // caso esteja conectado no sistema, então denovo desconectar para ver se não é login travado.
                if ( cliente_login.online === "S" ) {
                    await client.sendText(message.from, "OK! Você está online!\n\nVamos fazer alguns testes antes");
                }
                else if ( cliente_login.online === "N" ) {
                    await client.sendText(message.from, "OK! Vamos abrir um chamado para você.");
                }
                break;

            default:
                await client.sendText(message.from, "Essa opção não é válida.");
                break
        }
    }
}