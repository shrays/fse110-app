let paddle;
let speed = 5;
let meteorXPositions;
let meteorYPositions;
let imageList;
let lives;

/*-----------------------------------------------------------------------------------------------------
// THINGS TO ADD:
//  anti scrolling, arrow key support, CHANGE METEOR HITBOX: Hitting top of box with bottom of paddle
// Scoreboard based on time survived and lives
// OPTIONAL:
// Turtle in background
-----------------------------------------------------------------------------------------------------*/

function setup() 
{
  createCanvas(windowWidth, windowHeight);
  paddle = new Draggable(windowWidth/2, windowHeight * 0.87, windowWidth * 0.15, windowWidth * 0.03); // x y w h
  meteorXPositions = [];
  meteorYPositions = [];
  imageList = [];
  lives = 5;
}

function draw() 
{
  updateGame(); //updates meteor pos
  clear();
  print(meteorXPositions.length); // TEST: prints how many meteors present
  if(frameCount % 60 == 0) //every 1 second, create new meteor with position
  {
    imageList.push(createImg("Images/Meteor.gif"));
    imageList[imageList.length-1].style("user-select", "none");
    imageList[imageList.length-1].attribute("draggable", "false");
    imageList[imageList.length-1].attribute('height', 47 * windowWidth * 0.002);
    imageList[imageList.length-1].attribute('width', 27 * windowWidth * 0.002);
    meteorXPositions.push(Math.random() * (windowWidth - (27 * windowWidth * 0.002)));
    meteorYPositions.push(-200);
  }
  for(i = 0; i < meteorXPositions.length; i++) //Cycles through every objects positions
  {
    imageList[i].position(meteorXPositions[i], meteorYPositions[i]);  //Sets image positions
    if(meteorYPositions[i] > 0.9 * (windowHeight + (47 * windowWidth * 0.002))) //Removes meteors when off screen
    {
      imageList[0].remove();
      imageList.shift();
      meteorXPositions.shift();
      meteorYPositions.shift();
      i--;
    }
    else if(  meteorYPositions[i] >= (paddle.getPosY() - (47 * windowWidth * 0.002) + windowWidth * 0.007) && //windowWith * 0.007 is manual correction
              (meteorXPositions[i] > paddle.getPosX() - windowWidth * 0.04) && //windowWidth * 0.04 is manual correction number
              meteorXPositions[i] < (paddle.getPosX() + windowWidth * 0.15)) 
    {
      //Collision happens, remove imagelist/shift, give/remove points
      imageList[0].remove();
      imageList.shift();
      meteorXPositions.shift();
      meteorYPositions.shift();
      i--;
      lives--;
    }
  }
  paddle.over();
  paddle.update();
  paddle.show();
}

function updateGame() 
{  
  for(i = 0; i < meteorYPositions.length; i++) {meteorYPositions[i] += speed;}
}

function mousePressed() 
{
  paddle.pressed();
}

function mouseReleased() 
{
  paddle.released();
}

class Draggable {
  constructor(x, y, w, h) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the square/rectangle?
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.offsetX = 0;
    this.offsetY = 0;
  }
  over() {
    // Is mouse over object
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }
  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
    }
  }
  show() {
    stroke(0);
    // Different fill based on state      Light gray - hover: darker lives color - dragging: lives color
    if (this.dragging) {  //dragging
      switch(lives)
      {
        case 5:
          fill(0,255,0);
          break;
        case 4:
          fill(128,255,0);
          break;
        case 3:
          fill(255,255,0);
          break;
        case 2:
          fill(255,128,0);
          break;
        case 1:
          fill(255,0,0);
          break;
        default:
          fill(0,0,0);
          break;
      }
      //fill(50);
    } else if (this.rollover) { //hover
      switch(lives)
      {
        case 5:
          fill(0,153,0);
          break;
        case 4:
          fill(76,255,0);
          break;
        case 3:
          fill(153,153,0);
          break;
        case 2:
          fill(153,76,0);
          break;
        case 1:
          fill(153,0,0);
          break;
        default:
          fill(0,0,0);
          break;
      }
      //fill(100);
    } else {
      fill(175, 200);
    }
    rect(this.x, this.y, this.w, this.h);
  }
  pressed() {
    // Did I click on the rectangle?
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.dragging = true;
      // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x - mouseX;
    }
  }
  released() {
    // Quit dragging
    this.dragging = false;
  }
  getPosX() 
  {
    return this.x;
  }
  getPosY() 
  {
    return this.y;
  }
}