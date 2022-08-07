import { Component, OnDestroy, OnInit } from "@angular/core";
import { interval, Subject, throwError, zip } from "rxjs";
import {
  catchError,
  startWith,
  switchMap,
  takeUntil,
  tap,
  skipWhile,
  take,
  delay,
  retryWhen,
} from "rxjs/operators";
import { BtnConfig } from "../../../../shared/models";
import { CONSTANTS } from "../../../../shared/utils/constants";
import { WeatherService } from "../../services";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent implements OnInit, OnDestroy {
  private stopPolling = new Subject();
  pollingConditions$;
  zipCodeSelect$;
  countryCodeSelect$;
  listen$;
  currentZipCode = "12161";
  currentCountryCode = "25000";
  currentConditions = [];
  loading = false;
  currentBtnConfig: BtnConfig = {
    label: "test <span class='btn-label'><i class='fa fa-check'></i> </span>",
    btnClass: "btn btn-success",
    isDisabled: true,
    isLoading: false,
  };

  constructor(private weatherService: WeatherService) {
    this.listen$ = zip(this.zipCodeSelect$, this.countryCodeSelect$).pipe(
      tap(() => console.log),
      takeUntil(this.stopPolling),
      catchError((err) => {
        return throwError(err);
      })
    );
    /*   .subscribe((results) => {
        console.log(results);
      }); */
  }

  ngOnInit(): void {
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
          console.log("err", err);
          // this.loading = false;
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
