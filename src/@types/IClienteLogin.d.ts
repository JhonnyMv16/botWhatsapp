export default interface IClientLogin
{
    id: string,
    login: string,
    senha: string,
    online: "N" | "S" | "SS"
}