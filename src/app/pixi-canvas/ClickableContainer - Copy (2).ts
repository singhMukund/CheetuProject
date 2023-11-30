// import imgSrc from '../../assets/Buttons/position_icon.png';

import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
export interface zonePositons {
    zones_A_positions: number[][];
    zone_B_north_row_count_positions: number[][];
    zone_B_Edge_count_positions: number[][];
    zone_C_South_south_positions: number[][];
    zone_C_Interior_Panel_positions: number[][];
    zone_D_Interior_Panel_positions: number[][];
}



// @ts-ignore

export class ClickableContainer {
    private rectangleContanier!: Container;
    private app: Application;
    private x_array: number[];
    private y_array: number[];
    private rectangleCordinate: number[][];
    centerXYRecCordinate: number[][];
    private changePositionButton!: Sprite;
    private imagedContainer!: Container;

    // bigFilledGraphic!: Graphics;
    private isEnabled: boolean = true;
    public deleteBoxEnabled: boolean = true;
    private gapY: number = 15;
    private zonesColor = {
        zones_A: 0xfd0000,
        zone_B_north_row_count: 0xffbf03,
        zone_B_Edge_count: 0xffbf03,
        zone_C_South_south: 0x01b0ee,
        zone_C_Interior_Panel: 0x01b0ee,
        zone_D_Interior_Panel: 0x93d152
    }
    private zones_A_positions: number[][] = [];
    private zone_B_north_row_count_positions: number[][] = [];
    private zone_B_Edge_count_positions: number[][] = [];
    private zone_C_South_south_positions: number[][] = [];
    private zone_C_Interior_Panel_positions: number[][] = [];
    private zone_D_Interior_Panel_positions: number[][] = [];
    centerxycordinatesMapInXPerspective: Map<number, number[][]> = new Map();
    centerxycordinatesMapInYPerspective: Map<number, number[][]> = new Map();
    private centerXPosition: number[] = [];
    private centerYPosition: number[] = [];
    private virtualyRowAndCol: number[][][] = [];
    private width: number = 60;
    private height: number = 20;
    private initialContainerXPosition: number = 0;
    private initialContainerYPosition: number = 0;
    private isTopBarrier: boolean = false;
    private isDownBarrier: boolean = false;
    private isLeftBarrier: boolean = true;
    private isRightBarrier: boolean = false;




    constructor(app: Application, key: string, container?: Container) {
        this.app = app;
        this.rectangleContanier = container ? container : new Container;

        this.x_array = [];
        this.y_array = [];
        this.rectangleCordinate = [];
        this.centerXYRecCordinate = [];
        this.app.stage.addChild(this.rectangleContanier);
        this.imagedContainer = new Container;
        this.app.stage.addChild(this.imagedContainer);
        // @ts-ignore
        this.rectangleContanier.name = key;
        this.initializeButtonImage();
        // this.bigFilledGraphic = new Graphics();
        // this.rectangleContanier.addChildAt(this.bigFilledGraphic, 0);
        this.subscribeEvent();
        this.movementManagement();
    }

    setPosition(x:number,y:number)  :void{
        this.rectangleContanier.position.set(x,y);
    }



    setInitialContainerPosition(x: number, y: number) {
        x !== this.initialContainerXPosition && (this.initialContainerXPosition = x);
        y !== this.initialContainerYPosition && (this.initialContainerYPosition = y);
    }

    getInitialContainerPositon(): number[] {
        return [this.initialContainerXPosition, this.initialContainerYPosition];
    }

    getGapY(): number {
        return this.gapY;
    }

    setGapY(y: number): void {
        this.gapY = y;
    }

    getWidthHeight(): number[] {
        return [this.width, this.height];
    }

    setScale(scale: number): void {
        this.width = 60 * scale;
        this.height = 20 * scale;
    }

    getConatiner(): Container {
        return this.rectangleContanier;
    }

    public setXYArray(value1: number[], value2: number[]): void {
        this.x_array = value1;
        this.y_array = value2;
    }

