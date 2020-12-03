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

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  login: FormGroup;

  constructor(
    private auth: AuthService,
    private common: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.login = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }

  get fLogin() {
    return this.login.controls;
  }

  logUser() {
    if (this.catchUserErrors()) {
      let errorMsg =
        "Algunos campos son inválidos. Por favor, revise el formulario e intente de nuevo";
      this.common.showAlert(errorMsg);
    } else {
      var data = this.login.value;
      this.auth.login(
        data
      ); /* .subscribe((logData: any) => {
        if (!logData.status) {
          let errorMsg = logData.msg;
          this.common.showAlert(errorMsg);
        } else {
          this.auth.storeData(logData);
        }
      }); */
    }
  }
  catchUserErrors() {
    let aux1 = this.fLogin.username.errors
      ? this.fLogin.username.errors.required
      : false;
    let aux2 = this.fLogin.password.errors
      ? this.fLogin.password.errors.required
      : false;
    let error = aux1 || aux2;
    return error;
  }
}
