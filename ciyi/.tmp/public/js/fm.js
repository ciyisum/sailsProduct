Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function fmLogin(name, ps, callback) {
    var uppas = $.md5(ps).toUpperCase();
    var res = $.md5(new Date().Format("yyyyMMdd") + uppas + name + '_9W%kNpRI%[Wbb?_{b%I"Rh|J8]@').toUpperCase();
    $.ajax({
        type: "get",
        url: "http://reg.mfniu.com/index.php?c=center&a=videologinCallback&name=" + name + "&password=" + uppas + "&key=" + res,
        dataType: "jsonp",
        callback: 'loginCallback',
        success: function(result){
            callback(result);
        }
    });
};

function send_msg(token, uid, sessionid, content, url, callback) {
    var ChatSocket = io.connect(url);
    ChatSocket.on("connect", function () {
        // console.log("连接成功");
    });

    ChatSocket.on("message", function (body) {
        callback(body);
    });

    ChatSocket.emit("message", {
        event: "laba",
        data: content
    });
}

function sleep(n, callback)
{
  var start=new Date().getTime();
  while(true) if(new Date().getTime()-start>n) break;
}