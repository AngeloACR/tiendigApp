import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private storage: Storage, private http: HttpClient) {}

  getHeaders(token) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Authorization", token);
    return headers;
  }

  async login(data) {
    let info: any = await this.getProducts(data);
    if (info.status) {
      this.storeData(data, info.products);
    }
  }

  getProducts(data) {
    let authString = `${data.username}:${data.password}`;
    let authEncode = btoa(authString);
    let authToken = `Basic ${authEncode}`;
    let headers = this.getHeaders(authToken);
    let address = "https://tiendig.com/wp-json/dokan/v1/products/";
    return new Promise((resolve, reject) => {
      this.http
        .get(address, { headers: headers })
        .subscribe((productsData: any) => {
          let info;
          if (productsData.code) {
            info = {
              status: false
            };
          } else {
            let products = this.parseProducts(productsData);
            info = {
              status: true,
              products: products
            };
          }
          resolve(info);
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

  storeData(data, products) {
    let authString = `${data.username}:${data.password}`;
    let authEncode = btoa(authString);
    let authToken = `Basic ${authEncode}`;
    let productsAux = JSON.stringify(products);
    this.storage.set("token", authToken);
    this.storage.set("products", productsAux);
  }

  async getToken() {
    let token = await this.storage.get("token");
  }
}
