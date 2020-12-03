import { Component, OnInit, Input } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-cart-totals",
  templateUrl: "./cart-totals.component.html",
  styleUrls: ["./cart-totals.component.scss"]
})
export class CartTotalsComponent implements OnInit {
  @Input() subtotal: number;
  @Input() shipping: number;
  @Input() total: number;
  @Input() currencySymbol: number;
  constructor(private wc: WoocommerceService, private common: CommonService) {}

  async ngOnInit() {}
}
