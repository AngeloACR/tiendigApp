import { Component, OnInit } from "@angular/core";
import { Router, ɵangular_packages_router_router_o } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-splash",
  templateUrl: "./splash.component.html",
  styleUrls: ["./splash.component.scss"]
})
export class SplashComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private common: CommonService
  ) {}

  async ngOnInit() {
    setTimeout(async () => {
      let isLogged = await this.auth.getStatus();
      if (isLogged) {
        this.router.navigateByUrl("/");
      } else {
        this.router.navigateByUrl("/login");
      }
    }, 4000);
  }
}
