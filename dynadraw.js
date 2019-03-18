/* based on Paul Haeberli's 1989 Dynadraw method for smoothing mouse input

ported to P5.JS and published by Quinn JH ( quinnjh.net s)
*/


var colorCount;
var px, py;       // current position of spring
  var vx, vy;       // current velocity
  var ppx, ppy;     // previous position of spring

  var k;            // bounciness, stiffness of spring
  var damping;      // friction (smorzamento)
  var ductus;       // this constant relates stroke width to speed
  var mass;         // mass of simulated pen
  var max_brush;    // maximum stroke thickness
  var min_brush;    // minimum stroke thickness

  var old_brush = min_brush; // to change brush size smoothly

var amDrawing; // boolean switch for dislpaying line

var socket;

function setup () {
    px = mouseX;    // current position of spring
    py = mouseY;
    ppx = mouseX;   // previous position of spring
    ppy = mouseY;
    vx = 0;         // current velocity
    vy = 0;
    old_brush = min_brush; // to change brush size smoothly (+/- 1)

    k = 0.2;            // stiffness of spring (0.01 -> 1.0)
    damping = 0.51;      // friction (smorzamento) (0.01, 1.00)
    ductus = 1.2;        // this constant relates stroke width to speed (0.0 -> 5.0)
    mass = 0.9;          // mass of simulated pen (0.1 -> 5.0)
    max_brush = 18.0;    // maximum stroke thickness (1 -> 64)
    min_brush = 4.0;     // minimum stroke thickness (1 -> 64)

    createCanvas(window.innerWidth-20, window.innerHeight-20);
// need to apply defaults on 

    socket = io.connect('https://free-wall.herokuapp.com/');

     socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
 strokeWeight(data.brush);
    stroke(0,160);
    line(data.x,data.y,data.prevx,data.prevy);
    
 
}
);
}


function draw(){
textSize(12);
text('FREE WALL - 2019 quinnjh CLICK TO DRAW , REFRESH TO CLEAR', 10, 30);

    var dy = py - mouseY;   // Compute displacement from the cursor
    var dx = px - mouseX;
    var fx = -k * dx;       // Hooke's law, Force = - k * displacement
    var fy = -k * dy;
    var ay = fy / mass;     // Acceleration, computed from F = ma
    var ax = fx / mass;
    vx = vx + ax;             // Integrate once to get the next
    vy = vy + ay;             // velocity from the acceleration
    vx = vx * damping;        // Apply damping, which is a force
    vy = vy * damping;        // negatively proportional to velocity
    px = px + vx;             // Integrate a second time to get the
    py = py + vy;             // next position from the velocity

var vh = sqrt(vx*vx + vy*vy);                       // Compute the (Pythagorean) velocity,
    var brush = max_brush - min(vh*ductus, max_brush);  // which we use (scaled, clamped and
    brush = max(min_brush, brush);                        // inverted) in computing...
    if (brush > old_brush) {brush = old_brush+1;}         // smooth the change (+/- 1) and
    if (brush < old_brush) {brush = old_brush-1;}         // ... set the brush size.
    old_brush = brush;
    //println(int(round(brush)));c
    //strokeWeight(brush);
    // noStroke();
    // fill(30);
    // line (ppx, ppy, px,  py);
    

    if (amDrawing == 1){
      sendmouse(px,py,ppx,ppy,brush,amDrawing);
    //
    
    strokeWeight(brush);
    line(ppx,ppy,px,py);
    
    for (var q = 0; q <= random(1,5), q++;){
    push();
    stroke(0,255);
    translate(ppx,ppy);
    rotate(atan2(mouseX*PI,mouseY*PI));
   // rotate(0.3);
    //quad(0,0,0,10,10,15,0,15);
    rect(-old_brush/4,brush/6+random(4),-old_brush/10-random(4),brush/10);
   
  //  line(px-ppx,py-ppy,0,0);
    pop();
  }
  }

//line(vx,vy,px,py);


    ppx = px;                 // Update the previous positions
    ppy = py;
}

function mousePressed(){
resetDyna();
  amDrawing=1;
  
}

function keyPressed() {
  if (key = 'b') {
    colorCount = colorCount + 1;

    if (colorCount = 1){
      stroke(200,15,75);
    } else if (colorCount = 2){
      stroke(10,205,75);
    } else if (colorCount = 3){
      stroke(60,65,85);
    } else if (colorCount = 4){
      stroke(10,1,195);
      colorCount = 0;
    }
    
  }
}

function mouseClicked(){
  amDrawing=0;

}

function resetDyna(){

    px = mouseX;
    py = mouseY;
    ppx = mouseX;
    ppy = mouseY;
    vx = 0;
    vy = 0;
    old_brush = max_brush;
  
}

function sendmouse(xPos, yPos,prevxPos,prevyPos,brushWidth,theyDrawing) {
  // We are sending!
  console.log("sendmouse: " + xPos + " " + yPos);
  
  // Make a little object with  and y
  var data = {
    x: xPos,
    y: yPos,
    prevx: prevxPos,
    prevy: prevyPos,
    brush: brushWidth,
    theyDrawing: theyDrawing
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}