/**
 * Created by Administrator on 2016/1/8.
 */


var request = require('request');
var moment = require('moment');
var async = require('async');
module.exports = {
    /**
     * 钱眼推广用添加
     * @param req
     * @param res
     */
    qianYanAdd: function (req, res) {
        if(req.method == 'GET'){
            return res.view('qianYan/qianYanAdd', {
                error: req.param('error') || '',
                usertype: req.session.usertype,
                username: req.session.username
            });
        }else{
            var data = {};
            data.c_hash = req.body('c_hash') || '';
            data.c_name = req.body('c_name') || '';
            data.spread_num = req.body('spread_num') || 0;
            data.percent = req.body('percent') || 0;
            data.status = req.body('status') || 0;
            var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/cy_qianyanExpand_add';
            request.post({url: url, form: JSON.stringify(data)},
                function (err, httpResponse, body) {
                    if (err) console.log(err);
                    return res.json({"status": "ok"});
                }
            );
        }
    },

    //钱眼推广主页
    index:function(req, res){
        //get请求
        if(req.method == 'get'){
            return res.view('qianYan/qianYanindex', {
                error: req.param('error') || '',
                usertype: req.session.usertype,
                username: req.session.username
            });
        }else{
            console.log('POST IS IN');
            console.log(req.body);
            console.log(req.query);
            console.log(req.param);
            var in_data = req.allParams();
            console.log(in_data);
            //post请求
            var current_page = req.body.current_page || 0;
            var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/cy_qianyanExpand_add';
            request.post({url:url,current_page:JSON.stringify(current_page)},function(err,data){
                console.log(data);
                    if(err) throw err ;
                return res.json({"status":"ok",data:data});
            });
        }

    }
};