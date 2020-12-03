import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { WoocommerceService } from "../../services/woocommerce.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-categories-slider",
  templateUrl: "./categories-slider.component.html",
  styleUrls: ["./categories-slider.component.scss"]
})
export class CategoriesSliderComponent implements OnInit {
  @Input() categories: any;
  cat1: any;
  cat2: any;
  @Output() catSelected = new EventEmitter<any>();
  constructor(private router: Router, private wc: WoocommerceService) {}

  async ngOnInit() {
    let aux = this.categories.length % 2;
    this.cat1 = [];
    this.cat2 = [];
    let middle = (this.categories.length - aux) / 2;
    let auxCont = this.categories.length - 1;
    for (let i = 0; i < middle; i++) {
      this.cat1.push(this.categories[i]);
      this.cat2.unshift(this.categories[auxCont - i]);
    }
    if (aux) {
      this.cat1.push(this.categories[middle]);
    }
  }

  goToCategory(event, cat) {
    this.catSelected.emit(cat);
  }
}
