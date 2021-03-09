const { baseUrl } = require('./url.js')

export default function formatDate(item){
    if(item){
        let date= new Date(item)
        let year=date.getFullYear()
        let month=date.getMonth()+1
        let day=date.getDate()
        if(month<10){
            month=`0${month}`
        }
        if(day<10){
            day=`0${day}`
        }
        let returnData=`${year}-${month}-${day}`
        return returnData
    }else{
        return 
    } 
}
//"2020-07-30T16:00:00.000Z",取2020-07-30T16:00:00
export function getFormatDateAll(item){
    if(item){
        let date=item.split("T")[0]
        let time=item.split("T")[1].split(".")[0]
        return date + ' ' + time
    }else{
        return
    }
}

//时间取到分为止 2020-07-30 16:00:00 取2020-07-30 16:00
export function timeRemoveS(item){
  if(item){
    let date=item.split(":")
    let timeNew=date[0]+ ':' +date[1]
    return timeNew
  }else{
      return
  }
}

export function timeConvert(value){//num:0 YYYY-MM-DD  num:1  YYYY-MM-DD hh:mm:ss // timestamp:时间戳 
  let date = new Date(value)
  let y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let m = date.getMinutes()
  m = m < 10 ? ('0' + m) : m
  let s = date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
}

//"2019-05-13 16:01:14.736000000",取2019-05-13
export function getFormatDate(item){
  if(item){
    let [data,time]=item.split(" ")
    return data
  }else{
    return
  }
}

//形如"2019-06-04T03:40:36.000+0000"取2019-06-04
export function getFormatDateT(item){
  if(item){
    let [data,time]=item.split("T")
    console.log(data)
    if(time){
      return data+' '+time.split(".")[0]
    }else{
      return data
    }
  } else {
    return
  }
}


// 递归深拷贝
export function clone(object){
  let object2
  if(! (object instanceof Object) ){
      return object
  }else if(object instanceof Array){
      object2 = []
  }else if(object instanceof Function){
      object2 = eval(object.toString())
  }else if(object instanceof Object){
      object2 = {}
  }
  for(let key in object){
      object2[key] = clone(object[key])
  }
  return object2
}

// 获取当前时间 格式为"年"-"月"-"日"
export function getTimeNow() {
  let now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth()//得到月份
  let date = now.getDate()//得到日期
  month = month + 1
  if (month < 10) month = "0" + month
  if (date < 10) date = "0" + date
  let times = year + "-" + month + "-" + date 
  return times
}

// 处理节点数据
export function handleNode(node){
  nodeBaseData(node)
}

// 获取所有节点的key
const nodeBaseData = function(node) {
  node.key = node.id
  node.value = node.id
  node.title = node.name
  node.isLeaf = node.parentId != 0
  //用于判断非叶子节点 
  node.onlyOne = node.parentId == 0 && (!node.childrenList || node.childrenList.length == 0)
  if (node.childrenList && node.childrenList.length > 0) {
    node.children = node.childrenList
    node.childrenList.forEach(child => {
      nodeBaseData(child)
    })
  }
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return
  }

  for ( let key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 下载公共函数
 */
export function downloadByStream(url, fileName, val){
  
  return new Promise((resolve, reject) => {
    let reqUrl = baseUrl + url

    let xhr = new XMLHttpRequest()
    // POST的格式相对比较灵活，参数可以有比较多的形式，例如JSON，表单FORM等
    xhr.open('post', reqUrl, true)
    // 返回类型blob
    xhr.responseType = "blob"
    // 提交的数据为json格式
    xhr.setRequestHeader("Content-Type", "application/json")
    // 定义请求完成的处理函数
    xhr.onload = function () {
      // 请求完成
      if(this.status === 200){
        // 返回200
              let blob = this.response
        let reader = new FileReader()
        // 转换为base64，可以直接放入a表情href
        reader.readAsDataURL(blob)
        reader.onload = function(e){
          // 转换完成，创建一个a标签用于下载
          var a = document.createElement('a')
          a.download = fileName
          a.href = e.target.result
          // 修复firefox中无法触发click
          document.getElementsByTagName("body")[0].appendChild(a)
          a.click()
          a.remove()
        }
      }
    }

    xhr.setRequestHeader("Authorization", localStorage.token)
    var finalParam = JSON.stringify(val)
    xhr.send(finalParam)
    resolve()
  })
}

export function makeDownload(res, fileName){
  let content = res
  let blob = new Blob([content])
  if('download' in document.createElement('a')){
    // 非IE下载
    let elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    // 释放URL 对象
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}


export function downloadFile(data, fileName) {
  let blob = new Blob([data])
  // 获取heads中的filename文件名
  let downloadElement = document.createElement('a')
  // 创建下载的链接
  let href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  // 下载后文件名
  downloadElement.download = fileName
  document.body.appendChild(downloadElement)
  // 点击下载
  downloadElement.click()
  // 下载完成移除元素
  document.body.removeChild(downloadElement)
  // 释放掉blob对象
  window.URL.revokeObjectURL(href)
}

// 判断JSON字符串
export function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj=JSON.parse(str);
      if(typeof obj == 'object' && obj ){
          return true;
      } else {
          return false;
      }

    } catch(e) {
      console.log('错误'+str+'!!!'+e);
      return false;
    }
  }
  console.log('It is not a string!')
}

export function throttle(fn, interval) {
  let last = 0
  return function () {
    let context = this
    let args = arguments

    let now = +new Date()
    if (now - last > interval) {
      last = now
      fn.apply(context, args)
    }
  }
}