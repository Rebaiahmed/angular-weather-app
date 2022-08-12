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
  map,
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

  ngOnInit(): void {
    this.getCurrentCountries();
    this.onCountryInputValueChanged();
  }

  identify(index, item) {
    return item.countryCode;
  }

  getCurrentCountries() {
    this.service
      .loadCountries()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((countries) => {
        this.countries = countries;
      });
  }

  onCountryInputValueChanged() {
    this.countrySelectionFrom
      .get("countryForm")
      .valueChanges.pipe(
        filter((textValue) => textValue !== ""),
        map((textValue) => textValue.toLowerCase()),
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
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
    this.countrySelected$.emit(entry.countryCode);
    this.filteredCountries = [];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
