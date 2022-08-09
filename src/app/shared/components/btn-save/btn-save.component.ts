import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { BtnConfig } from "../../models/btn-config";

@Component({
  selector: "app-btn-save",
  templateUrl: "./btn-save.component.html",
  styleUrls: ["./btn-save.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnSaveComponent {
  @Input() btnConfig: BtnConfig;

  @Output() onClick = new EventEmitter<boolean>();

  constructor() {}

  onClickButton() {
    this.onClick.emit(true);
  }
}
