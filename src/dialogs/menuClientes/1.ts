import { Message, Whatsapp } from "venom-bot";
import IDialog from "../../@types/IDialog";
import { getRepository } from "typeorm";

// @models
import Dialog from "../../models/Dialog";
import Queue from "../../models/Queue";

import ixc from "../../service/ixc_functions";
import { MESSAGE_FINALY_SUPPORT } from "../../messages/closeSupport.message";

export default class MenuClientesOption1 implements IDialog
{
    async execute(client: Whatsapp, message: Message) {
        const option = parseInt(message.body);
        const dialogRepository = getRepository(Dialog);
        const dialog = await dialogRepository.findOneOrFail({ number: message.from });
        
        if ( dialog.stage === 0 ) {
            switch(option)
            {
                // sem conexão
                case 1:
                    await client.sendText(message.from, "Aguarde um momento enquanto verificamos em nosso sistema...");
                    
                    await dialogRepository.update(dialog.id, { stage: 1 });

                    const cliente = await ixc.getClient(dialog.client_cpf);

                    const cliente_login = await ixc.getClientLogin(cliente.id);

                    // caso esteja conectado no sistema, então denovo desconectar para ver se não é login travado.
                    if ( cliente_login.online === "S" ) {
                        await client.sendText(message.from, "Aguarde um momento, estou realizando alguns testes.");
                        await ixc.disconnectLogin(cliente_login.id);
                        await client.sendText(message.from, "Por favor desligue o seu roteador na tomada espera 2 minutos e ligue-o novamente. Após isso verifica se o sinal foi restabelecido.");
                        await client.sendText(message.from, "Após os dois minutos nos responda: \nSinal da internet foi restabelecido?\n\n[1] - Sim\n[2] - Não");    
                    }
                    else if ( cliente_login.online === "N" ) {
                        // deletar dialogo
                        await dialogRepository.delete({ id: dialog.id })

                        // pegar id do cliente no banco de dados da ixc provedor
                        const cliente = await ixc.getClient(dialog.client_cpf);
                        const queueRepository = getRepository(Queue);

                        // criar query para fila do cliente e salvar no banco de dados.
                        const queue = queueRepository.create({
                            name: message.sender.pushname,
                            avatar_url: message.sender.profilePicThumbObj.imgFull,
                            subject: "Sem conexão",
                            protocol: `${Date.now()}-${cliente.id}`,
                            client_id: cliente.id,
                            number: message.from
                        });
                        await queueRepository.save(queue);
            
                        await client.sendText(message.from, `Você está na *fila de atendimento*!\nEm breve você será atendido.\n\n_seu protocolo de atendimento é_: ${queue.protocol}`);
                    }
                    break;

                default:
                    await client.sendText(message.from, "Essa opção não é válida.");
                    break
            }
        } else if ( dialog.stage === 1 ) {
            switch(option) {
                case 1:
                    await dialogRepository.delete({ id: dialog.id });
                    await client.sendText(message.from, MESSAGE_FINALY_SUPPORT());
                    break;
                case 2:
                    await dialogRepository.delete({ id: dialog.id })

                    const cliente = await ixc.getClient(dialog.client_cpf);
                    const queueRepository = getRepository(Queue);

                    const queue = queueRepository.create({
                        name: message.sender.pushname,
                        avatar_url: message.sender.profilePicThumbObj.imgFull,
                        subject: "Sem conexão",
                        protocol: `${Date.now()}-${cliente.id}`,
                        client_id: cliente.id,
                        number: message.from,
                    });
                    await queueRepository.save(queue);
        
                    await client.sendText(message.from, `Você está na *fila de atendimento*!\nEm breve você será atendido.\n\n_seu protocolo de atendimento é_: ${queue.protocol}`);
                    break;

                default:
                    await client.sendText(message.from, "Opção inválida.");
                    break;
            }
        }
    }
}