    private findMinMax(data: any): void {
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const positions = data[key];
                for (const position of positions) {
                    if (Array.isArray(position) && position.length === 2) {
                        const [x, y] = position;
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
        }
    }

    private deleteCenterRecCordinate(x: number, y: number) {
        this.centerXYRecCordinate = this.centerXYRecCordinate.filter(item => !(item[0] === x && item[1] === y));
        if (this.centerxycordinatesMapInYPerspective.has(y)) {
            let value = this.centerxycordinatesMapInYPerspective.get(y);
            const index = value!.findIndex((subarray) => subarray[0] === x && subarray[1] === y);
            if (index !== -1) {
                value!.splice(index, 1);
            }
            if (value?.length === 0) {
                this.centerxycordinatesMapInYPerspective.delete(y);
            }
        }
        if (this.centerxycordinatesMapInXPerspective.has(x)) {
            let value = this.centerxycordinatesMapInXPerspective.get(x);
            const index = value!.findIndex((subarray) => subarray[0] === x && subarray[1] === y);
            if (index !== -1) {
                value!.splice(index, 1);
            }
            if (value?.length === 0) {
                this.centerxycordinatesMapInXPerspective.delete(x);
            }
        }
    }

    public getXYArray(newArray?: boolean): [number[], number[]] {
        if (newArray) {
            const new_x_array = [...this.x_array];
            const new_y_array = [...this.y_array];
            return [new_x_array, new_y_array]
        }
        return [this.x_array, this.y_array];
    }

    public setRectangleCordinate(value: number[][]): void {
        this.rectangleCordinate = value;
    }

    public setcenterXYRecCordinate(value: number[][]): void {
        this.centerXYRecCordinate = value;
    }

    public getRectangleCordinate(new_array?: true): number[][] {
        if (new_array) {
            const new_rectangleCordinate = this.rectangleCordinate.map(row => [...row]);
            return new_rectangleCordinate;
        }
        return this.rectangleCordinate;
    }

    public getcenterXYRecCordinate(newArray?: boolean): number[][] {
        if (newArray) {
            const newCenterXYRecCordinate = this.centerXYRecCordinate.map(row => [...row]);
            return newCenterXYRecCordinate;
        }
        return this.centerXYRecCordinate;
    }

    private initializeButtonImage(): void {
        const textture = Texture.from('../../assets/Buttons/position_icon.png');
        this.changePositionButton = new Sprite(textture);
        this.rectangleContanier.addChild(this.changePositionButton);
        let changePositionButtonX = Math.min(...this.x_array) - this.width;
        let changePositionButtonY = Math.max(...this.y_array) + this.height;
        this.changePositionButton.visible = true;
        // @ts-ignore
        this.changePositionButton.name = 'changePositionButton';
        this.changePositionButton.setTransform(changePositionButtonX, changePositionButtonY, 0.05, 0.05);
        // const rotationButtonTexture = Texture.from(imgSrc);
        // this.changePositionButton = new Sprite(rotationButtonTexture);
        // this.app.stage.addChild(this.changePositionButton);
        // this.rectangleContanier.addChild(this.changePositionButton);
        // this.changePositionButton.x = 200;
        // this.changePositionButton.y = 200;
    }



    private subscribeEvent(): void {
        // @ts-ignore
        this.rectangleContanier.buttonMode = true;
        // this.app.view.addEventListener('click', (event) => {
        //     let xyPositions = this.CheckCordinateInRectangle(event.x, event.y);
        //     if (xyPositions) {
        //         this.createRectangle(xyPositions[0], xyPositions[1]);
        //         console.log("Click from inside");
        //     }
        // });
    }

    clickOnRectangle(x: number, y: number) {
        let xyPositions = this.CheckCordinateInRectangle(x, y);
        this.setInitialContainerPosition(this.rectangleContanier.x, this.rectangleContanier.y);
        console.log(xyPositions);
        if (xyPositions) {
            this.createRectangle(xyPositions[0], xyPositions[1]);
            // console.log("Click from inside");
        }
    }

    public checkIsThisClickIsOfSameObject(x: number, y: number): boolean {
        if (this.rectangleContanier.x === x && this.rectangleContanier.y === y) {
            return true;
        } else {
            return false;
        }
    }



    CheckCordinateInRectangle(x: number, y: number) {
        // x = x / this.app.stage.scale.x;
        // y = y/ this.app.stage.scale.y;
        x = Number(((x - this.rectangleContanier.x)).toFixed(0)) ;
        y = y - Number((this.rectangleContanier.y).toFixed(0));
        if (this.rectangleCordinate.length) {
            for (let i = 0; i < this.rectangleCordinate.length; i++) {
                if (x >= this.rectangleCordinate[i][0] && x <= this.rectangleCordinate[i][1] && y >= this.rectangleCordinate[i][2] && y <= this.rectangleCordinate[i][3]) {
                    return [(this.rectangleCordinate[i][1] - (this.width * 0.5)), (this.rectangleCordinate[i][3] - (this.height * 0.5))]
                }
            }
            return undefined;
        } else {
            return [x, y];
        }
    }

    createRectangle(x: number, y: number) {
      // this.stopMouseClick = true;
      if (this.checkAndRemove(x, y)) {
        return;
    }
    if (this.checkRectangleExistOrNot(x, y)) {
        return;
    }
    let centerContainer = new Container();
    // this.centerRecCordinate.push([[x - 10 , x + 10],[y - 15, y + 15]]);
    const blackedShapeGraphics = new Graphics();
    blackedShapeGraphics.beginFill(0x171717);
    blackedShapeGraphics.drawRect(x - (this.width * 0.5), y - (this.height * 0.5), this.width, this.height);
    blackedShapeGraphics.endFill();
    // @ts-ignore
    blackedShapeGraphics.name = 'blackedShapeGraphics';
    centerContainer.addChild(blackedShapeGraphics);

    const outerShape = new Graphics();
    outerShape.beginFill(0xffdb08);
    outerShape.drawRect(x - (0.5 * this.width), y - (0.5 * this.height), this.width, this.height);
    outerShape.endFill();
    // @ts-ignore
    outerShape.name = 'outerShape';
    centerContainer.addChild(outerShape);
    var outerMostShape = new Graphics();
    outerMostShape.lineStyle(2, 0xffffff);
    outerMostShape.drawRect((x - (0.5 * this.width)),
        (y - (0.5 * this.height)), this.width, this.height);
    outerMostShape.alpha = 1;
    outerMostShape.endFill();
    // @ts-ignore
    outerMostShape.name = 'outerMostShape'
    centerContainer.addChild(outerMostShape);
    const rectangle = new Graphics();
    rectangle.beginFill(0x0c0c0c);
    rectangle.drawRect(x - (0.5 * this.percenatgeValue(this.width, 67)), y - (0.5 * (this.percenatgeValue(this.height, 80))), this.percenatgeValue(this.width, 67), this.percenatgeValue(this.height, 80));
    rectangle.endFill();
    // @ts-ignore
    rectangle.name = 'middleBlackShape';
    centerContainer.addChild(rectangle);
    this.createRectangleAroundTheShape(x, y, this.width, this.height, centerContainer);
    this.x_array.push(x - (this.width * 0.5), x + (this.width * 0.5));
    this.y_array.push(y - (this.height * 0.5), y + (this.height * 0.5));
    this.rectangleCordinate.push([x - (this.width * 0.5), x + (this.width * 0.5), y - (this.height * 0.5), y + (this.height * 0.5)]);
    this.centerXYRecCordinate.push([x, y]);
    if (this.centerXPosition.indexOf(x) === -1) {
        this.centerXPosition.push(x);
    }
    if (this.centerYPosition.indexOf(y) === -1) {
        this.centerYPosition.push(y);
    }
    if (this.centerxycordinatesMapInYPerspective.has(y)) {
        const existingValue = this.centerxycordinatesMapInYPerspective.get(y);
        if (existingValue !== undefined) {
            existingValue.push([x, y]);
            existingValue.sort((a, b) => a[0] - b[0]);
            this.centerxycordinatesMapInYPerspective.set(y, existingValue);
        }

    } else {
        this.centerxycordinatesMapInYPerspective.set(y, [[x, y]]);
    }
    if (this.centerxycordinatesMapInXPerspective.has(x)) {
        const existingValue = this.centerxycordinatesMapInXPerspective.get(x);
        if (existingValue !== undefined) {
            existingValue.push([x, y]);
            existingValue.sort((a, b) => a[1] - b[1]);
            this.centerxycordinatesMapInXPerspective.set(x, existingValue);
        }

    } else {
        this.centerxycordinatesMapInXPerspective.set(x, [[x, y]]);
    }
    // @ts-ignore
    centerContainer.name = `clickedCenterContainer_${x}_${y}`;
    this.rectangleContanier.addChildAt(centerContainer, 1);
    // this.rectangleContanier.anchor
    let changePositionButtonX = Math.min(...this.x_array) - (this.width + 10);
    let changePositionButtonY = Math.max(...this.y_array) + this.height;
    this.changePositionButton.setTransform(changePositionButtonX, changePositionButtonY, 0.05, 0.05);
    // this.changePositionButton.anchor.set()
    // if(this.app.stage.scale.x <= 1){
    //     this.app.stage.pivot.set((window.innerWidth * this.app.stage.scale.x) * 0.5, (window.innerHeight * this.app.stage.scale.x) * 0.5);
    // }else{
        
    // }
    // this.app.stage.pivot.set((window.innerWidth) * 0.5, (window.innerHeight) * 0.5);
    // this.app.stage.position.set(this.app.stage.pivot.x, this.app.stage.pivot.y);
    // console.log("Total Row" + this.centerYPosition.length);
        
    }

    private percenatgeValue(num: number, percenatge: number): number {
        return ((num * percenatge) / 100);
    }

    // public getCenterYPosition() :

    public zonesCount(): number[] {
        this.setZonesPositions();
        return [this.zones_A_positions.length, this.zone_B_Edge_count_positions.length,
        this.zone_B_north_row_count_positions.length, this.zone_C_South_south_positions.length,
        this.zone_C_Interior_Panel_positions.length,
        this.zone_D_Interior_Panel_positions.length];
    }

    getImageContainer(): Container {
        // const newContainer = this.cloneImageContainer();
        return this.imagedContainer;
    }

    private createZoneImage(x: number, y: number, colorCode: number): Container {
        const zoneContainer = new Container();
        let zonesShape = new Graphics();
        //0xdae9eb
        zonesShape.lineStyle(2, 0xdae9eb);
        zonesShape.drawRect(x, y, this.width, this.height);
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

    createImageContainer(): void {
        this.imagedContainer.removeChildren();
        this.imagedContainer.visible = true;
        this.imagedContainer.setTransform(this.rectangleContanier.x, this.rectangleContanier.y)
        this.zones_A_positions.forEach((zone_Positions) => {
            let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zones_A);
            // @ts-ignore
            zoneShapeContainer.name = 'zonesAShape';
            this.imagedContainer.addChild(zoneShapeContainer);
        });
        this.zone_B_Edge_count_positions.forEach((zone_Positions) => {
            let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_B_Edge_count);
            // @ts-ignore
            zoneShapeContainer.name = 'zone_B_Edge';
            this.imagedContainer.addChild(zoneShapeContainer);
        });
        this.zone_B_north_row_count_positions.forEach((zone_Positions) => {
            let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_B_north_row_count);
            // @ts-ignore
            zoneShapeContainer.name = 'zone_B_north_row';
            this.imagedContainer.addChild(zoneShapeContainer);

        });
        this.zone_C_Interior_Panel_positions.forEach((zone_Positions) => {
            let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_C_Interior_Panel);
            // @ts-ignore
            zoneShapeContainer.name = 'zone_C_Interior_Panel';
            this.imagedContainer.addChild(zoneShapeContainer);
        });
        this.zone_C_South_south_positions.forEach((zone_Positions) => {
            let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_C_South_south);
            // @ts-ignore
            zoneShapeContainer.name = 'zone_C_South_south';
            // this.imagedContainer.addChild(zonesAShape);
            this.imagedContainer.addChild(zoneShapeContainer);
        });
        this.zone_D_Interior_Panel_positions.forEach((zone_Positions) => {
            let zoneShapeContainer = this.createZoneImage(zone_Positions[0], zone_Positions[1], this.zonesColor.zone_D_Interior_Panel);
            // @ts-ignore
            zoneShapeContainer.name = 'zone_D_Interior_Panel';
            this.imagedContainer.addChild(zoneShapeContainer);
        });
    }

    isSubArrayPresent(arr: number[][], subArray: number[]): boolean {
        for (const element of arr) {
            if (element.length !== subArray.length) {
                continue;
            }

            let isMatch = true;
            for (let i = 0; i < element.length; i++) {
                if (element[i] !== subArray[i]) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return true;
            }
        }

        return false;
    }

    areArraysEqual(arr1: number[], arr2: number[]): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    findMinKeyInMap<K>(map: Map<K, any>): K | undefined {
        let minKey: K | undefined = undefined;
        for (const key of map.keys()) {
            if (minKey === undefined || (minKey && key < minKey)) {
                minKey = key;
            }
        }
        return minKey;
    }

    findMaxKeyInMap<K>(map: Map<K, any>): K | undefined {
        let maxKey: K | undefined = undefined;
        for (const key of map.keys()) {
            if (maxKey === undefined || (maxKey && key > maxKey)) {
                maxKey = key;
            }
        }
        return maxKey;
    }

    setZonesPositions(): void {
        let remaingZones: number[][] = [];
        // console.clear()
        this.resetZonesPositions();
        this.centerxycordinatesMapInYPerspective.forEach((value, key) => {
            if (value[0]) {
                let yRowValue = this.centerxycordinatesMapInXPerspective.get(value[0][0]);
                if (yRowValue) {
                    if (this.areArraysEqual(value[0], yRowValue[0])) {
                        this.zones_A_positions.push([value[0][0] - (this.width * 0.5), value[0][1] - (this.height * 0.5)]);
                        remaingZones.push(value[0]);
                    }
                    if (!this.areArraysEqual(value[0], value[value.length - 1])) {
                        yRowValue = this.centerxycordinatesMapInXPerspective.get(value[value.length - 1][0]);
                        if (yRowValue) {
                            if (this.areArraysEqual(value[value.length - 1], yRowValue[0])) {
                                this.zones_A_positions.push([value[value.length - 1][0] - (this.width * 0.5), value[value.length - 1][1] - (this.height * 0.5)]);
                                remaingZones.push(value[value.length - 1]);
                            }
                        }
                    }
                }

            }
        });
        for (let i: number = 0; i < this.centerXYRecCordinate.length; i++) {
            let nearestXPosition = this.centerXYRecCordinate[i][0] - this.width;
            let nearestRightXPosition = this.centerXYRecCordinate[i][0] + this.width;
            let nearestYPosition = this.centerXYRecCordinate[i][1] - this.height - this.gapY;
            let isNerestLeftAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [nearestXPosition, this.centerXYRecCordinate[i][1]]);
            let isNearesetRightAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [nearestRightXPosition, this.centerXYRecCordinate[i][1]]);
            let isNearestUppAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [this.centerXYRecCordinate[i][0], nearestYPosition]);
            if ((!isNerestLeftAvailable && !isNearestUppAvailable) || (!isNearesetRightAvailable && !isNearestUppAvailable)) {
                if (!this.isSubArrayPresent(this.zones_A_positions, [this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)])) {
                    this.zones_A_positions.push([this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)]);
                    remaingZones.push(this.centerXYRecCordinate[i]);
                }
            }
        }
        // console.log('zones_A_positions');
        // console.log(this.zones_A_positions);


        let minKey = this.findMinKeyInMap(this.centerxycordinatesMapInYPerspective);
        let maxKey = this.findMaxKeyInMap(this.centerxycordinatesMapInYPerspective);

        this.centerxycordinatesMapInXPerspective.forEach((value, key) => {
            if (this.isSubArrayPresent(this.zones_A_positions, [value[0][0] - (this.width * 0.5), value[0][1] - (this.height * 0.5)]) === false) {
                if (this.isSubArrayPresent(this.zone_B_north_row_count_positions, [value[0][0] - (this.width * 0.5), value[0][1] - (this.height * 0.5)]) === false) {
                    this.zone_B_north_row_count_positions.push([value[0][0] - (this.width * 0.5), value[0][1] - (this.height * 0.5)]);
                    remaingZones.push(value[0]);
                }
            }
        });
        for (let i: number = 0; i < this.centerXYRecCordinate.length; i++) {
            let nearestXPosition = this.centerXYRecCordinate[i][0] - this.width;
            let nearestRightXPosition = this.centerXYRecCordinate[i][0] + this.width;
            let nearestYPosition = this.centerXYRecCordinate[i][1] - this.height - this.gapY;
            let isNerestLeftAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [nearestXPosition, this.centerXYRecCordinate[i][1]]);
            let isNearesetRightAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [nearestRightXPosition, this.centerXYRecCordinate[i][1]]);
            let isNearestUppAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [this.centerXYRecCordinate[i][0], nearestYPosition]);
            if ((isNerestLeftAvailable && !isNearestUppAvailable) || (isNearesetRightAvailable && !isNearestUppAvailable)) {
                if (!this.isSubArrayPresent(this.zones_A_positions, [this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)])) {
                    if (!this.isSubArrayPresent(this.zone_B_north_row_count_positions, [this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)])) {
                        this.zone_B_north_row_count_positions.push([this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)]);
                        remaingZones.push(this.centerXYRecCordinate[i]);
                    }
                }
            }
        }
        // console.log('zone_B_north_row_count_positions');
        // console.log(this.zone_B_north_row_count_positions);

        this.centerxycordinatesMapInYPerspective.forEach((value, key) => {
            if (this.isSubArrayPresent(this.zones_A_positions, [value[0][0] - (this.width * 0.5), value[0][1] - (this.height * 0.5)]) === false) {
                if (this.isSubArrayPresent(this.zone_B_Edge_count_positions, [value[0][0] - (this.width * 0.5), value[0][1] - (this.height * 0.5)]) === false) {
                    this.zone_B_Edge_count_positions.push([value[0][0] - (this.width * 0.5), value[0][1] - (this.height * 0.5)]);
                    remaingZones.push(value[0]);
                }
            }
            if (this.isSubArrayPresent(this.zones_A_positions, [value[value.length - 1][0] - (this.width * 0.5), value[value.length - 1][1] - (this.height * 0.5)]) === false) {
                if (this.isSubArrayPresent(this.zone_B_Edge_count_positions, [value[value.length - 1][0] - (this.width * 0.5), value[value.length - 1][1] - (this.height * 0.5)]) === false) {
                    this.zone_B_Edge_count_positions.push([value[value.length - 1][0] - (this.width * 0.5), value[value.length - 1][1] - (this.height * 0.5)]);
                    remaingZones.push(value[value.length - 1]);
                }

            }
        });

        for (let i: number = 0; i < this.centerXYRecCordinate.length; i++) {
            let nearestXPosition = this.centerXYRecCordinate[i][0] - this.width;
            let nearestRightXPosition = this.centerXYRecCordinate[i][0] + this.width;
            let nearestYPosition = this.centerXYRecCordinate[i][1] - this.height - this.gapY;
            let isNerestLeftAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [nearestXPosition, this.centerXYRecCordinate[i][1]]);
            let isNearesetRightAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [nearestRightXPosition, this.centerXYRecCordinate[i][1]]);
            let isNearestUppAvailable = this.isSubArrayPresent(this.centerXYRecCordinate, [this.centerXYRecCordinate[i][0], nearestYPosition]);
            if ((!isNerestLeftAvailable && isNearestUppAvailable) || (!isNearesetRightAvailable && isNearestUppAvailable)) {
                if (!this.isSubArrayPresent(this.zones_A_positions, [this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)])) {
                    if (!this.isSubArrayPresent(this.zone_B_north_row_count_positions, [this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)])) {
                        if (!this.isSubArrayPresent(this.zone_B_Edge_count_positions, [this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)])) {
                            this.zone_B_Edge_count_positions.push([this.centerXYRecCordinate[i][0] - (this.width * 0.5), this.centerXYRecCordinate[i][1] - (this.height * 0.5)]);
                            remaingZones.push(this.centerXYRecCordinate[i]);
                        }
                    }
                }
            }
        }
        // console.log('zone_B_Edge_count_positions');
        // console.log(this.zone_B_Edge_count_positions);


        if (minKey !== undefined && minKey !== null && maxKey !== undefined && maxKey !== null) {
            this.centerxycordinatesMapInXPerspective.forEach((value, key) => {
                if ((this.isSubArrayPresent(this.zones_A_positions, [value[value.length - 1][0] - (this.width * 0.5), value[value.length - 1][1] - (this.height * 0.5)]) === false) &&
                    (this.isSubArrayPresent(this.zone_B_Edge_count_positions, [value[value.length - 1][0] - (this.width * 0.5), value[value.length - 1][1] - (this.height * 0.5)]) === false) &&
                    (this.isSubArrayPresent(this.zone_B_north_row_count_positions, [value[value.length - 1][0] - (this.width * 0.5), value[value.length - 1][1] - (this.height * 0.5)]) === false)) {
                    this.zone_C_South_south_positions.push([value[value.length - 1][0] - (this.width * 0.5), value[value.length - 1][1] - (this.height * 0.5)]);
                    remaingZones.push(value[value.length - 1]);
                }
            })
        }




        if (minKey !== undefined && minKey !== null && maxKey !== undefined && maxKey !== null) {
            this.centerxycordinatesMapInYPerspective.forEach((value, key) => {
                if ((minKey && key > minKey) && (maxKey && key < maxKey)) {
                    for (let i: number = 0; i < value.length; i++) {
                        if ((i === 1) || (i === value.length - 2)) {
                            if (i !== 0 && i !== value.length - 1) {
                                if (!this.isSubArrayPresent(this.zones_A_positions, [value[i][0] - (this.width * 0.5), value[i][1] - (this.height * 0.5)])) {
                                    if (!this.isSubArrayPresent(this.zone_B_north_row_count_positions, [value[i][0] - (this.width * 0.5), value[i][1] - (this.height * 0.5)])) {
                                        if (!this.isSubArrayPresent(this.zone_B_Edge_count_positions, [value[i][0] - (this.width * 0.5), value[i][1] - (this.height * 0.5)])) {
                                            if (this.isSubArrayPresent(this.zone_C_Interior_Panel_positions, [value[i][0] - (this.width * 0.5), value[i][1] - (this.height * 0.5)]) === false) {
                                                if (this.isSubArrayPresent(this.zone_C_South_south_positions, [value[i][0] - (this.width * 0.5), value[i][1] - (this.height * 0.5)]) === false) {
                                                    this.zone_C_Interior_Panel_positions.push([value[i][0] - (this.width * 0.5), value[i][1] - (this.height * 0.5)]);
                                                    remaingZones.push(value[i]);
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            })
        }

        for (let i: number = 0; i < this.centerXYRecCordinate.length; i++) {
            let x = this.centerXYRecCordinate[i][0] - (this.width * 0.5);
            let y = this.centerXYRecCordinate[i][1] - (this.height * 0.5);
            if (!this.isSubArrayPresent(this.zones_A_positions, [x, y])) {
                if (!this.isSubArrayPresent(this.zone_B_north_row_count_positions, [x, y])) {
                    if (!this.isSubArrayPresent(this.zone_B_Edge_count_positions, [x, y])) {
                        if (this.isSubArrayPresent(this.zone_C_Interior_Panel_positions, [x, y]) === false) {
                            if (this.isSubArrayPresent(this.zone_C_South_south_positions, [x, y]) === false) {
                                this.zone_D_Interior_Panel_positions.push([x, y]);
                            }
                        }
                    }
                }
            }
        }
        this.filterWindBarrier();
    }

    private filterWindBarrier(): void {
        if (this.isTopBarrier && !this.isLeftBarrier && !this.isRightBarrier) {
            this.zones_A_positions.forEach((value) => {
                this.zone_B_Edge_count_positions.push(value);
            })
            this.zones_A_positions = [];
        } else if (this.isTopBarrier && this.isLeftBarrier && this.isRightBarrier) {
            this.zones_A_positions.forEach((value) => {
                this.zone_C_Interior_Panel_positions.push(value);
            })
            this.zones_A_positions = [];
        } else if (this.isTopBarrier && !this.isLeftBarrier && this.isRightBarrier) {
            this.zones_A_positions.forEach((value) => {
                if (!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] + (this.width * 1.5), value[1] + (this.height * 0.5)])) {
                    this.zone_C_Interior_Panel_positions.push(value);
                } else {
                    this.zone_B_Edge_count_positions.push(value);
                }

            })
            this.zones_A_positions = [];
        } else if (this.isTopBarrier && this.isLeftBarrier && !this.isRightBarrier) {
            this.zones_A_positions.forEach((value) => {
                if (!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] + (this.width * 1.5), value[1] + (this.height * 0.5)])) {
                    this.zone_B_Edge_count_positions.push(value);
                } else {
                    this.zone_C_Interior_Panel_positions.push(value);
                }

            })
            this.zones_A_positions = [];
        }else if(!this.isTopBarrier && !this.isLeftBarrier && this.isRightBarrier){
            for(let i : number = 0;i<this.zones_A_positions.length;i++){
                const value = this.zones_A_positions[i];
                if (!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] + (this.width * 1.5), value[1] + (this.height * 0.5)])) {
                    this.zone_B_north_row_count_positions.push(value);
                    this.zones_A_positions.splice(i,1);
                    i--;
                }
            }
        }else if(!this.isTopBarrier && !this.isRightBarrier&& this.isLeftBarrier){
            for(let i : number = 0;i<this.zones_A_positions.length;i++){
                const value = this.zones_A_positions[i];
                if (!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] - (this.width * 0.5), value[1] + (this.height * 0.5)])) {
                    this.zone_B_north_row_count_positions.push(value);
                    this.zones_A_positions.splice(i,1);
                    i--;
                }
            }
        }

        if (this.isTopBarrier) {
            this.zone_B_north_row_count_positions.forEach((value) => {
                if ((!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] - (this.width * 2.5), value[1] + (this.height * 0.5)]))
                    || (!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] + (this.width * 2.5), value[1] + (this.height * 0.5)]))) {
                    this.zone_C_Interior_Panel_positions.push(value);
                } else {
                    this.zone_D_Interior_Panel_positions.push(value);
                }

            })
            this.zone_B_north_row_count_positions = [];
        }

        if (this.isDownBarrier) {
            this.zone_C_South_south_positions.forEach((value) => {
                if ((!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] - (this.width * 1.5), value[1] + (this.height * 0.5)]))
                    || (!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] + (this.width * 2.5), value[1] + (this.height * 0.5)]))) {
                    this.zone_C_Interior_Panel_positions.push(value);
                } else {
                    this.zone_D_Interior_Panel_positions.push(value);
                }

            })
            this.zone_C_South_south_positions = [];
        }
        if (this.isLeftBarrier && this.isRightBarrier) {
            let newArray = this.zone_C_Interior_Panel_positions.map(row => [...row]);
            this.zone_C_Interior_Panel_positions = [];
            this.zone_C_Interior_Panel_positions = this.zone_B_Edge_count_positions.map(row => [...row]);
            this.zone_B_Edge_count_positions = [];
            newArray.forEach((value) => {
                if ((!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] - (this.width * 0.5), value[1] + (this.height * 0.5)]))
                    || (!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] + (this.width * 1.5), value[1] + (this.height * 0.5)]))) {
                    this.zone_C_Interior_Panel_positions.push(value);
                } else {
                    this.zone_D_Interior_Panel_positions.push(value);
                }
                //  this.zone_D_Interior_Panel_positions.push(value);
            })
            newArray = [];
        }
        if (this.isLeftBarrier && !this.isRightBarrier) {
            let newArray: number[][] = [];
            this.zone_B_Edge_count_positions.forEach((value) => {
                if ((!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] - (this.width * 0.5), value[1] + (this.height * 0.5)]))) {
                    this.zone_C_Interior_Panel_positions.push(value);
                }else{
                    newArray.push(value)
                }
                //  this.zone_D_Interior_Panel_positions.push(value);
            })
            this.zone_B_Edge_count_positions = [];
            this.zone_B_Edge_count_positions = newArray;
        }
        if (!this.isLeftBarrier && this.isRightBarrier) {
            let newArray: number[][] = [];
            this.zone_B_Edge_count_positions.forEach((value) => {
                if ((!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] + (this.width * 1.5), value[1] + (this.height * 0.5)]))) {
                    this.zone_C_Interior_Panel_positions.push(value);
                }else{
                    newArray.push(value)
                }
                //  this.zone_D_Interior_Panel_positions.push(value);
            })
            this.zone_B_Edge_count_positions = [];
            this.zone_B_Edge_count_positions = newArray;
        }
        const arrayToBeDeleted: number[][] = [];
        this.zone_C_Interior_Panel_positions.forEach((value) => {
            let leftmrgin = 1.5;
            let rightmargin = 2.5;
            if(!this.isLeftBarrier && this.isRightBarrier){
                leftmrgin = 1.5;
                rightmargin = 1.5;
            }else if(this.isLeftBarrier && !this.isRightBarrier){
                rightmargin = 2.5;
                leftmrgin = 0.5;
            }
            if (!(this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] - (this.width * leftmrgin), value[1] + (this.height * 0.5)]))) {
                // this.zone_D_Interior_Panel_positions.push(value);
                arrayToBeDeleted.push(value)
            }else if((!this.isSubArrayPresent(this.centerXYRecCordinate, [value[0] + (this.width * rightmargin), value[1] + (this.height * 0.5)]))){
                arrayToBeDeleted.push(value)
            }else{
                this.zone_D_Interior_Panel_positions.push(value);
            }
        });
        this.zone_C_Interior_Panel_positions = [];
        this.zone_C_Interior_Panel_positions = arrayToBeDeleted.map(row => [...row]);
        // const arrayToBeDeleted: number[][] = [];
        // this.zone_C_Interior_Panel_positions.forEach((value) => {
        //     arrayToBeDeleted.push([value[0] + (0.5 * this.width),value[1]]);
        // })

        


    }

    containsArray(array: number[][], target: number[]): boolean {
        return array.some(arr => this.areArraysEqual(arr, target));
    }



    getZonePositions(): any {
        let zonePositons: zonePositons = {
            zones_A_positions: this.zones_A_positions,
            zone_B_Edge_count_positions: this.zone_B_Edge_count_positions,
            zone_B_north_row_count_positions: this.zone_B_north_row_count_positions,
            zone_C_Interior_Panel_positions: this.zone_C_Interior_Panel_positions,
            zone_C_South_south_positions: this.zone_C_South_south_positions,
            zone_D_Interior_Panel_positions: this.zone_D_Interior_Panel_positions
        }
        return zonePositons;
    }

    arrayToString(arr: number[][]): string[] {
        return arr.map(subArray => subArray.toString());
    }

    // Function to find the uncommon subarrays between arrays A and B
    findUncommonSubArrays(arrA: number[][], arrB: number[][]): number[][] {
        const uncommonSubArrays: number[][] = [];
        const setA = new Set(this.arrayToString(arrA));
        const setB = new Set(this.arrayToString(arrB));

        for (const subArrayA of arrA) {
            if (!setB.has(subArrayA.toString())) {
                uncommonSubArrays.push(subArrayA);
            }
        }

        for (const subArrayB of arrB) {
            if (!setA.has(subArrayB.toString())) {
                uncommonSubArrays.push(subArrayB);
            }
        }

        return uncommonSubArrays;
    }

    // private printCorners() {
    //     if(!this.centerXYRecCordinate.length){
    //         return;
    //     }
    //     // Sort the coordinates based on their y-coordinate (row) in ascending order
    //     const sortedCoordinates = this.centerXYRecCordinate.slice().sort((a, b) => a[1] - b[1]);

    //     let currentRow = sortedCoordinates[0][1]; // The y-coordinate of the current row
    //     let currentRowBoxes = [];

    //     for (const [x, y] of sortedCoordinates) {
    //       if (y !== currentRow) {
    //         console.log("printA_");
    //         // If the y-coordinate changes, it means we have moved to a new row
    //         // Print the left and right corners of the current row
    //         const leftCorner = currentRowBoxes.reduce((min, box) => (box[0] < min[0] ? box : min));
    //         const rightCorner = currentRowBoxes.reduce((max, box) => (box[0] > max[0] ? box : max));
    //         console.log(leftCorner, rightCorner);

    //         // Update for the new row
    //         currentRow = y;
    //         currentRowBoxes = [];
    //       }

    //       currentRowBoxes.push([x, y]);
    //     }

    //     // Print the left and right corners of the last row
    //     const leftCorner = currentRowBoxes.reduce((min, box) => (box[0] < min[0] ? box : min));
    //     const rightCorner = currentRowBoxes.reduce((max, box) => (box[0] > max[0] ? box : max));

    //     console.log(leftCorner, rightCorner);
    // }

    private resetZonesPositions() {
        this.zones_A_positions = [];
        this.zone_B_north_row_count_positions = [];
        this.zone_B_Edge_count_positions = [];
        this.zone_C_South_south_positions = [];
        this.zone_C_Interior_Panel_positions = [];
        this.zone_D_Interior_Panel_positions = [];
    }

    // private fillRectangle(x: number, y: number) {
    //     if (this.checkRectangleExistOrNot(x, y)) {
    //         return;
    //     }
    //     let fillCenterContainer = new Container();
    //     const blackedShapeGraphics = new Graphics();
    //     blackedShapeGraphics.beginFill(0x171717);
    //     blackedShapeGraphics.drawRect(x - 30, y - 10, 60, 20);
    //     blackedShapeGraphics.endFill();
    //     // @ts-ignore
    //     blackedShapeGraphics.name = 'blackedShapeGraphics';
    //     fillCenterContainer.addChild(blackedShapeGraphics);
    //     const outerShape = new Graphics();
    //     outerShape.beginFill(0xffdb08);
    //     outerShape.drawRect(x - (0.5 * 60), y - (0.5 * 20), 60, 20);
    //     outerShape.endFill();
    //     fillCenterContainer.addChild(outerShape);
    //     const rectangle = new Graphics();
    //     rectangle.beginFill(0x0c0c0c);
    //     rectangle.drawRect(x - (0.5 * 40), y - (0.5 * 16), 40, 16);
    //     rectangle.endFill();
    //     // @ts-ignore
    //     rectangle.name = 'middleBlackShape';
    //     fillCenterContainer.addChild(rectangle);
    //     var outerMostShape = new Graphics();
    //     outerMostShape.lineStyle(2, 0xffffff);
    //     outerMostShape.drawRect(x - (0.5 * 58), y - (0.5 * 18), 58, 18);
    //     outerMostShape.endFill();
    //     outerMostShape.alpha = 0.3;
    //     // this.rectangleCordinate.push([x - 30, x + 30, y - 10, y + 10]);
    //     // @ts-ignore
    //     outerMostShape.name = 'outerMostShape';
    //     fillCenterContainer.addChild(outerMostShape);
    //     // @ts-ignore
    //     fillCenterContainer.name = `clickedCenterContainer_${x}_${y}`;
    //     this.x_array.push(x - 30, x + 30);
    //     this.y_array.push(y - 10, y + 10);
    //     this.rectangleCordinate.push([x - 30, x + 30, y - 10, y + 10]);
    //     this.centerXYRecCordinate.push([x, y]);
    //     this.createRectangleAroundTheShape(x, y, 60, 20, fillCenterContainer);
    //     this.rectangleContanier.addChildAt(fillCenterContainer, 1);
    //     let changePositionButtonX = Math.min(...this.x_array) - 60;
    //     let changePositionButtonY = Math.max(...this.y_array) + 20;
    //     this.changePositionButton.setTransform(changePositionButtonX, changePositionButtonY, 0.05, 0.05);
    // }

    private checkRectangleExistOrNot(x: number, y: number) {
        for (let i: number = 0; i < this.rectangleContanier.children.length; i++) {
            // @ts-ignore
            if (this.rectangleContanier.children[i].name === `clickedCenterContainer_${x}_${y}`) {
                return true;
            }
        }
        return false;
    }

    private checkAndRemove(x: number, y: number): boolean {
        if (!this.deleteBoxEnabled) {
            return false;
        }
        for (let i: number = 0; i < this.rectangleContanier.children.length; i++) {
            // @ts-ignore
            if (this.rectangleContanier.children[i].name === `clickedCenterContainer_${x}_${y}`) {
                this.rectangleContanier.removeChild(this.rectangleContanier.children[i]);
                this.deleteElement(this.x_array, x);
                this.deleteElement(this.y_array, y);
                this.deleteCenterRecCordinate(x, y);
                this.deleteRectangleCoordinate(x, y, (this.width * 0.5), (this.height * 0.5));
                if (this.rectangleContanier.children.length === 1) {
                    this.destroy();
                }
                return true;
            }
        }
        return false;
    }

    setPositionButtonVisible(action: boolean): void {
        this.changePositionButton.visible = action;
    }

    destroy() {
        this.rectangleContanier.visible = false;
        this.rectangleContanier.alpha = 0;
        // this.rectangleContanier.parent.removeChild(this.rectangleContanier);
        // this.rectangleContanier.destroy({ children: true, texture: true, baseTexture: true });
        this.x_array = [];
        this.y_array = [];
        this.rectangleCordinate = [];
        this.centerXYRecCordinate = [];
        this.centerXPosition = [];
        this.centerYPosition = [];
        this.centerxycordinatesMapInYPerspective.clear();
        this.centerxycordinatesMapInXPerspective.clear();
        this.resetZonesPositions();
        this.setEnabled(false);
    }

    resetBoxes(): void {
        while (this.rectangleContanier.children.length !== 1) {
            this.rectangleContanier.children.forEach((child, index) => {
                if (!(child instanceof Sprite)) {
                    this.rectangleContanier.removeChildAt(index);
                }
            })
        }
        this.x_array = [];
        this.y_array = [];
        this.rectangleCordinate = [];
        this.centerXYRecCordinate = [];
        this.centerXPosition = [];
        this.centerYPosition = [];
        this.centerxycordinatesMapInYPerspective.clear();
        this.centerxycordinatesMapInXPerspective.clear();
        this.resetZonesPositions();
    }

    private deleteElement(array: number[], elements: number): void {
        const index = array.indexOf(elements);
        if (index > -1) { // only splice array when item is found
            array.splice(index, 1); // 2nd parameter means remove one item only
        }
    }

    private deleteRectangleCoordinate(x: number, y: number, w: number, h: number) {
        this.checkAndFilterRectangleCordinate(x - (1.5 * w), x - (1.5 * w), y - (0.5 * h), y - (0.5 * h) + this.height);
        this.checkAndFilterRectangleCordinate(x - (0.5 * w), x - (0.5 * w) + this.width, y - (1.5 * h), y - (1.5 * h) + this.height);
        this.checkAndFilterRectangleCordinate(x + (0.5 * w), x + (0.5 * w) + this.width, y - (0.5 * h), y - (0.5 * h) + this.height);
        this.checkAndFilterRectangleCordinate(x - (0.5 * w), x - (0.5 * w), y + (0.5 * h), y + (0.5 * h) + this.height);
    }

    private createZonesTableWithColor(): void {

    }

    private checkAndFilterRectangleCordinate(x1: number, x2: number, y1: number, y2: number): void {
        if (!(this.rectangleCordinateIsInCenterRectangle(x1, x2, y1, y2))) {
            this.rectangleCordinate = this.rectangleCordinate.filter(item => !(item[0] === x1 && item[1] === x2 && item[2] === y1 && item[3] === y2));
        }
    }

    private rectangleCordinateIsInCenterRectangle(x1: number, x2: number, y1: number, y2: number): boolean {
        for (let i: number = 0; i < this.centerXYRecCordinate.length; i++) {
            let newArray: number[] = [this.centerXYRecCordinate[i][0] - this.width, this.centerXYRecCordinate[i][0] + this.width, this.centerXYRecCordinate[i][1] - this.height, this.centerXYRecCordinate[i][1] + this.height];
            if (newArray[0] === x1 && newArray[1] === x2 && newArray[2] === y1 && newArray[3] === y2) {
                return true;
            }
        }
        return false;
    }

    private centerContainer(): void {

    }

    changeButtonPosition(): void {
        this.changePositionButton.visible = true;
        let changePositionButtonX = Math.min(...this.x_array) - this.width;
        let changePositionButtonY = Math.max(...this.y_array) + this.height;
        this.changePositionButton.setTransform(changePositionButtonX, changePositionButtonY, 0.05, 0.05);
    }

    createRectangleAroundTheShape(x: number, y: number, w: number, h: number, centerContainer: Container) {
        // var surroundedRectCont = new Container();
        var surroundedRect = new Graphics();
        surroundedRect.lineStyle(2, 0xffffff);
        surroundedRect.drawRect(x - (1.5 * w), y - (0.5 * h), w, h)
        surroundedRect.endFill();
        centerContainer.addChild(surroundedRect);
        this.rectangleCordinate.push([x - (1.5 * w), x - (1.5 * w) + this.width, y - (0.5 * h), y - (0.5 * h) + this.height]);

        surroundedRect.lineStyle(2, 0xffffff);
        surroundedRect.drawRect(x - (0.5 * w), y - (1.5 * h) - this.gapY, w, h)
        surroundedRect.endFill();
        centerContainer.addChild(surroundedRect);
        this.rectangleCordinate.push([x - (0.5 * w), x - (0.5 * w) + this.width, y - (1.5 * h) - this.gapY, y - (1.5 * h) + this.height - this.gapY]);

        surroundedRect.lineStyle(2, 0xffffff);
        surroundedRect.drawRect(x + (0.5 * w), y - (0.5 * h), w, h)
        surroundedRect.endFill();
        centerContainer.addChild(surroundedRect);
        this.rectangleCordinate.push([x + (0.5 * w), x + (0.5 * w) + this.width, y - (0.5 * h), y - (0.5 * h) + this.height]);

        surroundedRect.lineStyle(2, 0xffffff);
        surroundedRect.drawRect(x - (0.5 * w), y + (0.5 * h) + this.gapY, w, h)
        surroundedRect.endFill();
        // @ts-ignore
        surroundedRect.name = 'surroundedRect';
        centerContainer.addChild(surroundedRect);
        this.rectangleCordinate.push([x - (0.5 * w), x - (0.5 * w) + this.width, y + (0.5 * h) + this.gapY, y + (0.5 * h) + this.gapY + this.height]);
        // centerContainer.addChild(surroundedRectCont);
    }

    returnXY(): number[] {
        return [this.rectangleContanier.x, this.rectangleContanier.y];
    }

    setXY(x: number, y: number): void {
        this.rectangleContanier.x = x;
        this.rectangleContanier.y = y;
    }

    clickOnBigFilledGraphic(): void {
        // if(!this.bigFilledGraphic){
        //     return
        // }
        // this.bigFilledGraphic.interactive = true;
        // this.bigFilledGraphic.buttonMode = true;
        // this.bigFilledGraphic.off("pointerdown");
        // this.bigFilledGraphic.on("pointerdown", this.pointerClick.bind(this));
    }

    // private pointerClick(event:any) :void{
    //     this.setEnabled(true);
    //     this.showAll();
    // }

    private movementManagement(): void {
        // @ts-ignore
        this.changePositionButton.interactive = true;
        // @ts-ignore
        this.changePositionButton.buttonMode = true;

        let clickOffsetX = 0;
        let clickOffsetY = 0;
        let pointerdown = false;


        // @ts-ignore
        this.changePositionButton.on("pointerdown", (event) => {
            pointerdown = true
            clickOffsetX = event.data.global.x - this.rectangleContanier.x;
            clickOffsetY = event.data.global.y - this.rectangleContanier.y;
        });


        // @ts-ignore
        document.addEventListener("pointerup", () => {
            pointerdown = false;
            clickOffsetX = 0;
            clickOffsetY = 0;
        });

        // @ts-ignore
        this.app.view.addEventListener("pointermove", (event) => {
            if (clickOffsetX !== 0 && clickOffsetY !== 0) {
                if (pointerdown) {
                    // @ts-ignore
                    this.rectangleContanier.x = event.clientX - clickOffsetX;
                    // @ts-ignore
                    this.rectangleContanier.y = event.clientY - clickOffsetY;
                }
            }
        });

    }


    onButtonDown(): void {
        // console.log(this.centerXYRecCordinate);
        let x = Math.min(...this.x_array);
        let y = Math.min(...this.y_array);
        let outputArray = this.convertArray(this.centerXYRecCordinate);
        this.setInitialContainerPosition(this.rectangleContanier.x, this.rectangleContanier.y);
        for (let i = 0; i < outputArray.length; i++) {
            let x_new = outputArray[i][0];
            let y_new = outputArray[i][1];
            this.createRectangle(x_new, y_new);
        }
        let width = Math.max(...this.x_array) - Math.min(...this.x_array);
        let height = Math.max(...this.y_array) - Math.min(...this.y_array);
        // this.bigFilledGraphic.name = 'bigFilledGraphic'
        // this.bigFilledGraphic.beginFill(0x121212);
        // this.bigFilledGraphic.drawRect(x, y, width, height);
        // this.bigFilledGraphic.endFill();
        // this.rectangleContanier.addChildAt(this.bigFilledGraphic, 0);
    }

    public hideAll(): void {
        // const color = new filters.ColorMatrixFilter();
        // color.desaturate();
        for (let i: number = 0; i < this.rectangleContanier.children.length; i++) {
            if ((this.rectangleContanier.children[i] as Container).children.length) {
                for (let j: number = 0; j < (this.rectangleContanier.children[i] as Container).children.length; j++) {
                    // @ts-ignore
                    if (!((this.rectangleContanier.children[i] as Container).children[j].name === 'blackedShapeGraphics')) {

                        // (this.rectangleContanier.children[i] as Container).children[j].filters  =  [color];
                        // @ts-ignore
                        if ((this.rectangleContanier.children[i] as Container).children[j].name === 'outerMostShape') {
                            (this.rectangleContanier.children[i] as Container).children[j].alpha = 0.3;
                        } else {
                            (this.rectangleContanier.children[i] as Container).children[j].visible = false;
                        }

                    }
                }
            }
        }
        this.setPositionButtonVisible(false);
        // his.bigFilledGraphic.visible = true;
    }

    public showAll(): void {
        for (let i: number = 0; i < this.rectangleContanier.children.length; i++) {
            if ((this.rectangleContanier.children[i] as Container).children.length) {
                for (let j: number = 0; j < (this.rectangleContanier.children[i] as Container).children.length; j++) {
                    (this.rectangleContanier.children[i] as Container).children[j].visible = true;
                    (this.rectangleContanier.children[i] as Container).children[j].alpha = 1;
                }
            }
        }
        this.changePositionButton.visible = true;
    }

    public setEnabled(value: boolean): void {
        this.isEnabled = value;
    }

    public getEnabled(): boolean {
        return this.isEnabled;
    }

    // private convertArray(inputArray: number[][]) {
    //     const col1 = inputArray.map((subArray) => subArray[0]);
    //     const col2 = inputArray.map((subArray) => subArray[1]);
    //     col1.sort((x1, x2) => x1 - x2);
    //     col2.sort((y1, y2) => y1 - y2);
    //     const outputArray = [];
    //     for (const num1 of col1) {
    //         for (const num2 of col2) {
    //             outputArray.push([num1, num2]);
    //         }
    //     }
    //     return outputArray;
    // }

    convertArray(inputArray: number[][]): number[][] {
        let col1 = inputArray.map((subArray) => subArray[0]);
        col1 = Array.from(new Set(col1))
        let col2 = inputArray.map((subArray) => subArray[1]);
        col2 = Array.from(new Set(col2))
        col1.sort((x1, x2) => x1 - x2);
        col2.sort((y1, y2) => y1 - y2);
        const outputArray: number[][] = [];
        for (const num1 of col1) {
            for (const num2 of col2) {
                outputArray.push([num1, num2]);
            }
        }
        const newOutArray: number[][] = [];
        for (let i: number = 0; i < outputArray.length; i++) {
            if (!(inputArray.some(subArray => JSON.stringify(subArray) === JSON.stringify(outputArray[i])))) {
                newOutArray.push(outputArray[i])
            }
        }
        return newOutArray;
    }

    cloneImageContainer() {
        let newContainer = new Container();

        // Clone each child shape and add it to the new container
        this.imagedContainer.children.forEach((child) => {
            if (!(child instanceof Sprite)) {
                // @ts-ignore
                if ((child.name === 'bigFilledGraphic')) {
                    let clonedChild = (child as any).clone();
                    newContainer.addChild(clonedChild);
                } else {
                    // const clonedChild = (child as any).clone();
                    // newContainer.addChild(clonedChild);
                    const clonedChildContainer = this.cloneOfContainerType(child as any)
                    newContainer.addChild(clonedChildContainer);
                }
            }
        });

        return newContainer;
    }

    cloneContainer() {
        let newContainer = new Container();

        // Clone each child shape and add it to the new container
        this.rectangleContanier.children.forEach((child) => {
            if (!(child instanceof Sprite)) {
                // @ts-ignore
                if ((child.name === 'bigFilledGraphic')) {
                    let clonedChild = (child as any).clone();
                    newContainer.addChild(clonedChild);
                } else {
                    // const clonedChild = (child as any).clone();
                    // newContainer.addChild(clonedChild);
                    const clonedChildContainer = this.cloneOfContainerType(child as any)
                    newContainer.addChild(clonedChildContainer);
                }
            }
        });

        return newContainer;
    }

    private cloneOfContainerType(containerAtLocal: Container): Container {
        let clonedContainer = new Container();
        // Clone the properties of the original container
        clonedContainer.position.copyFrom(containerAtLocal.position);
        clonedContainer.scale.copyFrom(containerAtLocal.scale);
        clonedContainer.rotation = containerAtLocal.rotation;
        // @ts-ignore
        clonedContainer.name = containerAtLocal.name;

        // Clone the children elements of the original container
        for (let i: number = 0; i < containerAtLocal.children.length; i++) {
            let clonedChild;
            // if((containerAtLocal.children[i] as Graphics).name === 'blackedShapeGraphics' || 
            //    (containerAtLocal.children[i] as Graphics).name === 'outerMostShape'){

            // }else{
            //     clonedChild = (containerAtLocal.children[i] as Graphics).clone();
            // }

            clonedChild = (containerAtLocal.children[i] as Graphics).clone();
            // @ts-ignore
            clonedChild.name = (containerAtLocal.children[i] as Graphics).name;
            clonedChild.visible = true;
            clonedChild.alpha = (containerAtLocal.children[i] as Graphics).alpha;
            clonedContainer.addChild(clonedChild);
        }
        return clonedContainer;
    }
}