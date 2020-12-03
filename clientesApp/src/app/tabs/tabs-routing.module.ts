import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { HomeComponent } from "../containers/home/home.component";
import { CategoriesComponent } from "../containers/categories/categories.component";
import { CartComponent } from "../containers/cart/cart.component";
import { ConfirmationComponent } from "../containers/confirmation/confirmation.component";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "categories",
        component: CategoriesComponent
      },
      {
        path: "cart",
        component: CartComponent
      },
      {
        path: "confirmation",
        component: ConfirmationComponent
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/categories",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
