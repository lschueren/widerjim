// Setup Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Setup Gamesdingsi
var fps = 60;
var backgroundColor = "black";

var upkey = 40;
var downkey = 38;
var leftkey = 37;
var rightkey = 39;
var shootkey = 32;

////Werte Schießen
var cooldowntimer = 0;
var shootDelay = 5;

var bulletKillTimer = 90;
var bulletSpeed = 10;

var bullets = [];

////Werte Feinde
var enemies = [];
var enemySpeed = 1;


//Objekte und Konstruktoren
var player = {};
    player.image = new Image();
    player.image.src = "img/megaman.png";
    player.x = 0;
    player.y = 260;
    player.height = 80;
    player.width = 100;
    player.keyUp = false;
    player.keyDown = false;
    player.keyLeft = false;
    player.keyRight = false;
    player.shootKey = false;
    player.energy = 100;

function createBullet(){
    var bullet = {};
        bullet.image = new Image();
        bullet.image.src = "img/bullet.png"
        bullet.x = (player.x + player.width);
        bullet.y = (player.y + player.height/3);
        bullet.height = 20;
        bullet.width = 20;
        bullet.timer = bulletKillTimer;
        bullet.isMoving = true;
this.bullets.push( bullet );
}

function createEnemy(){
    var enemy = {};
    enemy.image = new Image();
    enemy.image.src = "img/enemy.png"
    enemy.x = 800;
    enemy.y = 0;
    enemy.height = 600;
    enemy.width = 800;
    enemy.energy = 2000;
    ///colision box körper
    enemy.colBoxX = enemy.x + 190;
    enemy.colBoxY = enemy.y;
    enemy.colBoxHeight = enemy.height;
    enemy.colBoxWidth = 800;
    ///collision box arm
    enemy.colBoxArmX = enemy.x;
    enemy.colBoxArmY = enemy.y + 250;
    enemy.colBoxArmHeight = 90;
    enemy.colBoxArmWidth = 800;
    enemy.direction = "left";
    enemy.frameCounter = 0;
    enemy.isMoving = true;
this.enemies.push( enemy );
}




//Male Dinge
function drawBG(){
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0,0,800,600);
}

