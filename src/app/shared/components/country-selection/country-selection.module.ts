import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountrySelectionComponent } from "./country-selection/country-selection.component";
import { CountrySelectionService } from "./country.service";
import { ReactiveFormsModule } from "@angular/forms";
import { BoldSpanPipe } from "../../pipes/bold-span.pipe";

@NgModule({
  declarations: [CountrySelectionComponent, BoldSpanPipe],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [CountrySelectionComponent],
  providers: [CountrySelectionService],
})
export class CountrySelectionModule {}
