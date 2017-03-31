var data = {
	probeList:{
		"district":"上海中国电信",
		"hbtime":"2017-03-15 15:23:34",
		"hostname":"test-242",
		"ip":"101.231.135.154",
		"version":"v1.0.5"
	},
	// list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
	list: [
		{
			"district":"上海中国电信",
			"hbtime":"2017-03-15 15:23:34",
			"hostname":"test-242",
			"ip":"101.231.135.154",
			"version":"v1.0.5"
		},
		{
			"district":"上海中国电信",
			"hbtime":"2017-03-15 15:23:34",
			"hostname":"test-242",
			"ip":"101.231.135.154",
			"version":"v1.0.5"
		}
	]
};
var html = template('proberListDataTmp', data);
document.getElementById('proberList').innerHTML = html;