import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LocationService } from "../../services";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent implements OnInit, OnDestroy {
  @Output() newZipCode$ = new EventEmitter<string>();
  searchWeatherForm: FormGroup;
  constructor(private service: LocationService) {}

  ngOnInit(): void {
    this.initZipCdeForm();
    this.searchWeatherForm
      .get("zipCodeControl")
      .valueChanges.pipe()
      .subscribe();
  }

  private initZipCdeForm() {
    this.searchWeatherForm = new FormGroup({
      zipCodeControl: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("[0-9]{5}"),
        ])
      ),
    });
  }

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
    this.newZipCode$.emit(zipcode);
  }

  ngOnDestroy() {}
}
