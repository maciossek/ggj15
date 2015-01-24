
  'use strict';
  function Play() {}
  Play.prototype = {
    preload: function() {
      this.iceplate = null;
      this.iceplateAngle = 0;


      //giraffe Variables
      this.crate2 = null;
      this.crate2angleMultiplier = 0.1;
      this.facing = 'left';
      //head Variables
      this.head = null;
      this.headAngleMultiplier = 0.1;
      this.stopHead = true;

      //giraffe hals
      this.circles=[];
      this.halsDetails = 100;


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
      this.game.physics.p2.gravity.y = 250;
      this.game.physics.p2.friction = 0.00001;

      for(var i=0; i<this.halsDetails; i++) {
        this.circles[i] = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY);
        this.circles[i].lineStyle(1, 0xf47f4d);
        this.circles[i].beginFill(0xf47f4d, 1);

        this.circles[i].drawCircle(0, 0, 50);
        this.circles[i].endFill();
      }


      //SETUP Iceplate
      this.iceplate = this.game.add.sprite(this.game.width/2, 600, "crate");
      this.iceplate.anchor.setTo(0.5, 0.5);
      this.iceplate.scale.setTo(3, 1);
      this.iceplate.friction = 0.0005;
      this.game.physics.p2.enable(this.iceplate);
      this.iceplate.body.motionState = Phaser.Physics.P2.Body.KINEMATIC;


      //Setup Giraffe
      this.crate2 = this.game.add.sprite(this.game.width/2, 300, "giraffe");

      this.game.physics.p2.enable(this.crate2);
      this.crate2animationLeft = this.crate2.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
      this.crate2animationRight = this.crate2.animations.add('right', [7, 6, 5, 4, 3, 2, 1, 0], 8, true);
      this.crate2animationTurn = this.crate2.animations.add('turn', [4], 20, true);



      //Setup Head
      this.head = this.game.add.sprite(this.game.width/2, 50, "head");

      this.game.physics.p2.enable(this.head);
      this.head.body.motionState = Phaser.Physics.P2.Body.KINEMATIC;



      // Add timer & score
      this.timerText = this.game.add.text(15, 20, "Time: " + this.timer, { font: "24px Arial", fill: "#333333" });
      this.distanceText = this.game.add.text(15, 40, "Distance: " + this.distance, { font: "24px Arial", fill: "#333333" });
      this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);


      //________________ CONTROLS

      //game.input.onDown.add(doSomething, this);
      this.cursors = this.game.input.keyboard.createCursorKeys();

      this.game.input.keyboard.onUpCallback = function(e) {
        this.stopHead = true;
      }
    },
    update: function() {
      this.drawBezier();

      //________________ CONTROLS
      if (this.cursors.left.isDown) {
        this.head.body.velocity.x -= 10;

        this.stopHead = false;
      } else if (this.cursors.right.isDown) {
        this.head.body.velocity.x += 10;

        this.stopHead = false;
      }
      if(this.stopHead) {
        if(this.head.body.velocity.x < 0) {
          this.head.body.velocity.x +=10;
        } else if(this.head.body.velocity.x > 0) {
          this.head.body.velocity.x -=10;
        }
      }
      //UPDATE Y POSITION OF HEAD BASED ON X
      //(x - xm)2 + (y - ym)2 = r2
      // y' = (x-u) sin(beta) + (y-v) cos(beta) + v
      var xm = this.crate2.x;
      var ym = this.crate2.y;
      var x = Math.abs(this.head.body.x-this.game.width/2);
      var y = -Math.abs(  300*Math.sin(  this.toRadians(x/5)  )  );

      this.head.body.y = x*x/300+50;


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

      this.crate2animationLeft.speed = Math.abs(this.iceplateAngle)*3;
      this.crate2animationRight.speed = Math.abs(this.iceplateAngle)*3;

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

    },
    drawBezier: function() {
      var accuracy = 1 / this.halsDetails, //this'll give the bezier 100 segments
        p0 = {x: this.head.position.x, y: this.head.position.y}, //use whatever points you want obviously
        p1 = {x: this.head.position.x, y: this.head.position.y + 100},
        p2 = {x: this.crate2.position.x + 20, y: this.crate2.position.y - 150},
        p3 = {x: this.crate2.position.x + 20, y: this.crate2.position.y - 70};


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
    }
  };

  module.exports = Play;
