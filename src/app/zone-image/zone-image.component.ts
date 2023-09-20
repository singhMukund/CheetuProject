import { Component, ElementRef } from '@angular/core';
import { SharedDataService } from '../Service/Service';
import { Application, Container, Graphics, Text } from 'pixi.js';

@Component({
  selector: 'app-zone-image',
  templateUrl: './zone-image.component.html',
  styleUrls: ['./zone-image.component.css']
})
export class ZoneImageComponent {
  private app!: Application;
  private rectangleContanier!: Container;
  private isDragging: boolean = false;
  private startY: number = 0;

  receivedData: any;

  constructor(private el: ElementRef, private sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.app = new Application({
      width: 1920,
      height: 400,
      backgroundColor: 0x808080,
    });
    this.el.nativeElement.appendChild(this.app.view);
    (globalThis as any).__PIXI_APP__ = this.app;

    this.rectangleContanier = new Container();
    // document.getElementById("HAVS")?.append(this.app.view);

    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.app.stage.addChild(this.rectangleContanier);



    this.sharedDataService.sendData$.subscribe(async data => {
      for (let i: number = 0; i < data.length; i++) {
        this.receivedData = data[i][0];
        // this.receivedData.x = data[0][1]
        // this.receivedData.y = data[0][3];
        this.rectangleContanier.addChild(this.receivedData);
        const graphics = new Graphics();
        graphics.lineStyle(2, 0xFF0000, 1);
        const width = new Text(`${data[i][2] - data[i][1]}`,
          {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xff1010,
            align: 'center',
          });

        const height = new Text(`${data[i][4] - data[i][3]}`,
          {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xff1010,
            align: 'center',
          });
        this.rectangleContanier.scale.set(1.1);
        graphics.moveTo(data[i][1], data[i][3] - 10);
        graphics.lineTo(data[i][2], data[i][3] - 10);
        graphics.lineStyle(2, 0xFF0000, 1);
        graphics.moveTo(data[i][1] - 10, data[i][3]);
        graphics.lineTo(data[i][1] - 10, data[i][4]);

        width.x = graphics.currentPath.points[0]+ ((data[i][2] - data[i][1])/2);
        width.y = graphics.currentPath.points[1] - 40;

        height.x = graphics.currentPath.points[0] - 60;
        height.y = graphics.currentPath.points[1] + (data[i][4] - data[i][3]/2);

        this.rectangleContanier.addChild(graphics);
        this.rectangleContanier.addChild(width);
        this.rectangleContanier.addChild(height);

        // const div = document.createElement('div');
        // const a = document.createElement('img');
        // const url = await this.app.renderer.extract.base64(this.receivedData);
        // a.src = url;
        // div.appendChild(a);
        // document.getElementById('zoneImages')?.appendChild(div);
        // this.rectangleContanier.visible = false;
      }

      // a.click();
    });
  }

  listenEvent(): void {
    // @ts-ignore
    this.rectangleContanier.on('pointermove', (event: { data: { global: { y: number; }; }; }) => {
      if (this.isDragging) {
        const newY = event.data.global.y - this.startY;
        // Limit the scrolling to keep the shape within the mask
        const minY = 0;
        const maxY = this.app.renderer.height - this.rectangleContanier.height;
        this.rectangleContanier.y = Math.min(maxY, Math.max(minY, newY));
      }
    });
    // @ts-ignore
    this.rectangleContanier.on('pointerup', () => {
      this.isDragging = false;
    });
    // @ts-ignore
    this.rectangleContanier.on('pointerupoutside', () => {
      this.isDragging = false;
    });
  }
}
