
'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {
    if (localStorage.getItem('score') > localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', localStorage.getItem('score'));
    }
    if (localStorage.getItem('distance') > localStorage.getItem('bestDistance')) {
      localStorage.setItem('bestDistance', localStorage.getItem('distance'));
    }

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};

    this.mountains = this.game.add.tileSprite(0, this.game.height-117, this.game.width, 170, "mountain-graphic");
    //this.mountains.scale.setTo(0.2, 0.2);
    this.mountains.anchor.setTo(0, 1);


    this.cloudz1 = this.game.add.tileSprite(0, this.game.height-400, this.game.width, 170, "cloudz-01");
    this.cloudz1.anchor.setTo(0, 1);
    this.cloudz2 = this.game.add.tileSprite(0, this.game.height-130, this.game.width, 170, "cloudz-02");
    this.cloudz2.anchor.setTo(0, 1);

    this.water1 = this.game.add.tileSprite(0, this.game.height, this.game.width, 117, "water-01");
    this.water1.anchor.setTo(0, 1);

    this.frozenGiraffe = this.game.add.sprite(this.game.width * 0.3, this.game.height* 0.3 , "frozenGiraffe");
    this.game.add.tween(this.frozenGiraffe).to({y:this.frozenGiraffe.position.y + 10}, 3400, Phaser.Easing.Bounce.Out, true, 0, 1000, true);

    this.water2 = this.game.add.tileSprite(0, this.game.height, this.game.width, 117, "water-02");
    this.water2.anchor.setTo(0,1);



    //this.frozenGiraffe .body.motionState = Phaser.Physics.P2.Body.STATIC;

    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

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
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;
