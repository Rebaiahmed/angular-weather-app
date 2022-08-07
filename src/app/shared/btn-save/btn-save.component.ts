import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { BtnConfig } from "../models/btn-config";

@Component({
  selector: "app-btn-save",
  templateUrl: "./btn-save.component.html",
  styleUrls: ["./btn-save.component.scss"],
})
export class BtnSaveComponent implements OnInit, OnChanges {
  @Input() btnConfig: BtnConfig = {
    label: "Add location",
    btnClass: "btn btn-primary",
    isDisabled: false,
    isLoading: false,
  };

  @Output() onClick = new EventEmitter<any>();

  constructor() {}

  ngOnChanges(changes) {
    console.log(
      "Changed",
      changes.property.currentValue,
      changes.property.previousValue
    );
  }

  ngOnInit(): void {}

  onClickButton() {
    this.onClick.emit(event);
  }
}
