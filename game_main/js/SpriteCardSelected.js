phina.define("SpriteCardSelected", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(spritesheet, animation, column, locate, width= CARD_WIDTH*3, height= CARD_HEIGHT*3) {
    //console.log("SpriteCardSelectedクラスinit");
    this.superInit(spritesheet, animation, 0, 0, width, height);
    this.locate = locate;
    this.cardNo = animation;
    let xlocateShake = Math.floor(Math.random()*LOCATE_SHAKE) - LOCATE_SHAKE/2;
    let ylocateShake = Math.floor(Math.random()*LOCATE_SHAKE) - LOCATE_SHAKE/2;
    this.targetX = SCREEN_WIDTH / 2 + xlocateShake;
    this.targetY = SCREEN_HEIGHT / 2 + ylocateShake;
    
    this.drawCards(column);
  },
  drawCards: function(column) {
    let angleShake = Math.floor(Math.random()*ANGLE_SHAKE) - ANGLE_SHAKE/2;
    // 初期位置（下）
    if (this.locate == LOCATE_ME) {
      this.sprite.x = column * (CARD_WIDTH + PADDING) + CARD_WIDTH / 2 + PADDING;
      this.sprite.y = SCREEN_HEIGHT - CARD_HEIGHT / 2 - PADDING - CARD_HEIGHT;
      this.sprite.setRotation(angleShake);
      // 「タップしてもどす」ラベル
      //this.addNameLabel("タップしてもどす", angleShake);
    }
    // 初期位置（上）
    if (this.locate == LOCATE_FRONT) {
      this.sprite.x = column * (CARD_WIDTH + PADDING) + CARD_WIDTH / 2 + PADDING;
      this.sprite.y = BUTTON_SIZE + CARD_HEIGHT / 2 + PADDING + CARD_HEIGHT;
      this.sprite.setRotation(180 + angleShake);
    }
    // 初期位置（左）
    if (this.locate == LOCATE_LEFT) {
      this.sprite.x = CARD_HEIGHT / 2 + CARD_HEIGHT;
      this.sprite.y = column * (CARD_WIDTH + PADDING) + CARD_WIDTH * 3;
      this.sprite.setRotation(90 + angleShake);
    }
    // 初期位置（右）
    if (this.locate == LOCATE_RIGHT) {
      this.sprite.x = SCREEN_WIDTH - CARD_HEIGHT / 2 + CARD_HEIGHT;
      this.sprite.y = column * (CARD_WIDTH + PADDING) + CARD_WIDTH * 3;
      this.sprite.setRotation(270 + angleShake);
    }
    // 初期位置（中央）
    if (this.locate == LOCATE_CENTER) {
      this.sprite.x = this.targetX;
      this.sprite.y = this.targetY;
      this.sprite.setRotation(angleShake);
    }
  },
  // 更新
  update: function(app) {
    //console.log("SpriteCardSelectedクラスupdate");
    var xDiff = this.targetX - this.sprite.x;
    var yDiff = this.targetY - this.sprite.y
    // 徐々に次の位置に近づける
    if (xDiff !=0 && yDiff !=0) {
      this.sprite.moveBy(xDiff * MOVE_SPEED, yDiff * MOVE_SPEED);
    }
  },
  // ラベルオブジェクト追加
  addNameLabel: function(str, angleShake, color="white") {
    this.nameLabel = Label({
      text: str,
      x: this.targetX,
      y: this.targetY + CARD_HEIGHT + PADDING*2,
      fontSize: 20,
      fill: color,
      stroke: "black",
      strokeWidth: 5,
    }).addChildTo(this);
    this.nameLabel.setRotation(angleShake);
  }
});