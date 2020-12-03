import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";
import { CarritoService } from "../../services/carrito.service";
@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit {
  billing: any;
  shipping: any;
  payments: any;
  payment: any;
  montoTotal: any;
  montoSubtotal: any;
  currencySymbol: any;
  paymentsGetted: boolean = false;
  montoShipping: any = 0;
  totalsReady: boolean = false;
  productos: any;
  constructor(
    private wc: WoocommerceService,
    private router: Router,
    private carrito: CarritoService,
    private common: CommonService
  ) {}

  async ionViewDidEnter() {
    await this.common.showLoader();
    this.productos = await this.carrito.getCart();
    this.montoTotal = await this.carrito.getMontoTotal();
    this.montoSubtotal = await this.carrito.getMontoSubtotal();
    this.montoShipping = await this.carrito.getMontoShipping();
    this.currencySymbol = await this.wc.getCurrency();
    this.payments = await this.wc.getPaymentGateways();
    console.log(this.payments);
    this.paymentsGetted = true;
    this.totalsReady = true;
    this.currencySymbol = this.toHTML(this.currencySymbol);
    this.common.hideLoader();
  }
  ngOnInit() {}
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement
      .textContent;
  }

  handleBilling(data) {
    this.billing = data;
    console.log(this.billing);
  }
  handleShipping(data) {
    this.shipping = data;
    console.log(this.shipping);
  }
  handlePayment(data) {
    this.payment = data;
    console.log(this.payment);
  }

  async createOrder() {
    try {
      await this.common.showLoader();
      let orderProducts = [];
      console.log(this.carrito.method);
      let method = this.carrito.method;
      console.log(method);
      this.productos.forEach(producto => {
        let aux = {
          product_id: producto.producto.id,
          quantity: producto.qty
        };
        orderProducts.push(aux);
      });
      let montoEnvio = this.montoShipping.toFixed(2);
      let order = {
        payment_method: this.payment.id,
        payment_method_title: this.payment.title,
        set_paid: true,
        status: "on-hold",
        billing: this.billing,
        shipping: this.shipping,
        line_items: orderProducts,
        shipping_lines: [
          {
            method_id: method.id,
            method_title: method.title,
            total: `${montoEnvio}`
          }
        ]
      };
      console.log(order);
      let result: any = await this.wc.createOrder(order);
      console.log(result);
      this.carrito.resetCart();
      this.common.hideLoader();
      this.common.showAlert(
        `Orden creada exitosamente. El número de referencia de la orden es ${result.number}. Anótelo en un lugar seguro porque lo necesitará más adelante.`
      );
      this.router.navigateByUrl("/");
    } catch (e) {
      this.common.hideLoader();
      this.common.showAlert(
        "Ocurrio un error inesperado, por favor revise el formulario e intente de nuevo."
      );
      console.log(e.toString());
    }
  }
}
