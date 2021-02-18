
const date = new Date()
const hours = date.getHours();

let m:string;

if ( hours > 0 && hours < 12 ) {
    m = "Bom dia";
} else if ( hours > 12 && hours < 18 ) {
    m = "Boa Tarde";
}else {
    m = "Bom Noite";
}

export const MESSAGE_WELLCOME = (params?: any) => `_Mensagem Automática_
${m}, *${params?.username ?? "Cliente"}*!
Eu sou ${process.env.ATTENDANT_NAME} sua atendente virtual.

Seja bem-vindo(a) ao atendimento WhatsApp Automático *${process.env.NAME}* !!
Lembrando que nosso atendimento Automático está disponível 24h, estamos ansiosos para atendê-lo, para facilitar seu atendimento !!

Caso não possua CPF/CNPJ cadastrado conosco e deseje atendimento para a contratação.


👉 Por favor, informe APENAS o CPF/CNPJ cadastrado como responsável pela rede que deseja atendimento.`