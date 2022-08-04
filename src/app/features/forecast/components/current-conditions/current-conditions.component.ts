import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocationService, WeatherService } from "../../services";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
})
export class CurrentConditionsComponent implements OnInit {
  currentConditions: any[];
  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentConditions = this.weatherService
      .getCurrentConditions()
      .map((location) => {
        return {
          ...location,
          imageSrc: this.weatherService.getWeatherIcon(
            location.data.weather[0].id
          ),
        };
      });
    console.log("sshs", this.currentConditions);
  }

  showForecast(zipCode: string) {
    this.router.navigate(["/forecast", zipCode]);
  }
}
