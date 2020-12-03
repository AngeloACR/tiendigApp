import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {AuthService} from '../../services/auth.service'
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {}

  goToCarrito() {
    this.router.navigateByUrl("/cart");
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl("/login");
  }

}
