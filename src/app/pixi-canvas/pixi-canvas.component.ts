import { Component, ElementRef, OnInit, asNativeElements } from '@angular/core';
import { Application, Container, Filter, Graphics, Point, Sprite, Text, Texture, filters } from 'pixi.js';
import { ClickableContainer } from './ClickableContainer';

// import { Application } from 'pixijs';

@Component({
  selector: 'app-pixi-canvas',
  templateUrl: './pixi-canvas.component.html',
  styleUrls: ['./pixi-canvas.component.css']
})
export class PixiCanvasComponent implements OnInit {
  private app!: Application;
  private rectangleContanier!: Container;
  private new_big_rectangle!: Container;
  private buttonClick: boolean = false;
  private stopMouseClick: boolean = false;
  private buttonContainer!: Container;
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
  private startPoint: Point | null = null;
  private startMouse: Point | null = null;
  private mouseDown: boolean = false;
  private currentX: number | undefined = -1;
  private currentY: number | undefined = -1;

  zone_D_Interior_Panel : number = 10;
  zone_C_South_south : number = 5;
  zone_C_Interior_count : number = 5;
  zone_B_north_row_count : number = 4;
  zone_B_Edge_count : number = 3;
  zone_A_count : number = 2
  totalBlackBox : number= 0;
  blackBoxCountForSelectedOne : number= 0;

  // private ballImage! : Sprite;
  // private moveRight = true;
  // private moveDown = false;
  // private moveLeft = false;
  // private moveUp = false;


  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.app = new Application({
      width: 1280,
      height: 920,
      backgroundColor: 0x808080,
    });

    this.el.nativeElement.appendChild(this.app.view);
    (globalThis as any).__PIXI_APP__ = this.app;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.rectangleContanier = new Container();
    this.new_big_rectangle = new Container();
    this.buttonContainer = new Container();
    this.app.stage.addChild(this.rectangleContanier);
    this.app.stage.addChild(this.new_big_rectangle);
    this.app.stage.addChild(this.buttonContainer);
    this.rectangleOnMouse = new Graphics();
    this.rectangleOnMouse.beginFill(0x171717);
    this.rectangleOnMouse.drawRect(5, 5, 30, 40);
    this.rectangleOnMouse.endFill();

