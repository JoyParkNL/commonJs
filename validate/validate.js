function validateMobile(rule, value, callback){
  if(!value){
    callback('请输入手机号码')
  }
  if(new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)){
    callback()
  }else{
    callback("手机号码格式不正确")
  }
}

export {
  validateMobile
}