/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/


var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var collectable;
var trees_x;
var gameWorldSize;
var mountains=[]
var clouds=[];
var collectables=[];
var canyons=[]
var game_score;
var flagpole;
var lives;
var gameOver;
var platforms;
var enemies;



var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jumpsound.wav');
    jumpSound.setVolume(0.1);
	backgroundSound= loadSound('assets/background.mp3')
	collectSound = loadSound('assets/CollectSound.wav')
	fallSound = loadSound('assets/failsound.wav')
	fallSound.setVolume(0.1);
	endSound = loadSound('assets/Success.wav')
	
	backgroundSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    //lives
	lives= 3;
	platforms = [];
	startGame();
	
}


function startGame(){
	backgroundSound.play();
	isLeft= false;
	isRight= false;
	isFalling= false;
	isPlummeting= false;
	
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	treePos_x = width/2 - 280;
	treePos_y = height/2;
	mountain = {x_pos: 220, y_pos: 432, size: 50}
	cloud = {x_pos: 200, y_pos: 100, size: 100}
	trees_x = [300,500,900,1150];
	var diff = 100
	for(var i=0;i<40;i++){
		mountains.push({x_pos: 220+(diff), y_pos: 432, size: random(40,100)})
		clouds.push({x_pos: 200+(diff), y_pos: 100, size: random(40,100)})
		trees_x.push(trees_x[trees_x.length-1]+(200*i))
		if (i != 0 && i % 3 == 0){
			diff += 100
		}
		diff += (100*i)
	}
	gameWorldSize = 2048;
	//initializing collectables
	for (var i=0; i<40;i++){
		collectables.push({x_pos: 450+(450*i), y_pos: 400, size: 30, isFound:false})
	}

	//initializing canyons
	for (var i=0; i<40;i++){
		canyons.push({x_pos: 50+(700*i), width: random(20,250)})
	}

	
	for (var i=0;i<20;i++){
		platforms.push(createPlatforms(300+(600*i),floorPos_y-90,random(100,200)))
	}
	

	//gamescore
	game_score =0;

	//initialize flagpole
	flagpole={
		x_pos:4000,
		isReached:false
	}

	enemies = [];
	for (var i=0;i<10;i++){
		enemies.push(new Enemy(300+(600*i),floorPos_y-10,100))
	}
	
}

