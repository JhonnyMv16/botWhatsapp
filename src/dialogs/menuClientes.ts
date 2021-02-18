import { Message, Whatsapp } from "venom-bot";
import { getRepository } from "typeorm";
import Dialog from "../models/Dialog";

import IDialog from "../@types/IDialog";

export default class MenuClientes implements IDialog
{
    async execute(client:Whatsapp, message:Message) {
        const repo = getRepository(Dialog);

        const option = parseInt(message.body);
        switch(option) {
            // Suporte Técnico
            case 1:
                const dialog = await repo.findOneOrFail({ number: message.from });
                dialog.name = "menuClientes/1.ts";
                await repo.save(dialog);

                client.sendText(message.from, "Ainda em desenvolvimento.");
                break;

            // Informar Pagamento
            case 2:

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