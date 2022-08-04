import { Routes } from "@angular/router";
import { ForecastsListComponent } from "./components/forecasts-list/forecasts-list.component";
import { MainPageComponent } from "./components/main-page/main-page.component";


export const appRoutes: Routes = [
  {
    path: "",
    component: MainPageComponent,
  },
  {
    path: "forecast/:zipcode",
    component: ForecastsListComponent,
  },
];
