var request = require('request');
var nodeExcel = require('excel-export');
var _ = require('underscore');
module.exports = {
    /**
     * 打印操作日志
     ***/
    log: function (req, userid, username, action) {
        var data = {};
        data.userid = userid;
        data.username = username;
        data.action = action;
        data.dateline = Date.parse(new Date()) / 1000;
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_admin_log';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
            }
        );
    },
    /**
     * 生成excel 表格
     ***/
    excel: function (_cols, _rows) {
        /**静态数据
         var conf ={};
         conf.cols = [
         {caption:'string', type:'string'},
         {caption:'date', type:'date'},
         {caption:'bool', type:'bool'},
         {caption:'number', type:'number'}
         ];
         conf.rows = [
         ['pi', (new Date(2013, 4, 1)).getJulian(), true, 3.14],
         ["e", (new Date(2012, 4, 1)).getJulian(), false, 2.7182]
         ];
         var result = nodeExcel.execute(conf);
         res.setHeader('Content-Type', 'application/vnd.openxmlformats');
         res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
         res.end(result, 'binary');
         **/
        var conf = {};
        conf.cols = _cols, conf.rows = _rows;
        return nodeExcel.execute(conf);
    },
    /**
     * 对象转化为数组
     * _Objvalue:[{}]
     ***/
    ObjTOArray: function (_Objvalue) {
        var _Array = [];
        if (_Objvalue.length > 0) {
            for(var i=0; i<_Objvalue.length; i++){
                _Array[i]= _.values(_Objvalue[i]);
            }
        }
        return _Array;
    }
};