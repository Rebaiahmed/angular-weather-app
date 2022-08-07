import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountrySelectionComponent } from "./country-selection/country-selection.component";
import { CountrySelectionService } from "./country.service";

@NgModule({
  declarations: [CountrySelectionComponent],
  imports: [CommonModule],
  exports: [CountrySelectionComponent],
  providers: [CountrySelectionService],
})
export class CountrySelectionModule {}
