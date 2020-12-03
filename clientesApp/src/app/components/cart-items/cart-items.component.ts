import { Component, OnInit, Input } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-cart-items",
  templateUrl: "./cart-items.component.html",
  styleUrls: ["./cart-items.component.scss"]
})
export class CartItemsComponent implements OnInit {
  @Input() productos: any;
  @Input() currencySymbol: any;
  constructor(private wc: WoocommerceService, private common: CommonService) {}

  async ngOnInit() {}
}
