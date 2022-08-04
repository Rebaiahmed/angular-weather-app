import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { ForecastModule } from "./features/forecast/forecast.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,

    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
    ForecastModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
