import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, interval, Subject, throwError, zip } from "rxjs";
import {
  catchError,
  filter,
  mergeMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { BtnConfig } from "../../../../shared/models";
import { CONSTANTS } from "../../../../shared/utils/constants";
import { ConditionParams } from "../../models";
import { LocationService, WeatherService } from "../../services";
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
  currentConditions = [];
  currentZipCode = "";
  currentCountryCode = "";

  loading = false;

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
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

    interval(CONSTANTS.POLLING_INTERVAL)
      .pipe(
        mergeMap(() => this.weatherService.pollingWeatherConditions$),
        takeUntil(this.stopPolling$)
      )
      .subscribe((weatherConditions) => {
        console.log("wether conditions", weatherConditions);
        this.currentConditions.push({
          data: weatherConditions,
          zip: this.currentZipCode,
          countryCode: this.currentCountryCode,
          /*     imageSrc: this.weatherService.getWeatherIcon(
            weatherConditions.weather[0].id
          ), */
        });
      });
  }

  setBtnState(config: BtnConfig): void {
    this.currentBtnConfig = config;
  }

  syncSearchWeatherParams$() {
    const id = uuidv4();
    zip(
      this.zipCodeSelect$,
      this.countryCodeSelect$,
      this.btnClickedObservable$
    )
      .pipe(
        takeUntil(this.stopListen$),
        catchError((err) => {
          return throwError(err);
        }),
        filter((results) => results[0] !== "" || results[1] !== ""),
        tap((value) => {
          this.locationService.addLocation({
            zipCode: value[0],
            countryCode: value[1],
            uid: id,
          } as ConditionParams);
        }),
        mergeMap((results) =>
          this.weatherService.getCurrentConditionsApiCall({
            zipCode: results[0],
            countryCode: results[1],
          } as ConditionParams)
        ),
        takeUntil(this.stopListen$)
      )
      .subscribe((currentWeather) => {
        this.currentConditions.push({
          id: id,
          data: currentWeather,
          zip: this.currentZipCode,
          countryCode: this.currentCountryCode,
          imageSrc: this.weatherService.getWeatherIcon(
            currentWeather.weather[0].id
          ),
        });
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

  resetBtnDefaultState() {
    interval(CONSTANTS.RESET_TIME)
      .pipe(
        take(1),
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
  }

  ngOnDestroy() {
    this.stopPolling$.next();
    this.stopPolling$.complete();

    this.stopListen$.next();
    this.stopListen$.complete();
  }
}
