import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BuscadorComponent } from "./containers/buscador/buscador.component";
import { CartComponent } from "./containers/cart/cart.component";
import { CategoriesComponent } from "./containers/categories/categories.component";
import { CheckoutComponent } from "./containers/checkout/checkout.component";
import { HomeComponent } from "./containers/home/home.component";
import { LoginComponent } from "./containers/login/login.component";
import { SplashComponent } from "./containers/splash/splash.component";
import { ConfirmationComponent } from "./containers/confirmation/confirmation.component";
import { RegisterComponent } from "./containers/register/register.component";

import { BillingComponent } from "./components/billing/billing.component";
import { ShippingComponent } from "./components/shipping/shipping.component";
import { CartItemsComponent } from "./components/cart-items/cart-items.component";
import { CartEmptyComponent } from "./components/cart-empty/cart-empty.component";
import { CartTotalsComponent } from "./components/cart-totals/cart-totals.component";
import { CategoriesSliderComponent } from "./components/categories-slider/categories-slider.component";
import { ConfirmationUploadComponent } from "./components/confirmation-upload/confirmation-upload.component";
import { PaymentGatewaysComponent } from "./components/payment-gateways/payment-gateways.component";
import { ProductsReviewComponent } from "./components/products-review/products-review.component";
import { ProductsSliderComponent } from "./components/products-slider/products-slider.component";
import { ShippingToolComponent } from "./components/shipping-tool/shipping-tool.component";
import { StoreComponent } from "./components/store/store.component";
import { HeaderComponent } from "./components/header/header.component";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BuscadorComponent,
    CartComponent,
    CategoriesComponent,
    CheckoutComponent,
    BillingComponent,
    HomeComponent,
    ShippingComponent,
    ConfirmationComponent,
    CartItemsComponent,
    SplashComponent,
    CartTotalsComponent,
    CategoriesSliderComponent,
    ConfirmationUploadComponent,
    PaymentGatewaysComponent,
    ProductsReviewComponent,
    ProductsSliderComponent,
    ShippingToolComponent,
    ProductDetailComponent,
    StoreComponent,
    CartEmptyComponent,
    HeaderComponent
  ],
  entryComponents: [
    BillingComponent,
    CartEmptyComponent,
    CategoriesSliderComponent,
    ShippingComponent,
    ConfirmationUploadComponent,
    PaymentGatewaysComponent,
    ProductDetailComponent,
    ProductsReviewComponent,
    CartItemsComponent,
    ConfirmationComponent,
    ProductsSliderComponent,
    ShippingToolComponent,
    CartTotalsComponent,
    StoreComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
