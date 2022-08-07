import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { countries } from "../../utils/countries-list";
import { Country } from "../../models";

@Injectable()
export class CountrySelectionService {
  constructor(private http: HttpClient) {}

  loadCountries(): Country[] {
    return countries;
  }
}
