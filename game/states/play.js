
  'use strict';
  function Play() {}
  Play.prototype = {
    preload: function() {
      this.iceplate = null;
      this.iceplateGraphic = null;
      this.iceplateAngle = 0;

      /*---------AMBIENTE-------*/
      //mountains
      this.mountains = null;

      //clouds
      this.cloudz1 = null;
      this.cloudz2 = null;

      //water
      this.water1 = null;
      this.water2 = null;


      /*--------FIGURES--------*/
      //giraffe Variables
      this.crate2 = null;
      this.crate2angleMultiplier = 0.15;
      this.facing = 'left';
      //head Variables
      this.head = null;
      this.headPosY = 100;
      this.maxHeadDistance = 300;
      this.headAngleMultiplier = 0.2;
      this.stopHead = true;


      this.headVelocityConstant = 10;
      this.headVelocity = this.headVelocityConstant;
      this.headVelocityMultiplier = 0.96;

      //giraffe hals
      this.circles=[];
      this.halsDetails = 100;


      this.deltaHeadCrate = null;
      this.headPos = null;
      this.crate2pos = null;
      this.distanceHeadCrate = null;


      // Timer
      this.timer = 0;
      this.timerText = '';

      // Distance
      this.distance = 0;
      this.distanceText = '';

      this.cursors = null;
    },
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.gravity.y = 900;
      this.game.physics.p2.friction = 0.00001;

      this.mountains = this.game.add.tileSprite(0, this.game.height-117, this.game.width, 170, "mountain-graphic");
      //this.mountains.scale.setTo(0.2, 0.2);
      this.mountains.anchor.setTo(0, 1);


      this.cloudz1 = this.game.add.tileSprite(0, this.game.height-400, this.game.width, 170, "cloudz-01");
      this.cloudz1.anchor.setTo(0, 1);
      this.cloudz2 = this.game.add.tileSprite(0, this.game.height-130, this.game.width, 170, "cloudz-02");
      this.cloudz2.anchor.setTo(0, 1);


      for(var i=0; i<this.halsDetails; i++) {
        this.circles[i] = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY);
        this.circles[i].lineStyle(1, 0xf4c54d);
        this.circles[i].beginFill(0xf4c54d, 1);

        this.circles[i].drawCircle(0, 0, 50);
        this.circles[i].endFill();
      }

      //SETUP Mountains
      //bgtile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('bgtile').height, 'bgtile');



      /*this.mountains.create(0, 0, 'mountain-02');
      this.mountains.create(1720+1606, 0, 'mountain-03');
      this.mountains.create(1720+1606+1301, 0, 'mountain-04');
      this.mountains.create(1720+1606+1301+1416, 0, 'mountain-05');*/



      this.water1 = this.game.add.tileSprite(0, this.game.height, this.game.width, 117, "water-01");

      this.water1.anchor.setTo(0, 1);



      //SETUP Iceplate
      this.iceplate = this.game.add.sprite(this.game.width/2, this.game.height-60, "crate");
      this.iceplate.anchor.setTo(0.5, 1);
      //this.iceplate.scale.setTo(3, 1);
      this.iceplate.friction = 0.0005;
      this.iceplate.visible = false;

      this.iceplateGraphic = this.game.add.sprite(this.game.width/2, this.game.height-90, "crate");
      this.iceplateGraphic.anchor.setTo(0.5, 1);
      this.iceplateGraphic.y += 70;

      this.water2 = this.game.add.tileSprite(0, this.game.height, this.game.width, 117, "water-02");
      this.water2.anchor.setTo(0,1);




      this.game.physics.p2.enable(this.iceplate);

      this.iceplate.body.motionState = Phaser.Physics.P2.Body.KINEMATIC;
      this.iceplate.hitArea = new Phaser.Rectangle(0, 0, 20, 20);
      //this.iceplate.body.setSize(100, 50, 50, 25);


      //Setup Giraffe
      this.crate2 = this.game.add.sprite(this.game.width/2, this.game.height*0.5, "giraffe");
      this.crate2.anchor.setTo(0.5, 0.5);

      this.game.physics.p2.enable(this.crate2);

      var framesLeft = [];
      for (i=0;i<47;i++) {
        framesLeft.push(i);
      }
      var framesRight = [];
      for (i=46;i>=0;i--) {
        framesRight.push(i);
      }
      this.crate2animationLeft = this.crate2.animations.add('left', framesLeft, 23, true);
      this.crate2animationRight = this.crate2.animations.add('right', framesRight, 23, true);
      this.crate2animationTurn = this.crate2.animations.add('turn', [4], 20, true);



      //Setup Head
      this.head = this.game.add.sprite(this.game.width/2, this.headPosY, "head");

      this.game.physics.p2.enable(this.head);
      this.head.body.motionState = Phaser.Physics.P2.Body.KINEMATIC;



      // Add timer & score
      this.timerText = this.game.add.text(15, 20, "Time: " + this.timer, { font: "24px Arial", fill: "#333333" });
      this.distanceText = this.game.add.text(15, 40, "Distance: " + this.distance, { font: "24px Arial", fill: "#333333" });
      this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);

      // Replay
      this.replayButton = this.game.add.button(this.game.width, 0, 'replayButton', this.startClick, this);
      this.replayButton.anchor.setTo(0.5,0.5);


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

      this.cloudz1.tilePosition.x -=0.8;
      this.cloudz2.tilePosition.x -=0.6;

      //________________ CONTROLS
      if((this.game.input.x > this.game.width/2) && this.game.input.pointer1.isDown) {
        console.log('left');
        this.head.body.velocity.x += 10;
        this.stopHead = false;

      } else if((this.game.input.x < this.game.width/2) && this.game.input.pointer1.isDown){
        console.log('right');
        this.head.body.velocity.x -= 10;
        this.stopHead = false;
      }

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

      console.log(this.headVelocity);

      if (this.cursors.left.isDown) {

        if(this.distanceHeadCrate < 500) {
          this.headVelocity = Math.sqrt(this.headVelocity*this.headVelocity*this.headVelocityMultiplier);
          this.head.body.velocity.x -= this.headVelocity;
          this.stopHead = false;
        } else {
          //this.head.body.velocity.x -= 5;
          this.stopHead = true;
          this.headVelocity = this.headVelocityConstant;
        }


      } else if (this.cursors.right.isDown) {

        if(this.distanceHeadCrate < 500) {
          this.headVelocity = Math.sqrt(this.headVelocity*this.headVelocity*this.headVelocityMultiplier);
          this.head.body.velocity.x += this.headVelocity;
          this.stopHead = false;
        } else {
          //this.head.body.velocity.x += 5;
          this.headVelocity = this.headVelocityConstant;
          this.stopHead = true;
        }
      } else {
        this.stopHead = true;
        this.headVelocity = this.headVelocityConstant;
      }
      if(this.stopHead) {

        if(this.distanceHeadCrate > 500 && this.headPos.x < this.crate2pos.x) {
          this.head.body.velocity.x +=10;
        } else if(this.distanceHeadCrate > 500 && this.headPos.x > this.crate2pos.x) {
          this.head.body.velocity.x -=10;
        } else {
            if(this.head.body.velocity.x < 0) {
              this.head.body.velocity.x +=5;
            } else if(this.head.body.velocity.x > 0) {
              this.head.body.velocity.x -=5;
            }
        }

      }

      this.rotateHead();
      //UPDATE Y POSITION OF HEAD BASED ON X
      //(x - xm)2 + (y - ym)2 = r2
      // y' = (x-u) sin(beta) + (y-v) cos(beta) + v
      var xm = this.crate2.x-this.game.width/2;
      var ym = this.crate2.y-this.game.width/2;
      var x = this.head.body.x-this.game.width/2 + xm;
      var y = -Math.abs(  300*Math.sin(  this.toRadians(x/5)  )  );


      this.head.body.y = x*x*0.001+this.headPosY;




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

      this.rotatePlate();

      this.updateDistance();

      //console.log(this.game.world.bounds.height, this.crate2.position.y + this.crate2.height);
      if (this.crate2.position.y > this.iceplate.position.y) {
        localStorage.setItem('score', this.timer);
        localStorage.setItem('distance', this.distance);
        //this.score.current = this.timer;
        this.game.state.start('gameover');
      }
    },
    rotatePlate: function() {
      this.iceplateAngle = (this.head.position.x-this.game.width/2)*this.headAngleMultiplier + (this.crate2.position.x-this.game.width/2)*this.crate2angleMultiplier;
      this.iceplate.body.angle = this.iceplateAngle;
      this.iceplateGraphic.angle = this.iceplateAngle;

    },
    rotateHead: function() {
      this.head.body.angle = -Math.abs((this.head.position.x-this.crate2.position.x)/5);

    },
    drawBezier: function() {
      var headStartX = 90 * Math.sin(this.toRadians(this.crate2.body.angle+15));
      var headStartY = 90 * Math.cos(this.toRadians(this.crate2.body.angle+15));

      var headBezierX = 140 * Math.sin(this.toRadians(this.crate2.body.angle+30));
      var headBezierY = 140 * Math.cos(this.toRadians(this.crate2.body.angle+30));


      var accuracy = 1 / this.halsDetails, //this'll give the bezier 100 segments
        p0 = {x: this.head.position.x, y: this.head.position.y}, //use whatever points you want obviously
        p1 = {x: this.head.position.x, y: this.head.position.y + 100},
        p2 = {x: this.crate2.position.x + headStartX + headBezierX, y: this.crate2.position.y - headStartY - headBezierY},
        p3 = {x: this.crate2.position.x + headStartX, y: this.crate2.position.y - headStartY};


      for (var i = 0; i < 1; i += accuracy) {
        var p = this.calculateBezier(i, p0, p1, p2, p3);


        //console.log(Math.round(i/accuracy));
        this.circles[Math.round(i / accuracy)].x = p.x;
        this.circles[Math.round(i / accuracy)].y = p.y;


        this.circles[Math.round(i / accuracy)].scale.set(0.5 * i + 0.2, 0.5 * i + 0.2);

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
      this.timer++;
      this.timerText.setText('Time: ' + this.timer);
    },
    updateDistance: function() {
      this.distance = this.distance + 1;
      if (this.iceplateAngle > 0) {
        this.distance = this.distance + 0.5 * Math.abs(this.iceplateAngle);
      }

      this.distanceText.setText('Distance travelled: ' + this.distance);
    },
    startClick: function() {
      this.game.state.start('play');
    }
  };

  module.exports = Play;
