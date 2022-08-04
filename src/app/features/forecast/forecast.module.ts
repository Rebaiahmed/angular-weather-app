import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrentConditionsComponent } from "./components/current-conditions/current-conditions.component";
import { ForecastsListComponent } from "./components/forecasts-list/forecasts-list.component";
import { ZipcodeEntryComponent } from "./components/zipcode-entry/zipcode-entry.component";
import { RouterModule } from "@angular/router";
import { appRoutes } from "./forecast-routing.module";
import { LocationService, WeatherService } from "./services";
import { MainPageComponent } from "./components/main-page/main-page.component";
@NgModule({
  declarations: [
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(appRoutes)],
  providers: [LocationService, WeatherService],
  exports: [RouterModule],
})
export class ForecastModule {}
