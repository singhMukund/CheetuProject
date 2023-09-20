import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PixiCanvasComponent } from './pixi-canvas/pixi-canvas.component';
import { ZoneImageComponent } from './zone-image/zone-image.component';
import { SharedDataService } from './Service/Service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    PixiCanvasComponent,
    ZoneImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [SharedDataService],
  bootstrap: [AppComponent],
})
export class AppModule { }
