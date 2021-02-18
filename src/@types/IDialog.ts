import { Whatsapp, Message } from "venom-bot";

export default interface IDialog
{
    execute(client: Whatsapp, message: Message): Promise<any>
}