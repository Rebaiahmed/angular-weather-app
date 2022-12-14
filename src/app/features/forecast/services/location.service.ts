import { Injectable } from "@angular/core";
import { ConditionParams } from "../models";
import { WeatherService } from "./weather.service";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  locations: ConditionParams[] = [];

  constructor(private weatherService: WeatherService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations = JSON.parse(locString);
    for (let loc of this.locations)
      this.weatherService.addSavedWeatherCondition(loc);
  }

  addLocation(conditionParams: ConditionParams) {
    this.locations.push(conditionParams);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
  }

  removeLocation(conditionParams: ConditionParams) {
    let index = this.locations.findIndex(
      (value) => value.id == conditionParams.id
    );
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}
