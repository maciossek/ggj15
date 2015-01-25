
'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {
    this.currentScore = Math.round(localStorage.getItem('score'));
    this.bestScore = Math.round(localStorage.getItem('bestScore'));
    this.steps =  Math.round(localStorage.getItem('distance'));
    this.bestSteps = Math.round(localStorage.getItem('bestDistance'));



    if (this.currentScore > this.bestScore) {
      localStorage.setItem('bestScore', this.currentScore);
    }
    if (this.steps > this.bestSteps) {
      localStorage.setItem('bestDistance', this.steps);
    }

  },
  create: function () {
    var style = { font: '65px Slabo', fill: '#ffffff', align: 'center'};

    this.mountains = this.game.add.tileSprite(0, this.game.height-117, this.game.width, 170, "mountain-graphic");
    //this.mountains.scale.setTo(0.2, 0.2);
    this.mountains.anchor.setTo(0, 1);


    this.cloudz1 = this.game.add.tileSprite(0, this.game.height-400, this.game.width, 170, "cloudz-01");
    this.cloudz1.anchor.setTo(0, 1);
    this.cloudz2 = this.game.add.tileSprite(0, this.game.height-130, this.game.width, 170, "cloudz-02");
    this.cloudz2.anchor.setTo(0, 1);

    this.water1 = this.game.add.tileSprite(0, this.game.height, this.game.width, 117, "water-01");
    this.water1.anchor.setTo(0, 1);

    this.frozenGiraffe = this.game.add.sprite(this.game.width/4, this.game.height , "frozenGiraffe");
    var tw = this.game.add.tween(this.frozenGiraffe).to({y: this.game.height-this.frozenGiraffe.height/2 }, 1200, Phaser.Easing.Cubic.Out, true, 0);
    tw.onComplete.add(function(){
      this.game.add.tween(this.frozenGiraffe).to({y:this.frozenGiraffe.position.y + 20}, 2400, Phaser.Easing.Cubic.InOut, true, 0, 1000, true).start();
      },this);
    //

    this.water2 = this.game.add.tileSprite(0, this.game.height, this.game.width, 117, "water-02");
    this.water2.anchor.setTo(0,1);



    //this.frozenGiraffe .body.motionState = Phaser.Physics.P2.Body.STATIC;

    var style = { font: '120px ShareTech', fill: '#77afa7', align: 'center'};

    this.timerText = this.game.add.text(15, 20, "Time: " + this.currentScore, style);
    this.distanceText = this.game.add.text(this.game.width - 20, 20, "Steps: " + this.steps, { font: '60px ShareTech', fill: '#77afa7', align: 'center'});

    this.distanceText.anchor.setTo(0.5, 0.5);
    this.timerText.anchor.setTo(0.5, 0.5);
    this.distanceText.scale = { x:0.8, y: 0.8 };
    this.timerText.scale = { x:0.8, y: 0.8 };



    this.game.add.tween(this.distanceText.scale).to({ x:1, y: 1 }, 500, Phaser.Easing.Back.Out, true, 10);;
    this.game.add.tween(this.timerText.scale).to({ x:1, y: 1 }, 500, Phaser.Easing.Back.Out, true, 10);;

    this.game.add.tween(this.timerText).to({ x: this.game.width/2, y:120 }, 500, Phaser.Easing.Back.Out, true, 10);
    this.game.add.tween(this.distanceText).to({ x: this.game.width/2, y: 200 }, 500, Phaser.Easing.Back.Out, true, 10);


/*
    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You lasted ' + localStorage.getItem('score') + ' Seconds', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);
    this.congratsText = this.game.add.text(this.game.world.centerX, 250, 'Best ' + localStorage.getItem('bestScore') + ' Seconds', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);
    this.congratsText = this.game.add.text(this.game.world.centerX, 300, 'You travelled ' + localStorage.getItem('distance') + ' miles', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);
    this.congratsText = this.game.add.text(this.game.world.centerX, 350, 'Best: ' + localStorage.getItem('bestDistance') + ' miles', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);
    this.instructionText = this.game.add.text(this.game.world.centerX, 400, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
    */
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  },
  shutdown: function() {
    this.timerText.destroy();
    this.distanceText.destroy();
    this.cloudz1.destroy();
    this.cloudz2.destroy();
    this.mountains.destroy();
    this.frozenGiraffe.destroy();
    this.water1.destroy();
    this.water2.destroy();
  }
};
module.exports = GameOver;
