import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-shipping-tool",
  templateUrl: "./shipping-tool.component.html",
  styleUrls: ["./shipping-tool.component.scss"]
})
export class ShippingToolComponent implements OnInit {
  shippingMethod: FormGroup;
  @Input() methods: any;
  @Output() data = new EventEmitter<any>();
  constructor(private wc: WoocommerceService, private common: CommonService) {}

  async ngOnInit() {
    console.log("Shipping here");
    this.shippingMethod = new FormGroup({
      method: new FormControl("")
    });
  }

  sendValue() {
    let value = this.shippingMethod.value;
    console.log(value);
    let methodSelected = this.methods[value.method];
    this.data.emit(methodSelected);
  }
}
