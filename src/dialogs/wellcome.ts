import { Whatsapp, Message } from "venom-bot";
import { getRepository } from "typeorm";
import ixc from "../service/ixc_functions";
import Dialog from "../models/Dialog";
import { MESSAGE_MENU_CLIENT } from "../messages/menuClient.message";

export default class Wellcome
{
    /**
     * 
     * Pegar o CPF, verificar se é um cliente ou um futuro cliente e mostrar as informações cabiveis.
     * 
     */
    async execute(client:Whatsapp, message:Message) {
        const cliente = await ixc.getClient(message.body);
        // cliente encontrado
        if ( cliente ) {

            // atualizar banco de dados
            const repo = getRepository(Dialog);
            await repo.update({ number: message.from }, {
                name: "menuClientes",
                client_cpf: cliente.cnpj_cpf
            });

            await client.sendText(message.from, `Achei o seu endereço!\n\n${cliente.endereco}, ${cliente.numero} - ${cliente.bairro}, ${cliente.cidade}`);
            await client.sendText(message.from, MESSAGE_MENU_CLIENT({ cpf: cliente.cnpj_cpf }) );
        }
    }
}