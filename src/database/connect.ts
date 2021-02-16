import { createConnection } from "typeorm";


createConnection().then( r => {
    if ( r.isConnected ) {
        console.log("🗄  Banco de dados conectado.");
    }
});