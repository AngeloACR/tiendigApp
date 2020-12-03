import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonService } from "../../services/common.service";
import { WoocommerceService } from "../../services/woocommerce.service";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  register: FormGroup;

  constructor(
    private auth: AuthService,
    private common: CommonService,
    private wc: WoocommerceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.register = new FormGroup({
      username: new FormControl(""),
      email: new FormControl(""),
      first_name: new FormControl(""),
      last_name: new FormControl(""),
      password: new FormControl("")
    });
  }

  get fRegister() {
    return this.register.controls;
  }

  login() {
    this.router.navigateByUrl("/login");
  }
  async registerUser() {
    try {
      console.log(this.catchUserErrors());
      if (this.catchUserErrors()) {
        let errorMsg =
          "Algunos campos son inválidos. Por favor, revise el formulario e intente de nuevo";
        this.common.showAlert(errorMsg);
      } else {
        var data = this.register.value;
        console.log(data)
        //await this.wc.createCustomer(data);
        this.common.showToast('Usuario creado exitosamente');
        this.router.navigateByUrl("/login");
      }
    } catch (e) {}
  }
  catchUserErrors() {
    console.log(this.fRegister);
    let aux1 = this.fRegister.username.errors
      ? this.fRegister.username.errors.required
      : false;
    let aux2 = this.fRegister.password.errors
      ? this.fRegister.password.errors.required
      : false;
    let error = aux1 || aux2;
    return false;
  }
}
