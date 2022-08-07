import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { BtnConfig } from "../../../../shared/models/btn-config";
import { LocationService } from "../../services";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent {
  @Output() newZipCode$ = new EventEmitter<string>();
  currentBtnConfig: BtnConfig = {
    label: "test <span class='btn-label'><i class='fa fa-check'></i> </span>",
    btnClass: "btn btn-success",
    isDisabled: true,
    isLoading: false,
  };
  constructor(private service: LocationService) {}

  searchWeatherForm = new FormGroup({
    zipCode: new FormControl(),
  });

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
    this.newZipCode$.emit(zipcode);
  }
}
