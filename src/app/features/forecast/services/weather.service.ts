import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";

import { environment } from "../../../../environments/environment";

@Injectable()
export class WeatherService {
  constructor(private http: HttpClient) {}

  addCurrentConditions(zipcode: string): void {
    // Here we make a request to get the curretn conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get(
      `${environment.API_URL}/weather?zip=${zipcode},us&units=imperial&APPID=${environment.APPID}`
    );
  }

  removeCurrentConditions(zipcode: string) {
    /*  for (let i in this.currentConditions) {
      if (this.currentConditions[i].zip == zipcode)
        this.currentConditions.splice(+i, 1);
    } */
  }

  getCurrentConditions(): any[] {
    /*   return this.currentConditions; */
    return null;
  }

  getForecast(zipcode: string): Observable<any> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get(
      `${environment.API_URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${environment.APPID}`
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
