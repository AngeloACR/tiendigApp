import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root"
})
export class ProductsService {
  constructor(private storage: Storage) {}

  async getToken() {
    let token = await this.storage.get("token");
    return token;
  }

  async getProducts() {
    let token = await this.storage.get("product");
    return token;
  }
}
