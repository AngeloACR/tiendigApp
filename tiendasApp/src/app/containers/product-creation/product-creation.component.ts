import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { ProductsService } from "../../services/products.service";
import { WoocommerceService } from "../../services/woocommerce.service";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-product-creation",
  templateUrl: "./product-creation.component.html",
  styleUrls: ["./product-creation.component.scss"]
})
export class ProductCreationComponent implements OnInit {
  tags: any;
  cats: any;
  product: FormGroup;

  constructor(
    private common: CommonService,
    private products: ProductsService,
    private wc: WoocommerceService
  ) {
    this.initForm();
  }

  initForm() {
    this.product = new FormGroup({
      name: new FormControl("", Validators.required),
      regular_price: new FormControl("", Validators.required),
      description: new FormControl(""),
      categories: new FormArray([]),
      tags: new FormArray([])
    });
  }

  async ionViewDidEnter() {
    await this.common.showLoader();
    this.tags = await this.wc.getTags();
    this.cats = await this.wc.getCategories();
    this.common.hideLoader();
  }

  ngOnInit() {}

  async createProduct() {
    try {
      await this.common.showLoader();
      let productAux = this.product.value;
      let catsAux = productAux.categories;
      let tagsAux = productAux.tags;
      let categories = [];
      catsAux.forEach(cat => {
        let aux = {
          id: cat
        };
        categories.push(aux);
      });
      let tags = [];
      tagsAux.forEach(tag => {
        let aux = {
          id: tag
        };
        tags.push(aux);
      });
      let product = {
        name: productAux.name,
        type: "simple",
        status: "publish",
        regular_price: productAux.regular_price.toString(),
        description: productAux.description,
        categories,
        tags,

        in_stock: true
      };
      let data = await this.products.createProduct(product);
      this.common.hideLoader();
      this.common.showToast("Producto creado exitosamente");
    } catch (e) {
      this.common.hideLoader();
      this.common.showToast("Hubo un error creando el producto");
    }
  }

  onCatChange(event) {
    const formArray: FormArray = this.product.get("categories") as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  onTagChange(event) {
    const formArray: FormArray = this.product.get("tags") as FormArray;
    console.log("here");
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }
}
