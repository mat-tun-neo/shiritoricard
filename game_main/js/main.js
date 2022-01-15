// グローバルに展開
phina.globalize();

// 画面・スプライトサイズ
const SCREEN_WIDTH           = 640;
const SCREEN_HEIGHT          = 960;
const PADDING                = 10;
const BUTTON_SIZE            = 60;
const LABEL_FONT_SIZE        = 30;
const TITLE_HEIGHT           = 100;
const START_BUTTON_WIDTH     = 300;
const START_BUTTON_HEIGHT    = 300;
const CARD_WIDTH             = SCREEN_WIDTH / 8;
const CARD_HEIGHT            = SCREEN_HEIGHT / 10;

// 座標値
const START_X = SCREEN_WIDTH / 4;
const START_Y = TITLE_HEIGHT;
const LOCATE_ME = 1;          // 位置（下）
const LOCATE_FRONT = 2;       // 位置（上）
const LOCATE_LEFT = 3;        // 位置（左）
const LOCATE_RIGHT = 4;       // 位置（右）
const LOCATE_CENTER = 5;      // 位置（中央）
const LOCATE_SHAKE = 100;     // 座標のぶれ
const ANGLE_SHAKE = 30;       // 角度のぶれ
const MOVE_SPEED = 0.5;       // 移動スピード

// URL
const HREF = document.getElementById("HTTP_REFERER").innerText;

const date = new Date();
const Y = date.getFullYear();
const M = ("00" + (date.getMonth()+1)).slice(-2);
const D = ("00" + date.getDate()).slice(-2);
const h = ("00" + date.getHours()).slice(-2);
const m = ("00" + date.getMinutes()).slice(-2);
const s = ("00" + date.getSeconds()).slice(-2);
const datestr = "?" + Y + M + D + h + m + s;

// 各セッティング値
const UPDATE_FRAME = 10;          // 同期フレーム
const CARD_OMOTE = "cards";       // カード表スプライトシート
const CARD_URA = "card_ura";      // カード裏裏スプライトシート

