/*
 * メインシーン
 */
phina.define("SceneMain", {
  // 継承
  superClass: "DisplayScene",
  // コンストラクタ
  init: function(param) {
    console.log("SceneMainクラスinit");
    // 親クラス初期化
    this.superInit();
    // セッションID
    this.sessionId = String(document.cookie.match(/PHPSESSID=[A-Za-z0-9]{32}/i)).replace("PHPSESSID=", "");
    // 背景スプライト
    this.mainwindow = Sprite("mainwindow").addChildTo(this);
    this.mainwindow.setPosition(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
    // タイトルラベル描画
    this.title;
    this.putTitle();
    // ボタン描画
    this.putXButton();
    // スプライト

    // スプライトグループ
    this.beforeStart = DisplayElement().addChildTo(this);
    this.afterStart = DisplayElement().addChildTo(this);
    this.selectedCards = DisplayElement().addChildTo(this);

    // 同部屋プレイヤー情報の描画
    this.updatePlayerInfo();
  },
  // 画面更新
  update: function(app) {
    // プレイヤー更新
    if (app.frame % UPDATE_FRAME == 0) {
      //console.log("update_frame：" + app.frame);
      // 同部屋プレイヤー情報の描画
      this.updatePlayerInfo();
    };
  },
  // Xボタン描画
  putXButton: function() {
    console.log("SceneMainクラスputXButton");
    this.xbutton = SpriteBase(
      "xbutton", "000",
      SCREEN_WIDTH - BUTTON_SIZE / 2,
      BUTTON_SIZE / 2,
      BUTTON_SIZE,
      BUTTON_SIZE
    ).addChildTo(this);
    // Xボタン押下時の処理
    this.xbutton.sprite.setInteractive(true);
    this.xbutton.sprite.onclick = function() {
      this.exit("Exit");
    }.bind(this);
  },
  // タイトル描画
  putTitle: function(theme) {
    console.log("SceneMainクラスputTitle");
    // タイトルラベル
    if (this.title != null) {
      this.title.remove();
    }
    this.title = Label({text: "しりとりカード"}).addChildTo(this);
    this.title.setPosition(SCREEN_WIDTH / 2, LABEL_FONT_SIZE);
    this.title.fontSize = LABEL_FONT_SIZE;
    this.title.fill = "white";
    this.title.stroke = "black";
    this.title.strokeWidth = 5;
  },
  // 同部屋プレイヤー情報の更新
  updatePlayerInfo: function() {
    //console.log("SceneMainクラスupdatePlayerInfo");
    axios.post("./apiGetData.php")
    .then(function (response) {
      this.erasePlayers(response);
      this.drawPlayers(response);
    }.bind(this))
    .catch(function (error) { console.log(error); })
    .finally(function () {});
  },
  // プレイヤーオブジェクト描画
  drawPlayers: function(response) {
    //console.log("SceneMainクラスdrawPlayers");
    let keys = Object.keys(response.data);
    let member_no = 2;
    let sessionExist = false;

    // スタートボタン押下前
    if (response.data[this.sessionId].gamestart_flg == 0) {
      for (let array_no = 0; array_no < keys.length; array_no++) {
        // 自プレイヤーの描画
        if (this.sessionId == keys[array_no]) {
          sessionExist = true;
          for (let x=0; x<7; x++) {
            let mycard = SpriteCard(
              CARD_URA, "000", x, LOCATE_ME
            ).addChildTo(this.beforeStart);
            this.drawPlayersLabel(response.data[this.sessionId].name, LOCATE_ME, this.beforeStart);
          }
        // 参加メンバの描画
        } else if (this.sessionId != keys[array_no]) {
          // ゲームがスタートしていたらEXIT
          if (response.data[keys[array_no]].gamestart_flg == 1) {
            this.exit("Exit");
          }
          for (let x=0; x<7; x++) {
            let frontcard = SpriteCard(
              CARD_URA, "000", x, member_no
            ).addChildTo(this.beforeStart);
            this.drawPlayersLabel(response.data[keys[array_no]].name, member_no, this.beforeStart);
          }
          member_no++;
        }
        // スタートボタン
        if (member_no > 2) {
          let startbutton = SpriteButtonStart(
            "000", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2
          ).addChildTo(this.beforeStart);
          // スタートボタン押下時の処理
          startbutton.sprite.setInteractive(true);
          startbutton.sprite.onclick = function() {
            console.log("startButton.onclick");
            axios.post("./apiStartGame.php")
            .then(function (response) {

            }.bind(this))
            .catch(function (error) { console.log(error); })
            .finally(function () {});
          }.bind(this);
        }
      }

    // スタートボタン押下後
    } else {
      for (let array_no = 0; array_no < keys.length; array_no++) {
        // 自プレイヤーの描画
        if (this.sessionId == keys[array_no]) {
          sessionExist = true;
          // 名前ラベル描画
          this.drawPlayersLabel(response.data[this.sessionId].name, LOCATE_ME, this.afterStart);
          // 最初の1枚
          this.drawSelectedCard(response.data[this.sessionId].first_card, 1, LOCATE_CENTER);
          // カード描画
          for (let x=0; x<7; x++) {
            let cardNo = response.data[this.sessionId].owned_cards[x];
            // 非選択カードの描画
            if (response.data[this.sessionId].touch_timestamp[x] == 0) {
              let mycard = SpriteCard(
                CARD_OMOTE, cardNo, x, LOCATE_ME
              ).addChildTo(this.afterStart);
              // カードタッチ時の処理
              mycard.sprite.setInteractive(true);
              mycard.sprite.onclick = function() {
                // スプライト消去
                mycard.sprite.remove();
                // タッチ時間を更新
                let post_data= {"card_array_no":x, "touch_timestamp": Date.now()};
                console.log("post_data", post_data);
                axios.post("./apiTouchCard.php", post_data)
                .then(function (response) {

                }.bind(this))
                .catch(function (error) { console.log(error); })
                .finally(function () {});
              }.bind(this);
              // 選択済みカードの中から削除
              this.eraseSelectedCard(cardNo);
              
            // 選択済みカードの描画
            } else {
              this.drawSelectedCard(cardNo, x, LOCATE_ME);
            }
          }
        // 参加メンバの描画
        } else if (this.sessionId != keys[array_no]) {
          for (let x=0; x<7; x++) {
            let cardNo = response.data[keys[array_no]].owned_cards[x];
            if (response.data[keys[array_no]].touch_timestamp[x] == 0) {
              let membercard = SpriteCard(
                CARD_OMOTE, cardNo, x, member_no
              ).addChildTo(this.afterStart);
              this.drawPlayersLabel(response.data[keys[array_no]].name, member_no, this.afterStart);
              // 選択済みカードの中から削除
              this.eraseSelectedCard(cardNo);

            // 選択済みカードの描画
            } else {
              this.drawSelectedCard(cardNo, x, member_no);
            }
          }
          member_no++;
        }
      }
    }
    // セッションIDが消えていたらEXIT
    if (!sessionExist) {
      this.exit("Exit");
    }
  },
  // プレイヤーラベル描画
  drawPlayersLabel: function(name, locate, addTarget) {
    let label = Label({text: name}).addChildTo(addTarget);
    label.fontSize = LABEL_FONT_SIZE;
    label.fill = "white";
    label.stroke = "black";
    label.strokeWidth = 5;
    // ラベル位置（下）
    if (locate == LOCATE_ME) {
      label.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT - CARD_HEIGHT - LABEL_FONT_SIZE);
    }
    // ラベル位置（上）
    if (locate == LOCATE_FRONT) {
      label.setPosition(SCREEN_WIDTH / 2, TITLE_HEIGHT + CARD_HEIGHT - PADDING);
      label.setRotation(180);
    }
    // ラベル位置（左）
    if (locate == LOCATE_LEFT) {
      label.setPosition(CARD_HEIGHT + PADDING * 2, SCREEN_HEIGHT / 2 + PADDING * 3);
      label.setRotation(90);
    }
    // ラベル位置（右）
    if (locate == LOCATE_RIGHT) {
      label.setPosition(SCREEN_WIDTH - CARD_HEIGHT - PADDING * 2, SCREEN_HEIGHT / 2 + PADDING * 3);
      label.setRotation(270);
    }
  },
  // 選択済みカード描画
  drawSelectedCard: function(cardNo, x, locate) {
    let existFlg = false;
    // 描画済みかどうかをチェック
    for (i=0; i<this.selectedCards.children.length; i++) {
      if (this.selectedCards.children[i].cardNo == cardNo) {
        existFlg = true;
        break;
      }
    }
    // 描画していないカードなら描画
    if (existFlg == false) {
      let selected_card = SpriteCardSelected(
        CARD_OMOTE, cardNo, x, locate
      ).addChildTo(this.selectedCards);
      // カードタッチ時の処理
      selected_card.sprite.setInteractive(true);
      selected_card.sprite.onclick = function() {
        // 1枚目を除く最前のスプライトのみ処理
        array_length = this.selectedCards.children.length;
        if (array_length > 1 && selected_card.cardNo == this.selectedCards.children[array_length - 1].cardNo) {
          // タッチ時間を更新
          let post_data= {"card_array_no":x, "touch_timestamp": 0, "card_no": cardNo};
          console.log("post_data", post_data);
          axios.post("./apiTouchCard.php", post_data)
          .then(function (response) {

          }.bind(this))
          .catch(function (error) { console.log(error); })
          .finally(function () {});
        }
      }.bind(this);
    }
  },
  // 選択済みカード描画
  eraseSelectedCard: function(cardNo) {
    //console.log("this.selectedCards.children.length", this.selectedCards.children.length);
    for (i=0; i<this.selectedCards.children.length; i++) {
      //console.log("this.selectedCards.children[i].cardNo", this.selectedCards.children[i].cardNo, "cardNo", cardNo);
      if (this.selectedCards.children[i].cardNo == cardNo) {
        //console.log("this.selectedCards.children[i]", i, this.selectedCards.children[i].cardNo);
        this.selectedCards.children.splice(i, 1);
        break;
      }
    }
  },
  // プレイヤーオブジェクト消去
  erasePlayers: function(response) {
    //console.log("SceneMainクラスerasePlayers");
    this.beforeStart.children.length = 0;
    this.afterStart.children.length = 0;
  }
});
