import { Whatsapp, Message } from "venom-bot";
import { getRepository } from "typeorm"
import Dialog from "../models/Dialog"

export default class Wellcome
{
    async execute(client: Whatsapp, message: Message) {
        const repo = getRepository(Dialog)
        const dialog = await repo.find({ number: message.from })
        console.log(dialog);
    }
}