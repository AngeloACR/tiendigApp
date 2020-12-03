import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root"
})
export class CarritoService {
  productos: any = [];
  montoSubtotal: number = 0;
  montoTotal: number = 0;
  montoShipping: number = 0;
  totalItems: number = 0;
  method: any;
  constructor(private storage: Storage) {}

  getItems() {}

  async addItem(item, qty) {
    this.productos = await this.getCart();
    let montoSubtotal = 0;
    if (item.regular_price) {
      montoSubtotal = qty * item.regular_price;
    }
    montoSubtotal = parseFloat(montoSubtotal.toFixed(2));
    let productExist = false;
    if (this.productos) {
      this.productos.forEach(producto => {
        if (producto.producto.id == item.id) {
          producto.qty += qty;
          producto.subtotal += montoSubtotal;
          productExist = true;
          return;
        }
      });
    } else {
      this.productos = [];
    }
    if (!productExist) {
      let aux = {
        producto: item,
        qty: qty,
        subtotal: montoSubtotal
      };
      this.productos.push(aux);
    }
    this.getTotalItems();
    await this.calcularTotal();

    this.storeCart(this.productos);
    this.storeMontos(this.montoSubtotal, this.montoTotal, this.montoShipping);
  }

  storeCart(cart) {
    let aux = JSON.stringify(cart);
    this.storage.set("cart", aux);
  }
  storeMontos(montoSubtotal, montoTotal, montoShipping) {
    this.storage.set("total", montoTotal);
    this.storage.set("subtotal", montoSubtotal);
    this.storage.set("shipping", montoShipping);
  }

  async getCart() {
    let cart = await this.storage.get("cart");
    return JSON.parse(cart);
  }
  async getMontoTotal() {
    let total = await this.storage.get("total");
    return total;
  }
  async getMontoSubtotal() {
    let total = await this.storage.get("subtotal");
    return total;
  }
  async getMontoShipping() {
    let total = await this.storage.get("shipping");
    return total;
  }

  getTotalItems() {
    this.totalItems = 0;
    this.productos.forEach(producto => {
      this.totalItems += producto.qty;
    });
  }

  async removeItem(item) {
    console.log(item);
    this.productos.forEach((aux, i) => {
      if (aux.producto.key == item.producto.key) {
        this.productos.splice(i, 1);
      }
    });
    await this.calcularTotal();
    this.getTotalItems();

    this.storeCart(this.productos);
    this.storeMontos(this.montoSubtotal, this.montoTotal, this.montoShipping);
  }

  async resetCart() {
    this.productos = [];
    this.montoShipping = 0;
    this.method = null;
    await this.calcularTotal();
    this.storeCart(this.productos);
    this.storeMontos(this.montoSubtotal, this.montoTotal, this.montoShipping);
  }

  async setShipping(monto, method) {
    this.method = method;
    this.montoShipping = monto;
    await this.calcularTotal();

    this.storeMontos(this.montoSubtotal, this.montoTotal, this.montoShipping);
  }

  async calcularTotal() {
    this.montoSubtotal = 0;
    this.productos.forEach(aux => {
      this.montoSubtotal += aux.subtotal;
    });
    this.montoTotal = this.montoSubtotal + this.montoShipping;
  }
}
