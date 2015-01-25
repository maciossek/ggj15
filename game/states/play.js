
  'use strict';
  function Play() {}
  Play.prototype = {
    preload: function() {
      this.moveBackgroundConstant = 100;

      this.iceplate = null;
      this.iceplateGraphic = null;
      this.iceplateAngle = 0;
      this.icePlateY = 90;

      this.IP1Y = 0;
      this.IP2Y = 0;

      this.n = 0;
      
      /*---------AMBIENTE-------*/
      //mountains
      this.mountains = null;

      //clouds
      this.cloudz1 = null;
      this.cloudz2 = null;

      //water
      this.water1 = null;
      this.waterHeight = 220;
      this.water2 = null;
      this.waterWaves = [];
      this.waterWavesAnimations = [];
      this.numWaterWaves = 30;


      /*--------FIGURES--------*/
      //giraffe Variables
      this.crate2 = null;
      this.crate2angleMultiplier = 0.0005;
      this.facing = 'left';
      //head Variables
      this.head = null;
      this.headPosY = 100;
      this.maxHeadDistance = 470;
      this.headAngleMultiplier = 0.0017;
      this.stopHead = true;


      this.headVelocityConstant = 20;
      this.headVelocity = this.headVelocityConstant;
      this.headVelocityMultiplier = 0.99;

      //giraffe hals
      this.circles=[];
      this.halsDetails = 100;


      this.deltaHeadCrate = null;
      this.headPos = null;
      this.crate2pos = null;
      this.distanceHeadCrate = null;

      //Hals Bezier
      this.headStartX = 0;
      this.headStartY = 0;

      this.headBezierX = 0;
      this.headBezierY = 0;

      this.p0 = 0;
      this.p1 = 0;
      this.p2 = 0;
      this.p3 = 0;
      this.bP = 0;

      this.accuracy = 1

      //Giraffe Schatten
      this.shadow = null;


      // Timer
      this.timer = 0;
      this.timerText = '';

      // Distance
      this.distance = 0;
      this.distanceText = '';
      this.animationSpeed;
      this.dialogue;
      this.dialogueTween;
      this.gameStarted = false;

      this.cursors = null;
    },
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.gravity.y = 3000;
      this.game.physics.p2.friction = 0.1;



      this.mountains = this.game.add.tileSprite(0, this.game.height-117-this.moveBackgroundConstant, this.game.width, 170, "mountain-graphic");
      //this.mountains.scale.setTo(0.2, 0.2);
      this.mountains.anchor.setTo(0, 1);


      this.cloudz1 = this.game.add.tileSprite(0, this.game.height-400-this.moveBackgroundConstant, this.game.width, 170, "cloudz-01");
      this.cloudz1.anchor.setTo(0, 1);
      this.cloudz2 = this.game.add.tileSprite(0, this.game.height-130-this.moveBackgroundConstant, this.game.width, 170, "cloudz-02");
      this.cloudz2.anchor.setTo(0, 1);




      //SETUP Mountains
      //bgtile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('bgtile').height, 'bgtile');



      /*this.mountains.create(0, 0, 'mountain-02');
      this.mountains.create(1720+1606, 0, 'mountain-03');
      this.mountains.create(1720+1606+1301, 0, 'mountain-04');
      this.mountains.create(1720+1606+1301+1416, 0, 'mountain-05');*/



      this.water1 = this.game.add.tileSprite(0, this.game.height, this.game.width, this.waterHeight, "water-01");
      this.water1.anchor.setTo(0, 1);

      var framesLeft = [];
      for (i=0;i<47;i++) {
        framesLeft.push(i);
      }
      var framesRight = [];
      for (i=46;i>=0;i--) {
        framesRight.push(i);
      }

      for(var i=0; i<this.numWaterWaves; i++) {
        this.waterWaves[i] = this.game.add.sprite(this.game.width*Math.random(), this.game.height-Math.random()*this.waterHeight, 'water-waves');
        this.waterWavesAnimations[i] = this.waterWaves[i].animations.add('justrun', framesLeft, 23, true);
        this.waterWavesAnimations[i].play();
      }
      //this.waterWaves = this.game.add.sprite(0*100, this.game.height-this.moveBackgroundConstant,'water-waves');
      //this.waterWavesAnimations = this.waterWaves.animations.add('water-waves',framesLeft, 23, true);

     /* var framesLeft = [];
      for (i=0;i<47;i++) {
        framesLeft.push(i);
      }
      var framesRight = [];
      for (i=46;i>=0;i--) {
        framesRight.push(i);
      }
      this.crate2animationLeft = this.crate2.animations.add('left', framesLeft, 23, true);
      this.crate2animationRight = this.crate2.animations.add('right', framesRight, 23, true);
      this.crate2animationTurn = this.crate2.animations.add('turn', [4], 20, true);*/
      for(var i=0; i<this.halsDetails; i++) {
        this.circles[i] = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY);
        this.circles[i].lineStyle(1, 0xf4c54d);
        this.circles[i].beginFill(0xf4c54d, 1);

        this.circles[i].drawCircle(0, 0, 50);
        this.circles[i].endFill();
      }


      //SETUP Iceplate
      this.iceplate = this.game.add.sprite(this.game.width/2, this.game.height-this.icePlateY, "crate");
      this.iceplate.anchor.setTo(0.5, 1);
      //this.iceplate.scale.setTo(3, 1);
      this.iceplate.friction = 0.0005;
      this.iceplate.visible = false;

      this.iceplateGraphic = this.game.add.sprite(this.game.width/2, this.game.height-34-this.icePlateY, "crate");
      this.iceplateGraphic.anchor.setTo(0.5, 1);
      this.iceplateGraphic.y += 70;

      this.IP1Y = this.iceplate.y;
      this.IP2Y = this.iceplateGraphic.y;

      this.water2 = this.game.add.tileSprite(0, this.game.height, this.game.width, 150, "water-02");
      this.water2.anchor.setTo(0,1);


      //Shadow
      this.shadow = this.game.add.graphics(this.game.world.centerX, this.game.height-this.icePlateY-80);
      this.shadow.beginFill(0x000000, 0.06);
      this.shadow.drawPolygon(-80, 0, -60, -13, 0, -12, 80, 0, 30, 10, 0, 5, -60, 8, -80, 0);
      this.shadow.endFill();


      this.game.physics.p2.enable(this.iceplate);

      this.iceplate.body.motionState = Phaser.Physics.P2.Body.KINEMATIC;
      this.iceplate.hitArea = new Phaser.Rectangle(0, 0, 20, 20);
      //this.iceplate.body.setSize(100, 50, 50, 25);


      //Setup Giraffe
      this.crate2 = this.game.add.sprite(this.game.width/2, this.game.height*0.5, "giraffe");
      this.crate2.anchor.setTo(0.5, 0.5);

      this.game.physics.p2.enable(this.crate2);


      this.crate2animationLeft = this.crate2.animations.add('left', framesLeft, 23, true);
      this.crate2animationRight = this.crate2.animations.add('right', framesRight, 23, true);
      this.crate2animationTurn = this.crate2.animations.add('turn', [4], 20, true);



      //Setup Head
      this.head = this.game.add.sprite(this.game.width/2, this.headPosY, "head");

      this.game.physics.p2.enable(this.head);
      this.head.body.motionState = Phaser.Physics.P2.Body.KINEMATIC;


      if (this.gameStarted) {

      }
      // Add timer & score
      var style = { font: '24px Slabo', fill: '#ffffff', align: 'center'};
      this.timerText = this.game.add.text(15, 20, "Time: " + this.timer, style);
      this.distanceText = this.game.add.text(15, 40, "Steps: " + this.distance, style);
      this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);

      // Replay
      this.replayButton = this.game.add.button(this.game.width, 0, 'replayButton', this.startClick, this);
      this.replayButton.anchor.setTo(0.5,0.5);

      // Replay
      this.dialogue = this.game.add.sprite(this.game.width/2 + 110, 100, 'dialogue');
      this.dialogueTween = this.game.add.tween(this.dialogue);
      this.game.physics.p2.enable(this.dialogue);
      this.dialogue.body.motionState = Phaser.Physics.P2.Body.STATIC;


      //________________ CONTROLS

      //game.input.onDown.add(doSomething, this);
      this.cursors = this.game.input.keyboard.createCursorKeys();

      this.game.input.keyboard.onUpCallback = function(e) {
        this.stopHead = true;
      }
    },
    update: function() {

      this.drawBezier();
      this.mountains.tilePosition.x -= 0.3;
      this.water1.tilePosition.x -=1.5;
      this.water2.tilePosition.x -=1.5;
      for(var i=0; i<this.numWaterWaves; i++) {
        this.waterWaves[i].x -=1.5;
        if(this.waterWaves[i].x < 0) {
          this.waterWaves[i].x = this.game.width+Math.random()*60;
          this.waterWaves[i].y = this.game.height-Math.random()*this.waterHeight;
        }
      }

      this.cloudz1.tilePosition.x -=0.8;
      this.cloudz2.tilePosition.x -=0.6;

      this.shadow.x = this.crate2.position.x;
      this.shadow.y = this.crate2.position.y+108;
      this.shadow.angle = this.iceplate.angle;
      this.shadow.alpha = 1-Math.abs(this.crate2.x - this.game.width/2)/(this.crate2.width*0.5);

      this.n++;
      this.iceplate.body.y = this.IP1Y+Math.sin(this.n*0.06)*8;
      this.iceplateGraphic.y = this.IP2Y+Math.sin(this.n*0.06)*8;
      

      //________________ CONTROLS
      this.crate2pos = {
          x: this.crate2.body.x,
          y: this.crate2.body.y
        }
      this.headPos = {
        x: this.head.body.x,
        y: this.head.body.y
      }
      this.deltaHeadCrate = {
        x: this.crate2pos.x-this.headPos.x,
        y: this.crate2pos.y-this.headPos.y
      }
      this.distanceHeadCrate = Math.sqrt(this.deltaHeadCrate.x*this.deltaHeadCrate.x+this.deltaHeadCrate.y*this.deltaHeadCrate.y);


      if (this.cursors.left.isDown || ((this.game.input.x < this.game.width/2) && this.game.input.pointer1.isDown)) {
        this.setStart();
        if(this.distanceHeadCrate < this.maxHeadDistance) {
          this.headVelocity = Math.sqrt(this.headVelocity*this.headVelocity*this.headVelocityMultiplier);
          this.head.body.velocity.x -= this.headVelocity;
          this.stopHead = false;
        } else {
          //this.head.body.velocity.x -= 5;
          this.headVelocity = this.headVelocityConstant;
          this.stopHead = true;
          
        }


      } else if (this.cursors.right.isDown || ((this.game.input.x > this.game.width/2) && this.game.input.pointer1.isDown)) {
        this.setStart();
        if(this.distanceHeadCrate < this.maxHeadDistance) {
          this.headVelocity = Math.sqrt(this.headVelocity*this.headVelocity*this.headVelocityMultiplier);
          this.head.body.velocity.x += this.headVelocity;
          this.stopHead = false;
        } else {
          //this.head.body.velocity.x += 5;
          this.headVelocity = this.headVelocityConstant;
          this.stopHead = true;
        }
      } else {
        this.headVelocity = this.headVelocityConstant;
        this.stopHead = true;
        
      }
      if(this.stopHead) {

        if(this.distanceHeadCrate > this.maxHeadDistance && this.headPos.x < this.crate2pos.x) {
          this.head.body.velocity.x +=Math.abs(this.head.body.velocity.x)*0.1+(this.distanceHeadCrate-this.maxHeadDistance)*0.1;
        } else if(this.distanceHeadCrate > this.maxHeadDistance && this.headPos.x > this.crate2pos.x) {
          this.head.body.velocity.x -=Math.abs(this.head.body.velocity.x)*0.1+(this.distanceHeadCrate-this.maxHeadDistance)*0.1;
        } else {
            if(this.head.body.velocity.x < 0) {
              this.head.body.velocity.x +=10;
            } else if(this.head.body.velocity.x > 0) {
              this.head.body.velocity.x -=10;
            }
        }

      }

      this.rotateHead();
      //UPDATE Y POSITION OF HEAD BASED ON X
      //(x - xm)2 + (y - ym)2 = r2
      // y' = (x-u) sin(beta) + (y-v) cos(beta) + v
      this.xm = this.crate2.x-this.game.width/2;
      this.x1 = this.head.body.x-this.game.width/2 + this.xm;


      this.head.body.y = this.x1*this.x1*0.001+this.headPosY;




      //Play Animations based on
      if(this.iceplateAngle > 0) {

        this.crate2.animations.play('left');

      } else if(this.iceplateAngle < 0) {

        this.crate2.animations.play('right');

      } else {
        if (this.facing != 'idle') {
          this.crate2.animations.stop();
          this.facing = 'idle';
        }
      }

      this.crate2animationLeft.speed = Math.abs(this.iceplateAngle)*20+15;
      this.crate2animationRight.speed = Math.abs(this.iceplateAngle)*20+15;
      if(this.crate2animationLeft.speed > 180) {
        this.head.frame = 1;
      } else if(this.crate2animationLeft.speed > 100) {
        this.head.frame = 2;
      } else {
        this.head.frame = 0
      }
      this.animationSpeed = this.crate2animationRight.speed;

      this.rotatePlate();

      this.updateDistance();

      //console.log(this.game.world.bounds.height, this.crate2.position.y + this.crate2.height);
      if (this.crate2.position.y > this.game.height-this.waterHeight+70) {
        localStorage.setItem('score', this.timer);
        localStorage.setItem('distance', this.distance);
        //this.score.current = this.timer;
        this.game.state.start('gameover');
      }
    },
    rotatePlate: function() {
      this.iceplateAngleMod = 1;
      this.iceplateAngle += ((this.head.position.x-this.game.width/2)*this.headAngleMultiplier + (this.crate2.position.x-this.game.width/2)*this.crate2angleMultiplier)*this.iceplateAngleMod;
      //this.iceplateAngle = (this.head.position.x-this.game.width/2)*this.headAngleMultiplier + (this.crate2.position.x-this.game.width/2)*this.crate2angleMultiplier;
      this.iceplate.body.angle = this.iceplateAngle;
      this.iceplateGraphic.angle = this.iceplateAngle;

    },
    rotateHead: function() {
      this.head.body.angle = -Math.abs((this.head.position.x-this.crate2.position.x)/5);

    },
    drawBezier: function() {
      this.headStartX = 90 * Math.sin(this.toRadians(this.crate2.body.angle+15));
      this.headStartY = 90 * Math.cos(this.toRadians(this.crate2.body.angle+15));

      this.headBezierX = 140 * Math.sin(this.toRadians(this.crate2.body.angle+30));
      this.headBezierY = 140 * Math.cos(this.toRadians(this.crate2.body.angle+30));


      this.accuracy = 1 / this.halsDetails //this'll give the bezier 100 segments
      this.p0 = {x: this.head.position.x, y: this.head.position.y}; //use whatever points you want obviously
      this.p1 = {x: this.head.position.x, y: this.head.position.y + 100};
      this.p2 = {x: this.crate2.position.x + this.headStartX + this.headBezierX, y: this.crate2.position.y - this.headStartY - this.headBezierY};
      this.p3 = {x: this.crate2.position.x + this.headStartX, y: this.crate2.position.y - this.headStartY};


      for (var i = 0; i < 1; i += this.accuracy) {
        this.bP = this.calculateBezier(i, this.p0, this.p1, this.p2, this.p3);


        //console.log(Math.round(i/accuracy));
        this.circles[Math.round(i / this.accuracy)].x = this.bP.x;
        this.circles[Math.round(i / this.accuracy)].y = this.bP.y;


        this.circles[Math.round(i / this.accuracy)].scale.set(0.5 * i + 0.2, 0.5 * i + 0.2);

        //console.log("x: "+p.x+"  y: "+p.y);
      }
    },
    calculateBezier: function(t, p0, p1, p2, p3) {

        var cX = 3 * (p1.x - p0.x),
          bX = 3 * (p2.x - p1.x) - cX,
          aX = p3.x - p0.x - cX - bX;

        var cY = 3 * (p1.y - p0.y),
          bY = 3 * (p2.y - p1.y) - cY,
          aY = p3.y - p0.y - cY - bY;

        var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
        var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

        return {x: x, y: y};
    },
    toDegrees: function(angle) {
        return angle * (180 / Math.PI);
    },
    toRadians: function (angle) {
        return angle * (Math.PI / 180);
    },
    updateTimer: function() {
      if(this.gameStarted) {
        this.timer++;
        this.timerText.setText('Time: ' + this.timer);
      }


    },
    updateDistance: function() {
      if(this.gameStarted) {
        this.distance = this.distance +1 * (this.animationSpeed/1000);
        this.distanceText.setText('Steps: ' + Math.round(this.distance));
      }
    },
    startClick: function() {
      this.game.state.start('play');
    },
    setStart: function() {
      if(!this.gameStarted) {
        this.gameStarted = true;
        this.dialogueTween.to({ alpha: 0, y: 220 }, 500, Phaser.Easing.Back.Out, true, 10);
        this.dialogueTween.start();
      }

    }
  };

  module.exports = Play;
