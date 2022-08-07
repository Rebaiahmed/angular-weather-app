import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BtnSaveComponent } from "./components/btn-save/btn-save.component";
import { CountrySelectionComponent } from "./components/country-selection/country-selection.component";

@NgModule({
  declarations: [BtnSaveComponent, CountrySelectionComponent],
  imports: [CommonModule],
  exports: [BtnSaveComponent, CountrySelectionComponent],
})
export class SharedModule {}
