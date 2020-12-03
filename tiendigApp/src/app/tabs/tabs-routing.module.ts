import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { HomeComponent } from "../containers/home/home.component";
import { CategoriesComponent } from "../containers/categories/categories.component";
import { BuscadorComponent } from "../containers/buscador/buscador.component";
import { SettingsComponent } from "../containers/settings/settings.component";
import { CartComponent } from "../containers/cart/cart.component";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "home",
        component: HomeComponent
      },
      {
        path: "categories",
        component: CategoriesComponent
      },
      {
        path: "buscador",
        component: BuscadorComponent
      },
      {
        path: "settings",
        component: SettingsComponent
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/home",
    pathMatch: "full"
  },
  {
    path: "cart",
    component: CartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
