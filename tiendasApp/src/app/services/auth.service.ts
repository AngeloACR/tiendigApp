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
    let authString = `${data.username}:${data.password}`;
    let authEncode = btoa(authString);
    let authToken = `Basic ${authEncode}`;

    let info: any = await this.getProducts(authToken);
    if (info.status) {
      this.storeData(authToken);
    }
    return info;
  }

  getProducts(token) {
    let headers = this.getHeaders(token);
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
            info = {
              status: true
            };
          }
          resolve(info);
        });
    });
  }

  storeData(token) {
    this.storage.set("token", token);
    this.storage.set("isLogged", true);
  }

  async getToken() {
    let token = await this.storage.get("token");
    return token;
  }
}
