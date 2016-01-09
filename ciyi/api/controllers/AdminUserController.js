/**
 * AdminUserController
 *
 * @description :: Server-side logic for managing Adminusers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request = require('request');
var async = require('async');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
    login: function (req, res) {
        if (req.session.authenticated) {
            return res.redirect('adminuser/userindex');
        }
        return res.view('login', {
            error: req.param('error') || ''
        });
    },
    verify: function (req, res) {
        var password = req.param('password') || '';
        var data = {};
        data.act = "verify";
        data.username = req.param('username') || '';
        data.password = password;
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var userinfo = JSON.parse(body);
                if (userinfo.length) {
                    if (!bcrypt.compareSync(password, userinfo[0].password)) {
                        res.redirect('login?error=密码不正确');
                    } else {
                        req.session.authenticated = true;
                        req.session.username = userinfo[0].username;
                        req.session.usertype = userinfo[0].roleid;
                        req.session.c_id = userinfo[0].c_id;
                        var datal = {};
                        datal.act = 'loginip';
                        datal.username = data.username;
                        datal.loginip = req.ip;
                        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
                        request.post({url: url, form: JSON.stringify(datal)}, function (err, httpResponse, body) {
                            if (err) console.log(err);
                            if (userinfo[0].roleid == 1) {
                                res.redirect('adminuser/userindex');
                            } else if (userinfo[0].roleid == 3) {
                                res.redirect('room/index');
                            } else if (userinfo[0].roleid == 2) {
                                res.redirect('room/auditpaylist');
                            } else if (userinfo[0].roleid == 4) {
                                res.redirect('room/seo');
                            }
                        });
                    }
                } else {
                    return res.redirect('login?error=用户名不正确');
                }
            }
        );
    },
    useradd: function (req, res) {
        res.view('adminuser/add', {
            username: req.session.username,
            usertype: req.session.usertype,
            iusername: '',
            realname: '',
            roleid: '',
            error: req.param('error') || '',
            success: ''
        });
    },
    add: function (req, res) {
        var iusername = req.param('username');
        var password = bcrypt.hashSync(req.param('password'));
        var roleid = req.param('roleid');
        var realname = req.param('realname');
        if (!iusername || !password || !roleid || !realname) return res.redirect('adminuser/useradd?error=请完整填写用户信息');
        var data = {};
        data.act = 'add';
        data.username = iusername;
        data.password = password;
        data.roleid = roleid;
        data.lastloginip = req.ip;
        data.lastlogintime = Date.parse(new Date()) / 1000;
        data.realname = realname;
        data.api = '/TJVideoSVC/admin';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                if (result == 'exist') return res.redirect('adminuser/useradd?error=用户名已存在，请重新输入');
                return res.view('adminuser/add', {
                    username: req.session.username,
                    usertype: req.session.usertype,
                    iusername: iusername,
                    realname: realname,
                    roleid: roleid,
                    error: '',
                    success: '管理员成功创建'
                });
            }
        );
    },
    userindex: function (req, res) {
        var data = {};
        data.act = 'list';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)}, function (err, httpResponse, body) {
            if (err) console.log(err);
            var userlist = JSON.parse(body);
            for (var i = 0; i < userlist.length; i++) {
                delete userlist[i].password;
                userlist[i].lastlogintime = moment(userlist[i].lastlogintime * 1000).format('YYYY-MM-DD, hh:mm:ss');
            }
            return res.view('adminuser/userindex', {
                userlist: userlist,
                usertype: req.session.usertype,
                username: req.session.username
            });
        });
    },
    update: function (req, res) {
        var data = {};
        data.act = 'update';
        data.c_id = req.param('c_id') || '';
        data.username = req.param('username') || '';
        data.realname = req.param('realname') || '';
        data.roleid = req.param('roleid') || '';
        data.api = '/TJVideoSVC/admin';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                if (result == 'ok') return res.send('ok');
                return res.send('fail');
            }
        );
    },
    delete: function (req, res) {
        var data = {};
        data.act = 'delete';
        data.c_id = req.param('c_id') || '';
        data.api = '/TJVideoSVC/admin';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                if (result == 'ok') return res.send('ok');
                return res.send('fail');
            }
        );
    },
    reset: function (req, res) {
        var data = {};
        data.act = "reset";
        data.password = bcrypt.hashSync('000000');
        data.c_id = req.param('c_id') || '';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                if (result == 'ok') return res.send('ok');
                return res.send('fail');
            }
        );
    },
    profile: function (req, res) {
        var data = {};
        data.act = "profile";
        data.c_id = req.session.c_id || '';
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var profile = JSON.parse(body);
                delete profile[0].password;
                delete profile[0].lastlogintime;
                delete profile[0].lastloginip;
                return res.view('adminuser/profile', {
                    profile: profile[0],
                    usertype: req.session.usertype,
                    username: req.session.username
                })
            }
        );
    },
    pupdate: function (req, res) {
        var data = {};
        data.act = "pupdate";
        data.username = req.param('username') || '';
        data.realname = req.param('realname') || '';
        data.c_id = req.param('c_id') || '';
        data.api = '/TJVideoSVC/admin';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                return res.redirect('adminuser/profile');
            }
        );
    },
    passreset: function (req, res) {
        var data = {};
        data.act = "passreset";
        data.c_id = req.param('c_id');
        data.password = bcrypt.hashSync(req.param('password'));
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin';
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                if (result == 'ok') return res.send('ok');
                return res.send('fail');
            }
        );
    },
    logout: function (req, res) {
        req.session.destroy();
        return res.redirect('/login');
    },
    userlock: function (req, res) {
        return res.view('adminuser/lock', {
            error: req.param('error') || '',
            usertype: req.session.usertype,
            username: req.session.username
        });
    },
    userfind: function (req, res) {
        var nickname = req.param('nickname');
        if (!nickname) return res.redirect('/adminuser/userlock?error=请输入用户名');
        async.waterfall([
            function (callback) {
                var url = 'http://svc_s.mfniu.com/mf_userinfo_byname?c_name=' + nickname;
                request(url, function (err, response, body) {
                    if (err) {
                        return callback(null, []);
                    }
                    var body = JSON.parse(body);
                    if (body.length > 0) {
                        return callback(null, body);
                    } else {
                        return callback(null, []);
                    }
                });
            },
            function (lockList, callback) {
                if (lockList.length > 0) {
                    var uid = lockList[0].uid;
                    var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_user_lockfind';
                    var data = {
                        uid: uid
                    };
                    request.post({url: url, form: JSON.stringify(data)},
                        function (err, httpResponse, body) {
                            if (err) return callback(err);
                            lockList[0].operate = 'lock'
                            if (JSON.parse(body).length <= 0) {
                                lockList[0].operate = 'no_lock'
                            }
                            return callback(null, lockList);

                        }
                    );

                } else {
                    return callback(null, []);
                }
            }
        ], function (err, result) {
            if (err) {
                return res.json({
                    status: 'fail',
                    error: 'SERVER_ERR'
                });
            }
            if (result.length > 0) {
                return res.view('adminuser/find', {
                    status: 'ok',
                    userinfo: result[0],
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            } else {
                return res.view('error', {
                    error: '用户没有被禁用'
                });
            }

        });

    },
    lock: function (req, res) {
        var l_uid = req.param('l_uid');
        async.waterfall([
            function (callback) {
                var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_user_lock';
                var data = {
                    l_uid: l_uid,
                };
                data.api = '/TJVideoSVC/zn_user_lock';
                collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
                request.post({url: url, form: JSON.stringify(data)},
                    function (err, httpResponse, body) {
                        if (err) callback(err);
                        callback(null, body);
                    }
                );
            }
        ], function (err, result) {
            if (err) {
                return res.json({
                    status: 'fail',
                    error: 'SERVER_ERR'
                });
            }
            return res.json(result);
        });
    },
    userliftbanfind: function (req, res) {
        var uname = req.param('username');
        var uip = req.param('userip');
        var data = {};
        data.username = uname || "";
        data.userip = uip || "";
        data.current_page = +req.param('current_page') + 1; //current_page
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_user_lift_ban';
        request.post({url: url, form: JSON.stringify(data)}, function (err, response, body) {
            if (!!err) {
                return res.json({
                    status: 'fail',
                    error: 'SERVER_ERR'
                });
            }
            var body = JSON.parse(body);
            if (body.msg.length > 0) {
                return res.view('adminuser/userbanfind', {
                    status: 'ok',
                    findname: uname,
                    total_pages: body.sum,
                    userList: body.msg || [],
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            } else {
                return res.view('error', {
                    error: '用户没有被禁用'
                });
            }

        });
    },
    userliftbanfindcount: function (req, res) {
        var uname = req.param('username');
        var uip = req.param('userip');
        var data = {};
        data.username = uname || "";
        data.userip = uip || "";
        data.current_page = +req.param('current_page') + 1; //current_page
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_user_lift_ban';
        request.post({url: url, form: JSON.stringify(data)}, function (err, response, body) {
            if (!!err) {
                return res.json({
                    status: 'fail',
                    error: 'SERVER_ERR'
                });
            }
            var body = JSON.parse(body);
            if (body.msg.length > 0) {
                return res.json({
                    status:'ok',
                    total_pages: body.sum
                });
            } else {
                return res.json({
                    status:'fail',
                    total_pages: 0
                });
            }

        });
    },
    lockDelete: function (req, res) {
        var uid = req.param('l_uid');
        var url = req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_user_lockdelete';
        var data = {
            uid: uid
        };
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        request.post({url: url, form: JSON.stringify(data)},
            function (err, httpResponse, body) {
                return res.json(JSON.parse(body));
            }
        );
    }

};
