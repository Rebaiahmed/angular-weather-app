import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  BehaviorSubject,
  EMPTY,
  interval,
  Subject,
  throwError,
  timer,
  zip,
} from "rxjs";
import {
  catchError,
  filter,
  mergeMap,
  retry,
  takeUntil,
  tap,
  take,
} from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { BtnConfig, Status } from "../../../../shared/models";
import { CONSTANTS } from "../../../../shared/utils/constants";
import { ConditionParams, Weather } from "../../models";
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
      btnClass: "btn btn-primary",
      isLoading: false,
      status: Status.Initial,
    });
    this.syncSearchWeatherParams$();

    this.refreshExistingWeatherData();
  }

  refreshExistingWeatherData() {
    interval(CONSTANTS.POLLING_INTERVAL)
      .pipe(
        mergeMap(() => this.weatherService.pollingWeatherConditions$),
        takeUntil(this.stopPolling$),
        retry(3),
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe((weatherConditions: Weather) => {
        this.setNewData(weatherConditions);
      });
  }

  setNewData(weatherConditions: Weather) {
    const objIndex = this.currentConditions.findIndex(
      (obj) => obj.data.name == weatherConditions.name
    );
    if (objIndex != -1) {
      this.currentConditions[objIndex].data = weatherConditions;
    } else {
      this.currentConditions.push({
        data: weatherConditions,
        zip: this.currentZipCode,
        countryCode: this.currentCountryCode,
        imageSrc: this.weatherService.getWeatherIcon(
          weatherConditions.weather[0].id
        ),
      });
    }
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
          this.currentZipCode = value[0];
          this.currentCountryCode = value[1];
          this.setBtnState({
            btnClass: "btn btn-primary",
            isLoading: true,
            status: Status.Loading,
          });
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
        this.setBtnState({
          btnClass: "btn btn-success",
          isLoading: false,
          status: Status.Done,
        });
        timer(CONSTANTS.RESET_TIME)
          .pipe(takeUntil(this.stopListen$))
          .subscribe(() => {
            this.setBtnState({
              btnClass: "btn btn-primary",
              isLoading: false,
              status: Status.Initial,
            });
          });
      });
  }

  btnClicked($event) {
    this.btnClickedObservable$.next(true);
  }

  ngOnDestroy() {
    this.stopPolling$.next();
    this.stopPolling$.complete();

    this.stopListen$.next();
    this.stopListen$.complete();
  }
}
