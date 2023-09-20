import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PixiCanvasComponent } from './pixi-canvas/pixi-canvas.component';
import { ZoneImageComponent } from './zone-image/zone-image.component';

const routes: Routes = [
  { path: 'homePage', component: PixiCanvasComponent },
  { path: 'zoneImage', component: ZoneImageComponent },
  { path: '', redirectTo: '/homePage', pathMatch: 'full' }, // Default route to ComponentA
  { path: '**', redirectTo: '/homePage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
