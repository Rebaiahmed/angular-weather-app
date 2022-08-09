import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BtnSaveComponent } from "./components/btn-save/btn-save.component";
import { CountrySelectionModule } from "./components/country-selection/country-selection.module";
import { BoldSpanPipe } from "./pipes/bold-span.pipe";

@NgModule({
  declarations: [BtnSaveComponent],
  imports: [CommonModule, CountrySelectionModule],
  exports: [BtnSaveComponent, CountrySelectionModule],
  providers: [BoldSpanPipe],
})
export class SharedModule {}
