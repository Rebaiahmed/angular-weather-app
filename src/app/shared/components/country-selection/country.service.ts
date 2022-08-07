import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Country } from "../../models";
import { countries } from "../../utils/countries-list";

@Injectable()
export class CountrySelectionService {
  countries;

  constructor(private http: HttpClient) {}

  loadCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(
      "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json"
    );
  }
}
