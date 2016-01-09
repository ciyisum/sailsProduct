/**
 * RegionController
 *
 * @description :: Server-side logic for managing regions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request = require('request');
var async = require('async');
var moment = require('moment');

module.exports = {
	auditlist: function (req, res) {
		var data={};
		data.act="auditlist";
		var url=req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin_region';
		request.post({url: url, form: JSON.stringify(data)},
			function(err, httpResponse, body) {
				if (err) console.log(err);
				var result = JSON.parse(body);
				for (var i=0; i<result.length;i++) {
					result[i].dateline=moment(result[i].dateline*1000).format('YYYY-MM-DD, hh:mm:ss');
				}
				return res.view('region/auditindex', {
					regions: result,
					usertype: req.session.usertype,
					username: req.session.username
				});
			}
		);
	},
	room: function (req, res) {
		var data={};
		data.act="list";
		data.regionid=req.param('regionid') || '';
		var url=req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin_region_room';
		request.post({url: url, form: JSON.stringify(data)},
			function(err, httpResponse, body) {
				if (err) console.log(err);
				var result = JSON.parse(body);
				return res.json(result);
			}
		);
	},
	audit: function (req, res) {
		var data={};
		data.act="audit";
		data.c_id=req.param('c_id') || '';
		data.api='/TJVideoSVC/admin_region';
		collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
		var url=req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin_region';
		request.post({url: url, form: JSON.stringify(data)},
			function(err, httpResponse, body) {
				if (err) console.log(err);
				var result = JSON.parse(body);
				return res.json(result);
			}
		);
	},
	regionlist: function (req, res) {
		var data={};
		data.act="regionlist";
		var url=req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/admin_region';
		request.post({url: url, form: JSON.stringify(data)},
			function(err, httpResponse, body) {
				if (err) console.log(err);
				var result = JSON.parse(body);
				return res.view('region/regionindex', {
					regions: result,
					usertype: req.session.usertype,
					username: req.session.username
				});
			}
		);
	},
	regionadd: function (req, res) {
		return res.view('region/add.ejs', {
			username: req.session.username,
			usertype: req.session.usertype,
			error: req.param('error') || '',
			success: req.param('success') || ''
		});
	},
	add: function (req, res) {
		var data = {};
		data.act = 'add';
		data.c_name = (req.param('c_name')).trim() || '';
		data.c_status = (req.param('c_status')).trim() || '';
		if (data.c_name == '' || data.c_status == '') return res.redirect('/region/regionadd?error=请完整填写信息');
		data.api='/TJVideoSVC/zn_region';
		collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
		var url=req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_region';
		request.post({url: url, form: JSON.stringify(data)},
			function(err, httpResponse, body) {
				if (err) console.log(err);
				var result = JSON.parse(body);
				if (result.status == 'ok') {
					return res.redirect('/region/regionadd?success=添加成功');
				} else if (result.status == 'fail') {
					return res.redirect('/region/regionadd?error=添加失败');
				}
			}
		);
	},
	update: function (req, res) {
		var data = {};
		data.act = 'update'
		data.c_id = req.param('c_id');
		data.c_name = (req.param('regionname')).trim() || '';
		data.c_rank = req.param('regionrank') || '';
		data.status = (req.param('regionstatus1')).trim() || '';
		data.api='/TJVideoSVC/zn_region';
		collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
		var url=req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zn_region';
		request.post({url: url, form: JSON.stringify(data)},
			function(err, httpResponse, body) {
				if (err) console.log(err);
				var result = JSON.parse(body);
				return res.send(result.status);
			}
		);
	},
    regionOpenList: function (req, res) {
        var data={};
        var url=req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_region_openList';
        request.post({url: url, form: JSON.stringify(data)},
            function(err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                return res.view('region/regionOpenIndex', {
                    regions: result,
                    usertype: req.session.usertype,
                    username: req.session.username
                });
            }
        );
    },
    regionOpenYongJin: function (req, res) {
        var data = {};
        data.act = 'update'
        data.c_id = req.param('c_id');
        data.c_name = (req.param('regionname')).trim() || '';
        data.yj_status = (req.param('yj_status')).trim() || '';
        data.api='/TJVideoSVC/zj_region_commission';
        collector.log(req, req.session.c_id, req.session.username, JSON.stringify(data));
        var url=req.protocol + '://' + sails.config.apiserver + '/TJVideoSVC/zj_region_commission';
        request.post({url: url, form: JSON.stringify(data)},
            function(err, httpResponse, body) {
                if (err) console.log(err);
                var result = JSON.parse(body);
                return res.send(result.status);
            }
        );
    }
};

