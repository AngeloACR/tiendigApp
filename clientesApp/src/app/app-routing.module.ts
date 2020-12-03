import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { SplashComponent } from "./containers/splash/splash.component";
import { CheckoutComponent } from "./containers/checkout/checkout.component";
import { LoginComponent } from "./containers/login/login.component";
import { RegisterComponent } from "./containers/register/register.component";
const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./tabs/tabs.module").then(m => m.TabsPageModule)
  },
  {
    path: "splash",
    component: SplashComponent
  },
  {
    path: "checkout",
    component: CheckoutComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "registro",
    component: RegisterComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
