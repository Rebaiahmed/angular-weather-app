import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { ForecastModule } from "./features/forecast/forecast.module";
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [AppComponent, TestComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ReactiveFormsModule,

    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
    ForecastModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
