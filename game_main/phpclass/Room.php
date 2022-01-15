<?php
class Room extends Base
{
    // POST値
    private $post_ary;
    // JSONディレクトリ
    private $json_dir = "./json/room/";
    // 現在時刻（UNIXミリ秒）
    private $unix_time;
    // IPアドレス
    private $ip_address;
    // 部屋情報JSONをクリア対象とするミリ秒数
    const JSON_CLR_TIME = 600 * 1000;
    // 1人のカード枚数
    const NUMBER_OF_CARDS = 7;
    // すべてのカード枚数
    const TOTAL_CARDS = 60;
    // 最初の1枚の許可枚数
    const FIRST_CARDS = 45;

    // コンストラクタ
    public function __construct($post_ary)
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        //$this->debug_log("POST値", $post_ary);

        $this->classname = get_class($this);
        $this->post_ary = $post_ary;
        $this->unix_time = ceil(microtime(true)*1000);
        $this->ip_address = $_SERVER["REMOTE_ADDR"];
        // 部屋番号が未入力の場合
        if ($this->post_ary['roomno'] == null) {
            $this->post_ary['roomno'] = $this->ip_address;
        }
        // デバッグ情報
        //$this->debug_log("ip_address", $this->ip_address);
        //$this->debug_log("unix_time", $this->unix_time);
    }

    // 部屋情報作成
    public function createRoomInfo()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        $this->debug_log("POST値", $this->post_ary);
        // JSONファイル読込
        $json_file = $this->json_dir . $this->post_ary['roomno'] . ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
        // ゲームスタート済の場合の考慮が必要


        // JSONデータ更新（古いセッション情報をクリア）
        foreach ($json_buf as $key => $value) {
            // 要素クリア
            if ($this->unix_time - $value["createtimestamp"] > self::JSON_CLR_TIME) {
                // デバッグ情報
                $this->debug_log("要素クリア", ($this->unix_time - $value["createtimestamp"]));
                unset($json_buf[$key]);
            }
        }
        // JSONデータ更新
        if (!isset($json_buf[session_id()])) {
            $json_buf += array(session_id()=>$this->post_ary["sessionid"]);
        };
        $json_buf[session_id()]["createtimestamp"] = $this->unix_time;
        $json_buf[session_id()]["roomno"] = $this->post_ary["roomno"];
        $json_buf[session_id()]["name"] = $this->post_ary["name"];
        $json_buf[session_id()]["id"] = session_id();
        $json_buf[session_id()]["gamestart_flg"] = 0;
        for ($i = 0; $i < self::NUMBER_OF_CARDS; $i++) {
            $json_buf[session_id()]["owned_cards"][$i] = "";
            $json_buf[session_id()]["touch_timestamp"][$i] = 0;
        }
        $json_buf[session_id()]["first_card"] = "";
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
        // JSONファイル書込
        file_put_contents($json_file, json_encode($json_buf));
        // セッション情報更新
        $_SESSION["roomno"] = $this->post_ary["roomno"];
        // デバッグ情報
        $this->debug_log("session_id()", session_id());
        $this->debug_log("_SESSION", $_SESSION);
    }

    // 部屋情報取得
    public function getRoomInfo()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        //$this->debug_log("session_id()", session_id());
        //$this->debug_log("_SESSION", $_SESSION);

        // JSONファイル読込
        $json_file = $this->json_dir . $_SESSION["roomno"]. ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // デバッグ情報
        //$this->debug_log("$json_file", $json_buf);
        return $json_buf;
    }

    // 部屋情報削除
    public function deleteRoomInfo()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        $this->debug_log("session_id()", session_id());
        $this->debug_log("_SESSION", $_SESSION);
        // JSONファイル読込
        $json_file = $this->json_dir . $_SESSION["roomno"]. ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // JSONデータ更新
        unset($json_buf[session_id()]);
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
        // JSONファイル書込
        file_put_contents($json_file, json_encode($json_buf));
    }

    // ゲームスタート
    public function startGame()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        $this->debug_log("session_id()", session_id());
        $this->debug_log("_SESSION", $_SESSION);
        // JSONファイル読込
        $json_file = $this->json_dir . $_SESSION["roomno"]. ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);

        // カード抽選
        $cards_array = range(0, self::TOTAL_CARDS - 1);
        shuffle($cards_array);

        // JSONデータ更新
        $cards_array_no = 0;
        foreach ($json_buf as $key => $value) {
            // ゲームスタートのフラグ
            $json_buf[$key]["gamestart_flg"] = 1;
            // カード配布
            for ($i = 0; $i < self::NUMBER_OF_CARDS; $i++) {
                $json_buf[$key]["owned_cards"][$i] = sprintf('%03d', $cards_array[$cards_array_no]);
                $cards_array_no++;
            }
        }
        foreach ($json_buf as $key => $value) {
            // 最初の1枚
            while (true) {
                $json_buf[$key]["first_card"] = sprintf('%03d', $cards_array[$cards_array_no]);
                if ($cards_array[$cards_array_no] < self::FIRST_CARDS) break;
                $cards_array_no++;
            }
        }
        // JSONファイル書込
        file_put_contents($json_file, json_encode($json_buf));
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
    }
    // カードタッチ処理
    public function touchCard()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        $this->debug_log("POST値", $this->post_ary);
        // JSONファイル読込
        $json_file = $this->json_dir . $_SESSION["roomno"]. ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // 自分のカードをタッチした場合は、タイムスタンプがPOSTされる
        $timestamp = $this->post_ary["touch_timestamp"];
        // JSONデータ更新
        if ($timestamp > 0) {
            // カードを中央へ出す
            $json_buf[session_id()]["touch_timestamp"][$this->post_ary["card_array_no"]] = $timestamp;
        } else {
            // カードを手元へ戻す
            foreach ($json_buf as $key => $value) {
                // カード
                for ($i = 0; $i < self::NUMBER_OF_CARDS; $i++) {
                    if ($json_buf[$key]["owned_cards"][$i] == $this->post_ary["card_no"]){
                        $json_buf[$key]["touch_timestamp"][$i] = 0;
                    }
                }
            }
        }
        // JSONファイル書込
        file_put_contents($json_file, json_encode($json_buf));
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
        return $json_buf;
    }
}
?>