
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');


    this.load.image('mountain-graphic', 'assets/mountains.png');
    this.load.image('cloudz-01', 'assets/cloudz_Top.png');
    this.load.image('cloudz-02', 'assets/cloudz_Bottom.png');



    this.load.image('water-01', 'assets/water-01.png');
    this.load.image('water-02', 'assets/water-02.png');
   /* this.load.image('mountain-01', 'assets/mountains/mountain-01.png');
    this.load.image('mountain-02', 'assets/mountains/mountain-02.png');
    this.load.image('mountain-03', 'assets/mountains/mountain-03.png');
    this.load.image('mountain-04', 'assets/mountains/mountain-04.png');
    this.load.image('mountain-05', 'assets/mountains/mountain-05.png');*/
    this.load.image('frozenGiraffe', 'assets/IceCube_01-01.png');
    this.load.image('crate', 'assets/iceplate.png');
    this.load.image('head', 'assets/head-08.png');
    this.load.spritesheet('giraffe', 'assets/giraffe_sprite_04.png', 200.25,245.25);

  },
  create: function() {
    this.asset.cropEnabled = false;
    this.game.stage.backgroundColor = '#80E9DD';

  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
