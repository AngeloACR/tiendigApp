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
  selector: "app-shipping",
  templateUrl: "./shipping.component.html",
  styleUrls: ["./shipping.component.scss"]
})
export class ShippingComponent implements OnInit {
  shipping: FormGroup;
  @Output() data = new EventEmitter<any>();
  constructor(
    private auth: AuthService,
    private common: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("Shipping here");
    this.shipping = new FormGroup({
      first_name: new FormControl(""),
      last_name: new FormControl(""),
      company: new FormControl(""),
      address_1: new FormControl(""),
      address_2: new FormControl(""),
      city: new FormControl(""),
      state: new FormControl(""),
      postcode: new FormControl(""),
      country: new FormControl("")
    });
  }

  get fShipping() {
    return this.shipping.controls;
  }

  sendShipping() {
    if (this.catchErrors()) {
      let errorMsg =
        "Algunos campos son inválidos. Por favor, revise el formulario e intente de nuevo";
      this.common.showAlert(errorMsg);
    } else {
      var data = this.shipping.value;
    }
  }

  sendValue() {
    let value = this.shipping.value;
    this.data.emit(value);
  }
  catchErrors() {
    let aux1 = this.fShipping.postcode.errors
      ? this.fShipping.postcode.errors.required
      : false;
    let error = aux1;
    return error;
  }
}
