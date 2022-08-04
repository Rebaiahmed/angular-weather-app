import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrentConditionsComponent } from "./current-conditions/current-conditions.component";
import { ForecastsListComponent } from "./forecasts-list/forecasts-list.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { ZipcodeEntryComponent } from "./zipcode-entry/zipcode-entry.component";
import { RouterModule } from "@angular/router";
import { appRoutes } from "./forecast-routing.module";
@NgModule({
  declarations: [
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class ForecastModule {}
