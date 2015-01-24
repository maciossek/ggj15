
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
