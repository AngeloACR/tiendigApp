import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-cart-totals",
  templateUrl: "./cart-totals.component.html",
  styleUrls: ["./cart-totals.component.scss"]
})
export class CartTotalsComponent implements OnInit {
  @Input() total: any;

  constructor() {}

  ngOnInit() {}
}
