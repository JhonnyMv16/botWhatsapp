export const MESSAGE_MENU_CLIENT = (params?:any) => `
Para que possamos lhe direcionar para o setor desejado escolha uma das opções abaixo 
Por favor, digite a opção desejada 

[1] - Suporte Técnico 🛠
[2] - Informar Pagamento ✅
[3] - Planos e Valores 💲
[4] - Faturas Pendentes 📃 (2ª Via de Boletos)
[5] - Solicitar atendimento para outro CPF/CNPJ ou Endereço 🔄  (CPF/CNPJ Atual: *${params?.cpf}*)
`