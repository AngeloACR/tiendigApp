import { Component, OnInit, Input } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";
import { CarritoService } from "../../services/carrito.service";

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.scss"]
})
export class StoreComponent implements OnInit {
  @Input() category: any;
  @Input() products: any;
  currencySymbol: any;
  qtys: any = [];
  constructor(
    private wc: WoocommerceService,
    private carrito: CarritoService,
    private common: CommonService
  ) {}

  async ngOnInit() {
    await this.common.showLoader();
    this.currencySymbol = await this.wc.getCurrency();
    this.products.forEach(product => {
      this.qtys.push(1);
    });
    this.common.hideLoader();
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement
      .textContent;
  }
  addToCart(event, product, index) {
    this.carrito.addItem(product, this.qtys[index]);
  }
}
