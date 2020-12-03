import { Component, OnInit } from "@angular/core";
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
  montoTotal: any;
  constructor(
    private wc: WoocommerceService,
    private carrito: CarritoService,
    private common: CommonService
  ) {}

  ngOnInit() {
    this.productos = this.carrito.productos;
    this.montoTotal = this.carrito.montoTotal;
  }
}
