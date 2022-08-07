import { Country } from "../../models/country.model";
import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

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

  constructor() {}

  ngOnChanges(changes) {}

  ngOnInit(): void {}

  onCountrySelected() {
    this.countrySelected$.emit("country selected!");
  }
}
