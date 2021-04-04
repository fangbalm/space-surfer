function Objects() { 

}; 

Objects.prototype.surfer = function(x, y, surfer_image){
    this.x = x; 
    this.y = y; 
    this.width = 100; 
    this.height = 100; 
    this.surfer_image = surfer_image;
    this.surfer_image.src = "/images/astro-default.png";
    return this; 
}

Objects.prototype.bullet = function(x,y){
    this.x = x; 
    this.y = y; 
    return this; 

}


Objects.prototype.crab = function(x, y, line, column, crab_image){

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

Objects.prototype.shell = function(x,y){
    this.x = x; 
    this.y = y; 
    return this; 

}


