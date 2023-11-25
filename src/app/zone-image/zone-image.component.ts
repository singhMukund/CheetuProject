import { Component, ElementRef } from '@angular/core';
import { SharedDataService } from '../Service/Service';
import { Application, Container, Graphics, Text } from 'pixi.js';
import { jsPDF } from "jspdf";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
// import [logo] from 'logo.png';




// import {PDFDocument} from '../../../node_modules/pdfkit/js/pdfkit.js';
// const PDFDocument = require('pdfkit');
// const fs = require('fs');


export interface zonePositons {
  zones_A_positions: number[][];
  zone_B_north_row_count_positions: number[][];
  zone_B_Edge_count_positions: number[][];
  zone_C_South_south_positions: number[][];
  zone_C_Interior_Panel_positions: number[][];
  zone_D_Interior_Panel_positions: number[][];
}

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
  private doc: any;
  private zonesColor = {
    zones_A: 0xfd0000,
    zone_B_north_row_count: 0xffbf03,
    zone_B_Edge_count: 0xffbf03,
    zone_C_South_south: 0x01b0ee,
    zone_C_Interior_Panel: 0x01b0ee,
    zone_D_Interior_Panel: 0x93d152
  }

  receivedData: any;

  constructor(private el: ElementRef, private sharedDataService: SharedDataService) { }

  ngOnInit() {
    // this.app = new Application({
    //   // width: 1920,
    //   // height: 400,
    //   // backgroundColor: 0x808080,
    // });
    // this.el.nativeElement.appendChild(this.app.view);
    // (globalThis as any).__PIXI_APP__ = this.app;

    this.convertPDF()
    // this.rectangleContanier = new Container();
    // // document.getElementById("HAVS")?.append(this.app.view);

    // this.app.renderer.resize(window.innerWidth, window.innerHeight);

    // // this.app.stage.addChild(this.rectangleContanier);



    // this.sharedDataService.sendData$.subscribe(async data => {
    //   for (let i: number = 0; i < data.length; i++) {
    //     this.receivedData = data[i][0];
    //     this.createImageContainer(data[i][3]);
    //     // this.receivedData.x = data[0][1]
    //     // this.receivedData.y = data[0][3];
    //     // this.rectangleContanier.addChild(this.receivedData);
    //     const graphics = new Graphics();
    //     graphics.lineStyle(2, 0xFF0000, 1);
    //     const width = new Text(`${data[i][1][2] - data[i][1][1]}`,
    //       {
    //         fontFamily: 'Arial',
    //         fontSize: 24,
    //         fill: 0xff1010,
    //         align: 'center',
    //       });

    //     const height = new Text(`${data[i][1][4] - data[i][1][3]}`,
    //       {
    //         fontFamily: 'Arial',
    //         fontSize: 24,
    //         fill: 0xff1010,
    //         align: 'center',
    //       });
    //     this.rectangleContanier.scale.set(1.1);
    //     // const graphics = new Graphics();
    //     graphics.lineStyle(2, 0xFF0000, 1);
    //     graphics.moveTo(data[i][1][1], data[i][1][3] - 10);
    //     graphics.lineTo(data[i][1][2], data[i][1][3] - 10);
    //     graphics.lineStyle(2, 0xFF0000, 1);
    //     graphics.moveTo(data[i][1][1] - 10, data[i][1][3]);
    //     graphics.lineTo(data[i][1][1] - 10, data[i][1][4]);

    //     width.x = graphics.currentPath.points[0] + ((data[i][1][2] - data[i][1][1]) / 2);
    //     width.y = (graphics.currentPath.points[1]) - 40;

    //     height.x = graphics.currentPath.points[0] - 60;
    //     height.y = data[i][1][3] + ((data[i][1][4] - data[i][1][3]) / 2);
    //     const total_row = (data[i][1][2] - data[i][1][1]) / 30;
    //     const total_col = (data[i][1][4] - data[i][1][3]) / 20;
    //     const row_count_container = new Container();
    //     for (let i: number = 0; i < total_row; i++) {
    //       const row_no = new Text(`${i + 1}`,
    //         {
    //           fontFamily: 'Arial',
    //           fontSize: 24,
    //           fill: 0x0000ff,
    //           align: 'center',
    //         });
    //       row_count_container.addChild(row_no);
    //       row_no.x = (i + 1) * 30;
    //       row_no.y = 120;
    //     }
    //     const col_count_container = new Container();
    //     for (let i: number = 0; i < total_col; i++) {
    //       const col_no = new Text(`${i + 1}`,
    //         {
    //           fontFamily: 'Arial',
    //           fontSize: 24,
    //           fill: 0x0000ff,
    //           align: 'center',
    //         });
    //       col_count_container.addChild(col_no);
    //       col_no.x = 0;
    //       col_no.y = ((i + 1) * 20) + 120;
    //     }
    //     this.rectangleContanier.addChild(col_count_container);
    //     this.rectangleContanier.addChild(row_count_container);
    //     this.rectangleContanier.addChild(graphics);
    //     this.rectangleContanier.addChild(width);
    //     this.rectangleContanier.addChild(height);

    //     const parentDiv = document.getElementById("parentDiv");



    //     // const div = document.createElement('div');
    //     // const a = document.createElement('img');
    //     const url = await this.app.renderer.extract.base64(this.receivedData);
        // a.src = url;
        // div.appendChild(a);
        // document.getElementById('zoneImages')?.appendChild(div);
        // this.rectangleContanier.visible = false;
      // }

      // a.click();
    // });
  }

  convertPDF(): void {

    const pdf = new jsPDF('p','pt','a4');
    pdf.html(this.el.nativeElement,{
      callback : (pdf)=>{
        pdf.save("a4.pdf");
      }
    })
    // Define your styles
    // const styles = {
    //   header: {
    //     fontSize: 18,
    //     bold: true,
    //     margin: [0, 20, 0, 0],
    //   },
    //   address: {
    //     fontSize: 14,
    //     margin: [0, 10, 0, 0],
    //   },
    //   bold: {
    //     bold: true,
    //   },
    //   underline: {
    //     decoration: 'underline',
    //   },
    // };
    // const content: Content[] = [
    //   // {
    //   //   columns: [
    //   //     // {
    //   //     //   image: './logo.png',
    //   //     //   width: 200, // Adjust the width as needed
    //   //     // },
    //   //     {
    //   //       text: 'PowerField Energy',
    //   //       style: 'header',
    //   //       alignment: 'center',
    //   //       margin: [0, 20, 0, 0],
    //   //     },
    //   //   ],
    //   // },
    //   // {
    //   //   text: '301 Park AVE Site 100',
    //   //   style: 'address',
    //   // },
    //   // {
    //   //   text: 'Fallas Church, VA 22046',
    //   //   style: 'address',
    //   // },

    //   {
    //     columns: [
    //       // {
    //       //   image: './logo.png',
    //       //   width: 200,
    //       // },
    //       {
    //         text: 'PowerField Energy',
    //         style: 'header',
    //         alignment: 'center',
    //       },
    //     ],
    //   },
    //   {
    //     text: '301 Park AVE Site 100',
    //     style: 'address',
    //   },
    //   {
    //     text: 'Fallas Church, VA 22046',
    //     style: 'address',
    //   },
    //   // Add more content sections here...
    // ];

    // // Define the PDF document definition
    // const pdfDefinition: TDocumentDefinitions = {
    //   content: content,
    //   styles: {
    //     header: {
    //       fontSize: 18,
    //       bold: true,
    //     },
    //     address: {
    //       fontSize: 14,
    //       margin: [0, 10, 0, 0],
    //     },
    //     // Define more styles as needed
    //   },
    //   pageMargins: [40, 40, 40, 40], // Adjust margins as needed
    //   pageSize: 'A4', // Set page size to A4
    // };

    // // // Create the PDF document
    // // const pdfDoc = pdfMake.createPdf(pdfDefinition);

    // // const pdfDefinition = {
    // //   pageMargins: [40, 40, 40, 40],
    // //   content: [
    // //     {
    // //       table: {
    // //         widths: [300, '*'],
    // //         headerRows: 1,
    // //         body: [
    // //           [
    // //             {
    // //               image: 'logo.png',
    // //               width: 200,
    // //             },
    // //             {
    // //               text: 'PowerField Energy\n\n301 Park AVE Site 100\nFalls Church, VA 22046',
    // //               alignment: 'center',
    // //               style: 'company',
    // //             },
    // //           ],
    // //         ],
    // //       },
    // //       layout: 'noBorders',
    // //     },
    // //     {
    // //       text: 'PowerRack Array- Product List',
    // //       style: 'sectionHeader',
    // //     },
    // //     'Project: Test',
    // //     {
    // //       columns: [
    // //         {
    // //           width: 'auto',
    // //           text: [
    // //             {
    // //               text: 'PREPARED FOR\n',
    // //               style: 'sectionHeader',
    // //             },
    // //             'Company Name\nUday Veer',
    // //           ],
    // //         },
    // //         {
    // //           width: '*',
    // //           alignment: 'right',
    // //           text: [
    // //             {
    // //               text: 'PREPARED DATE\n',
    // //               style: 'sectionHeader',
    // //             },
    // //             '27/09/23\n\nSYSTEM SIZE\n40.04kw',
    // //           ],
    // //         },
    // //       ],
    // //     },
    // //     {
    // //       text: 'MODULE',
    // //       style: 'sectionHeader',
    // //     },
    // //     'Manufacturer: Solarever USA\nModule: SE-166*83-455M-144',
    // //     {
    // //       columns: [
    // //         {
    // //           width: 'auto',
    // //           text: [
    // //             {
    // //               text: 'PROJECT ADDRESS\n',
    // //               style: 'sectionHeader',
    // //             },
    // //             'New Address',
    // //           ],
    // //         },
    // //         {
    // //           width: '*',
    // //           alignment: 'right',
    // //           text: [
    // //             'Wattage: 455 W\nNumber of Modules: 88',
    // //           ],
    // //         },
    // //       ],
    // //     },
    // //   ],
    // //   styles: {
    // //     sectionHeader: {
    // //       fontSize: 14,
    // //       bold: true,
    // //       margin: [0, 5, 0, 5],
    // //     },
    // //     company: {
    // //       alignment: 'center',
    // //       fontSize: 14,
    // //     },
    // //   },
    // //   defaultStyle: {
    // //     font: 'Arial',
    // //     fontSize: 12,
    // //     margin: [0, 5, 0, 5],
    // //   },
    // // };
    
    // // Create the PDF document
    // const pdfDoc = pdfMake.createPdf(pdfDefinition);
    
    // // Open or download the PDF
    // pdfDoc.open();

    // // Open or download the PDF
    // pdfDoc.open();
    // doc.text("", 10, 10);
    // const imgData = 'src/assets/logo.png'; 
    // doc.addImage(imgData, 'PNG', 10, 10, 90, 60);
    // doc.save("a4.pdf");


    // Replace with your image data or URL






    // this.doc.pipe(fs.createWriteStream('output.pdf'));

    // // Embed a font, set the font size, and render some text
    // this.doc
    //   .font('fonts/PalatinoBold.ttf')
    //   .fontSize(25)
    //   .text('Some text with an embedded font!', 100, 100);

    // // Add an image, constrain it to a given size, and center it vertically and horizontally
    // this.doc.image('path/to/image.png', {
    //   fit: [250, 300],
    //   align: 'center',
    //   valign: 'center'
    // });

    // // Add another page
    // this.doc
    //   .addPage()
    //   .fontSize(25)
    //   .text('Here is some vector graphics...', 100, 100);

    // // Draw a triangle
    // this.doc
    //   .save()
    //   .moveTo(100, 150)
    //   .lineTo(100, 250)
    //   .lineTo(200, 250)
    //   .fill('#FF3300');

    // // Apply some transforms and render an SVG path with the 'even-odd' fill rule
    // this.doc
    //   .scale(0.6)
    //   .translate(470, -380)
    //   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    //   .fill('red', 'even-odd')
    //   .restore();

    // // Add some text with annotations
    // this.doc
    //   .addPage()
    //   .fillColor('blue')
    //   .text('Here is a link!', 100, 100)
    //   .underline(100, 100, 160, 27, { color: '#0000FF' })
    //   .link(100, 100, 160, 27, 'http://google.com/');

    // // Finalize PDF file
    // this.doc.end();
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

  private createZoneImage(x: number, y: number, colorCode: number): Container {
    const zoneContainer = new Container();
    let zonesShape = new Graphics();
    //0xdae9eb
    zonesShape.lineStyle(2, 0xdae9eb);
    zonesShape.drawRect(x, y, 60, 20);
    zonesShape.endFill();
    zoneContainer.addChild(zonesShape)
    zonesShape.beginFill(colorCode);
    zonesShape.drawRect(x + 10, y, 20, 20);
    zonesShape.endFill();
    zoneContainer.addChild(zonesShape)
    zonesShape.beginFill(colorCode);
    zonesShape.drawRect(x + 40, y, 20, 20);
    zonesShape.endFill();
    zoneContainer.addChild(zonesShape)
    return zoneContainer;
  }

  createImageContainer(zonePositons: zonePositons): void {
    const imagedContainer = new Container();
    imagedContainer.removeChildren();
    imagedContainer.visible = true;
    imagedContainer.setTransform(this.rectangleContanier.x, this.rectangleContanier.y)
    zonePositons.zones_A_positions.forEach((zone_Positions) => {
      let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zones_A);
      // @ts-ignore
      zoneShapeContainer.name = 'zonesAShape';
      imagedContainer.addChild(zoneShapeContainer);
    });
    zonePositons.zone_B_Edge_count_positions.forEach((zone_Positions) => {
      let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_B_Edge_count);
      // @ts-ignore
      zoneShapeContainer.name = 'zone_B_Edge';
      imagedContainer.addChild(zoneShapeContainer);
    });
    zonePositons.zone_B_north_row_count_positions.forEach((zone_Positions) => {
      let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_B_north_row_count);
      // @ts-ignore
      zoneShapeContainer.name = 'zone_B_north_row';
      imagedContainer.addChild(zoneShapeContainer);

    });
    zonePositons.zone_C_Interior_Panel_positions.forEach((zone_Positions) => {
      let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_C_Interior_Panel);
      // @ts-ignore
      zoneShapeContainer.name = 'zone_C_Interior_Panel';
      imagedContainer.addChild(zoneShapeContainer);
    });
    zonePositons.zone_C_South_south_positions.forEach((zone_Positions) => {
      let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_C_South_south);
      // @ts-ignore
      zoneShapeContainer.name = 'zone_C_South_south';
      // this.imagedContainer.addChild(zonesAShape);
      imagedContainer.addChild(zoneShapeContainer);
    });
    zonePositons.zone_D_Interior_Panel_positions.forEach((zone_Positions) => {
      let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_D_Interior_Panel);
      // @ts-ignore
      zoneShapeContainer.name = 'zone_D_Interior_Panel';
      imagedContainer.addChild(zoneShapeContainer);
    });
    this.rectangleContanier.addChild(imagedContainer);
  }
}
