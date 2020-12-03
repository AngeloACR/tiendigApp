import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ProductsService {
  url = "https://tiendig.com/";
  constructor(private storage: Storage, private http: HttpClient) {}

  async getToken() {
    let token = await this.storage.get("token");
    return token;
  }

  async getProducts() {
    let token = await this.getToken();
    let headers = this.getHeaders(token);
    let address = "https://tiendig.com/wp-json/dokan/v1/products/";
    return new Promise((resolve, reject) => {
      this.http
        .get(address, { headers: headers })
        .subscribe((productsData: any) => {
          let products = this.parseProducts(productsData);
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
        virtual: element.virtual,
        downloadable: element.downloadable
      };
      products.push(product);
    });
    return products;
  }
  getHeaders(token) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Authorization", token);
    return headers;
  }

  async createProduct(data) {
    let token = await this.getToken();
    let headers = this.getHeaders(token);
    let endpoint = "wp-json/dokan/v1/products/";
    let address = this.url + endpoint;

    return new Promise((resolve, reject) => {
      this.http
        .post(address, data, { headers: headers })
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
}
