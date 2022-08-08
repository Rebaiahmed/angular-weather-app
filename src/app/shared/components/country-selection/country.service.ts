import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { Country } from "../../models";

@Injectable()
export class CountrySelectionService {
  countries;

  constructor(private http: HttpClient) {}

  loadCountries(): Observable<Country[]> {
    return this.http.get<Country[]>("assets/data/countries.json");
  }
}
