import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { CommonService } from "../../services/common.service";
import { ProductsService } from "../../services/products.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  products: any;

  constructor(
    private storage: Storage,
    private common: CommonService,
    private ps: ProductsService
  ) {}

  async ionViewDidEnter() {
    await this.common.showLoader();
    this.products = await this.ps.getProducts();
    console.log(this.products);
    this.common.hideLoader();
  }

  ngOnInit() {}
}
