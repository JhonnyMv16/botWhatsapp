import { create, Whatsapp, Message } from "venom-bot";
import { getRepository } from "typeorm";
import Dialog from "./models/Dialog";
import { MESSAGE_WELLCOME } from "./messages/wellcome";

// @type
import IDialog from "./@types/IDialog";

create("auto-atendente").then( client => {   
    let time: NodeJS.Timeout;
    client.onStreamChange( (state) => {
        console.log("- Estado de conexão:", state)
        clearTimeout(time);
        if ( state === "CONNECTED" ) {
            console.log("🟢 Bot carregado com sucesso!");
            start(client)
        }
        else if ( state === "DISCONNECTED" || state === "SYNCING" ) {
            time = setTimeout(() => {
                client.close()
                console.error("🔴 Bot não foi inicializado.");
            }, 30000);
        }
    })
}).catch(error => {
    console.error(error)
});

async function start(client: Whatsapp) {
    const inchat = await client.isInsideChat();
    if ( inchat ) {
        client.onMessage( async ( message ) => {
            try {
                const repo = getRepository(Dialog);
                const d = await repo.findOne({ number: message.from });
                
                if ( d ) {
                    const instance = await import(`./dialogs/${d?.name}`)
                    const m:IDialog = new instance.default();
                    m.execute(client, message);
                } else {
                    const dialog = repo.create({
                        number: message.from,
                        stage: 0,
                        name: "wellcome"
                    })
                    await repo.save(dialog);
                    await client.sendText(message.from, MESSAGE_WELLCOME({ username: message.sender.pushname }));
                }
            } catch (error) {
                console.error(`[ERROR] ${error} in`, __filename);
                client.sendText(message.from, "Não conseguimos processar sua solicitação.");
            }
            
        })
    }
}