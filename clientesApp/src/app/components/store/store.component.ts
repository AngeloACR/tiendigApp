import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";
import { CarritoService } from "../../services/carrito.service";
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { IonSlides } from "@ionic/angular";

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.scss"]
})
export class StoreComponent implements OnInit {
  @Input() category: any;
  @Input() products: any;
  productDetail: ProductDetailComponent;
  @ViewChild("productDetail", { static: false }) set content(
    content: ProductDetailComponent
  ) {
    if (content) {
      // initially setter gets called with undefined
      this.productDetail = content;
    }
  }
  currencySymbol: any;
  qtys: any = [];
  productSelected: any;
  indexSelected: any;
  isDetail: boolean = false;

  @ViewChild("slideWithNav", { static: false }) slideWithNav: IonSlides;
  imgSlider: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    centeredSlides: true,
    effect: "slide"
  };
  images: any;

  constructor(
    private wc: WoocommerceService,
    private carrito: CarritoService,
    private common: CommonService
  ) {}

  async ngOnInit() {
    await this.common.showLoader();
    this.currencySymbol = await this.wc.getCurrency();
    this.products.forEach(product => {
      this.qtys.push(1);
    });
    this.common.hideLoader();
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement
      .textContent;
  }
  async addToCart(event, product, index) {
    await this.common.showLoader();
    this.carrito.addItem(product, this.qtys[index]);
    this.common.hideLoader();
    this.common.showToast("Producto agregado al carrito exitosamente");
  }

  initSlider() {
    let imgs = [];
    this.productSelected.images.forEach(image => {
      imgs.push(image.src);
    });
    console.log(imgs);
    this.imgSlider = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: imgs
    };
  }

  async viewDetail(event, product, index) {
    await this.common.showLoader();
    this.indexSelected = index;
    console.log(product);
    this.productSelected = product;
    this.initSlider();
    this.isDetail = true;
    this.common.hideLoader();
  }

  backToStore() {
    this.isDetail = false;
  }

  async addFromDetail(data) {
    let product = data.product;
    let index = this.indexSelected;
    this.qtys[index] = data.qty;
    await this.addToCart("", product, index);
    this.isDetail = false;
  }
}
