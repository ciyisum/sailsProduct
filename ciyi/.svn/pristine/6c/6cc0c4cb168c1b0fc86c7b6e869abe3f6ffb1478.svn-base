/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request = require('request');
var async = require('async');
var moment = require('moment');
var crypto = require('crypto');

module.exports = {
    index: function (req, res) {
        var data = {};
        data.act = "list";
        data.current_page = 0;
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            return res.view('room/roomindex', {
                total_pages: result.total_pages,
                usertype: req.session.usertype,
                username: req.session.username
            });
        });
    },
    indexlist: function (req, res) {
        var data = {};
        data.act = "list";
        data.current_page = req.param('current_page');

        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            for (var i = 0; i < result.msg.length; i++) {
                result.msg[i].c_apply = moment(result.msg[i].c_apply * 1000).format('YYYY-MM-DD, hh:mm:ss');
            }
            return res.json({
                msg: result.msg,
                total_pages: result.total_pages,
                current_page: result.current_page,
                usertype: req.session.usertype,
                username: req.session.username
            });
        });
    },
    add: function (req, res) {
        var data = {};
        data.act = "addinfo";
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body) || {'status': 'fail'};
                return res.view('room/add', {
                    rooms: result.msg,
                    username: req.session.username,
                    usertype: req.session.usertype,
                    room_region: result,
                    error: req.param('error') || '',
                    success: req.param('success') || ''
                });
            }
        );
    },
    roomadd: function (req, res) {
        var timestamp = (Date.parse(new Date()) / 1000);
        var data = {};
        data.act = "add";
        data.c_hash = crypto.createHash('md5').update(req.param('c_hash') + timestamp).digest('hex') || '';
        data.c_chatroom_name = (req.param('c_chatroom_name')).trim() || '';
        data.c_code = req.param('c_code') || '';
        data.c_forward = req.param('c_forward') || '';
        data.c_business = req.param('c_business') || 0;
        data.c_owner = req.param('c_owner') || '';
        data.c_ownername = req.param('c_ownername') || '';
        data.c_region = req.param('c_region') || '';
        data.c_apply = timestamp;
        data.c_adopt = timestamp;
        data.c_status = req.param('c_status') || 1;
        data.c_Branch = req.param('c_Branch') || '';
        data.c_dep = req.param('c_dep') || '';
        data.department_id = req.param('department_id') || '';
        data.c_roompassword = 000000;
        if (data.c_hash == '' || data.c_chatroom_name == '' || data.c_code == '' || data.c_owner == '' || data.c_ownername == '' || data.c_region == '' || data.department_id == '') return res.redirect('/room/add?error=请完整填写信息');
        data.api = '/TJVideoSVC/zn_room';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        async.waterfall([
            function (callback) {
                var verify_url = 'http://reg.mfniu.com/index.php?c=getuser&a=getuserinfo&uid=' + data.department_id;
                request(verify_url, function (err, httpResponse, body) {
                    var userInfo = JSON.parse(body);
                    if (1 == userInfo.stats) {
                        callback(null, body);
                    } else {
                        return res.redirect('/room/add?success=请输入正确的营业部管理员ID!');
                    }
                });

            }], function (verifyInfo, callback) {
            var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
            request.post({url: url, form: JSON.stringify(data)},
                function (err, httpResponse, body) {
                    if (err) console.log(err);
                    var result = JSON.parse(body);
                    if (result.status == 'ok') {
                        return res.redirect('/room/add?success=添加成功');
                    } else if (result.status == 'fail') {
                        return res.redirect('/room/add?error=添加失败');
                    } else if (result.status == 'exist') {
                        return res.redirect('/room/add?error=房间已存在');
                    }
                }
            );
        });
    },
    edit: function (req, res) {
        var data = {};
        data.act = "addinfo";
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body) || {'status': 'fail'};
                return res.json(result);
            }
        );
    },
    update: function (req, res) {
        var in_data = req.allParams();
        var data = {};
        data.act = "update";
        for (key in in_data) {
            if ('string' == typeof in_data[key]) {
                data[key] = (in_data[key]).trim();
            } else {
                data[key] = in_data[key];
            }
        }
        if (data.c_region == '') data.c_region = 0;
        if (data.c_chatroom_name == '' || data.c_code == '' || data.c_business == '') {  //|| data.c_region == ''
            return res.json({
                'status': 'fail',
                'msg': 'err_args'
            });
        }
        async.waterfall([
            function (callback) {
                var verify_url = 'http://reg.mfniu.com/index.php?c=getuser&a=getuserinfo&uid=' + data.department_id;
                request(verify_url, function (err, httpResponse, body) {
                    var userInfo = JSON.parse(body);
                    if (1 == userInfo.stats) {
                        return callback(null, {'status': 'ok'});
                    } else {
                        return res.json({'status': 'fail', 'msg': 'department_id_err'});
                    }
                });
            },
            function (verifyInfo, callback) {
                if ('fail' == verifyInfo.status) {
                    return callback(verifyInfo);
                }
                var url = 'http://svc_s.mfniu.com/mf_userinfo_byname?c_name=' + data.c_ownername.trim();
                console.log(url);
                request(url, function (err, response, body) {
                    if (err) callback(err);
                    callback(null, body);
                });
            },
            function (info, callback) {
                var tmpdata = data;
                if (!info || info.length == 2) return callback(null, {'status': 'fail', 'msg': 'nickname_err'});
                var tmpinfo = JSON.parse(info);
                tmpdata.c_owner = tmpinfo[0].uid;
                tmpdata.api = '/TJVideoSVC/zn_room';
                collector.log(req, req.session.c_id, req.session.username, JSON.stringify(tmpdata));
                var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
                request.post({url: url, form: JSON.stringify(tmpdata)}, function (err, httpResponse, body) {
                    if (!!err) {
                        console.log(err);
                        return res.json({'status': 'fail'});
                    }
                    ;
                    var result = JSON.parse(body || {'status': 'fail'});
                    return res.json(result);
                });
            }
        ], function (err, result) {
            if (err) console.log(err);
            return res.json(result);
        });
    },
    search: function (req, res) {
        var data = {};
        data.act = "search";
        data.search = req.param('search') || '';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (!!err) {
                console.log(err);
                return res.json({
                    'status': 'fail',
                    'msg': 'err_args'
                });
            }
            var result = JSON.parse(body);
            for (var i = 0; i < result.msg.length; i++) {
                result.msg[i].c_apply = moment(result.msg[i].c_apply * 1000).format('YYYY-MM-DD, hh:mm:ss');
            }
            return res.json(result);
        });
    },
    auditlist: function (req, res) {
        var data = {};
        data.act = "auditlist";
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room_audit';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                for (var i = 0; i < result.msg.length; i++) {
                    result.msg[i].dateline = moment(result.msg[i].dateline * 1000).format('YYYY-MM-DD, hh:mm:ss');
                }
                return res.view('room/auditindex', {
                    rooms: result.msg,
                    total_pages: result.sum,
                    current_page: result.current_page,
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            }
        );
    },
    auditpageList: function (req, res) {
        var data = {};
        data.act = "auditlist";
        data.current_page = +req.param('current_page') + 1; //current_page
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room_audit';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                for (var i = 0; i < result.msg.length; i++) {
                    result.msg[i].dateline = moment(result.msg[i].dateline * 1000).format('YYYY-MM-DD, hh:mm:ss');
                }
                return res.json({
                    msg: result.msg,
                    total_pages: result.sum,
                    current_page: result.current_page,
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            }
        );
    },
    audit: function (req, res) {
        async.waterfall([
            function (callback) {
                var url = 'http://svc_s.mfniu.com/mf_userinfo_byname?c_name=' + req.param('nickname');
                request(url, function (err, response, body) {
                    if (err) callback(err);
                    callback(null, body);
                });
            },
            function (info, callback) {
                if (info.length == 2) return callback(null, 'nickname_err', null, null);
                var url = req.protocol + '://' + sails.config.apiserver + '/TJCenterSVC/freeroom';
                var data = {};
                var info = JSON.parse(info);
                data.uid = info[0].uid || '';
                data.nickname = req.param('nickname') || '';
                data.realname = req.param('realname') || '';
                data.card = req.param('card') || '';
                data.email = req.param('email') || '';
                data.telphone = req.param('telphone') || '';
                data.qq = req.param('qq') || '';
                data.room_name = req.param('room_name') || '';
                data.room_hash = req.param('room_hash') || '';
                data.room_desc = req.param('room_desc') || '';
                data.room_person = '';
                data.api = '/TJCenterSVC/freeroom';
                collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
                request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
                    if (err) callback(err);
                    callback(null, info, body, data.uid);
                });
            },
            function (info, freeroom, c_owner, callback) {
                if (info == 'nickname_err') return callback(null, 'nickname_err');
                if (freeroom == 'fail') return callback(null, 'freeroom_err');
                var data = {};
                data.act = "audit";
                data.c_id = req.param('c_id') || '';
                data.c_owner = c_owner;
                data.check_reason = req.param('check_reason');
                data.room_status = req.param('room_status');
                data.api = '/TJVideoSVC/zn_room_audit';
                collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
                var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room_audit';
                request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
                    if (err) callback(err);
                    var result = JSON.parse(body);
                    callback(null, result);
                });
            }], function (err, result) {
            if (err) return res.json('SERVER_ERR');
            return res.json(result);
        });
    },
    auditpaylist: function (req, res) {
        var data = {};
        data.expire = 0;
        data.page = +req.param('current_page') + 1 || 1;
        data.pagesize = 10;
        var reqType = req.param('reqType');
        // data.pagesize=1;
        var url = req.protocol + '://' + sails.config.apiserver + '/TJCenterSVC/roomlist';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                for (var i = 0; i < result.results.length; i++) {
                    result.results[i].room_edate = moment(result.results[i].room_edate * 1000).format('YYYY-MM-DD, hh:mm:ss');
                }
                if ('json' == reqType) {
                    return res.json({
                        rooms: result.results,
                        total_pages: result.rows,
                        current_page: req.param('current_page') || 1,
                        usertype: req.session.usertype,
                        username: req.session.username
                    });
                }
                return res.view('room/payindex', {
                    rooms: result.results,
                    total_pages: result.rows,
                    current_page: req.param('current_page') || 1,
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            }
        );
    },
    auditpay: function (req, res) {
        var url = 'http://service.17mf.com/index.php?d=api&c=roomapi&m=check&room_hash=' +
            req.param('room_hash') +
            '&room_status=' + req.param('room_status') +
            '&check_reason=' + (req.param('check_reason') || '');
        request.post(url, function (err, httpResponse, body) {
            if (err) console.log(err);
            return res.json(body);
        });
    },
    cardid: function (req, res) {
        var url = 'http://gzt.wy-fund.com/ycgzt/roomcertapi.php?id=' + req.param('cardid') + '&name=' + req.param('name');
        request.post(encodeURI(url), function (err, httpResponse, body) {
            if (err) console.log(err);
            return res.json(body);
        });
    },
    owner: function (req, res) {
        var data = {};
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_teacher_room_list';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                return res.view('room/owner', {
                    records: result.result || [],
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            }
        );
    },
    owner_add: function (req, res) {
        return res.view('room/owner_add', {
            error: req.param('error') || '',
            success: req.param('success') || '',
            usertype: req.session.usertype,
            username: req.session.username
        });
    },
    owneradd: function (req, res) {
        async.waterfall([
            function (callback) {
                var url = 'http://svc_s.mfniu.com/mf_userinfo_byname?c_name=' + req.param('nickname');
                request(url, function (err, response, body) {
                    if (err) callback(err);
                    callback(null, body);
                });
            },
            function (info, callback) {
                if (info.length == 2) return callback(null, 'nickname_err');
                var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_teacher_room_add';
                var data = {};
                var info = JSON.parse(info);
                data.uid = info[0].uid || '';
                data.nickname = req.param('nickname') || '';
                data.c_chatroom_name = req.param('c_chatroom_name') || '';
                data.api = '/TJVideoSVC/zn_teacher_room_add';
                collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
                request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
                    if (err) callback(err);
                    var result = JSON.parse(body);
                    callback(null, result);
                });
            }
        ], function (err, result) {
            if (err) console.log(err);
            if (result.status == 'ok') {
                return res.redirect('/room/owner_add?success=添加成功');
            } else if (result.status == 'fail' && result.error == 'room_exist_teacher') {
                return res.redirect('/room/owner_add?error=房间已设定过默认讲师');
            } else if (result.status == 'fail' && result.error == 'room_not_exist') {
                return res.redirect('/room/owner_add?error=房间不存在');
            } else {
                return res.redirect('/room/owner_add?error=服务器异常');
            }
        });
    },
    owner_update: function (req, res) {
        var data = {};
        data.uid = req.param('uid');
        data.nickname = req.param('nickname');
        data.c_chatroom_name = req.param('c_chatroom_name');
        data.api = '/TJVideoSVC/zn_settle';
        data.c_name = req.session.username || '';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_settle';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            return res.json(result);
        });
    },
    owner_search: function (req, res) {
        var data = {};
        data.c_chatroom_name = req.param('search');
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_teacher_room_search';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                return res.json(result);
            }
        );
    },
    owner_delete: function (req, res) {
        var data = {};
        data.Id = req.param('Id');
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_teacher_room_delete';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            return res.json(result);
        });
    },
    seolist: function (req, res) {
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_seo_roomlist';
        request.post({url: url, form: JSON.stringify({})}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            return res.view('seo/seolist', {
                rooms: result || [],
                usertype: req.session.usertype,
                username: req.session.username
            });
        });
    },
    seosearch: function (req, res) {
        var data = {};
        data.search = req.param('search') || '';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_seo_roomsearch';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            return res.json(result);
        });
    },
    seoupdate: function (req, res) {
        var data = {};
        data.seo_title = req.param('seo_title') || "";
        data.seo_key = req.param('seo_key') || "";
        data.seo_desc = req.param('seo_desc') || "";
        data.c_hash = req.param('c_hash') || "";
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_seo_roomupdate';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            return res.json(result);
        });
    },
    roomliftban: function (req, res) {
        return res.view('room/rliftban', {
            error: req.param('error') || '',
            usertype: req.session.usertype,
            username: req.session.username
        });
    },
    roomliftbanfind: function (req, res) {
        var roomname = req.param('roomname');
        var roomip = req.param('roomip');
        var data = {};
//        if (!roomname) return res.redirect('/room/roomliftban?error=请输入房间名称');
        data.roomname = roomname || ""
        data.roomip = roomip || ""
        data.current_page = +req.param('current_page') + 1; //current_page
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_room_lift_ban';
        request.post({url: url, form: JSON.stringify(data)}, function (err, response, body) {
            if (err) {
                return res.json({
                    status: 'fail',
                    error: 'SERVER_ERR'
                });
            }
            var body = JSON.parse(body);
            if (body.msg.length > 0) {
                return res.view('room/roomfind', {
                    status: 'ok',
                    rooms: body.msg || [],
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            } else {
                return res.view('error', {
                    error: '房间没有被禁用信息'
                });
            }

        });
    },
    roomliftbancount: function (req, res) {
        var roomname = req.param('roomname');
        var roomip = req.param('roomip');
        var data = {};
        data.roomname = roomname || ""
        data.roomip = roomip || ""
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_room_lift_ban';
        request.post({url: url, form: JSON.stringify(data)}, function (err, response, body) {
            if (err) {
                return res.json({
                    status: 'fail',
                    error: 'SERVER_ERR'
                });
            }
            var body = JSON.parse(body);
            if (body.msg.length > 0) {
                return res.json({
                    status: 'ok',
                    total_pages: body.sum
                });
            } else {
                return res.json({
                    status: 'fail',
                    total_pages: 0
                });
            }

        });
    },
    setroomindex: function (req, res) {
        var data = {};
        data.act = "list";
        data.current_page = 0;
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            return res.view('room/setroomindex', {
                total_pages: result.total_pages,
                usertype: req.session.usertype,
                username: req.session.username
            });
        });
    },
    setroomindexJson: function (req, res) {
        var data = {};
        data.act = "list";
        data.current_page = req.param('current_page');

        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            for (var i = 0; i < result.msg.length; i++) {
                result.msg[i].c_apply = moment(result.msg[i].c_apply * 1000).format('YYYY-MM-DD, hh:mm:ss');
            }
            return res.json({
                msg: result.msg,
                total_pages: result.total_pages,
                current_page: result.current_page,
                usertype: req.session.usertype,
                username: req.session.username
            });
        });
    },
    setroomupdate: function (req, res) {
        var data = {};
        data.qq = req.param('qq') || "";
        data.c_hash = req.param('c_hash') || "";
        if (data.c_hash == '' || data.c_hash =="null" || data.c_hash =="undefined") {
            return res.json({
                'status': 'fail',
                'msg': 'err_args'
            });
        }
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/basicRoomSet';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var result = JSON.parse(body);
            result.status='ok';
            return res.json(result);
        });
    },
    setroomsearch: function (req, res) {
        var data = {};
        data.act = "search";
        data.search = req.param('search') || '';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (!!err) {
                console.log(err);
                return res.json({
                    'status': 'fail',
                    'msg': 'err_args'
                });
            }
            var result = JSON.parse(body);
            for (var i = 0; i < result.msg.length; i++) {
                result.msg[i].c_apply = moment(result.msg[i].c_apply * 1000).format('YYYY-MM-DD, hh:mm:ss');
            }
            return res.json(result);
        });
    },
    relayRooms: function (req, res) {
        var data = {};
        data.act = "addinfo";
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_room';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body) || {'status': 'fail'};
                return res.view('room/relay_Rooms', {
                    rooms: result.msg,
                    username: req.session.username,
                    usertype: req.session.usertype,
                    room_region: result,
                    error: req.param('error') || '',
                    success: req.param('success') || ''
                });
            }
        );
    },relayUpdate: function (req, res) {
        var data = {};
        data.c_forward = req.param('c_forward') || '';
        var rList=req.param('roomList') || [];
        var rs='("'
        for (var r in rList) {
            if ('' != rList[r].trim()) {
                if(+r<rList.length-1){
                   rs= rs+rList[r].trim()+'","';
                }else{
                   rs= rs+rList[r].trim()+'")';
                }
             }else if(r>=rList.length-1){
                   rs= rs+'")';
             }
        }
        data.rString=rs;
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_set_Relay_rooms';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                return res.json(body);
            }
        );

    }
};