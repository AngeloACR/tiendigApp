import { Component, OnInit } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {
  categories: any;
  categoriesReady: boolean = false;
  showCatList: boolean = true;
  showStore: boolean = false;
  catSelected: any;
  products: any;
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

  async openCategory(event, cat) {
    await this.common.showLoader();
    this.products = await this.wc.getProductsByCategory(cat.id);
    this.showCatList = false;
    this.catSelected = cat.name;
    this.showStore = true;
    this.common.hideLoader();
  }
  backToCat() {
    this.showStore = false;
    this.showCatList = true;
  }
}
