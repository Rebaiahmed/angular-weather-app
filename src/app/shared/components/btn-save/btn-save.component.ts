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

  // nziodu houni btn disabled  bl combinelatest tow events countrySelected w zeda zipdCode entered w selon value rnbadel status mt3 btnConfig
}
