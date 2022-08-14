import { Injectable, OnDestroy } from "@angular/core";
import { from, Observable, Subject, throwError } from "rxjs";

import { HttpClient } from "@angular/common/http";

import { catchError, concatMap } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { ConditionParams, Weather } from "../models";

@Injectable()
export class WeatherService implements OnDestroy {
  stopPolling$ = new Subject();
  pollingWeatherConditions$;
  private currentConditions = [];
  constructor(private http: HttpClient) {
    this.pollingWeatherConditions$ = from(this.currentConditions).pipe(
      concatMap((val) => {
        return this.getCurrentConditionsApiCall(val);
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getCurrentConditionsApiCall(
    conditionSearchParams: ConditionParams
  ): Observable<Weather> {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    const zipParams =
      conditionSearchParams.zipCode != ""
        ? `zip=${conditionSearchParams.zipCode}`
        : "";
    const countryParams =
      conditionSearchParams.countryCode != ""
        ? `,${conditionSearchParams.countryCode}`
        : "";

    return this.http.get<Weather>(
      `${environment.API_URL}/weather?${zipParams}${countryParams}&units=imperial&APPID=${environment.APPID}`
    );
  }

  addSavedWeatherCondition(conditionParams: ConditionParams) {
    this.currentConditions.push(conditionParams);
  }

  removeCurrentConditions(uid: string) {
    for (let i in this.currentConditions) {
      if (this.currentConditions[i].uid === uid)
        this.currentConditions.splice(+i, 1);
    }
  }

  getForecast(zipCode: string, countryCode: string): Observable<Weather[]> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Weather[]>(
      `${environment.API_URL}/forecast/daily?zip=${zipCode},${countryCode}&units=imperial&cnt=5&APPID=${environment.APPID}`
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

  ngOnDestroy() {
    this.stopPolling$.next();
    this.stopPolling$.complete();
  }
}
