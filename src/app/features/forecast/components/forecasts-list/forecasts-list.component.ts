import { Component } from "@angular/core";

import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { WeatherService } from "../../services";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
})
export class ForecastsListComponent {
  zipCode: string;
  forecast$;

  constructor(private weatherService: WeatherService, route: ActivatedRoute) {
    this.forecast$ = route.params
      .pipe(
        tap((params) => (this.zipCode = params["zipcode"])),
        switchMap((params) => {
          return this.weatherService.getForecast(this.zipCode);
        })
      )
      .subscribe();
  }
}



