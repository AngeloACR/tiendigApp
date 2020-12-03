import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.scss"]
})
export class BillingComponent implements OnInit {
  billing: FormGroup;
  @Output() data = new EventEmitter<any>();
  constructor(
    private auth: AuthService,
    private common: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("Billing here");
    this.billing = new FormGroup({
      first_name: new FormControl(""),
      last_name: new FormControl(""),
      company: new FormControl(""),
      address_1: new FormControl(""),
      address_2: new FormControl(""),
      city: new FormControl(""),
      state: new FormControl(""),
      postcode: new FormControl(""),
      country: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl("")
    });
  }

  get fBilling() {
    return this.billing.controls;
  }

  sendBilling() {
    if (this.catchErrors()) {
      let errorMsg =
        "Algunos campos son inválidos. Por favor, revise el formulario e intente de nuevo";
      this.common.showAlert(errorMsg);
    } else {
      var data = this.billing.value;
    }
  }

  sendValue() {
    let value = this.billing.value;
    this.data.emit(value);
  }

  catchErrors() {
    let aux1 = this.fBilling.postcode.errors
      ? this.fBilling.postcode.errors.required
      : false;
    let error = aux1;
    return error;
  }
}
