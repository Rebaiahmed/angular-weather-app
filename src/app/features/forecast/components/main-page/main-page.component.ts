import { Component, OnDestroy } from "@angular/core";
import { interval, Subject, throwError, zip } from "rxjs";
import {
  catchError,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { BtnConfig } from "../../../../shared/models";
import { CONSTANTS } from "../../../../shared/utils/constants";
import { WeatherService } from "../../services";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent implements OnDestroy {
  private stopPolling = new Subject();
  pollingConditions$;
  zipCodeSelect$;
  countryCodeSelect$;
  listen$;
  currentZipCode = "";
  currentCountryCode = "";
  currentConditions = [];
  loading = false;
  currentBtnConfig: BtnConfig = {
    label: "test <span class='btn-label'><i class='fa fa-check'></i> </span>",
    btnClass: "btn btn-success",
    isDisabled: true,
    isLoading: false,
  };

  constructor(private weatherService: WeatherService) {
    this.listen$ = zip(this.zipCodeSelect$, this.countryCodeSelect$)
      .pipe(
        tap(() => {}),
        takeUntil(this.stopPolling),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe((results) => {
        console.log(results);
      });

    this.pollingConditions$ = interval(CONSTANTS.POLLING_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.weatherService.addCurrentConditions(
            this.currentZipCode,
            this.currentCountryCode
          )
        ),
        catchError((err) => {
          return throwError(err);
        }),
        takeUntil(this.stopPolling)
      )
      .subscribe((currentWeather) => {
        this.currentConditions = [
          {
            data: currentWeather,
            zip: this.currentZipCode,
          },
        ];
      });
  }

  ngOnDestroy() {
    this.stopPolling.next();
    this.stopPolling.complete();
  }
}
