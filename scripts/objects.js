class Objects {
    constructor() {
    }
    surfer(x, y, surfer_image) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.surfer_image = surfer_image;
        this.surfer_image.src = "/images/astro-default.png";
        return this;
    }
    bullet(x, y) {
        this.x = x;
        this.y = y;
        return this;

    }
    crab(x, y, line, column, crab_image) {

        this.x = x;
        this.y = y;
        this.line = line;
        this.column = column;
        this.width = 33;
        this.height = 25;
        this.crab_image = crab_image;
        this.crab_image.src = '/images/crab.png';

        return this;

    }
    shell(x, y) {
        this.x = x;
        this.y = y;
        return this;

    }
}; 







