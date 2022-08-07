import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
  {
    path: "forecast",
    loadChildren: () =>
      import("./features/forecast/forecast.module").then(
        (m) => m.ForecastModule
      ),
  },
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
