import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { BtnConfig } from "../../models/btn-config";

@Component({
  selector: "app-btn-save",
  templateUrl: "./btn-save.component.html",
  styleUrls: ["./btn-save.component.scss"],
})
export class BtnSaveComponent implements OnInit, OnChanges {
  @Input() btnConfig: BtnConfig;

  @Output() onClick = new EventEmitter<any>();

  constructor() {}

  ngOnChanges(changes) {}

  ngOnInit(): void {}

  onClickButton() {
    this.onClick.emit(event);
  }
}
