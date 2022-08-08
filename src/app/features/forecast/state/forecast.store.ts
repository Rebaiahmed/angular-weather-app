import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";

export interface ForecastState {
  zipCode: string;
  countryCode: string;
  loading: boolean;
  error: boolean;
}

export function createInitialState(): ForecastState {
  return {
    zipCode: "",
    countryCode: "",
    loading: false,
    error: false,
  };
}

@Injectable({
  providedIn: "root",
})
@StoreConfig({ name: "forecast" })
export class ForeCastStore extends Store<ForecastState> {
  constructor() {
    super(createInitialState());
  }
}
