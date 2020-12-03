import { Component, OnInit } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  categories: any;
  categoriesReady: boolean = false;
  showStore: boolean = false;
  products: any;
  catSelected: any;
  constructor(
    private router: Router,
    private common: CommonService,
    private wc: WoocommerceService
  ) {}

  async ionicViewDidEnter() {
    await this.common.showLoader();
    this.categories = await this.wc.getCategories();
    if (this.categories.length) {
      this.categoriesReady = true;
      this.common.hideLoader();
    }
  }

  async ngOnInit() {
    await this.common.showLoader();
    this.categories = await this.wc.getCategories();
    if (this.categories.length) {
      this.categoriesReady = true;
      this.common.hideLoader();
    }
  }

  async openCategory(cat) {
    await this.common.showLoader();
    this.products = await this.wc.getProductsByCategory(cat.id);
    this.catSelected = cat.name;
    this.showStore = true;
    this.common.hideLoader();
  }
  backToHome() {
    this.showStore = false;
  }
}
