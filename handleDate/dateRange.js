export function getCommonRange(str) {
	var res
	switch(str) {
		case '今日':
			res = getToday()
			break;
		case '昨日':
			res = getYesterday()
			break;
		case '本周':
			res = getWeek()
			break;
		case '本月':
			res = getMonth()
			break;
	}
	return res
}

const parseDate = function(strDate) {
	var myDate
	if (strDate.indexOf("/Date(") > -1)
			myDate = new Date(parseInt(strDate.replace("/Date(", "").replace(")/", ""), 10))
	else
			myDate = new Date(Date.parse(strDate.replace(/-/g, "/").replace("T", " ").split(".")[0]))
			//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
	return myDate
}

const dateFormat = function(v, format) {
	if (!v) return ""
	var d = v
	if (typeof v === 'string') {
		if (v.indexOf("/Date(") > -1)
			d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10))
		else
			d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]))
			//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
	}
	var o = {
		"M+": d.getMonth() + 1,  //month
		"d+": d.getDate(),       //day
		"h+": d.getHours(),      //hour
		"m+": d.getMinutes(),    //minute
		"s+": d.getSeconds(),    //second
		"q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
		"S": d.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format
}

const getToday = function() {
	let res = {
		startTime: '',
		endTime: ''
	}
	let today = new Date()
	res.startTime = dateFormat(today, 'yyyy-MM-dd 00:00:00')
	res.endTime = dateFormat(today, 'yyyy-MM-dd 23:59:59')
	return res
}

const getYesterday = function() {
	let res = {
		startTime: '',
		endTime: ''
	}
	res.startTime = dateFormat(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd 00:00:00')
	res.endTime = dateFormat(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd 23:59:59')
	return res
}

const getWeek = function() {
	let res = {
		startTime: '',
		endTime: ''
	}
	var now = new Date()
	var nowYear = now.getFullYear()//当前年
	var nowDayOfWeek = now.getDay() //今天本周的第几天
	var nowDay = now.getDate() //当前日
	var nowMonth = now.getMonth() //当前月

	var weekStart = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
	var weekendTime = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
	res.startTime = dateFormat(weekStart, 'yyyy-MM-dd 00:00:00')
	res.endTime = dateFormat(weekendTime, 'yyyy-MM-dd 23:59:59')
	return res
}

const getMonth = function() {
	var res = {
		startTime: '',
		endTime: ''
	}
	var currentDate = parseDate(dateFormat(new Date(), "yyyy-MM-01"))
	var endDate = currentDate.DateAdd('m', 1).DateAdd('d', -1)
	res.startTime = dateFormat(currentDate, 'yyyy-MM-dd 00:00:00')
	res.endTime = dateFormat(endDate, 'yyyy-MM-dd 23:59:59')
	return res
}

Date.prototype.DateAdd = function (strInterval, Number) {
	var dtTmp = this
	switch (strInterval) {
		case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));// 秒
		case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));// 分
		case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));// 小时
		case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));// 天
		case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));// 星期
		case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());// 季度
		case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());// 月
		case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());// 年
	}
}