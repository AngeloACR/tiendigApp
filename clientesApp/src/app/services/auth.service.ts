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
    return headers;
  }

  async login(data) {
    this.storeData(data);
  }

  async getStatus() {
    let isLogged = await this.storage.get("isLogged");
    return isLogged;
  }

  storeData(data) {
    this.storage.set("customerId", data);
    this.storage.set("isLogged", true);
  }

  async logout() {
    try {
      console.log("login out");
      await this.storage.clear();
      localStorage.clear();
    } catch (error) {
      console.log(error.toString());
    }
  }
}
