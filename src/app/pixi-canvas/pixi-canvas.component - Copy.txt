import { Component, ElementRef, OnInit, asNativeElements } from '@angular/core';
// import { Application, Container, Filter, Graphics, Point, Sprite, Text, Texture, filters } from 'pixi.js';
import { ClickableContainer } from './ClickableContainer';
import { ITABLEDATA } from './ITableData';
import { Application, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { SharedDataService } from '../Service/Service';
import { Router } from '@angular/router';
import { ISingleContainerData } from './DataInterface';

// import { Application } from 'pixijs';

@Component({
  selector: 'app-pixi-canvas',
  templateUrl: './pixi-canvas.component.html',
  styleUrls: ['./pixi-canvas.component.css']
})


export class PixiCanvasComponent implements OnInit {
  private app!: Application;
  private buttonClick: boolean = false;
  private stopMouseClick: boolean = false;
  private fillRectangleButton!: Graphics;
  private cloneButton!: Graphics;
  private mesurementCalculateButton!: Graphics;
  private button_1_Text!: Text;
  private button_2_Text!: Text;
  private button_3_Text!: Text;
  private rectangleOnMouse!: Graphics;
  private clickableContainerMap: Map<string, ClickableContainer> = new Map();
  private highlightedKey: string = "";
  private measurentContainer!: Container;
  private measurementXText!: Text;
  private measurementYText!: Text;
  private mouseDown: boolean = false;
  private currentX: number | undefined = -1;
  private currentY: number | undefined = -1;
  inputValue: string = '';
  private width: number = 60;
  private height: number = 20;
  private currentScale: number = 1;






  zone_D_Interior_Panel: number = 10;
  zone_C_South_south: number = 5;
  zone_C_Interior_count: number = 5;
  zone_B_north_row_count: number = 4;
  zone_B_Edge_count: number = 3;
  zone_A_count: number = 2
  totalBlackBox: number = 0;
  blackBoxCountForSelectedOne: number = 0;
  private tableData: ITABLEDATA[] = [
    {
      firstCol: 'Zone Name ',
      secondCol: 'Panel Count'
    },
    {
      firstCol: 'Zone A Corner Panel',
      secondCol: '10'
    },
    {
      firstCol: 'Zone B,edge',
      secondCol: '10'
    },
    {
      firstCol: 'Zone B,North row',
      secondCol: '10'
    },
    {
      firstCol: 'Zone C, South row',
      secondCol: '10'
    },
    {
      firstCol: 'Zone C, Interior',
      secondCol: '10'
    },
    {
      firstCol: 'Zone D, Interior Panel',
      secondCol: '10'
    }
  ]

  // private ballImage! : Sprite;
  // private moveRight = true;
  // private moveDown = false;
  // private moveLeft = false;
  // private moveUp = false;


  constructor(private el: ElementRef, private sharedDataService: SharedDataService, private router: Router) {

  }

  ngOnInit(): void {
    this.app = new Application({
      width: 1280,
      height: 920,
      backgroundColor: 0x808080,
    });
    this.el.nativeElement.appendChild(this.app.view);
    // this.app.stage.pivot.set(window.innerWidth * 0.5, window.innerHeight * 0.5)
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    (globalThis as any).__PIXI_APP__ = this.app;
    // this.app.stage.pivot.set((window.innerWidth) * 0.5, (window.innerHeight) * 0.5);
    // this.app.stage.position.set(this.app.stage.pivot.x, this.app.stage.pivot.y);
    this.rectangleOnMouse = new Graphics();
    this.rectangleOnMouse.beginFill(0x171717);
    this.rectangleOnMouse.drawRect(5, 5, 30, 40);
    this.rectangleOnMouse.endFill();

    this.app.stage.addChild(this.rectangleOnMouse);
    // @ts-ignore
    this.app.view.addEventListener('mousemove', (offset: { x: any; y: any; }) => {
      !this.stopMouseClick && this.rectangleOnMouse.position.set(offset.x, offset.y);
      this.stopMouseClick && (this.rectangleOnMouse.visible = false);
    });
    this.createMeasurent();
    // this.createButtonAndSetEvent();
    this.subscribeEvent();
    this.subscribeMouseMovementEventForDragEvent();
    // this.getDataFromBackEnd(localStorage.getItem('box_Value')!);
    // this.ballAnimation();
  }

  setScale(scale: number): void {
    this.width = 60 * scale;
    this.height = 20 * scale;
  }

  ///Issue is that gap is constant through out

  private toFixed(num : number) : number{
    return (Number((num).toFixed(1)));
  } 

  zoomIn(): void {
    if ((Number((this.currentScale - 0.1).toFixed(2))) <= 0.3) {
      // this.currentScale = Number((this.currentScale - 0.3).toFixed(2)); 
      return;
    }else{
      // this.currentScale = 1;
      this.currentScale = Number((this.currentScale - 0.1).toFixed(2)); 

    }
    let initialWH = [this.app.stage.width,this.app.stage.height];
    // this.app.stage.scale.set(this.currentScale);
    let finalWidth = [this.app.stage.width,this.app.stage.height];
    if(this.currentScale <= 1){
      this.app.renderer.resize(window.innerWidth , window.innerHeight );
    }else{
      this.app.renderer.resize(window.innerWidth * this.currentScale, window.innerHeight * this.currentScale);
    }

    for (const [key, value] of this.clickableContainerMap) {
        let minx = this.findMinX(value.getcenterXYRecCordinate());
        let miny = this.findMinY(value.getcenterXYRecCordinate());
        value.getConatiner().scale.set(this.currentScale);
        let containerWidth = value.getConatiner().width;
        let containerHeight = value.getConatiner().height;
        value.getConatiner().position.set(-(containerWidth * 0.5), -(containerHeight * 0.5));
    }
    // this.app.stage.position.set(-((finalWidth[1] - initialWH[1]) * 1),-((finalWidth[0] - initialWH[0]) * 1));
    // this.el.nativeElement.style.setTransform(`scale(${this.currentScale})`);
    // for (const [key, value] of this.clickableContainerMap) {
    //   let data = value.getcenterXYRecCordinate();
    //   if (data) {
    //     let isEnable = value.getEnabled();
    //     const gapY = value.getGapY();
    //     const initialRecPosition = value.getInitialContainerPositon();
    //     let widthHeight = value.getWidthHeight();
    //     if(60 * this.currentScale < 0 || 20 * this.currentScale < 0){
    //       return;
    //     }
    //     value.setScale(this.currentScale);
    //     let newWidthHeight = value.getWidthHeight();
    //     let gapDifference = [(newWidthHeight[0] - widthHeight[0]), (newWidthHeight[1] - widthHeight[1])];
    //     const minX = this.findMinX(data);
    //     const minY = this.findMinY(data);
    //     data = this.updateDataOnUpdatedWidth(data, this.toFixed(minX), this.toFixed(gapDifference[0]));
    //     data = this.updateDataOnUpdatedHeight(data, this.toFixed(minY), this.toFixed(gapDifference[1]), this.toFixed(gapY));
    //     if (initialRecPosition[0] === value.getConatiner().x || initialRecPosition[1] === value.getConatiner().y) {
    //       data = this.updateDataOnInitialValue(data, initialRecPosition);
    //     }
    //     // data = this.updateDataOnGap(data, gapDifference); 
    //     data.sort((a, b) => a[1] - b[1]);
    //     value.resetBoxes();
    //     console.log(value);
    //     this.setScale(this.currentScale);
    //     for (let i: number = 0; i < data.length; i++) {
    //       value.clickOnRectangle(data[i][0]/this.app.stage.scale.x, data[i][1]/this.app.stage.scale.y);
    //       this.updatePanelCount(value.zonesCount(), false, key);
    //     }
    //     if (!isEnable) {
    //       value.hideAll();
    //     }
    //   }
    // }
  }

  zoomOut(): void {
    
    if ((Number((this.currentScale + 0.3).toFixed(2))) > 3) {
      return;
    }
    this.currentScale =  Number((this.currentScale + 0.3).toFixed(2));
    // this.app.stage.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

    // this.app.stage.pivot.set(this.app.stage.width / 2, this.app.stage.height/2);
    // @ts-ignore
    // this.app.stage.anchor.set(0.5);
    // this.app.stage.scale.set(this.currentScale,this.currentScale);
    for (const [key, value] of this.clickableContainerMap) {
      let initialWH = [value.getConatiner().width,value.getConatiner().height];
      // let minx = this.findMinX(value.getcenterXYRecCordinate());
      // let miny = this.findMinY(value.getcenterXYRecCordinate());
      value.getConatiner().scale.set(this.currentScale);
      let finalWidth = [value.getConatiner().width,value.getConatiner().height];
      let containerWidth = value.getConatiner().width;
      let containerHeight = value.getConatiner().height;
      let newX = value.getConatiner().x - ((finalWidth[0] - initialWH[0]) * 0.25);
      let newY = value.getConatiner().y - ((finalWidth[1] - initialWH[1]) * 0.25);
      value.getConatiner().position.set(newX, newY);
  }
    this.app.renderer.resize(window.innerWidth * this.currentScale, window.innerHeight * this.currentScale);
    // this.app.stage.position.set((initialWH[0]-finalWidth[0]),((initialWH[1]-finalWidth[1])));
    // this.resetImage(); 
     // Calculate new x and y to center the app
  // const newX = (window.innerWidth - this.app.screen.width) / 2;
  // const newY = (window.innerHeight - this.app.screen.height) / 2;

  // Set the new position
  // if(this.app.view.style){
  //   this.app.view.style.left = newX + 'px';
  //   this.app.view.style.top = newY + 'px';
  // }
 
   
  }

  private resetImage():void{
    for (const [key, value] of this.clickableContainerMap) {
      let data = value.getcenterXYRecCordinate();
      if (data) {
        let isEnable = value.getEnabled();
        const gapY = value.getGapY();
        const initialRecPosition = value.getInitialContainerPositon();
        let widthHeight = value.getWidthHeight();
        if(60 * this.currentScale < 0 || 20 * this.currentScale < 0){
          return;
        }
        value.setScale(this.currentScale);
        let newWidthHeight = value.getWidthHeight();
        let gapDifference = [(newWidthHeight[0] - widthHeight[0]), (newWidthHeight[1] - widthHeight[1])];
        const minX = this.findMinX(data);
        const minY = this.findMinY(data);
        data = this.updateDataOnUpdatedWidth(data, this.toFixed(minX), this.toFixed(gapDifference[0]));
        data = this.updateDataOnUpdatedHeight(data, this.toFixed(minY), this.toFixed(gapDifference[1]), this.toFixed(gapY));
        if (initialRecPosition[0] === value.getConatiner().x || initialRecPosition[1] === value.getConatiner().y) {
          data = this.updateDataOnInitialValue(data, initialRecPosition);
        }
        // data = this.updateDataOnGap(data, gapDifference); 
        data.sort((a, b) => a[1] - b[1]);
        value.resetBoxes();
        console.log(value);
        this.setScale(this.currentScale);
        for (let i: number = 0; i < data.length; i++) {
          value.clickOnRectangle(data[i][0]/this.app.stage.scale.x, data[i][1]/this.app.stage.scale.y);
          this.updatePanelCount(value.zonesCount(), false, key);
        }
        if (!isEnable) {
          value.hideAll();
        }
      }
    }
  }

  private updateDataOnInitialValue(data: number[][], initialRecPosition: number[]): number[][] {
    for (let i: number = 0; i < data.length; i++) {
      data[i][0] = data[i][0] + initialRecPosition[0];
      data[i][1] = data[i][1] + initialRecPosition[1];
    }
    return data;
  }

  getValue() {
    for (const [key, value] of this.clickableContainerMap) {
      if (value.getEnabled()) {
        const oldGapY = value.getGapY();
        const gapDifference = Number(this.inputValue) - oldGapY;
        const data = value.getcenterXYRecCordinate();
        data.sort((a, b) => a[1] - b[1]);
        const minV = this.findMinY(data);
        const newData = this.updateData(data, minV, gapDifference, oldGapY);
        value.resetBoxes();
        value.setGapY(Number(this.inputValue));
        console.log(value);
        for (let i: number = 0; i < newData.length; i++) {
          value.clickOnRectangle(newData[i][0]/this.app.stage.scale.x, newData[i][1]/this.app.stage.scale.y);
          this.updatePanelCount(value.zonesCount(), false, key);
          // this.measurentContainer.visible = false;
        }
      }
    }
  }

  private findMinY(data: any): number {
    let minY: number = data[0][1];
    for (const subarray of data) {
      if (subarray[1] < minY) {
        minY = subarray[1];
      }
    }
    return minY;
  }

  private findMinX(data: any): number {
    let minY: number = data[0][0];
    for (const subarray of data) {
      if (subarray[0] < minY) {
        minY = subarray[0];
      }
    }
    return minY;
  }

  private updateDataOnUpdatedWidth(data: number[][], minV: number, difference: number): number[][] {
    for (let i: number = 0; i < data.length; i++) {
      const changeInY = ((data[i][0] - minV) / (this.width)) * difference;
      data[i][0] = data[i][0] + this.toFixed(changeInY);
    }
    return data;
  }

  private updateDataOnUpdatedHeight(data: number[][], minV: number, difference: number, gapY: number): number[][] {
    for (let i: number = 0; i < data.length; i++) {
      const changeInY = ((data[i][1] - minV) / (gapY + this.height)) * difference;
      data[i][1] = data[i][1] + changeInY
    }
    data.sort((a, b) => a[1] - b[1]);
    return data;
  }



  private updateData(data: number[][], minV: number, difference: number, oldGap: number): number[][] {
    for (let i: number = 0; i < data.length; i++) {
      const changeInY = (data[i][1] - minV) / (oldGap + this.height) * difference;
      data[i][1] = data[i][1] + this.toFixed(changeInY);
    }
    return data;
  }

  onDeleteButtonClick(event: MouseEvent): void {
    for (const [key, value] of this.clickableContainerMap) {
      if (value.getEnabled()) {
        value.destroy();
        // this.clickableContainerMap.delete(key);
        this.deleteSelectedTable(key);
        return;
      }
    }
    // this.enableDisableAllContainer(false);
    // this.hideAllContainer();
    // for (const [key, value] of this.clickableContainerMap) {
    //   value.setEnabled(true);
    //   value.showAll();
    //   return;
    // }
  }

  saveDataForBackEnd() {
    let outputStringArray: string = "";
    for (const [key, value] of this.clickableContainerMap) {
      let outputStr = "";
      outputStr = `${value.getConatiner().x},${value.getConatiner().y}`;
      for (let i: number = 0; i < value.centerXYRecCordinate.length; i++) {
        outputStr = outputStr.length ? (outputStr + ',' + value.centerXYRecCordinate[i][0]) : value.centerXYRecCordinate[i][0].toString();
        outputStr = outputStr + ',' + value.centerXYRecCordinate[i][1];
      }
      outputStringArray = outputStringArray.length ? (outputStringArray + ">" + outputStr) : outputStr;
    }
    // return outputStringArray;
    localStorage.setItem("box_Value", outputStringArray);
    // console.log('BackEndData' + outputStringArray);
  }

  getDataFromBackEnd(outputStringArray: string): void {
    let stringArray = outputStringArray.split('>');
    let data: number[][][] = [];
    for (let i: number = 0; i < stringArray.length; i++) {
      let numberArray = stringArray[i].split(',');
      let dataArray = [];
      for (let j: number = 0; j < numberArray.length; j = j + 2) {
        let singleDataArray = [];
        singleDataArray.push(Number(numberArray[j]));
        singleDataArray.push(Number(numberArray[j + 1]));
        dataArray.push(singleDataArray);
      }
      data.push(dataArray);
    }
    // console.log(data);
    this.showSavedContainer(data);
    //  let container_y = [0,400]

  }

  private showSavedContainer(data: number[][][]): void {
    if (!data) {
      return;
    }
    for (let i: number = 0; i < data.length; i++) {
      this.enableDisableAllContainer(false);
      this.createClickableContainer();
      this.hideAllContainer();
      for (let j: number = 1; j < data[i].length; j++) {
        let value = this.clickableContainerMap.get(this.highlightedKey);
        if (value) {
          value.clickOnRectangle(data[i][j][0]/this.app.stage.scale.x, data[i][j][1]/this.app.stage.scale.y);
        }
      }
      let value = this.clickableContainerMap.get(this.highlightedKey);
      if (value) {
        this.updatePanelCount(value.zonesCount(), true, this.highlightedKey);
        value.getConatiner().x = data[i][0][0];
        value.getConatiner().y = data[i][0][1];
      }
    }
  }

  sendData() {
    // this.saveDataForBackEnd(); 
    const data: any[] = [];
    for (const [key, value] of this.clickableContainerMap) {
      const singleData = [];
      singleData.push(value.getImageContainer());
      let minX = Math.min(...value.getXYArray()[0]);
      let maxX = Math.max(...value.getXYArray()[0]);
      let minY = Math.min(...value.getXYArray()[1]);
      let maxY = Math.max(...value.getXYArray()[1]);
      let minMaxArray = [minX, maxX, minY, maxY];
      singleData.push(minMaxArray);
      singleData.push(value.getcenterXYRecCordinate());
      singleData.push(value.getZonePositions());
      data.push(singleData);
    }
    this.sharedDataService.sendData(data);
    this.router.navigate(['/zoneImage']);

  }

  private deleteSelectedTable(key: string): void {
    const selectedTable = document.getElementById(key);
    if (selectedTable) {
      const parentNode = selectedTable.parentNode;
      if (parentNode) {
        parentNode.removeChild(selectedTable);
      }
    }
  }

  updateTotalBlackBox(): void {
    let totalChildren = 0;
    for (const [key, value] of this.clickableContainerMap) {
      totalChildren += value.getConatiner().children.length - 1;
    }
    this.totalBlackBox = totalChildren;
  }

  updateBlackBoxCountForSelectedOne(): void {
    let totalChildren = 0;
    for (const [key, value] of this.clickableContainerMap) {
      if (value.getEnabled()) {
        totalChildren += value.getConatiner().children.length - 1;
        break;
      }
    }
    this.blackBoxCountForSelectedOne = totalChildren;
  }

  private createMeasurent(): void {
    this.measurentContainer = new Container();
    this.app.stage.addChild(this.measurentContainer);
    this.measurementXText = new Text('X : 10', {
      fontFamily: 'Arial',
      fontSize: 30,
      fill: 0x1B1C1B,
      align: 'center',
    });
    this.measurementXText.x = 135;
    this.measurementXText.y = 0;
    this.measurentContainer.addChild(this.measurementXText);
    // this.createClickableContainer();
    this.measurementYText = new Text('Y : 10', {
      fontFamily: 'Arial',
      fontSize: 30,
      fill: 0x1B1C1B,
      align: 'center',
    });
    this.measurementYText.x = -80;
    this.measurementYText.y = 100;
    this.measurentContainer.addChild(this.measurementYText);
    const textture = Texture.from('../../assets/Buttons/arrow_right.png');
    let arrowX = new Sprite(textture);
    arrowX.scale.set(0.25, 0.2);
    arrowX.y = -41;
    let arrowY = new Sprite(textture);
    arrowY.scale.set(0.2, 0.25);
    arrowY.angle = 90;
    arrowY.x = 76.5;
    this.measurentContainer.addChild(arrowY);
    this.measurentContainer.addChild(arrowX);
    this.measurentContainer.visible = false;
    this.measurentContainer.x = 200;
    this.measurentContainer.y = 200;
  }

  private subscribeMouseMovementEventForDragEvent(): void {
    // @ts-ignore
    // this.app.view.addEventListener('mousedown', this.onMouseDown.bind(this));
    // // @ts-ignore
    // this.app.view.addEventListener('mousemove', this.onMouseMove.bind(this));
    // // @ts-ignore
    // document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  private onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    for (const [key, value] of this.clickableContainerMap) {
      value.deleteBoxEnabled = false;
    }
    for (const [key, value] of this.clickableContainerMap) {
      if (value.getEnabled()) {
        let xy = value.CheckCordinateInRectangle(event.offsetX/this.app.stage.scale.x, event.offsetY/this.app.stage.scale.y);
        if (xy?.length) {
          this.mouseDown = true;
          this.currentX = xy[0] - (this.width * 0.5);
          this.currentY = xy[1] - (this.height * 0.5);
        }
      }
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      if (this.currentX !== undefined && this.currentY !== undefined) {
        if (event.offsetX/this.app.stage.scale.x > this.currentX + this.width || event.offsetY/this.app.stage.scale.y > this.currentY + this.height ||
          event.offsetX/this.app.stage.scale.x > this.currentX - this.width || event.offsetY/this.app.stage.scale.y > this.currentY - this.height) {
          for (const [key, value] of this.clickableContainerMap) {
            if (value.getEnabled()) {
              value.getEnabled() && value.clickOnRectangle(event.offsetX/this.app.stage.scale.x
                , event.offsetY/this.app.stage.scale.y
                );
              this.updatePanelCount(value.zonesCount(), false, key);
              this.measurentContainer.visible = false;
              break
            }
          }
        }
      }

    }
  }

  private onMouseUp(event: MouseEvent): void {
    this.mouseDown = false;
    this.currentX = undefined;
    this.currentY = undefined;
    for (const [key, value] of this.clickableContainerMap) {
      value.deleteBoxEnabled = true;
    }
  }


  private createClickableContainer(): void {
    let key: string = `clickableContainer${this.clickableContainerMap.size}`;
    let container: ClickableContainer = new ClickableContainer(this.app, key);
    container.setEnabled(true);
    this.highlightedKey = key;
    this.clickableContainerMap.set(key, container);
    if (this.clickableContainerMap.get(key)?.getConatiner()) {
      let conatiner = this.clickableContainerMap.get(key)?.getConatiner();
      if (conatiner) {
        // @ts-ignore
        conatiner.interactive = true
        // @ts-ignore
        conatiner.buttonMode = true;
        // @ts-ignore
        conatiner.off("pointerdown");
        // @ts-ignore
        conatiner.on("pointerdown", this.pointerClick.bind(this));
      }
    }
  }

  private subscribeEvent(): void {
    // @ts-ignore
    this.app.view.addEventListener('click', (event: MouseEvent) => {
      if (this.clickableContainerMap.size) {
        for (const [key, value] of this.clickableContainerMap) {
          if (this.clickableContainerMap.size === 1 && value.getcenterXYRecCordinate().length === 0) {
            this.clickableContainerMap.clear();
            this.createClickableContainer();
            this.clickableContainerMap.get(this.highlightedKey)?.setPosition(event.offsetX/this.app.stage.scale.x, event.offsetY/this.app.stage.scale.y);
            this.clickableContainerMap.get(this.highlightedKey)?.clickOnRectangle(event.offsetX/this.app.stage.scale.x, event.offsetY/this.app.stage.scale.y);
            this.updatePanelCount(value.zonesCount(), false, key);
            break
          } else {
            if (value.getEnabled()) {
              value.clickOnRectangle(event.offsetX/this.app.stage.scale.x, event.offsetY/this.app.stage.scale.y);
              this.updatePanelCount(value.zonesCount(), false, key);
            }
            this.measurentContainer.visible = false;
          }
        }
      } else {
        this.createClickableContainer();
        let value = this.clickableContainerMap.get(this.highlightedKey);
        if (value) {
          value.setPosition(event.offsetX, event.offsetY);
          value.clickOnRectangle(event.offsetX/this.app.stage.scale.x, event.offsetY/this.app.stage.scale.y);
          this.updatePanelCount(value.zonesCount(), true, this.highlightedKey);
        }

      }
      this.stopMouseClick = true;
      this.updateTotalBlackBox();
    });
  }

  onFillRectangleClick(event: MouseEvent): void {
    for (const [key, value] of this.clickableContainerMap) {
      if (value.getEnabled()) {
        value.onButtonDown();
        this.updatePanelCount(value.zonesCount(), false, key);
      }
    }
  }

  private updatePanelCount(zonesCount: number[], create: boolean, id: string): void {
    this.updateTableData(zonesCount)
    if (create) {
      this.createTable(this.tableData, id);
    }
    else {
      this.updateCellValueById(id);
    }
  }

  createTable(tableData: { firstCol: string; secondCol: string; }[], id: string) {
    this.updateBlackBoxCountForSelectedOne();
    this.resetBorderColorOfTable();
    const tableElement = document.createElement("table");
    tableElement.id = id; // Set the ID of the table
    tableElement.style.border = "1px solid red";
    for (let i = 0; i < tableData.length; i++) {
      const row = document.createElement("tr");
      let cell = document.createElement(i === 0 ? "th" : "td");
      cell.textContent = tableData[i].firstCol;
      row.appendChild(cell);
      cell = document.createElement(i === 0 ? "th" : "td");
      cell.textContent = tableData[i].secondCol;
      row.appendChild(cell);
      tableElement.appendChild(row);
    }
    document.body.appendChild(tableElement);
  }

  private updateTableData(zonesCount: number[]): void {
    for (let i: number = 1; i < this.tableData.length; i++) {
      this.tableData[i].secondCol = zonesCount[i - 1] > 0 ? `${zonesCount[i - 1]}` : '0';
    }
  }

  updateCellValueById(tableId: string) {
    this.resetBorderColorOfTable();
    const table = document.getElementById(tableId);
    if (table !== null) {
      table.style.border = "1px solid red";
      for (let i = 0; i < this.tableData.length; i++) {
        if (table instanceof HTMLTableElement) {
          const targetCell = table.rows[i].cells[1];
          if (targetCell) {
            if (i === this.tableData.length) {
              targetCell.textContent = this.blackBoxCountForSelectedOne.toString();
            } else {
              targetCell.textContent = this.tableData[i].secondCol;
            }
          }

        }
      }
    }
  }

  private resetBorderColorOfTable(): void {
    this.clickableContainerMap.forEach((value, key) => {
      const table = document.getElementById(key);
      if (table !== null) {
        table.style.border = "";
      }
    });
  }


  onMeasurementCalculation(event: MouseEvent): void {
    for (const [key, value] of this.clickableContainerMap) {
      if (value.getEnabled()) {
        let xy = value.getXYArray();
        this.measurentContainer.visible = true;
        this.measurentContainer.x = value.getConatiner().x + Math.min(...xy[0]) - 120;
        this.measurentContainer.y = value.getConatiner().y + Math.min(...xy[1]) - 80;
        this.measurementXText.text = `X : ${((Math.max(...xy[0]) - Math.min(...xy[0])) / 1152).toFixed(2)} ft`;
        this.measurementYText.text = `Y : ${((Math.max(...xy[1]) - Math.min(...xy[1])) / 1152).toFixed(2)} ft`;
      }
    }
  }
  onCreateImageButtonClick(event: MouseEvent): void {
    for (const [key, value] of this.clickableContainerMap) {
      value.createImageContainer();
    }
  }

  private pointerClick(event: any): void {
    // if(!this.deleteBoxEnabled){
    //   return ;
    // }
    if (event.target.name === 'changePositionButton') {
      return;
    }
    this.hideAllContainer();
    this.enableDisableAllContainer(false);
    let key: string = event.target.name;
    this.clickableContainerMap.get(key)?.showAll();
    this.clickableContainerMap.get(key)?.setEnabled(true);
    this.clickableContainerMap.get(key)?.setPositionButtonVisible(true);
  }
  // this.clickableContainerMap.get(this.highlightedKey)?.onButtonDown();


  private enableDisableAllContainer(action: boolean): void {
    for (const [key, value] of this.clickableContainerMap) {
      value.setEnabled(action);
    }
  }

  private checkEnabledConatiner(): string {
    for (const [key, value] of this.clickableContainerMap) {
      if (value.getEnabled()) {
        return key;
      }
    }
    return "clickableContainer1"
  }

  private hideAllContainer(): void {
    for (const [key, value] of this.clickableContainerMap) {
      value.hideAll();
    }
  }

  onCloneButtonClicked(event: MouseEvent): void {
    let highlightedKey: string = this.checkEnabledConatiner();
    const highlightedObj = this.clickableContainerMap.get(highlightedKey);
    const clonedContainer = highlightedObj?.cloneContainer();
    let xy = highlightedObj?.returnXY();
    let xyArray = highlightedObj?.getXYArray(true);
    let recCordinate = highlightedObj?.getRectangleCordinate(true);
    let centerRecCordinate = highlightedObj?.getcenterXYRecCordinate(true);
    const centerxycordinatesMapInXPerspective = new Map(highlightedObj?.centerxycordinatesMapInXPerspective);
    const centerxycordinatesMapInYPerspective = new Map(highlightedObj?.centerxycordinatesMapInYPerspective);
    let key: string = `clickableContainer${this.clickableContainerMap.size}`;
    let container: ClickableContainer = new ClickableContainer(this.app, key, clonedContainer);
    this.enableDisableAllContainer(false);
    container.setScale(this.currentScale);
    this.setScale(this.currentScale);
    this.highlightedKey = key;
    this.clickableContainerMap.set(key, container);
    this.hideAllContainer();
    const clonedObj = this.clickableContainerMap.get(key);
    if (clonedObj) {
      clonedObj.showAll();
      clonedObj.setEnabled(true);
      if (xy) {
        clonedObj.setXY(xy[0], xy[1]);
        clonedObj.setInitialContainerPosition(xy[0], xy[1]);
      }
      clonedObj.centerxycordinatesMapInYPerspective = centerxycordinatesMapInYPerspective;
      clonedObj.centerxycordinatesMapInXPerspective = centerxycordinatesMapInXPerspective;
      clonedObj.setRectangleCordinate(recCordinate ? recCordinate : []);
      clonedObj.setcenterXYRecCordinate(centerRecCordinate ? centerRecCordinate : []);
      clonedObj.setXYArray(xyArray ? xyArray[0] : [], xyArray ? xyArray[1] : []);
      clonedObj.changeButtonPosition();
      clonedObj.setZonesPositions();
      this.updatePanelCount(container.zonesCount(), true, key);
    }
    if (clonedObj?.getConatiner()) {
      let conatiner = clonedObj?.getConatiner();
      if (conatiner) {
        // @ts-ignore
        conatiner.interactive = true;
        // @ts-ignore
        conatiner.buttonMode = true;
        // @ts-ignore
        conatiner.off("pointerdown");
        // @ts-ignore
        conatiner.on("pointerdown", this.pointerClick.bind(this));
      }
    }
  }
}