function draw()
{

	///////////DRAWING CODE//////////
	isFalling = false;
	cameraPosX = gameChar_x - width / 2;
	background(100,155,255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
	push();
	translate(-cameraPosX, 0);

	

	


	//mountain loop
	drawMountains();

	//draw clouds
	drawClouds();
	
	//tree loop
	drawTrees();

	for (var i =0;i<platforms.length;i++){
		platforms[i].draw();
	}

	//draw the canyon
	for(var i=0;i<canyons.length;i++){
		drawCanyon(canyons[i]);
	}

	//collectable
	for(var i=0;i<collectables.length;i++){
		drawCollectable(collectables[i]);
	}
	

	//draw flag
	renderFlagpole();
	
	for(var i=0;i<enemies.length;i++){
		enemies[i].draw();
		var isTouch = enemies[i].checkContact(gameChar_x,gameChar_y)

		if (isTouch){
			if (lives>0){
				lives--;
				backgroundSound.stop()
				startGame();
				break;
			}
		}
	}

	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		strokeWeight(5);
		stroke(0);
		fill(255,255,0);
		ellipse(gameChar_x,gameChar_y-57,18,18);
		stroke(255,0,0);
		ellipse(gameChar_x,gameChar_y-36,3,16);
		line(gameChar_x,gameChar_y-36,gameChar_x-13,gameChar_y-42);
		
		stroke(0,0,255);
		ellipse(gameChar_x,gameChar_y-23,5,13)
		strokeWeight(1);
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		strokeWeight(5);
		stroke(0);
		fill(255,255,0);
		ellipse(gameChar_x,gameChar_y-59,18,18);
		stroke(255,0,0);
		ellipse(gameChar_x,gameChar_y-38,3,16);
		line(gameChar_x,gameChar_y-37,gameChar_x+9,gameChar_y-45);
		
		stroke(0,0,255);
		ellipse(gameChar_x,gameChar_y-23,5,13)

	}
	else if(isLeft)
	{
		// add your walking left code
		strokeWeight(5);
		stroke(0);
		fill(255,255,0);
		ellipse(gameChar_x,gameChar_y-49,18,18);
		stroke(255,0,0);
		ellipse(gameChar_x,gameChar_y-29,3,16);
		line(gameChar_x+1,gameChar_y-26,gameChar_x-15,gameChar_y-37);
		
		stroke(0,0,255);
		ellipse(gameChar_x,gameChar_y-11,5,13)
		strokeWeight(1);
	}
	else if(isRight)
	{
		// add your walking right code
		strokeWeight(5);
		stroke(0);
		fill(255,255,0);
		ellipse(gameChar_x-3,gameChar_y-49,18,18);
		stroke(255,0,0);
		ellipse(gameChar_x-4,gameChar_y-29,3,16);
		line(gameChar_x-4,gameChar_y-24,gameChar_x+9,gameChar_y-37);
		
		stroke(0,0,255);
		ellipse(gameChar_x-4,gameChar_y-11,5,13)
		strokeWeight(1);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		stroke(0);
		strokeWeight(5);
		fill(0,0,255);
		ellipse(gameChar_x-11,gameChar_y-27,8,15);//leg
		ellipse(gameChar_x+9,gameChar_y-27,8,15);//leg 2
		fill(255,0,0);
		rect(gameChar_x-16,gameChar_y-52,30,22);//body	
		fill(255,255,0);
		ellipse(gameChar_x,gameChar_y-62,18,18);//head
		strokeWeight(1)//reset stroke

	}
	else
	{
		stroke(0);
		strokeWeight(5);
		fill(0,0,255);
		ellipse(gameChar_x+11,gameChar_y-7,8,15);//leg
		ellipse(gameChar_x-9,gameChar_y-7,8,15);//leg 2
		fill(255,0,0);
		rect(gameChar_x-15,gameChar_y-37,30,22);//body	
		fill(255,255,0);
		ellipse(gameChar_x,gameChar_y-47,18,18);//head
		strokeWeight(1)//reset stroke


	}

	
	pop();
	noStroke();
	fill(255);
	//draw game score
	textSize(20);
	text(game_score,20,20);

	//draw lives
	drawLives();

	if (lives <1){
		fill(255,0,0);
		textSize(60);
		text("GameOver. Press Space to continue", 30, height/2)
		return;
	}
	if (flagpole.isReached){
		fill(255);
		textSize(40);
		text("Level Complete.Press space to continue", 30, height/2);
		return;
	}
	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
	if (isRight){
		gameChar_x += 3;
	}
	if (isLeft){
		gameChar_x -=3;
	}
	if (gameChar_y < floorPos_y){
		var isContact = false;
		for (var i =0; i < platforms.length;i++){
			if(platforms[i].checkContact(gameChar_x, gameChar_y)){
				isContact = true;
				break;
			}
		}
		if (!isContact){
			gameChar_y +=0.7;
			isFalling = true;
		}
	}
	else {
		isFalling = false;
	}

	for(var i=0;i<collectables.length;i++){
		if(!collectables[i].isFound){
			checkCollectable(collectables[i]);
		}
		
		
	}
	
	for(var i=0;i<canyons.length;i++){
		checkCanyon(canyons[i]);	
	}
	
	
	if (isPlummeting== true){
		gameChar_y += 5
		if(gameChar_y> height+2) {
			isPlummeting =false
			gameChar_x = width/2;
			gameChar_y = floorPos_y;
			lives--;
		}
		
	}


	if(!flagpole.isReached){
		checkFlagpole();
	}


	checkPlayerDie()
	

	cameraPosX = gameChar_x - width / 2;

	// Limit the camera position to the bounds of the game world.
	if (cameraPosX < 0)
	{
		cameraPosX = 0;
	}
	else if (cameraPosX > gameWorldSize - width)
	{
		cameraPosX = gameWorldSize - width;
	}
	
}


function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.
	if (key == 'a'){
		isLeft = true;
	}
	if (key =='d'){
		isRight = true;
	}
	if (key ==' ' && (lives== 0 || flagpole.isReached == true)){
		lives = 3;
		score=0;
		backgroundSound.stop();
		startGame();
	}
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

	if (isPlummeting == false){
		if (key == 'a'){
			isLeft = false;
		}
		if (key =='d'){
			isRight= false;
		}
		if (key =='w' && isFalling == false){
			gameChar_y -= 105;
			jumpSound.play()
		}
	}
}

