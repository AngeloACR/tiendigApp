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
  selector: "app-payment-gateways",
  templateUrl: "./payment-gateways.component.html",
  styleUrls: ["./payment-gateways.component.scss"]
})
export class PaymentGatewaysComponent implements OnInit {
  paymentMethod: FormGroup;
  @Input() payments: any;
  @Output() data = new EventEmitter<any>();
  constructor(private wc: WoocommerceService, private common: CommonService) {}

  async ngOnInit() {
    console.log("Payment here");
    this.paymentMethod = new FormGroup({
      method: new FormControl("")
    });
  }

  sendValue() {
    let value = this.paymentMethod.value;
    let paymentSelected = this.payments[value.method];
    this.data.emit(paymentSelected);
  }
}
