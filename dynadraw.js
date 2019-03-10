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

    k = 0.06;            // bounciness, stiffness of spring (0.01 -> 1.0)
    damping = 0.78;      // friction (smorzamento) (0.01, 1.00)
    ductus = 0.5;        // this constant relates stroke width to speed (0.0 -> 5.0)
    mass = 1.0;          // mass of simulated pen (0.1 -> 5.0)
    max_brush = 18.0;    // maximum stroke thickness (1 -> 64)
    min_brush = 4.0;     // minimum stroke thickness (1 -> 64)

    createCanvas(900,900);


    socket - io.connect('https://free-wall.herokuapp.com/');

     socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
     if (data.theyDrawing == 1){
    push();
    strokeWeight(data.brush);
    translate(data.x,data.y);
    line(data.x-data.prevx,data.y-data.prevy,0,0);
    pop();


}
    }
  );
}

function draw(){


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
    //println(int(round(brush)));
    //strokeWeight(brush);
    // noStroke();
    // fill(30);
    // line (ppx, ppy, px,  py);
    

    if (amDrawing == 1){
      sendmouse(px,py);
    //line(ppx,ppy,px,py);
    push();
    strokeWeight(brush);
    translate(px,py);
   // rotate(0.3);
    //quad(0,0,0,10,10,15,0,15);
   // rect(-brush/2,-1,brush/2,1);
    line(px-ppx,py-ppy,0,0);
    pop();
  }

//line(vx,vy,px,py);


    ppx = px;                 // Update the previous positions
    ppy = py;
}

function mousePressed(){
  amDrawing=1;
  resetDyna();
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
    old_brush = min_brush;
  
}

function sendmouse(xPos, yPos,prevxPos,prevyPos,brushWidth,theyDrawing) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);
  
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