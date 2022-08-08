import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BtnConfig } from "../../models/btn-config";

@Component({
  selector: "app-btn-save",
  templateUrl: "./btn-save.component.html",
  styleUrls: ["./btn-save.component.scss"],
})
export class BtnSaveComponent {
  @Input() btnConfig: BtnConfig;

  @Output() onClick = new EventEmitter<any>();

  constructor() {}

  onClickButton() {
    this.onClick.emit(event);
  }
}
