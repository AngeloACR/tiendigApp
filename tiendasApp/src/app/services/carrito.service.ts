import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CarritoService {
  productos: any = [];
  montoTotal: number = 0;
  totalItems: number = 0;
  constructor() {}

  getItems() {}

  addItem(item, qty) {
    let montoSubtotal = qty * item.regular_price;
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
    }
    if (!productExist) {
      let aux = {
        producto: item,
        qty: qty,
        subtotal: montoSubtotal
      };
      this.productos.push(aux);
    }
    this.calcularTotal();
    this.getTotalItems();
  }

  getTotalItems() {
    this.totalItems = 0;
    this.productos.forEach(producto => {
      this.totalItems += producto.qty;
    });
  }

  removeItem(item) {
    console.log(item);
    this.productos.forEach((aux, i) => {
      if (aux.producto.key == item.producto.key) {
        this.productos.splice(i, 1);
      }
    });
    this.calcularTotal();
    this.getTotalItems();
  }

  resetCart() {
    this.productos = [];
    this.montoTotal = 0;
  }

  calcularTotal() {
    this.montoTotal = 0;
    this.productos.forEach(aux => {
      this.montoTotal += aux.subtotal;
    });
  }
}
