import { Message, Whatsapp } from "venom-bot";
import { getRepository } from "typeorm";

import IDialog from "../../@types/IDialog";

// @models
import Dialog from "../../models/Dialog";
import Queue from "../../models/Queue";

// @services
import ixc from "../../service/ixc_functions";
import { MESSAGE_ADD_QUEUE } from "../../messages/addQueue";

export default class Support implements IDialog
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
                {
                    await client.sendText(message.from, "Aguarde um momento enquanto verificamos em nosso sistema...");
                    
                    const cliente = await ixc.getClient(dialog.client_cpf);

                    const cliente_login = await ixc.getClientLogin(cliente.id);

                    // caso esteja conectado no sistema, então denovo desconectar para ver se não é login travado.
                    if ( cliente_login.online === "S" ) {
                        await dialogRepository.update(dialog.id, { name: "support/nonConnection.ts" });

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
                            protocol: `#${cliente.id}#${Date.now()}`,
                            client_id: cliente.id,
                            client_cpf: cliente.cnpj_cpf,
                            number: message.from
                        });
                        await queueRepository.save(queue);
            
                        await client.sendText(message.from, MESSAGE_ADD_QUEUE({ protocol: queue.protocol }));
                    }
                    break;
                }
                // lentidão
                case 2:
                    // pegar id do cliente no banco de dados da ixc provedor
                    const cliente = await ixc.getClient(dialog.client_cpf);

                    // criar query para fila do cliente e salvar no banco de dados.
                    const queueRepository = getRepository(Queue);
                    const queue = queueRepository.create({
                        name: message.sender.pushname,
                        avatar_url: message.sender.profilePicThumbObj.imgFull,
                        subject: "Lentidão",
                        protocol: `#${cliente.id}#${Date.now()}`,
                        client_id: cliente.id,
                        client_cpf: cliente.cnpj_cpf,
                        number: message.from
                    });
                    await queueRepository.save(queue);
                    
                    await client.sendText(message.from, MESSAGE_ADD_QUEUE({ protocol: queue.protocol }));
                    break;

                // aumentar cabo
                case 3:
                    break

                // trocar senha
                case 4:
                    break;

                default:
                    await client.sendText(message.from, "Essa opção não é válida.");
                    break
            }
        }
    }
}