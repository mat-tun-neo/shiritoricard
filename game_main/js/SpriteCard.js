phina.define("SpriteCard", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(spritesheet, animation, column, locate, width= CARD_WIDTH, height= CARD_HEIGHT) {
    //console.log("SpriteCardクラスinit");
    this.superInit(spritesheet, animation, 0, 0, width, height);
    this.drawCards(column, locate, width, height);
  },
  drawCards: function(column, locate, width, height) {
    // 初期位置（下）
    if (locate == LOCATE_ME) {
      this.sprite.x = column * (CARD_WIDTH + PADDING) + CARD_WIDTH / 2 + PADDING;
      this.sprite.y = SCREEN_HEIGHT - CARD_HEIGHT / 2 - PADDING;
    }
    // 初期位置（上）
    if (locate == LOCATE_FRONT) {
      this.sprite.x = column * (CARD_WIDTH + PADDING) + CARD_WIDTH / 2 + PADDING;
      this.sprite.y = BUTTON_SIZE + CARD_HEIGHT / 2 + PADDING;
      this.sprite.setRotation(180);
    }
    // 初期位置（左）
    if (locate == LOCATE_LEFT) {
      this.sprite.x = CARD_HEIGHT / 2;
      this.sprite.y = column * (CARD_WIDTH + PADDING) + CARD_WIDTH * 3;
      this.sprite.setRotation(90);
    }
    // 初期位置（右）
    if (locate == LOCATE_RIGHT) {
      this.sprite.x = SCREEN_WIDTH - CARD_HEIGHT / 2;
      this.sprite.y = column * (CARD_WIDTH + PADDING) + CARD_WIDTH * 3;
      this.sprite.setRotation(270);
    }

  }
});