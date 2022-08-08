import { Injectable } from "@angular/core";
import { ForeCastStore } from "./forecast.store";

@Injectable({
  providedIn: "root",
})
export class ForeCastStoreService {
  constructor(private foreCastStore: ForeCastStore) {}

  setZipCode(zipCode: string) {
    this.foreCastStore.update({ zipCode: zipCode });
  }

  setCountryCode(countryCode: string) {
    this.foreCastStore.update({ countryCode: countryCode });
  }
}
