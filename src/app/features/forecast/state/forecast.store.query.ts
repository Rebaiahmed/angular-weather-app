import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { ForecastState, ForeCastStore } from "./forecast.store";

@Injectable({
  providedIn: "root",
})
export class ForeCastQuery extends Query<ForecastState> {
  constructor(protected store: ForeCastStore) {
    super(store);
  }

  zipCode$ = this.select((state) => state.zipCode);
  countryCode$ = this.select((state) => state.countryCode);
  loading$ = this.select((state) => state.loading);
}
