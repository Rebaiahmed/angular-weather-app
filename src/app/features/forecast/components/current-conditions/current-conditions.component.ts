import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Weather } from "../../models/weather";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
})
export class CurrentConditionsComponent implements OnInit {
  @Input() weatherConditions: Weather[] = [];
  constructor(private router: Router) {}

  ngOnInit() {}

  showForecast(location) {
    console.log(location);
    this.router.navigate([
      "/forecast",
      { zipCode: location.zip, countryCode: location.countryCode },
    ]);
  }
}
