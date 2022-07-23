const express = require("express");
var cors = require("cors");
const http = require("http");
const { Server: SocketServer } = require("socket.io");
const { dbConnection } = require("../database/connection.js");
const fileUpload = require("express-fileupload");

const Sockets = require("./sockets");
const morgan = require("morgan");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.httpServer = http.createServer(this.app);
    // this.io = new SocketServer(this.httpServer, {
    //   origins: "*",
    // });

    this.paths = {
      auth: "/api/auth",
      usuario: "/api/usuarios",
      categorias: "/api/categorias",
      productos: "/api/productos",
      buscar: "/api/buscar",
      uploads: "/api/uploads",
      roles: "/api/roles",
      solicitudes: "/api/solicitudes",
      bodega: "/api/bodega",
      pedido: "/api/pedido",
      marca:"/api/marca",
    };
    // this.usuariosPath ="/api/usuarios"
    // this.authPath ="/api/auth"
    // this.authCategoria ="/api/categorias"

    //Conectyar a la base de datos:
    this.conectarBD();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicacion
    this.route();

    // Configurar sockets
    // this.configurarSockets();
  }

  // configurarSockets() {
  //   new Sockets(this.io);
  // }

  async conectarBD() {
    await dbConnection();
  }

  middlewares() {
    //cors
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public"));

    //Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
    
    // Morgan
    this.app.use(morgan("dev"));
  }

  route() {
    this.app.use(this.paths.auth, require("../routes/auth.js"));
    this.app.use(this.paths.categorias, require("../routes/categorias.js"));
    this.app.use(this.paths.productos, require("../routes/productos.js"));
    this.app.use(this.paths.buscar, require("../routes/buscar.js"));
    this.app.use(this.paths.usuario, require("../routes/usuarios.js"));
    this.app.use(this.paths.uploads, require("../routes/uploads.js"));
    this.app.use(this.paths.roles, require("../routes/roles.js"));
    this.app.use(this.paths.bodega, require("../routes/bodegas.js"));
    this.app.use(this.paths.pedido, require("../routes/pedidos.js"));
    this.app.use(this.paths.marca, require("../routes/marcas.js"));
  }

  listen() {
    // Escuchar peticiones
    this.app.listen(this.port, () => {
      console.log("Corriendo en el puerto", this.port);
    });
    // this.httpServer.listen(this.port, () => {
    //   console.log("Corriendo en el puerto", this.port);
    // });
  }
}

module.exports = Server;
