export default class Fender {
    constructor(id, simCtx, fenderPosX, fenderPosY, forceLimit, thickness, width, limits) {
        this.id = id;
        this.simCtx = simCtx;

        this.posX = fenderPosX;
        this.posY = fenderPosY;

        this.forceLimit = forceLimit;
        this.thicknessInM = thickness;
        this.widthInM = width;
        this.limit = limits;

        this.currentForce;

        // colors 
        this.colorFirstLimit = 'orange';
        this.colorNoLimit = 'green';
        this.colorSecondLimit = 'red';
    }

    draw(ctx=this.simCtx.ctx) {
        // Calculating pos with height=0 bc fenderOriginDefinition = x: widhth/2 y:0
        const posOnCanvas = this.simCtx.originToCanvasCoords(this.posX, this.posY, this.thicknessInM, 0);
        ctx.fillStyle = this.getFenderColor();
        ctx.fillRect(posOnCanvas.x, posOnCanvas.y, this.simCtx.meterToPx(this.widthInM), this.simCtx.meterToPx(this.thicknessInM))
    }

    setCurrentForce(force) {
        this.currentForce = force;
    }

    setBreakingTimePoint(timePoint) {
        this.breakingTimePoint = timePoint;
    }

    setHasBroken(hasBroken) {
        this.hasBroken = hasBroken;
    }

    getFenderColor() {
        if (this.hasBroken) return "blue";
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