import { Component, OnDestroy, OnInit } from "@angular/core";
import { interval, Subject, throwError, zip } from "rxjs";
import {
  catchError,
  delay,
  retryWhen,
  skipWhile,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { BtnConfig } from "../../../../shared/models";
import { CONSTANTS } from "../../../../shared/utils/constants";
import { WeatherService } from "../../services";
import { ForeCastQuery } from "../../state/forecast.store.query";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent implements OnInit, OnDestroy {
  private stopPolling = new Subject();
  pollingConditions$;
  listen$;
  currentBtnConfig: BtnConfig = {
    label: "test <span class='btn-label'><i class='fa fa-check'></i> </span>",
    btnClass: "btn btn-success",
    isDisabled: false,
    isLoading: false,
  };

  currentZipCode = "";
  currentCountryCode = "";
  currentConditions = [];
  loading = false;

  zipCodeSelect$ = this.foreCastQuery.zipCode$;
  countryCodeSelect$ = this.foreCastQuery.countryCode$;

  constructor(
    private weatherService: WeatherService,
    private foreCastQuery: ForeCastQuery
  ) {}

  ngOnInit(): void {
    this.listen$ = zip(this.zipCodeSelect$, this.countryCodeSelect$)
      .pipe(
        tap(() => console.log),
        takeUntil(this.stopPolling),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe((results) => {
        console.log(results);
        this.currentZipCode = results[0];
        this.currentCountryCode = results[1];
      });

    this.pollingApiCall();
  }

  pollingApiCall() {
    this.pollingConditions$ = interval(CONSTANTS.POLLING_INTERVAL)
      .pipe(
        tap(() => (this.loading = true)),
        startWith(0),
        skipWhile(
          () => this.currentZipCode == "" && this.currentCountryCode == ""
        ),
        switchMap(() =>
          this.weatherService.addCurrentConditions(
            this.currentZipCode,
            this.currentCountryCode
          )
        ),
        catchError((err) => {
          return throwError(err);
        }),
        retryWhen((error$) => error$.pipe(delay(1000), take(6))),
        takeUntil(this.stopPolling)
      )
      .subscribe((currentWeather) => {
        this.loading = false;
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
