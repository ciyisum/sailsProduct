/**
 * BroadcastController
 *
 * @description :: Server-side logic for managing broadcasts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');
var moment = require('moment');

module.exports = {
    history: function (req, res) {
        // return res.view('broadcast/history');
        var data = {};
        data.act = 'history';
        data.page = req.param('page') ? (req.param('page') - 1) : 0;
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_history';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                for (var i = 0; i < result.res.length; i++) {
                    result.res[i].send_time = moment(result.res[i].send_time * 1000).format('YYYY-MM-DD, hh:mm:ss');
                }
                return res.view('broadcast/history', {
                    username: req.session.username,
                    usertype: req.session.usertype,
                    history: result.res || []
                });
            }
        );
    },
    record: function (req, res) {
        var data = {};
        data.act = 'record';
        data.page = req.param('page') ? (req.param('page') - 1) : 0;
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_record';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                for (var i = 0; i < result.res.length; i++) {
                    result.res[i].create_at = moment(result.res[i].create_at * 1000).format('YYYY-MM-DD, hh:mm:ss');
                    result.res[i].update_at = moment(result.res[i].update_at * 1000).format('YYYY-MM-DD, hh:mm:ss');
                }
                return res.view('broadcast/record', {
                    username: req.session.username,
                    usertype: req.session.usertype,
                    record: result.res || []
                });
            }
        );
    },
    add: function (req, res) {
        var data = {};
        data.act = "region_list";
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_add';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body) || {'status': 'fail'};
                return res.view('broadcast/add', {
                    username: req.session.username,
                    usertype: req.session.usertype,
                    region_list: result.res || [],
                    error: req.param('error') || '',
                    success: req.param('success') || ''
                });
            }
        );
    },
    create: function (req, res) {
        var timestamp = (Date.parse(new Date()) / 1000);
        var data = {};
        data.act = "create";
        // data.type = 1;
        data.type = req.param('type') || 1;
        if (!req.param('range')) return res.redirect('broadcast/add?error=请选择广播范围');
        data.range = req.param('range');
        if (!req.param('title') || req.param('title') == '') return res.redirect('broadcast/add?error=请填写广播标题');
        data.title = req.param('title');
        data.content = req.param('content') || '';
        data.uri = req.param('uri') || '';
        data.create_user = req.session.username;
        data.create_at = timestamp;
        data.update_at = timestamp;
        data.api = '/TJVideoSVC/zn_broadcast_add';
        console.log(data);
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_add';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                if (result.status == 'fail' && result.error == "record_full") return res.redirect('broadcast/add?error=广播已达上限，请删除无用广播后，重新添加');
                return res.redirect('broadcast/add?success=添加成功');
            }
        );
    },
    edit: function (req, res) {
        var data = {};
        data.act = 'edit';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_record';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                return res.json(result);
            }
        );
    },
    update: function (req, res) {
        var timestamp = (Date.parse(new Date()) / 1000);
        var data = {};
        data.act = 'update';
        data.title = req.param('title');
        data.type = req.param('type');
        data.range = req.param('range');
        data.content = req.param('content');
        data.create_user = req.session.username;
        data.update_at = timestamp;
        data.broadcast_id = req.param('broadcast_id');
        data.api = '/TJVideoSVC/zn_broadcast_record';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_record';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                return res.json(result);
            }
        );
    },
    delete: function (req, res) {
        var data = {};
        data.bid = +req.param('broadcast_id');
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_delete';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                res.json(JSON.parse(body) || {status: 'no'});
            }
        );
    },
    send: function (req, res) {
        var data = {};
        data.act = 'send';
        data.broadcast_id = req.param('broadcast_id');
        data.send_user = req.session.username;
        data.send_time = Date.parse(new Date()) / 1000;
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        async.waterfall([
            function (callback) {
                request("http://video.88mf.com/connectors.php", function (err, httpResponse, body) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, JSON.parse(body) || []);
                    }
                });
            }, function (connectors, callback) {
                if (connectors.length == 0) {
                    callback(null, {status: 'fail', msg: '链接器信息丢失'});
                } else {
                    var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_send';
                    request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
                        if (err) {
                            callback(err);
                        } else if (!body || body.length == 0) {
                            callback(null, {status: 'fail', msg: '广播信息丢失'});
                        } else {
                            callback(null, {status: 'ok', connectors: connectors, linkc: JSON.parse(body || '{}')});
                        }
                    });
                }
            }, function (broadcastInfo, callback) {
                var rData = {};
                if(!broadcastInfo.linkc || !broadcastInfo.linkc.recordInfo || !broadcastInfo.linkc.recordInfo.range){
                   callback(null, {status: 'fail', msg: '广播信息丢失'});
                }else{
                    rData['c_region'] = broadcastInfo.linkc.recordInfo.range;
                    var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/roomList';
                    request.post({url: url, form: JSON.stringify(rData)},
                        function (err, httpResponse, body) {
                            if (err) console.log(err);
                            if (err) {
                                callback(err);
                            } else if (!body || body.length == 0) {
                                callback(null, {status: 'fail', msg: '房间列表丢失'});
                            } else {
                                broadcastInfo.roomList = JSON.parse(body || '[]');
                                callback(null, broadcastInfo)
                            }
                        }
                    );
                }
            }
        ], function (err, result) {
            if (err) console.log(err);
            res.json(result);
        });
    },
    search: function (req, res) {
        var data = {};
        data.act = 'search';
        data.title = req.param('title');
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_broadcast_record';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                for (var i = 0; i < result.res.length; i++) {
                    result.res[i].create_at = moment(result.res[i].create_at * 1000).format('YYYY-MM-DD, hh:mm:ss');
                    result.res[i].update_at = moment(result.res[i].update_at * 1000).format('YYYY-MM-DD, hh:mm:ss');
                }
                return res.json(result);
            }
        );
    },
    /**
     * 全平台广播
     * **/
    getfms: function (req, res) {
        var data = {};
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_find_fm';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                for (var i = 0; i < result.msg.length; i++) {
                    result.msg[i].createAt = moment(+result.msg[i].createAt * 1000).format('YYYY-MM-DD, hh:mm:ss');
                    result.msg[i].updateAt = moment(+result.msg[i].updateAt * 1000).format('YYYY-MM-DD, hh:mm:ss');
                }
                return res.view('broadcast/fmList', {
                    username: req.session.username,
                    usertype: req.session.usertype,
                    fms: result.msg || [],
                    total_pages: result.sum,
                    current_page: result.current_page
                });
            }
        );
    },
    getfmJson: function (req, res) {
        var data = {};
        data.current_page = parseInt(req.param('current_page')) + 1 || 1;
        data.titlename = req.param('titlename') || '';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_find_fm';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                for (var i = 0; i < result.msg.length; i++) {
                    result.msg[i].createAt = moment(+result.msg[i].createAt * 1000).format('YYYY-MM-DD, hh:mm:ss');
                    result.msg[i].updateAt = moment(+result.msg[i].updateAt * 1000).format('YYYY-MM-DD, hh:mm:ss');
                }
                return res.json({
                    fms: result.msg || [],
                    total_pages: result.sum,
                    current_page: result.current_page,
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            }
        );
    },
    addfmview: function (req, res) {
        return res.view('broadcast/fmadd', {
            username: req.session.username,
            usertype: req.session.usertype,
            error: req.param('error') || '',
            success: req.param('success') || ''
        });
    },
    addfm: function (req, res) {
        var data = {};
        if (!req.param('title') || req.param('title') == '') return res.redirect('broadcast/addfmview?error=请填写广播标题');
        data.title = req.param('title');
        data.content = req.param('content') || '';
        data.link = req.param('uri') || '';
        data.create_user = req.session.username;
        data.update_user = req.session.username;
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_add_fm';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                return res.redirect('broadcast/addfmview?success=添加成功');
            }
        );
    },
    updatefm: function (req, res) {
        var data = {};
        if (!req.param('title') || req.param('title') == '') {
            return res.json({
                status: 'fail',
                error: 'SERVER_ERR_TITLE'
            });
        }
        data.title = req.param('title');
        data.content = req.param('content') || '';
        data.link = req.param('link') || '';
        data.update_user = req.session.username;
        data.c_id = +req.param('c_id');
        if (!data.c_id) {
            return res.json({
                status: 'fail',
                error: 'SERVER_ERR'
            });
        }
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_update_fm';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                return res.json(JSON.parse(body));
            }
        );
    },
    sendfm: function (req, res) {
        var data = {};
        var update_user = req.session.username;
        var sender = req.session.c_id;
        var createAt = req.param('createAt') || 0;
        var fmcreatetime = (Date.parse(new Date(createAt)) / 1000);
        data.broadcast_id = req.param('broadcast_id');
        data.sender = sender;
        data.sender_name = update_user;
        data.fmcreatetime = fmcreatetime;
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        async.waterfall([
            function (callback) {
                request("http://video.88mf.com/connectors.php", function (err, httpResponse, body) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, JSON.parse(body) || []);
                    }
                });
            },
            function (connectors, callback) {
                if (connectors.length == 0) {
                    callback(null, {status: 'fail', msg: '链接器信息丢失'});
                } else {
                    var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_send_fm';
                    request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
                        if (err) {
                            callback(err);
                        } else if (!body || body.length == 0) {
                            callback(null, {status: 'fail', msg: '广播信息丢失'});
                        } else {
                            callback(null, {status: 'ok', connectors: connectors, content: JSON.parse(body) || []});
                        }
                    });
                }
            }
        ], function (err, result) {
            if (err) console.log(err);
            res.json(result);
        });
    }
};