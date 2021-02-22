import { create, Whatsapp, Message } from "venom-bot";
import { getRepository, Not, Equal } from "typeorm";
import Dialog from "./models/Dialog";
import { MESSAGE_WELLCOME } from "./messages/wellcome.message";

// @type
import IDialog from "./@types/IDialog";
import { MESSAGE_FINALY_SUPPORT } from "./messages/closeSupport.message";
import Queue from "./models/Queue";
import { QueryExpressionMap } from "typeorm/query-builder/QueryExpressionMap";

create("auto-atendente").then( client => {   
    let time: NodeJS.Timeout;
    let connected = false;

    client.onStreamChange( (state) => {
        console.log("- Estado de conexão:", state)
        clearTimeout(time);
        if ( state === "CONNECTED" && !connected ) {
            connected = true;
            console.log("🟢 Bot carregado com sucesso!");
            start(client)
        }
        else if ( state === "DISCONNECTED" || state === "SYNCING" ) {
            time = setTimeout(() => {
                console.info("Não foi possível conectar ao whatsapp web. reconectando....");
                client.restartService();
            }, 30000);
        }
    })
}).catch(error => {
    console.error(error)
});

async function start(client: Whatsapp) {

    const inchat = await client.isInsideChat();
    if ( inchat ) {
        client.onMessage( async ( message: Message ) => {
            try {

                const queueRepository = getRepository(Queue);
                const queue = await queueRepository.findOne({
                    number: Not(Equal("message")),
                    status: Not(Equal("close"))
                });
                if ( queue ) {

                    if ( queue.status === "open" ) {
                        await client.sendText(message.from, "Aguarde que em breve um *colaborador* ira atende-lo!");
                        return
                    }
                    // enviar mensagem para o painel
                    return
                }

                const dialogRepository = getRepository(Dialog);
                const dialog = await dialogRepository.findOne({ number: message.from });
                
                if ( dialog ) {
                    if ( message.body.startsWith("finalizar") ) {
                        await dialogRepository.delete({ id: dialog.id });
                        await client.sendText(message.from, MESSAGE_FINALY_SUPPORT());
                        return
                    }
                    const instance = await import(`./dialogs/${dialog?.name}`)
                    const m:IDialog = new instance.default();
                    m.execute(client, message);
                } else {
                    const dialog = dialogRepository.create({
                        number: message.from,
                        stage: 0,
                        name: "wellcome"
                    })
                    await dialogRepository.save(dialog);
                    await client.sendText(message.from, MESSAGE_WELLCOME({ username: message.sender.pushname }));
                }
            } catch (error) {
                console.error(error);
                client.sendText(message.from, "Não conseguimos processar sua solicitação.");
            }
            
        })
    }
}