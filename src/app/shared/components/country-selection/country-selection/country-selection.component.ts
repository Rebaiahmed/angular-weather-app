import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { of, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import { Country } from "../../../models";
import { CountrySelectionService } from "../country.service";

@Component({
  selector: "app-country-selection",
  templateUrl: "./country-selection.component.html",
  styleUrls: ["./country-selection.component.scss"],
})
export class CountrySelectionComponent implements OnInit, OnDestroy {
  @Output() countrySelected$ = new EventEmitter<Country>();

  destroy$ = new Subject();
  unsubscribe$ = new Subject();
  countrySelectionFrom = new FormGroup({
    countryForm: new FormControl(),
  });
  countries: Country[] = [];
  filteredCountries: Country[] = [];

  constructor(private service: CountrySelectionService) {}

  onBlur() {
    console.log("onBlur");
  }

  ngOnInit(): void {
    this.service
      .loadCountries()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((countries) => {
        this.countries = countries;
      });
    this.onCountryInputValueChanged();
  }

  onCountryInputValueChanged() {
    this.countrySelectionFrom
      .get("countryForm")
      .valueChanges.pipe(
        filter((textValue) => textValue !== ""),
        //map((textValue) => textValue.toLowerCase()),
        takeUntil(this.destroy$),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((val) => this.onSearch(val))
      )
      .subscribe();
  }

  onSearch(countryName: string) {
    this.filteredCountries = this.countries
      .filter((c) => c.name.startsWith(countryName))
      .slice(0, 5);
    return of(this.filteredCountries);
  }

  onCountrySelected(entry) {
    this.countrySelectionFrom
      .get("countryForm")
      .setValue(entry.name, { emitEvent: false });
    this.filteredCountries = [];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
