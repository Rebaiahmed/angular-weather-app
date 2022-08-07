import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BtnSaveComponent } from "./btn-save/btn-save.component";

@NgModule({
  declarations: [BtnSaveComponent],
  imports: [CommonModule],
  exports: [BtnSaveComponent],
})
export class SharedModule {}
