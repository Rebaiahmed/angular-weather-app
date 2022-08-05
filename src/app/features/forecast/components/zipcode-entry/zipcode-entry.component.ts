import { Component, EventEmitter, Output } from "@angular/core";
import { LocationService } from "../../services";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent {
  @Output() newZipCode$ = new EventEmitter<string>();
  constructor(private service: LocationService) {}

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
    this.newZipCode$.emit(zipcode);
  }
}
