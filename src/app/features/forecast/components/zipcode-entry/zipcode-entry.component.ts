import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { combineLatest, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent implements OnInit, OnDestroy {
  searchWeatherForm: FormGroup;
  @Output() newZipCode = new EventEmitter<string>();
  private destroySubscription$ = new Subject();
  constructor() {
    this.initZipCdeForm();
  }

  ngOnInit(): void {
    this.syncCurrentZipCodeValue();
  }

  syncCurrentZipCodeValue() {
    combineLatest(
      this.searchWeatherForm.statusChanges,
      this.searchWeatherForm.valueChanges
    )
      .pipe(
        debounceTime(500),

        distinctUntilChanged(),
        takeUntil(this.destroySubscription$)
      )
      .subscribe((result) => {
        if (result[0] == "VALID") {
          this.newZipCode.emit(result[1].zipCodeControl);
        }
      });
  }

  initZipCdeForm() {
    this.searchWeatherForm = new FormGroup({
      zipCodeControl: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("[0-9]{4,8}"),
        ])
      ),
    });
  }

  ngOnDestroy() {
    this.destroySubscription$.next();
    this.destroySubscription$.complete();
  }
}
