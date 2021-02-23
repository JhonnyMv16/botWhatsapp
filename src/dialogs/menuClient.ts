import { Message, Whatsapp } from "venom-bot";
import { getRepository } from "typeorm";
import Dialog from "../models/Dialog";

import IDialog from "../@types/IDialog";
import { MESSAGE_SUPPORT_LIST } from "../messages/support.message";

export default class MenuClient implements IDialog
{
    async execute(client:Whatsapp, message:Message) {
        const dialogRepository = getRepository(Dialog);
        const dialog = await dialogRepository.findOneOrFail({ number: message.from });

        const option = parseInt(message.body);
        switch(option) {
            // Suporte Técnico
            case 1:
                await dialogRepository.update(dialog.id, { name: "menu/support.ts" });
                client.sendText(message.from, MESSAGE_SUPPORT_LIST());
                break;

            // Informar Pagamento
            case 2:
                client.sendText(message.from, "Envie-nos uma foto do comprovante.");
                break;

            // Planos e Valores
            case 3:

            // Faturas Pendentes ( 2° Via de boletos )
            case 4:

            // solicitar atendimento para outro CPF
            case 5:

            // nenhuma das opções
            default:
                client.sendText(message.from, "Não encontramos essa opção.");
                break;
        }
    }
}