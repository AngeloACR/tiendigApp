import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild
} from "@angular/core";
import { IonSlides } from "@ionic/angular";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"]
})
export class ProductDetailComponent implements OnInit {
  @Input() product: any;
  @Input() currencySymbol: any;

  @Output() addToCart = new EventEmitter<any>();
  @ViewChild("slideWithNav", { static: false }) slideWithNav: IonSlides;
  imgSlider: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    centeredSlides: true,
    effect: "slide"
  };
  images: any;
  constructor() {}

  ionViewDidEnter() {
    this.initSlider();
    console.log(this.product);
  }

  ngOnInit() {
    this.initSlider();
    console.log(this.product);
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement
      .textContent;
  }

  addProduct() {
    this.addToCart.emit(this.product);
  }

  initSlider() {
    let imgs = [];
    this.product.images.forEach(image => {
      imgs.push(image.src);
    });
    console.log(imgs);
    this.imgSlider = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: imgs
    };
  }
}