    this.app.stage.addChild(this.rectangleOnMouse);
    this.app.view.addEventListener('mousemove', (event) => {
      !this.stopMouseClick && this.rectangleOnMouse.position.set(event.x, event.y);
      this.stopMouseClick && (this.rectangleOnMouse.visible = false);
    });
    this.createMeasurent();
    // this.createButtonAndSetEvent();
    this.subscribeEvent();
    this.subscribeMouseMovementEventForDragEvent();
    // this.ballAnimation();
  }

  onDeleteButtonClick(event : MouseEvent) :void{
    for (const [key, value] of this.clickableContainerMap) {
      if(value.getEnabled()){
        value.destroy();
        this.clickableContainerMap.delete(key);
        return;
      }
    }
  }

  updateTotalBlackBox() :void{
    let totalChildren = 0;
    for (const [key, value] of this.clickableContainerMap) {
      totalChildren += value.getConatiner().children.length - 1;
    }
    this.totalBlackBox = totalChildren;
  }

  updateBlackBoxCountForSelectedOne() :void{
    let totalChildren = 0;
    for (const [key, value] of this.clickableContainerMap) {
      if(value.getEnabled()){
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
    this.app.view.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.app.view.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.app.view.addEventListener('mouseup', this.onMouseUp.bind(this));
  }
 
  private onMouseDown(event:MouseEvent) :void{
    this.mouseDown= true;
    for (const [key, value] of this.clickableContainerMap) {
      value.deleteBoxEnabled = false;
    }
    for (const [key, value] of this.clickableContainerMap) {
      if(value.getEnabled()){
        let xy = value.CheckCordinateInRectangle(event.offsetX,event.offsetY);
        if(xy?.length){
          this.mouseDown = true;
          this.currentX = xy[0] - 30;
          this.currentY = xy[1] - 10;
        }
      }
    }
  }

  // private ballAnimation() :void{
  //   const ballImageTexture = Texture.from('../../assets/Ball_image.png');
  //   this.ballImage = new Sprite(ballImageTexture);
  //   this.ballImage.name = 'ballImage';
  //   this.ballImage.setTransform(100,100,0.25,0.25);
  //   this.app.stage.addChild(this.ballImage);
  //   setTimeout(()=>{
  //     this.playBallAnimation(true);
  //   },3000);
  // }

  // private playBallAnimation(isPlay:boolean) {
  //   let x1 = 100;
  //   let x2 = 800;
  //   let y1 = 100;
  //   let y2 = 450;
  //   isPlay = true;
  //    if(!isPlay){
  //     return;
  //    }
  //    if (this.moveRight) {
  //     this.ballImage.x += 0.5;
  //     if (this.ballImage.x >= x2) {
  //       this.ballImage.x = x2;
  //       this.moveRight = false;
  //       this.moveDown = true;
  //     }
  //   } else if (this.moveDown) {
  //     this.ballImage.y += 0.5;
  //     if (this.ballImage.y >= y2) {
  //       this.ballImage.y = y2;
  //       this.moveDown = false;
  //       this.moveLeft = true;
  //     }
  //   } else if (this.moveLeft) {
  //     this.ballImage.x -= 0.5;
  //     if (this.ballImage.x <= x1) {
  //       this.ballImage.x = x1;
  //       this.moveLeft = false;
  //       this.moveUp = true;
  //     }
  //   } else if (this.moveUp) {
  //     this.ballImage.y -= 0.5;
  //     if (this.ballImage.y <= y1) {
  //       this.ballImage.y = y1;
  //       this.moveUp = false;
  //       this.moveRight = true;
  //     }
  //   }
  //    setTimeout(()=>{
  //     this.playBallAnimation(isPlay);
  //    },16.66)
  // }

  private onMouseMove(event:MouseEvent) :void{
    if(this.mouseDown){
      if(this.currentX !== undefined && this.currentY !== undefined){
        if(event.offsetX > this.currentX + 60 || event.offsetY > this.currentY + 20){
          for (const [key, value] of this.clickableContainerMap) {
            value.getEnabled() && value.clickOnRectangle(event.offsetX, event.offsetY);
            this.measurentContainer.visible = false;
            break
          }
        }
      }
      
    }
  }

  private onMouseUp(event:MouseEvent) :void{
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
        conatiner.interactive = true
        conatiner.buttonMode = true;
        conatiner.off("pointerdown");
        conatiner.on("pointerdown", this.pointerClick.bind(this));
      }
    }
  }

  private subscribeEvent(): void {
    this.app.view.addEventListener('click', (event) => {
      if (this.clickableContainerMap.size) {
        for (const [key, value] of this.clickableContainerMap) {
          if (this.clickableContainerMap.size === 1 && value.getcenterXYRecCordinate().length === 0) {
            this.clickableContainerMap.clear();
            this.createClickableContainer();
            this.clickableContainerMap.get(this.highlightedKey)?.clickOnRectangle(event.offsetX, event.offsetY);
            break
          } else {
            if(value.getEnabled()){
              value.clickOnRectangle(event.offsetX, event.offsetY);
              this.updatePanelCount(value.zonesCount());
            } 
            this.measurentContainer.visible = false;
          }
        }
      } else {
        this.createClickableContainer();
        this.clickableContainerMap.get(this.highlightedKey)?.clickOnRectangle(event.offsetX, event.offsetY);
      }
      this.stopMouseClick = true;
      this.updateTotalBlackBox();
    });
  }

  onFillRectangleClick(event :MouseEvent): void {
    for (const [key, value] of this.clickableContainerMap) {
      if (value.getEnabled()) {
        value.onButtonDown();
        this.updatePanelCount(value.zonesCount());
      }
    }
  }

  private updatePanelCount(zonesCount : number[]) :void{
    this.zone_A_count = zonesCount[0];
    this.zone_B_Edge_count = zonesCount[1] > 0 ? zonesCount[1] : 0;
    this.zone_B_north_row_count = zonesCount[2] > 0? zonesCount[2] :0;
    this.zone_C_Interior_count = zonesCount[4] > 0? zonesCount[4]: 0;
    this.zone_C_South_south = zonesCount[3] > 0 ? zonesCount[3]: 0;
    this.zone_D_Interior_Panel = zonesCount[5] > 0 ? zonesCount[5]: 0;
  }

  onMeasurementCalculation(event : MouseEvent): void {
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

  onCloneButtonClicked(event : MouseEvent): void {
    let highlightedKey: string = this.checkEnabledConatiner();
    const clonedContainer = this.clickableContainerMap.get(highlightedKey)?.cloneContainer();
    let xy = this.clickableContainerMap.get(highlightedKey)?.returnXY();
    let xyArray = this.clickableContainerMap.get(highlightedKey)?.getXYArray();
    let recCordinate = this.clickableContainerMap.get(highlightedKey)?.getRectangleCordinate();
    let centerRecCordinate = this.clickableContainerMap.get(highlightedKey)?.getcenterXYRecCordinate();
    let key: string = `clickableContainer${this.clickableContainerMap.size}`;
    let container: ClickableContainer = new ClickableContainer(this.app, key, clonedContainer);
    this.enableDisableAllContainer(false);
    this.highlightedKey = key;
    this.clickableContainerMap.set(key, container);
    this.hideAllContainer();
    this.clickableContainerMap.get(key)?.showAll();
    this.clickableContainerMap.get(key)?.setEnabled(true);
    this.clickableContainerMap.get(key)?.setXY(xy ? xy[0] : 400, xy ? xy[1] : 300);
    this.clickableContainerMap.get(key)?.setRectangleCordinate(recCordinate ? recCordinate : []);
    this.clickableContainerMap.get(key)?.setcenterXYRecCordinate(centerRecCordinate ? centerRecCordinate : []);
    this.clickableContainerMap.get(key)?.setXYArray(xyArray ? xyArray[0] : [], xyArray ? xyArray[1] : []);
    this.clickableContainerMap.get(key)?.changeButtonPosition();
    if (this.clickableContainerMap.get(key)?.getConatiner()) {
      let conatiner = this.clickableContainerMap.get(key)?.getConatiner();
      if (conatiner) {
        conatiner.interactive = true
        conatiner.buttonMode = true;
        conatiner.off("pointerdown");
        conatiner.on("pointerdown", this.pointerClick.bind(this));
      }
    }


  }
}