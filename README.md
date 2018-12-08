# entrance-ui
🎁🎄vue实现的将登陆、注册、短信验证、邮箱验证、忘记密码等等功能合并在一起的通用组件

## 安装
npm install --save entrance-vue fzm

### 使用
```javascript
import Vue from 'vue'
import Entrance from "entrance-vue"
Vue.use(Entrance);
```
### Entrance组件需要传递以下个参数  

| 参数        | 说明    |  类型  |  是否必须  |
| :--------: | :-----   | :----: | :----: |
| api        |   存放所有登录注册相关的http接口方法的对象 详细请查看下面     |   Object    |   必须    |
| platkey    |  项目标记     |   String    |   必须    |
| callback   |   登录和注册成功之后的回调方法 详细请查看下面    |   Function    |   必须    |
| open       |   是否显示登录注册弹框,一般情况下这个属性是一个sync属性，所以请在open后面加上.sync    |   Boolean    |   必须    |
| icon       |   图标地址,不传递则没有图标,传入'default'则为默认图标(目前是找币的图标，以后会修改成33.cn的logo)    |   String    |   非必须    |
| maxsec     |   验证码倒计时最大秒数,不传则为60秒    |   Number    |   非必须    |
| sty        |   风格 可选值'absolute' 'relative' 'auto',不填为fixed风格,并wrap宽高均为100%,设置为'auto'则宽高均为auto    |   String    |   非必须    |
| invite     |   邀请码    |   String    |   非必须    |
| context    |   向登录注册传递的上下文钩子    |   Function    |   非必须    |
| mode       |   PC模式还是手机模式 默认是'win'，如需使用手机版，传入'mb'    |   String    |   非必须    |
| notify     |   提示框回调 在此对象中定义success、warn两个方法，方法接收参数message    |   Object    |   必须    |

### 假如需要在 a.vue 中使用登录注册组件Entrance

```vue
<template lang="html">
  <div>
    这里是登录注册的例子
    <Entrance :api="api" :platkey="'zhaobi'" :callback="cb" :open.sync="open" :icon="'default'"></Entrance>
  </div>
</template>

<script>
import api from './api.js'
export default {
  data(){
    return {
      api,
      cb(type,res){
        console.log(type,res);
      },
      open:true
    }
  }
}
</script>
```

### 附录`./api.js`
```javascript
import {restfuls} from 'entrance';
const api = {
  getRegisterState(params){ //判断是否已注册。注意!get方式的请求params外面需要包裹一个大括号
    return restfuls.get(注册的接口地址,{ params });
  },
  getCodeBySms(params){ //获取短信验证码 post参数不需要加大括号
    return restfuls.post(获取短信验证码的接口地址,params);
  },
  getCodeByEmail(params){ //获取邮箱验证码
    return restfuls.post(获取邮箱验证码的接口地址,params);
  },
  getCodeByVoice(params){ //获取语音验证码
    return restfuls.post(获取语音验证码的接口地址,params);
  },
  register(params){ //快速注册
    return restfuls.post(快速注册的接口地址,params);
  },
  login(params){ //快速登录
    return restfuls.post(快速登录的接口地址,params);
  },
  setPassword(params){ //第一次设置密码
    return restfuls.post(第一次设置密码的接口地址,params);
  },
  resetPassword(params){ //找回密码
    return restfuls.post(找回密码的接口地址,params);
  },
  isCaptcha(params){ //获取图形验证码
    return restfuls.get(获取图形验证码接口地址, {params});
  }
}
```
### 附录`callback`

callback会得到两个参数： 第一个参数是回调类型,目前有两个值提供'login' 、 'register'
第二个参数是调用登录接口后返回的结果
```javascript
export default {
  data(){
    return {
      api,
      cb(type,res){
        switch(type){
          case 'login':console.log(`登录成功,登录接口返回的信息是${res}`);break;
          case 'register':console.log(`注册成功,注册接口返回的信息是${res}`);break;
        }
      }
    }
  }
}
```

## 记住密码
点击记住密码会生成一个包含用户登录信息的cookie,cookie名为userinfo,有效时间为10天，值为一个json字符串
```
{
  "area":{
    "code":"+86",
    "name":"中国"
  },
  "mobile":{
    "type":"sms",
    "number":"15888888888",
    "password":"88888888"
  },
  "email":{
    "number":"88888888@163.com",
    "password":"88888888"
  }
}
```
可以使用JSON.parse可以解析出该用户信息,然后进行操作

自定义样式配置
如果你需要自定义样式，请直接编写自己的css样式覆盖默认样式
.entrance-logreg-wrap{
  //略
}
.entrance-logreg-win{
  //略
}

## 功能完成情况

- [x] ~~手机邮箱切换~~  
- [x] ~~手机验证码注册~~  
- [x] ~~手机验证码登录~~  
- [x] ~~邮箱验证码注册~~  
- [x] ~~邮箱验证码登录~~  
- [x] ~~手机设置密码~~   
- [x] ~~手机密码登录~~  
- [x] ~~手机找回密码~~  
- [x] ~~邮箱设置密码~~  
- [x] ~~邮箱密码登录~~  
- [x] ~~记住密码[不安全]~~
- [x] ~~邮箱找回密码~~  
- [x] ~~icon选择性添加~~  
- [x] ~~登录防刷验证码~~  
- [x] ~~验证码数秒倒计时~~
- [x] ~~密码登录验证码~~  

## 发现BUG  
- [x] 记住密码在切换手机和邮箱的时候,如果实现已经有密码了,不会执行判断是否注册的步骤    
- [x] ~~有时候腾讯云的验证不出现~~  
- [x] 多次发送验证码之后,进行注册，后台以第一次发送的验证码为正确的验证码,而不是以最后一次发送的验证码为验证码  
- [x] ~~腾讯云验证码在加载之后虽然进行capDestory操作，但是在html中仍然保留了创建的script(老版本也存在该问题)~~
