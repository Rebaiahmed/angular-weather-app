import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, EMPTY, interval, Subject, timer } from "rxjs";
import { catchError, mergeMap, share, takeUntil } from "rxjs/operators";
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
    this.refreshExistingWeatherData();
  }

  refreshExistingWeatherData() {
    interval(CONSTANTS.POLLING_INTERVAL)
      .pipe(
        mergeMap(() => this.weatherService.pollingWeatherConditions$),
        share(),
        takeUntil(this.stopPolling$),
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
      this.currentConditions[objIndex] = {
        ...this.currentConditions[objIndex],
        data: weatherConditions,
      };
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

  getRecentZipCodeValue($event) {
    this.currentZipCode = $event;
  }

  getRecentCountryCode($event) {
    this.currentCountryCode = $event;
  }

  resetButtonInitialState() {
    timer(CONSTANTS.RESET_TIME)
      .pipe(takeUntil(this.stopListen$))
      .subscribe(() => {
        this.setBtnState({
          btnClass: "btn btn-primary",
          isLoading: false,
          status: Status.Initial,
        });
      });
  }

  btnClicked($event) {
    const id = uuidv4();
    if (this.currentZipCode != "" && this.currentCountryCode != "") {
      this.setBtnState({
        btnClass: "btn btn-primary",
        isLoading: true,
        status: Status.Loading,
      });
      this.weatherService
        .getCurrentConditionsApiCall({
          zipCode: this.currentZipCode,
          countryCode: this.currentCountryCode,
        } as ConditionParams)
        .pipe(takeUntil(this.stopListen$))
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
          this.locationService.addLocation({
            zipCode: this.currentZipCode,
            countryCode: this.currentCountryCode,
            uid: id,
          } as ConditionParams);
          this.setBtnState({
            btnClass: "btn btn-success",
            isLoading: false,
            status: Status.Done,
          });
          this.resetButtonInitialState();
        });
    }
  }

  ngOnDestroy() {
    this.stopPolling$.next();
    this.stopPolling$.complete();

    this.stopListen$.next();
    this.stopListen$.complete();
  }
}