// アセット
const ASSETS = {
  // 画像
  image: {
    "mainwindow":      "./images/background.jpg" + datestr,
    "cards":           "./images/cards.png" + datestr,
    "card_ura":        "./images/card_ura.png" + datestr,
    "start_button":    "./images/startbutton.png" + datestr,
    "xbutton":         "./images/xbutton.png" + datestr
  },
  // スプライトシート
  spritesheet: {
    "xbutton":
    {
      "frame": { "width": 80, "height": 80, "cols": 1, "rows": 1 },
      "animations" : {
        "000": {"frames": [0] , "next": "000", "frequency": 1 }
      }
    },
    "start_button":
    {
      "frame": { "width": 300, "height": 300, "cols": 2, "rows": 1 },
      "animations" : {
        "000": {"frames": [0, 1] , "next": "000", "frequency": 10 }
      }
    },
    "cards":
    {
      "frame": { "width": 300, "height": 360, "cols": 5, "rows": 12 },
      "animations" : {
        "000": {"frames": [0] , "next": "000", "frequency": 1 },
        "001": {"frames": [1] , "next": "001", "frequency": 1 },
        "002": {"frames": [2] , "next": "002", "frequency": 1 },
        "003": {"frames": [3] , "next": "003", "frequency": 1 },
        "004": {"frames": [4] , "next": "004", "frequency": 1 },
        "005": {"frames": [5] , "next": "005", "frequency": 1 },
        "006": {"frames": [6] , "next": "006", "frequency": 1 },
        "007": {"frames": [7] , "next": "007", "frequency": 1 },
        "008": {"frames": [8] , "next": "008", "frequency": 1 },
        "009": {"frames": [9] , "next": "009", "frequency": 1 },
        "010": {"frames": [10], "next": "010", "frequency": 1 },
        "011": {"frames": [11], "next": "011", "frequency": 1 },
        "012": {"frames": [12], "next": "012", "frequency": 1 },
        "013": {"frames": [13], "next": "013", "frequency": 1 },
        "014": {"frames": [14], "next": "014", "frequency": 1 },
        "015": {"frames": [15], "next": "015", "frequency": 1 },
        "016": {"frames": [16], "next": "016", "frequency": 1 },
        "017": {"frames": [17], "next": "017", "frequency": 1 },
        "018": {"frames": [18], "next": "018", "frequency": 1 },
        "019": {"frames": [19], "next": "019", "frequency": 1 },
        "020": {"frames": [20], "next": "020", "frequency": 1 },
        "021": {"frames": [21], "next": "021", "frequency": 1 },
        "022": {"frames": [22], "next": "022", "frequency": 1 },
        "023": {"frames": [23], "next": "023", "frequency": 1 },
        "024": {"frames": [24], "next": "024", "frequency": 1 },
        "025": {"frames": [25], "next": "025", "frequency": 1 },
        "026": {"frames": [26], "next": "026", "frequency": 1 },
        "027": {"frames": [27], "next": "027", "frequency": 1 },
        "028": {"frames": [28], "next": "028", "frequency": 1 },
        "029": {"frames": [29], "next": "029", "frequency": 1 },
        "030": {"frames": [30], "next": "030", "frequency": 1 },
        "031": {"frames": [31], "next": "031", "frequency": 1 },
        "032": {"frames": [32], "next": "032", "frequency": 1 },
        "033": {"frames": [33], "next": "033", "frequency": 1 },
        "034": {"frames": [34], "next": "034", "frequency": 1 },
        "035": {"frames": [35], "next": "035", "frequency": 1 },
        "036": {"frames": [36], "next": "036", "frequency": 1 },
        "037": {"frames": [37], "next": "037", "frequency": 1 },
        "038": {"frames": [38], "next": "038", "frequency": 1 },
        "039": {"frames": [39], "next": "039", "frequency": 1 },
        "040": {"frames": [40], "next": "040", "frequency": 1 },
        "041": {"frames": [41], "next": "041", "frequency": 1 },
        "042": {"frames": [42], "next": "042", "frequency": 1 },
        "043": {"frames": [43], "next": "043", "frequency": 1 },
        "044": {"frames": [44], "next": "044", "frequency": 1 },
        "045": {"frames": [45], "next": "045", "frequency": 1 },
        "046": {"frames": [46], "next": "046", "frequency": 1 },
        "047": {"frames": [47], "next": "047", "frequency": 1 },
        "048": {"frames": [48], "next": "048", "frequency": 1 },
        "049": {"frames": [49], "next": "049", "frequency": 1 },
        "050": {"frames": [50], "next": "050", "frequency": 1 },
        "051": {"frames": [51], "next": "051", "frequency": 1 },
        "052": {"frames": [52], "next": "052", "frequency": 1 },
        "053": {"frames": [53], "next": "053", "frequency": 1 },
        "054": {"frames": [54], "next": "054", "frequency": 1 },
        "055": {"frames": [55], "next": "055", "frequency": 1 },
        "056": {"frames": [56], "next": "056", "frequency": 1 },
        "057": {"frames": [57], "next": "057", "frequency": 1 },
        "058": {"frames": [58], "next": "058", "frequency": 1 },
        "059": {"frames": [59], "next": "059", "frequency": 1 }
      }
    },
    "card_ura":
    {
      "frame": { "width": 300, "height": 360, "cols": 1, "rows": 1 },
      "animations" : {
        "000": {"frames": [0] , "next": "000", "frequency": 1 },
      }
    }
  }
};

// 0パディング（NUM=値 LEN=桁数）
function zeroPadding(NUM, LEN) {
	return ( Array(LEN).join("0") + NUM ).slice( -LEN );
};

// 文字列挿入
function strIns(str, idx, val) {
  return str.slice(0, idx) + val + str.slice(idx);
}

/*
 * メイン処理
 */
phina.main(function() {
  console.log("main");
  // アプリケーションを生成
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
  });
  // fps表示
  //app.enableStats();
  // 実行
  app.replaceScene(SceneSequence());
  app.run();
});

// SceneSequenceクラス
phina.define("SceneSequence", {
  superClass: "phina.game.ManagerScene",

  // 初期化
  init: function() {
    console.log("SceneSequenceクラスinit");
    this.superInit({
      scenes: [
        { label: "Loading", className: "SceneLoading" },
        { label: "Main",    className: "SceneMain" },
        { label: "Exit",    className: "SceneExit" },
      ]
    });
  }
});
  
phina.define("SceneLoading", {
  superClass: "phina.game.LoadingScene",

  init: function(options) {
    console.log("SceneLoadingクラスinit");

    this.superInit({
      // アセット読み込み
      assets: ASSETS,
    });

    this.backgroundColor = "BLACK";

    // view
    var baseLayer = DisplayElement(options).addChildTo(this);

    // ラベル
    var label = Label({
      text: "NOW LOADING...",
    })
    .addChildTo(baseLayer)
    .setPosition(this.width*0.5, this.height*0.5)
    label.tweener.clear()
    .setLoop(1)
    .to({alpha:0}, 500)
    .to({alpha:1}, 500)
    ;
    label.fill = "white";
    label.fontSize = 40;

    this.exit("Main");
  }
});
