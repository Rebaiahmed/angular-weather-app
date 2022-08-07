import { Component, OnDestroy } from "@angular/core";
import { interval, Subject, throwError } from "rxjs";
import { catchError, startWith, switchMap, takeUntil } from "rxjs/operators";
import { CONSTANTS } from "../../../../shared/utils/constants";
import { WeatherService } from "../../services";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent implements OnDestroy {
  private stopPolling = new Subject();
  pollingConditions$;
  currentZipCode = "";
  currentConditions = [];
  loading = false;

  constructor(private weatherService: WeatherService) {}

  getCurrentZipCode($event) {
    this.currentZipCode = $event;

    this.pollingConditions$ = interval(CONSTANTS.POLLING_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.weatherService.addCurrentConditions(this.currentZipCode)
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
