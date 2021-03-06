import bolderImage from '../../assets/images/bolder.png'

export default class Hawser {
    constructor(id, simCtx, bolderPosX, bolderPosY, limits) {
        this.id = id;
        this.simCtx = simCtx;
        this.bolderPosX = bolderPosX;
        this.bolderPosY = bolderPosY;
        this.limit = limits;

        this.posOnShipX = 0;
        this.posOnShipY = 0;
        this.loadRatio;

        this.breakingTimePoint;
        this.hasBroken = false;

        this.bolderWidthInM = 5;
        this.bolderHeightInM = this.bolderWidthInM;

        // colors 
        this.colorFirstLimit = 'orange';
        this.colorNoLimit = 'green';
        this.colorSecondLimit = 'red';

        this.image = new Image();
        this.image.src = bolderImage;
        this.imageIsLoaded = false;
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            this.image.onload = function(){
                this.imageIsLoaded = true;
                console.log('Bolder image loaded');
                resolve();
            }.bind(this);
        });
    }

    draw(ctx=this.simCtx.ctx) {
        // get coordinates
        const canvasCoordsBolderCenter = this.simCtx.originToCanvasCoords(
            this.bolderPosX, 
            this.bolderPosY, 
        );
        const canvasCoordsHawser = this.simCtx.originToCanvasCoords(
            this.posOnShipX, 
            this.posOnShipY, 
        );

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.getHawserColor();
        if (this.hasBroken) ctx.setLineDash([5]);
        ctx.moveTo(canvasCoordsBolderCenter.x, canvasCoordsBolderCenter.y);
        ctx.lineTo(canvasCoordsHawser.x, canvasCoordsHawser.y);
        ctx.stroke();
        ctx.closePath();

        // reset lines to solid
        if (this.hasBroken) ctx.setLineDash([]);

        // draw bolderImage
        const imageWidthInPx = this.simCtx.meterToPx(this.bolderWidthInM);
        const imageHeightInPx = this.simCtx.meterToPx(this.bolderHeightInM);

        const canvasCoordsBolderImage = this.simCtx.originToCanvasCoords(
            this.bolderPosX, 
            this.bolderPosY,
            this.bolderWidthInM, 
            this.bolderHeightInM,
        );

        ctx.drawImage(this.image, canvasCoordsBolderImage.x, canvasCoordsBolderImage.y, imageWidthInPx, imageHeightInPx);

    }

    setPosOnShipX(posX, amplification) {
        this.posOnShipX = posX;
    }

    setPosOnShipY(posY, amplification) {
        this.posOnShipY = posY;
    }

    setLoadRatio(loadRatio) {
        this.loadRatio = loadRatio;
    }

    setBreakingTimePoint(timePoint) {
        this.breakingTimePoint = timePoint;
    }

    setHasBroken(hasBroken) {
        this.hasBroken = hasBroken;
    }

    getHawserColor() {
        // const ratio = this.currentLoad / this.forceMax;
        const ratio = this.loadRatio;
        if (ratio > this.limit.second && ratio <= this.limit.first) {
            return this.colorFirstLimit;
        } else if ( ratio > this.limit.first) {
            this.hasBroken = true;
            return this.colorSecondLimit;
        }
        return this.colorNoLimit;
    }
}