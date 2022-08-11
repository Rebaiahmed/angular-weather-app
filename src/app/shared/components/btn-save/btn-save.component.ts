import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { BtnConfig, Status } from "../../models/btn-config";

@Component({
  selector: "app-btn-save",
  templateUrl: "./btn-save.component.html",
  styleUrls: ["./btn-save.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnSaveComponent implements OnInit, OnChanges {
  @Input() btnConfig: BtnConfig;

  @Input() initialTemplate: TemplateRef<any>;
  @Input() loadingTemplate: TemplateRef<any>;
  @Input() doneTemplate: TemplateRef<any>;
  currentTemplate: TemplateRef<any>;

  @Output() onClick = new EventEmitter<boolean>();

  ngOnInit() {
    this.currentTemplate = this.initialTemplate;
  }

  ngOnChanges(changes: SimpleChanges) {
    switch (changes.btnConfig.currentValue.status) {
      case Status.Initial:
        this.currentTemplate = this.initialTemplate;
        break;
      case Status.Loading:
        this.currentTemplate = this.loadingTemplate;
        break;
      case Status.Done:
        this.currentTemplate = this.doneTemplate;

        break;
    }
  }

  constructor() {}

  onClickButton() {
    this.onClick.emit(true);
  }
}
