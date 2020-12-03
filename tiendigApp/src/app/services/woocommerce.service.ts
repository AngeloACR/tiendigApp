import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

//https://woocommerce.github.io/woocommerce-rest-api-docs/?shell#introduction
/*
    headers: {
        'Authorization': 'Basic ' + btoa('consumer_key:consumer_secret')
    }
*/
@Injectable({
  providedIn: "root"
})
export class WoocommerceService {
  consumerKey: string = "ck_b1a4cbfb5ef4d71e4e1c76e842fa835c4a6d57f6";
  consumerSecret: string = "cs_eed45dd875e38a39797f6613e3ed6fd2b1503c36";
  authString: string = `${this.consumerKey}:${this.consumerSecret}`;
  authEncode: string = btoa(this.authString);
  authToken = `Basic ${this.authEncode}`;
  url = "https://tiendig.com/";

  constructor(private http: HttpClient) {}

  getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Authorization", this.authToken);
    return headers;
  }

  async getCategories() {
    let headers = this.getHeaders();
    let endpoint = "wp-json/wc/v3/products/categories?per_page=100";
    let address = this.url + endpoint;

    return new Promise((resolve, reject) => {
      this.http.get(address, { headers: headers }).subscribe((data: any) => {
        let categories = this.parseCategories(data);
        resolve(categories);
      });
    });
  }
  async getProducts() {
    let headers = this.getHeaders();
    let endpoint = "wp-json/wc/v3/products?per_page=20";
    let address = this.url + endpoint;

    return new Promise((resolve, reject) => {
      this.http.get(address, { headers: headers }).subscribe((data: any) => {
        let products = this.parseProducts(data);
        resolve(products);
      });
    });
  }

  parseProducts(data) {
    let products = [];
    data.forEach(element => {
      let product = {
        id: element.id,
        price: element.price,
        regular_price: element.regular_price,
        name: element.name,
        categories: element.categories,
        description: element.description,
        images: element.images,
        stock_status: element.stock_status,
        store: element.store,
        virtual: element.virtual,
        downloadable: element.downloadable
      };
      products.push(product);
    });
    return products;
  }

  parseCategories(data) {
    let categories = [];
    data.forEach(element => {
      let category = {
        id: element.id,
        name: element.name,
        description: element.description,
        //        images: ["assets/image/logo.png"],
        images: element.image,
        slug: element.slug
      };
      categories.push(category);
    });
    return categories;
  }

  async getProductsByCategory(category) {
    let headers = this.getHeaders();
    let endpoint = `wp-json/wc/v3/products?per_page=50&category=${category}`;
    let address = this.url + endpoint;

    return new Promise((resolve, reject) => {
      this.http.get(address, { headers: headers }).subscribe((data: any) => {
        let products = this.parseProducts(data);
        resolve(products);
      });
    });
  }
  async getPaymentGateways() {
    let headers = this.getHeaders();
    let endpoint = `wp-json/wc/v3/payment_gateways?per_page=100`;
    let address = this.url + endpoint;

    return new Promise((resolve, reject) => {
      this.http.get(address, { headers: headers }).subscribe((data: any) => {
        resolve(data);
      });
    });
  }
  async getShippingZones() {
    let headers = this.getHeaders();
    let endpoint = `wp-json/wc/v3/shipping/zones`;
    let address = this.url + endpoint;

    return new Promise((resolve, reject) => {
      this.http.get(address, { headers: headers }).subscribe((data: any) => {
        resolve(data);
      });
    });
  }
  async getShippingZonesMethods(id) {
    let headers = this.getHeaders();
    let endpoint = `wp-json/wc/v3/shipping/zones/${id}/methods`;
    let address = this.url + endpoint;

    return new Promise((resolve, reject) => {
      this.http.get(address, { headers: headers }).subscribe((data: any) => {
        resolve(data);
      });
    });
  }
  async getCurrency() {
    let headers = this.getHeaders();
    let endpoint = `wp-json/wc/v3/system_status`;
    let address = this.url + endpoint;

    return new Promise((resolve, reject) => {
      this.http.get(address, { headers: headers }).subscribe((data: any) => {
        resolve(data.settings.currency_symbol);
      });
    });
  }
}
