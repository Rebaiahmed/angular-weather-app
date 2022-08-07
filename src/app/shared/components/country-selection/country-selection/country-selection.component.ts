import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Country } from "../../../models";
import { CountrySelectionService } from "../country.service";

@Component({
  selector: "app-country-selection",
  templateUrl: "./country-selection.component.html",
  styleUrls: ["./country-selection.component.scss"],
})
export class CountrySelectionComponent implements OnInit, OnChanges {
  @Output() countrySelected$ = new EventEmitter<Country>();

  countrySelectionFrom = new FormGroup({
    country: new FormControl(),
  });
  countries: Country[] = [];

  constructor(private service: CountrySelectionService) {
    this.countries = this.service.loadCountries();
  }

  ngOnChanges(changes) {}

  ngOnInit(): void {}

  onCountrySelected() {
    this.countrySelected$.emit(null);
  }
}