function drawPlayer (){
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawBullets(){
    for ( var i = 0; i < this.bullets.length; i++ ) {
        ctx.drawImage( this.bullets[i].image, this.bullets[i].x, this.bullets[i].y, this.bullets[i].width, this.bullets[i].height);
    } 
}

function drawEnemies(){
    for ( var i = 0; i < this.enemies.length; i++ ) {
        ctx.drawImage( this.enemies[i].image, this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height);
       /// Arm Hitbox malen
        /* ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(this.enemies[i].colBoxArmX, this.enemies[i].colBoxArmY, this.enemies[i].colBoxArmWidth, this.enemies[i].colBoxArmHeight);
        ctx.restore(); */
    } 
}

function drawGUI(){
    powerplayer = this.player.energy;
    powerenemy = this.enemies[0].energy/100*40;
    console.log(powerenemy);
    ctx.beginPath();
    ctx.fillStyle="red";
    ctx.fillRect(0,0,powerenemy,25);
    ctx.closePath();
}

////Update Dinge
function updateBullets(){
    for ( var i = 0; i < this.bullets.length; i++ ) {
        if (this.bullets[i].isMoving == true){
           this.bullets[i].timer = this.bullets[i].timer - 1;
            this.bullets[i].x = this.bullets[i].x + bulletSpeed;
            if (this.bullets[i].timer == 0){
                this.bullets.splice(this.bullets[i], 1);
            }
        }
    } 

}

function updatePlayer(){
    if (player.keyUp){
        player.y = player.y + 10;
    }
    else if (player.keyDown){
        player.y = player.y - 10;
    }
    if (player.keyRight){
        player.x = player.x + 10;
    }
    else if (player.keyLeft){
        player.x = player.x - 10;
    }
    if (player.keyShoot && cooldowntimer == 0){
        cooldowntimer = shootDelay;
        createBullet();
    }
    if (cooldowntimer > 0){
        cooldowntimer = cooldowntimer - 1;
    }

}

function updateEnemies(){
    for ( var i = 0; i < this.enemies.length; i++ ) {
        
        this.enemies[i].frameCounter++;

        //Feind bewegen
        if (this.enemies[i].isMoving){
            if (this.enemies[i].direction == "left"){
                this.enemies[i].x = (this.enemies[i].x - enemySpeed);
                this.enemies[i].colBoxX = (this.enemies[i].colBoxX - enemySpeed);
                this.enemies[i].colBoxArmX = (this.enemies[i].colBoxArmX - enemySpeed);
            }
            if (this.enemies[i].direction == "right"){
                this.enemies[i].x = (this.enemies[i].x + enemySpeed);
                this.enemies[i].colBoxX = (this.enemies[i].colBoxX + enemySpeed);
                this.enemies[i].colBoxArmX = (this.enemies[i].colBoxArmX + enemySpeed);
            }
            if (this.enemies[i].direction == "up"){
                this.enemies[i].y = (this.enemies[i].y - enemySpeed);
                this.enemies[i].colBoxY = (this.enemies[i].colBoxY - enemySpeed);
                this.enemies[i].colBoxArmY = (this.enemies[i].colBoxArmY - enemySpeed);
            }
            if (this.enemies[i].direction == "down"){
                this.enemies[i].y = (this.enemies[i].y + enemySpeed);
                this.enemies[i].colBoxY = (this.enemies[i].colBoxY + enemySpeed);
                this.enemies[i].colBoxArmY = (this.enemies[i].colBoxArmY + enemySpeed);
            }
        }

        //Feind bewegungsroutine
        if (this.enemies[i].frameCounter == 500){
            this.enemies[i].isMoving = false;
        }
        if (this.enemies[i].frameCounter == 1000){
            this.enemies[i].direction = "right";
            this.enemies[i].isMoving = true;
        }
        if (this.enemies[i].frameCounter == 1500){
            this.enemies[i].isMoving = false;
        }
        if (this.enemies[i].frameCounter == 2000){
            this.enemies[i].frameCounter = 0;
            this.enemies[i].direction = "left";
            this.enemies[i].isMoving = true;
        }        



        //wenn Feind hinter linkem rand, dann wegmachen
        if (this.enemies[i].x == (0-this.enemies[i].width)){
            this.enemies.splice(this.enemies[i], 1);
        }
     

        //wenn feind tot dann game over
    
        if (this.enemies[i].energy <= 0){
            clearInterval(myTimer);
            alert("YOU FUCKING WIN");
        }
    }

}


//Kollisionsabfrage

function checkCollisions(bullet, enemy){

//Ränder
    if (player.y < 0){
        player.y = 0;
    }
    if (player.x < 0){
        player.x = 0;
    }

    if (player.y > 520){
        player.y = 520;
    }

    if (player.x > 700){
        player.x = 700;
    }



//Kollisionen
    ////Treffer in Körper?
    for(i = 0; i < this.bullets.length; i++){
        for(j = 0; j < this.enemies.length; j++){
            if ((this.bullets[i].x + this.bullets[i].width) >= this.enemies[j].colBoxX) {
                this.bullets[i].image.src="img/bulletred.png";
                this.bullets[i].isMoving = false;
                this.enemies[j].energy = this.enemies[j].energy - 1;
                setTimeout(function(){
                this.bullets.splice(this.bullets[i], 1);
                }, 200);
            }
        }
    }


    ////Treffer in Arm?
    for(i = 0; i < this.bullets.length; i++){
        for(j = 0; j < this.enemies.length; j++){

            if (this.bullets[i].x + this.bullets[i].width >= this.enemies[j].colBoxArmX && this.bullets[i].y + this.bullets[i].height > this.enemies[j].colBoxArmY && this.bullets[i].y < this.enemies[j].colBoxArmY + this.enemies[j].colBoxArmHeight){
                this.bullets[i].image.src="img/bulletred.png";
                this.bullets[i].isMoving = false;
                //console.log("ArmHit!");
                this.enemies[j].energy = this.enemies[j].energy - 1;
                setTimeout(function(){
                this.bullets.splice(this.bullets[i], 1);
                }, 200);
                
            }
        }
    }
    
    ////Feind Körper berührt?
    for(i = 0; i < this.enemies.length; i++){
        if (this.player.x + this.player.width >= this.enemies[i].colBoxX){
        this.player.x = this.enemies[i].colBoxX -this.player.width;
        }
    }

    ////Arm Berührt?

    for(i=0; i< this.enemies.length; i++){
        var armtop = this.enemies[i].colBoxArmY;
        var armleft = this.enemies[i].colBoxArmX;
        var armright = this.enemies[i].colBoxArmX + this.enemies[i].colBoxArmWidth;
        var armbottom = this.enemies[i].colBoxArmY + this.enemies[i].colBoxArmHeight;

        var playertop = player.y;
        var playerleft = player.x;
        var playerright = player.x + player.width;
        var playerbottom = player.y + player.height;

        var colliosion = false;

        //has a collision happened?

        if (playerright > armleft && playerbottom > armtop && playertop < armbottom && playerleft < armright){
            

            //collision left side?
            if (playerleft < armleft){
                if ((playerbottom-armtop)>(playerright-armleft)){
                    player.x = armleft - player.width;
                }
            }
        
            //collision top?
           if (playertop < armtop){
               if ((playerright-armleft)>(playerbottom-armtop)){
                   player.y = armtop - player.height;
               }
           }

           //collision bottom?
           if (playerbottom > armbottom){
                if ((playerright-armleft)>(armbottom-playertop)){
                player.y = armbottom;
                }
            }
        } 
    }
}
    

 





//Input Handling

var getInput = function( event ){
    if (event.keyCode == upkey){
        player.keyUp = true;
    }
    else if (event.keyCode == downkey){
        player.keyDown = true;
    } 
    if (event.keyCode == leftkey){
        player.keyLeft = true;
    }
    else if (event.keyCode == rightkey){
        player.keyRight = true;
    } 
    if (event.keyCode == shootkey){
        player.keyShoot = true;
    }
    
}
var stopInput = function( event ){
    if (event.keyCode == upkey){
        player.keyUp = false;
    }
    else if (event.keyCode == downkey){
        player.keyDown = false;
    } 
    if (event.keyCode == leftkey){
        player.keyLeft = false;
    }
    else if (event.keyCode == rightkey){
        player.keyRight = false;
    } 
    if (event.keyCode == shootkey){
        player.keyShoot = false;
    }
    
}



//Gameloop
window.onload = function(){
    
    //Eventlistener hinzufügen
    
    var arrow_keys_handler = function(e) {
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    };
    window.addEventListener("keydown", arrow_keys_handler, false);
    window.addEventListener("keydown", getInput, false);
    window.addEventListener("keyup", stopInput, false);

    createEnemy();
    //Dinge die in einem Frame passieren
    myTimer = setInterval(function(){

        updatePlayer();
        checkCollisions();
        updateBullets();
        updateEnemies();

        drawBG();
        drawEnemies();
        drawPlayer();
        drawBullets();
        drawGUI();
        
        /* console.log(enemies[0].frameCounter); */

    }, 1000/fps);
}