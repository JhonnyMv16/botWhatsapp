import { getRepository } from "typeorm";
import { Message, Whatsapp } from "venom-bot";

// @types
import IDialog from "../../@types/IDialog";

// @models
import Dialog from "../../models/Dialog";
import Queue from "../../models/Queue";

// @messages
import { MESSAGE_FINALY_SUPPORT } from "../../messages/closeSupport.message";

// @service
import ixc from "../../service/ixc_functions";
import { MESSAGE_ADD_QUEUE } from "../../messages/addQueue";



export default class NonConnection implements IDialog
{
    async execute(client: Whatsapp, message: Message) {
        const option = parseInt(message.body);
        const dialogRepository = getRepository(Dialog);
        const dialog = await dialogRepository.findOneOrFail({ number: message.from });

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
                    client_cpf: cliente.cnpj_cpf,
                    number: message.from,
                });
                await queueRepository.save(queue);
                await client.sendText(message.from, MESSAGE_ADD_QUEUE({ protocol: queue.protocol }));
                break;

            default:
                await client.sendText(message.from, "Opção inválida.");
                break;
        }
    }
}