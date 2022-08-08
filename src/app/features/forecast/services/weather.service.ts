import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";

import { environment } from "../../../../environments/environment";
import { Weather } from "../models";

@Injectable()
export class WeatherService {
  private currentConditions = [];
  currentConditions$;
  constructor(private http: HttpClient) {}

  addCurrentConditions(
    zipcode: string,
    countryCode: string
  ): Observable<Weather> {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Weather>(
      `${environment.API_URL}/weather?zip=${zipcode},${countryCode}&units=imperial&APPID=${environment.APPID}`
    );
  }

  removeCurrentConditions(zipCode: string) {
    for (let i in this.currentConditions) {
      if (this.currentConditions[i].zip == zipCode)
        this.currentConditions.splice(+i, 1);
    }
  }

  getCurrentConditions(): any[] {
    return this.currentConditions;
  }

  getForecast(zipCode: string, countryCode: string): Observable<Weather[]> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Weather[]>(
      `${environment.API_URL}/forecast/daily?zip=${zipCode},${countryCode}us&units=imperial&cnt=5&APPID=${environment.APPID}`
    );
  }

  getWeatherIcon(id) {
    if (id >= 200 && id <= 232) return environment.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return environment.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return environment.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return environment.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return environment.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return environment.ICON_URL + "art_fog.png";
    else return environment.ICON_URL + "art_clear.png";
  }
}
