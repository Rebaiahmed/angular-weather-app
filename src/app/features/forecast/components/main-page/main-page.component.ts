import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  BehaviorSubject,
  interval,
  Subject,
  throwError,
  timer,
  zip,
} from "rxjs";
import {
  catchError,
  skipWhile,
  startWith,
  switchMap,
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
  stopPolling$ = new Subject();
  stopListen$ = new Subject();
  btnClickedObservable$ = new BehaviorSubject(false);

  zipCodeSelect$ = this.foreCastQuery.zipCode$;
  countryCodeSelect$ = this.foreCastQuery.countryCode$;
  currentBtnConfig: BtnConfig;
  currentZipCode = "";
  currentCountryCode = "";
  currentConditions = [];
  loading = false;

  constructor(
    private weatherService: WeatherService,
    private foreCastQuery: ForeCastQuery
  ) {}

  ngOnInit(): void {
    this.setBtnState({
      label: "Add location",
      btnClass: "btn btn-primary",
      isDisabled: false,
      isLoading: false,
    });
    this.syncSearchWeatherParams$();
    this.pollingApiCall();
  }

  setBtnState(config: BtnConfig): void {
    this.currentBtnConfig = config;
  }

  syncSearchWeatherParams$() {
    zip(
      this.zipCodeSelect$,
      this.countryCodeSelect$,
      this.btnClickedObservable$
    )
      .pipe(
        takeUntil(this.stopListen$),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe((results) => {
        this.currentZipCode = results[0];
        this.currentCountryCode = results[1];
      });
  }

  btnClicked($event) {
    this.btnClickedObservable$.next(true);
    this.setBtnState({
      ...this.currentBtnConfig,
      label: "Adding ...",
      isDisabled: true,
      isLoading: true,
    });
  }

  pollingApiCall() {
    interval(CONSTANTS.POLLING_INTERVAL)
      .pipe(
        tap(() => {
          if (this.currentZipCode != "" && this.currentCountryCode != "")
            this.loading = true;
        }),
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
          this.loading = false;
          this.setBtnState({
            ...this.currentBtnConfig,
            isLoading: false,
            isDisabled: false,
          });
          return throwError(err);
        }),
        // retryWhen((error$) => error$.pipe(delay(1000), take(6))),
        takeUntil(this.stopPolling$)
      )
      .subscribe((currentWeather) => {
        this.loading = false;
        this.setBtnState({
          label: "Done",
          btnClass: "btn btn-success",
          isDisabled: false,
          isLoading: false,
        });
        this.currentConditions = [
          {
            data: currentWeather,
            zip: this.currentZipCode,
            countryCode: this.currentCountryCode,
            imageSrc: this.weatherService.getWeatherIcon(
              currentWeather.weather[0].id
            ),
          },
        ];

        timer(CONSTANTS.RESET_TIMER)
          .pipe(
            tap(() => {
              this.setBtnState({
                label: "Add location",
                btnClass: "btn btn-primary",
                isDisabled: false,
                isLoading: false,
              });
            })
          )
          .subscribe();
      });
  }

  ngOnDestroy() {
    this.stopPolling$.next();
    this.stopPolling$.complete();

    this.stopListen$.next();
    this.stopListen$.complete();
  }
}
