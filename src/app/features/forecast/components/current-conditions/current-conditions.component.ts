import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
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
    this.weatherService.getCurrentConditions();
  }

  getCurrentConditions() {
    return this.weatherService.getCurrentConditions();
  }

  showForecast(zipCode: string) {
    this.router.navigate(["/forecast", zipCode]);
  }
}
