import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";
import { CarritoService } from "../../services/carrito.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {
  productos: any;
  montoTotal: number;
  montoSubtotal: number;
  montoShipping: number = 0;
  currencySymbol: any;
  shippingMethods: any;
  cartEmpty: boolean = true;
  totalsReady: boolean = false;
  constructor(
    private wc: WoocommerceService,
    private router: Router,
    private carrito: CarritoService,
    private common: CommonService
  ) {}

  async ionViewDidEnter() {
    await this.common.showLoader();

    this.productos = await this.carrito.getCart();
    if (this.productos && this.productos.length) {
      this.cartEmpty = false;
      this.montoSubtotal = await this.carrito.getMontoSubtotal();
      this.montoTotal = await this.carrito.getMontoTotal();
      this.shippingMethods = await this.wc.getShippingMethods();
      this.currencySymbol = await this.wc.getCurrency();
      this.currencySymbol = this.toHTML(this.currencySymbol);
      this.totalsReady = true;
    }
    this.common.hideLoader();
  }

  async ngOnInit() {}
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement
      .textContent;
  }

  async handleShippingMethod(data) {
    if (data.id == "delivery") {
      this.montoShipping = 1;
    } else {
      this.montoShipping = 0;
    }
    await this.carrito.setShipping(this.montoShipping, data);
    this.montoTotal = await this.carrito.getMontoTotal();
  }

  goToCheckout() {
    if (this.carrito.method) {
      this.router.navigateByUrl("/checkout");
    } else {
      this.common.showAlert("Por favor seleccione un método de envío");
    }
  }
}
