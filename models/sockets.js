// import pedidoslist
const { usuarioConectado } = require("../controllers/socket");
const { comprobarJWT } = require("../helpers/jwt");
const PedidosList = require("./pedido-lista");

class Sockets {
  constructor(io) {
    this.io = io;

    this.pedidosList = new PedidosList();

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connect", async (socket) => {
      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);
      if(!valido){
          console.log('socket no identificado');
          return socket.disconnect();
      }
      
      // usuario conectado
      if (uid) {
        const usuario = await usuarioConectado(uid);
        console.log("cliente conectado", usuario.nombre);
      }

      // Escuchar evento: mensaje-to-server
      socket.on("mensaje-to-server", (data) => {
        console.log(data);

        this.io.emit("mensaje-from-server", data);
      });

    });
    // On disconnection
    this.io.on("disconnect", () => {
      console.log("cliente desconectado");
    });
  }
}

module.exports = Sockets;
