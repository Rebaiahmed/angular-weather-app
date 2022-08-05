import { Component } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { LocationService, WeatherService } from "../../services";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent {
  currentZipCode = "";
  currentConditions = [];

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    //here maybe refresh all zipcodes w dipalyehom!
  }

  getCurrentZipCode($event) {
    this.currentZipCode = $event;
    this.weatherService
      .addCurrentConditions(this.currentZipCode)
      .pipe(
        tap(console.log),
        map((condition) => {
          return {
            ...condition,
            imageSrc: this.weatherService.getWeatherIcon(
              condition.weather[0].id
            ),
            zipCode: this.currentZipCode,
          };
        })
      )
      .subscribe((currentWeather) => {
        this.currentConditions.push({
          data: currentWeather,
          zip: this.currentZipCode,
        });
      });
  }
}
