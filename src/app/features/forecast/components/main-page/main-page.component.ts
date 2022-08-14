import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, interval, Subject, throwError, timer } from "rxjs";
import { catchError, retry, share, switchMap, takeUntil } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { BtnConfig, Status } from "../../../../shared/models";
import { CONSTANTS } from "../../../../shared/utils/constants";
import { ConditionParams, Weather } from "../../models";
import { LocationService, WeatherService } from "../../services";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent implements OnInit, OnDestroy {
  stopPolling$ = new Subject();
  stopListen$ = new Subject();
  btnClickedObservable$ = new BehaviorSubject(false);
  currentBtnConfig: BtnConfig;
  currentConditions = [];
  currentZipCode = "";
  currentCountryCode = "";

  loading = false;

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService
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
        switchMap(() => this.weatherService.pollingWeatherConditions$),
        retry(),
        share(),
        takeUntil(this.stopPolling$),
        catchError((err) => {
          return throwError(err);
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
          weatherConditions?.weather?.length > 0
            ? weatherConditions?.weather[0]?.id
            : ""
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
        .pipe(
          takeUntil(this.stopListen$),
          catchError((err) => {
            alert("Error loading data with these params!");
            this.setBtnState({
              btnClass: "btn btn-primary",
              isLoading: false,
              status: Status.Initial,
            });
            return throwError(err);
          })
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
          this.locationService.addLocation({
            zipCode: this.currentZipCode,
            countryCode: this.currentCountryCode,
            id: id,
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
