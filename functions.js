function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}


function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function radToDeg(rad) {
    return rad / (Math.PI / 180);
}

function vectorToAngle(vector){
    var angle = Math.atan2(vector.y, vector.x);   //radians
    // you need to devide by PI, and MULTIPLY by 180:
    var degrees = 180*angle/Math.PI;  //degrees
    return (360+Math.round(degrees))%360; //round number, avoid decimal fragments
}

function angleToVector(angle) {
    return createVector(Math.cos(degToRad(angle)), Math.sin(degToRad(angle)))
}