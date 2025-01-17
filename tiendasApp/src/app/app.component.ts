import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { WoocommerceService } from "./services/woocommerce.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storage: Storage,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private wc: WoocommerceService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.storage.ready().then(async () => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.router.navigateByUrl("/splash");
        setTimeout(async () => {
          let isLogged = await this.storage.get("isLogged");
          console.log(isLogged);
          if (isLogged) {
            this.router.navigateByUrl("/");
          } else {
            this.router.navigateByUrl("/login");
          }
        }, 3000);
      });
    });
  }
}
