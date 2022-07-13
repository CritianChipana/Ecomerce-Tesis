class PedidosList {
  constructor() {
    this.pedidos = [];
  }

  agregarPedido(pedido) {
    this.pedidos.push(pedido);
  }

  getPedidos() {
    return this.pedidos;
  }

  getPedido(id) {
    return this.pedidos.find((p) => p.id == id);
  }

  eliminarPedido(id) {
    this.pedidos = this.pedidos.filter((p) => p.id != id);
  }

  actualizarPedido(id, pedido) {
    this.pedidos = this.pedidos.map((p) => (p.id == id ? pedido : p));
  }
}

module.exports=PedidosList;