function drawClouds(){
	for(var i = 0; i < clouds.length; i++)
	{
		noStroke();
		fill(255, 255, 255); // set the fill color to white for the clouds
		ellipse(clouds[i].x_pos-(clouds[i].size/4), clouds[i].y_pos, clouds[i].size, clouds[i].size); //first circle
		ellipse(clouds[i].x_pos+25,clouds[i].y_pos, clouds[i].size, clouds[i].size); //second circle
		ellipse(clouds[i].x_pos+50+(clouds[i].size/4), clouds[i].y_pos,clouds[i].size, clouds[i].size); //third circle
	}
}
function drawMountains(){
	for (var i=0;i<mountains.length ; i++){
		noStroke();
		fill(125); //gray color for the mountain
		triangle(mountains[i].x_pos - mountains[i].size, mountains[i].y_pos, mountains[i].x_pos+150, mountains[i].y_pos-357-mountains[i].size, mountains[i].x_pos+300+mountains[i].size, mountains[i].y_pos); //mountain shape
	}
}
function drawTrees(){
	for(var i=0;i< trees_x.length; i++){
		noStroke();
		fill(165,42,42);
		rect(trees_x[i]+288, treePos_y+12, 50, 132); //trunk
		fill(0, 100, 0); //dark green color for the tree
		triangle(trees_x[i]+237,treePos_y+14,trees_x[i]+412,treePos_y+14,trees_x[i]+315,treePos_y-154);
	}
}

function drawCollectable(t_collectable){
	if (!t_collectable.isFound){
		fill(255, 215, 0); //gold color for the collectable item
		ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size); //collectable item shape
	}
}

function drawCanyon(t_canyon){
	noStroke();
	fill(100, 50, 0); //brown color for the canyon
	rect(t_canyon.x_pos, 432, t_canyon.width , 144); //canyon shape
}

function renderFlagpole(){
	push();
	strokeWeight(5);
	stroke(150);
	line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y-250)
	fill(250,0,0);

	noStroke()
	if (flagpole.isReached){
		rect(flagpole.x_pos, floorPos_y-250,50,50)
	}else{
		rect(flagpole.x_pos, floorPos_y-50,50,50)
	}
	
	pop();
}


function checkCollectable(t_collectable){
	if (dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50) {
		t_collectable.isFound = true;
		collectSound.play();
		t_collectable.size=1;
		//make it disappear when collected and coordinates out of the game
		t_collectable.x_pos=-99999999
		t_collectable.y_pos=-99999999
		game_score++;
	  }
	
}

function checkCanyon(t_canyon){
	if (gameChar_x > t_canyon.x_pos && gameChar_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y) {
		isPlummeting = true;
		fallSound.play();
	}
}

function checkFlagpole(){
	var d = abs(gameChar_x- flagpole.x_pos)
	if (d<15){
		flagpole.isReached = true;
		endSound.play();
	}
	
}

function checkPlayerDie(){
	if (gameChar_y == height+1){
		lives --;
		if(lives > 0){
			backgroundSound.stop()
			startGame();
		}else{
			return;
		}
		
	}
}

function drawLives(){
	for(var i=0;i<lives;i++){
		fill(0,0,255);
		stroke(0);
		ellipse(950+(20*i),20, 20);
	}
}

function createPlatforms(x,y,length){
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function(){
			fill(255,0,255);
			rect(this.x, this.y, this.length,20)
		},
		checkContact: function(gc_x,gc_y){
			if(gc_x> this.x && gc_x < this.x+this.length){
				var d = this.y - gc_y
				if(d>=0 && d<5){
					return true;
				}
			}
			return false;
		}
	}
	return p;
}

function Enemy(x,y,range){
	this.x =x
	this.y = y
	this.range = range
	this.currentX = x
	this.inc = 1;

	this.update = function()
	{
		this.currentX += this.inc
		if(this.currentX >= this.x + this.range){
			this.inc = -1;
		}
		else if(this.currentX < this.x){
			this.inc =1;
		}
	}
	this.draw = function(){
		this.update();
		fill(255,0,0);
		ellipse(this.currentX, this.y,20,20)
	}
	this.checkContact = function(gc_x,gc_y)
	{
		var d= dist(gc_x,gc_y,this.currentX,this.y)
		if(d < 20){
			return true;
		}
		return false;
	}
}
