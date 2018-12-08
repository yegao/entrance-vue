<template>
  <div v-if="visibility" @click="close" :class="style" class="entrance-logreg-wrap">
    <div :class="[mode==='win'?'entrance-logreg-win':'entrance-logreg-mb']" @click="winclick" @click.stop>
      <div v-if="icon" class="logo"><img :src="logo"/></div>
      <!--默认-->
      <div class="default" v-if="visible.step<4">
        <div class="tabs">
          <span class="tab" @click="step(0,'mobile',null,'sms')" :class="{'active':type==='mobile'}">手机</span>
          <span class="tab" @click="step(0,'email')" :class="{'active':type==='email'}">邮箱</span>
          <i class="line" :style="'left:'+config[type].line.left+'px;'"></i>
        </div>
        <div class="tabc">
          <div class="step1">
            <div v-if="type=='mobile'" class="mobile edit-box item">
            <span @click="visible.world = !visible.world" @click.stop>
                <em class="code">+{{params.area.code}}</em>
                <i class="icon-2 entrance-icons entrance-icon-xiala" :class="{'icon-act':visible.world}"></i>
            </span>
              <ul v-if="visible.world" class="world">
                <li class="country" v-for="(item,index) in world" :key="index" @click="chooseArea(item)" @click.stop>
                  <span><em>{{item.code}}</em> {{item.ch_name}}</span>
                </li>
              </ul>
              <input v-if="params.area.code==='86'" @blur="blur" @focus="focus" v-model="chinaMobile" ref="chinaMobile1"
                     type="text" placeholder="请输入手机号" autocomplete="off" maxlength="13"/>
              <input v-else @blur="blur" @focus="focus" v-model="params.mobile.number" @input="input" ref="step1mobile"
                     type="text" placeholder="请输入手机号" autocomplete="off" maxlength="11"/>
              <i class="icon-2 mb-none entrance-icons entrance-icon-xiala"
                 style="position:absolute;width:40px;height:40px;right:0;cursor:pointer;"></i>
            </div>
            <div v-if="type=='email'" class="email edit-box item">
              <input @blur="blur" @focus="focus" v-model="params.email.number" @input="input" ref="step1email"
                     type="text" autocomplete="off" placeholder="请输入邮箱"/>
              <i class="icon-2 mb-none entrance-icons entrance-icon-xiala"
                 style="position:absolute;width:40px;height:40px;right:0;cursor:pointer;"></i>
            </div>
          </div>
          <!--验证码登录注册-->
          <div v-if="visible.step==2" class="step2">
            <!--手机-->
            <div v-if="type=='mobile'" class="mobile">
              <!--短信-->
              <div v-if="params.mobile.type=='sms' && visible.login=='verification'" class="sms">
                <div class="edit-box item">
                  <input type="text" @blur="blur" @focus="focus" v-model="params.verification.number" autocomplete="off"
                         placeholder="请输入验证码"/>
                  <span class="btn-verification" v-if="params.verification.enable"
                        @click="getVerification('sms','quick')">获取验证码</span>
                  <span class="countdown" v-else>还剩<span>{{params.verification.seconds}}</span>s</span>
                </div>
                <div class="note" v-if="!params.verification.enable">收不到短信试一试<span
                        @click="step(2,'mobile','verification','voice',function(){this.getVerification('voice','quick')})">语音认证</span>
                </div>
              </div>
              <!--语音-->
              <div v-if="params.mobile.type=='voice'" class="voice">
                <div class="edit-box item">
                  <input type="text" @blur="blur" @focus="focus" v-model="params.verification.number" autocomplete="off"
                         placeholder="请输入验证码"/>
                </div>
                <div class="note" v-if="params.verification.enable" @click="getVerification('voice','quick')">获取语音验证码
                </div>
                <div class="note" v-else>请注意接听语音认证 还剩<span>{{params.verification.seconds}}</span>s</div>
              </div>
            </div>
            <!--邮箱-->
            <div v-if="type=='email'" class="email">
              <div class="edit-box item">
                <input type="text" @blur="blur" @focus="focus" v-model="params.verification.number" autocomplete="off"
                       placeholder="请输入验证码"/>
                <span class="btn-verification center" v-if="params.verification.enable"
                      @click="getVerification('email','quick')">获取验证码</span>
                <span class="countdown" v-else>还剩<span>{{params.verification.seconds}}</span>s</span>
              </div>
            </div>
          </div>
          <!--密码登录-->
          <div v-if="visible.step==3" class="step3">
            <div v-if="visible.login=='password' && visible.pass" class="edit-box item">
              <input v-model="params[type].password" @blur="blur" @focus="focus" ref="step3input" type="password"
                     autocomplete="new-password" placeholder="请输入密码" class="full center" v-show="inputShow"/>
              <input type="text" v-model="params[type].password" @blur="blur" @focus="focus" @keyup.enter="submit"
                     autocomplete="new-password" placeholder="请输入密码" class="full center" v-show="!inputShow"/>
              <i class="entrance-icons entrance-icon-yanjing" @click="inputShow=!inputShow" :class="{'active':!inputShow}"></i>
            </div>
            <span @click="remember" class="remember-item" :class="{active : userinfoIsRemember}">
            <span class="check">
              <i class="entrance-icons" :class="{'entrance-icon-wancheng':userinfoIsRemember}"></i>
            </span>
            记住密码
          </span>
            <span @click="step(5)" class="forget-item">忘记密码</span>
          </div>
          <!--登录注册按钮在step1、step2的时候都有,但是其实step1的时候没有用处-->
          <div class="submit" @click="submit"><span>注册/登录</span></div>
          <!--密码登录、验证码登录放在这里是因为要放在注册/登录后面-->
          <div v-if="visible.step==2 || visible.step==3" class="step-box">
            <span @click="step(3,null,'password')" class="step" v-if="visible.login=='verification' && visible.pass">密码登录</span>
            <span @click="step(2,null,'verification')" class="step" v-if="visible.login=='password'">验证码登录</span>
          </div>
        </div>
        <!--这里放在这里是因为这个上面有一条线-->
        <div v-if="visible.step==2 && !visible.pass && isRegistered" class="nopassword">
          <span>您还没有设置登录密码，无法使用密码登录!</span>
          <span class="step" @click="step(4,null,'password')">设置登录密码</span>
        </div>
      </div>

      <!--设置密码-->
      <div v-if="visible.step==4" class="step4">
        <div class="tabs">
          <div class="tab">
            <span>设置密码</span>
            <i class="line" style="left:134px;"></i>
          </div>
        </div>
        <div class="tabc">
          <div class="item center">
            <span>验证码已发送至{{type=='mobile' && "+"+params.area.code || ""}} {{params[type].number}}</span></div>
          <div class="edit-box item">
            <input v-model="params.verification.number" class="most" type="text" @blur="blur" @focus="focus"
                   autocomplete="off" placeholder="请输入验证码"/>
            <span v-if="params.verification.enable" class="btn-verification"
                  @click="getVerification(null,'set_password')">获取验证码</span>
            <span v-else class="countdown">还剩<span>{{params.verification.seconds}}</span>s</span>
          </div>
          <div class="edit-box item">
            <input v-model="params[type].password" class="full" type="password" @blur="blur" @focus="focus"
                   autocomplete="new-password" placeholder="请设置新密码（6-16个字符）">
          </div>
          <div class="control">
            <span class="back" @click="step(2,null,'verification')">返回</span>
            <span class="ok" @click="setPassword()">确定</span>
          </div>
        </div>
      </div>

      <!--找回密码-->
      <div v-if="visible.step==5" class="step5">
        <div class="tabs">
          <span class="tab" @click="step(5,'mobile')">手机找回密码</span>
          <span class="tab" @click="step(5,'email')">邮箱找回密码</span>
          <i class="line" :style="'left:'+config[type].line.left+'px;'"></i>
        </div>
        <div class="tabc">
          <div v-if="type=='mobile'" class="edit-box mobile">
          <span @click="visible.world = !visible.world" @click.stop>
              <em class="code">+{{params.area.code}}</em>
              <i class="icon-2 entrance-icons entrance-icon-xiala"></i>
          </span>
            <ul v-if="visible.world" class="world">
              <li class="country" v-for="(item,index) in world" :key="index" @click="chooseArea(item)" @click.stop>
                <span><em>+{{item.code}}</em> {{item.ch_name}}</span>
              </li>
            </ul>
            <input v-if="params.area.code==='86'" @blur="blur" @focus="focus" v-model="chinaMobile" ref="chinaMobile2"
                   type="text" placeholder="请输入手机号" autocomplete="off" maxlength="13"/>
            <input v-else @blur="blur" @focus="focus" v-model="params.mobile.number" @input="input" type="text"
                   placeholder="请输入手机号" autocomplete="off" maxlength="11"/>
            <i class="icon-2 mb-none entrance-icons entrance-icon-xiala"
               style="position:absolute;width:40px;height:40px;right:0;cursor:pointer;"></i>
          </div>
          <div v-if="type=='email'" class="edit-box email">
            <input @blur="blur" @focus="focus" v-model="params.email.number" type="text" autocomplete="off"
                   placeholder="请输入邮箱"/>
            <i class="icon-2 mb-none entrance-icons entrance-icon-xiala"
               style="position:absolute;width:40px;height:40px;right:0;cursor:pointer;"></i>
          </div>
          <div class="edit-box item">
            <input v-model="params.verification.number" @blur="blur" @focus="focus" class="center" type="text"
                   autocomplete="off" placeholder="请输入验证码"/>
            <span class="btn-verification" v-if="params.verification.enable" @click="getVerification(null,'reset')">获取验证码</span>
            <span class="countdown" v-else>还剩<span>{{params.verification.seconds}}</span>s</span>
          </div>
          <!--新密码-->
          <div class="edit-box item">
            <input v-model="params[type].password" @blur="blur" @focus="focus" class="full center" type="password"
                   autocomplete="new-password" placeholder="请设置新密码（6-16个字符）"/>
          </div>
          <div class="control">
            <span class="back" @click="step(2,null,'verification')">返回</span>
            <span class="ok" @click="resetPassword">确定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import world from './json/world.json'
  import config from './json/logreg.json'
  import cookie from './utils/cookie.js'

  let position = 0;
  let positioning = false;//临近空格操作时候的光标
  let logo = require('./assets/i/logo.jpeg');
  let debounce, countdown;
  const check = (number, type, ac) => {
    if (!number) {
      return false;
    }
    switch (type) {
      case 'mobile':
        if (ac === '86') {
          return /^1[345789]\d{9}$/.test(number)
        }
        if (ac === '1') {
          return /^[2-9]\d{2}[2-9](?!11)\d{6}$/.test(number)
        }
        return false;
      case 'email':
        return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(number);
      case 'verification':
        return /^\d{4,6}$/.test(number);
      case 'password':
        return /^[\w|\W]{6,}$/.test(number);
    }
  }
  let userinfoIsRemember = !!cookie.get('userinfo');
  let userinfo = cookie.get('userinfo') && JSON.parse(cookie.get('userinfo')) || {
    area: {
      code: '86',
      name: '中国'
    },
    mobile: {
      type: 'sms',
      number: "",
      password: ""
    },
    email: {
      number: "",
      password: ""
    }
  };

  function createScript(res, vm, params) {
    if (res.isShow == 1) {
      Object.assign(params, {
        businessId: res.businessId
      });
      var script = document.createElement('script');
      script.src = res.data.jsUrl;
      document.getElementsByTagName('body')[0].appendChild(script);
      setTimeout(function () {
        var TCaptcha = document.getElementById('TCaptcha');
        var capOption = {
          callback(res) {
            if (res.ret == 0) {
              Object.assign(params, {
                ticket: res.ticket
              });
              let type = vm.type === 'mobile' ? vm.params.mobile.type : 'email';
              switch (type) {
                case 'sms':
                  vm.api.getCodeBySms(params).then(res => {
                    vm.params.verification.enable = false;
                  });
                  break;
                case 'voice':
                  vm.api.getCodeByVoice(params).then(res => {
                    vm.params.verification.enable = false;
                  });
                  break;
                case 'email':
                  vm.api.getCodeByEmail(params).then(res => {
                    vm.params.verification.enable = false;
                  });
                  break;
              }
            }
            capDestroy();
            script.remove();
          },
          type: 'popup',
          pos: 'fixed'
        };
        capInit(TCaptcha, capOption);
      }, 2000);
    }
    else {
      vm.params.verification.enable = false;
    }
  }

  function createScriptForLoginByPassword(res, vm, params) {
    if (res.isCaptcha == 1) {
      Object.assign(params, {
        businessId: res.businessId
      });
      var script = document.createElement('script');
      script.src = res.jsUrl;
      document.getElementsByTagName('body')[0].appendChild(script);
      setTimeout(function () {
        var TCaptcha = document.getElementById('TCaptcha');
        var capOption = {
          callback(res) {
            if (res.ret == 0) {
              Object.assign(params, {
                ticket: res.ticket
              });
              vm.api.login(params).then(res => {
                vm.notify.success('登录成功!');
                //如果选择了记住密码，则存储userinfo
                if(vm.userinfoIsRemember){
                  let {area, mobile, email} = vm.params;
                  cookie.set('userinfo', JSON.stringify({area, mobile, email}), 864000);
                }
                //登录成功清空表单信息
                vm.resetInfo();
                vm.visible.context = false;
                vm.step(0, 'mobile', null, 'sms', false);
                vm.callback && vm.callback('login', res);
              });
            }
            capDestroy();
            script.remove();
          },
          type: 'popup',
          pos: 'fixed'
        };
        capInit(TCaptcha, capOption);
      }, 1500);
    }
    else {
      vm.api.login(params).then(res => {
        // notify:success('登录成功!');
        // 如果选择了记住密码，则存储userinfo
        if(vm.userinfoIsRemember){
          let {area, mobile, email} = vm.params;
          cookie.set('userinfo', JSON.stringify({area, mobile, email}), 864000);
        }
        //登录成功清空表单信息
        vm.resetInfo();
        vm.visible.context = false;
        vm.step(0, 'mobile', null, 'sms', false);
        vm.callback && vm.callback('login', res);
      });
    }
  }

  //获取光标位置
  function getCursorPosition(e) {
    let position = 0;
    if (document.selection) {
      let selectRange = document.selection.createRange();
      selectRang.moveStart('character', -e.value.length);
      return selectRange.text.length;
    }
    else if (e && (e.selectionStart || e.selectionStart == '0')) {
      return e.selectionStart;
    }
  }

  function setCursorPosition(e, pos) {
    positioning = true;
    this.$nextTick(function () {
      if (e && e.setSelectionRange) {
        e.focus();
        e.setSelectionRange(pos, pos);
      }
      else if (e && e.createTextRange) {
        let range = e.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
      positioning = false;
    });
  }

  export default {
    name: 'entranceLogReg',
    props: {
      api: Object,
      platkey: String,
      callback: Function,
      open: Boolean,
      icon: String,
      maxsec: Number,
      sty: String,
      invite: String,
      context: Function,
      mode: {
        type: String,
        default: 'win'
      },
      notify: {
        type: Object,
        default: {
          success(){},
          warn(){},
          error(){}
        }
      }
    },
    data() {
      // let logo = png.logo.src;
      return {
        config,
        world,
        logo: this.icon == 'default' && logo || this.icon,
        type: 'mobile',
        inputShow: true,
        isRegistered: false,
        style: this.sty || "",
        chinaMobile: '',
        maxSeconds: this.maxsec || 60,
        userinfoIsRemember,
        params: {
          ...userinfo,
          verification: {
            number: "",
            enable: false,
            seconds: this.maxsec || 60
          }
        },
        visible: {
          world: false,
          step: 1,
          login: 'verification',
          pass: false
        },
        history: {
          sms: [],
          email: [],
          voice: []
        }
      }
    },
    computed: {
      visibility() {
        return this.open;
      }
    },
    watch: {
      "params.verification.enable"(now, old) {
        if ((!now) && this.params.verification.seconds) {
          this.countdown();
        }
      },
      chinaMobile(n, o) {
        if (n.length == 0) {
          this.params.mobile.number = '';
          return;
        }
        if (!/^[\s\d]{0,13}$/.test(n)) {
          this.notify.warn('请填写正确的中国手机号码!');
          return;
        }
        if (positioning) {
          return;
        }
        let input = this.visible.step == 5 && this.$refs.chinaMobile2 || this.$refs.chinaMobile1;
        let temp = n.replace(/\s/g, '');
        if (temp == o.replace(/\s/g, '')) {
          if (n.length < o.length) {
            position = getCursorPosition(input);
            if (~"3,8".indexOf("" + position)) {
              temp = (n.slice(0, position - 1) + n.slice(position)).replace(/\s/g, '');
              this.chinaMobile = temp.length < 4 && temp || temp.length < 8 && temp.slice(0, 3) + " " + temp.slice(3) || temp.slice(0, 3) + " " + temp.slice(3, 7) + " " + temp.slice(7);
              --position;
            }
          }
          n.length > o.length && (~"4,9".indexOf("" + position)) && (++position)
          this.params.mobile.number = temp;
          this.input();
          setCursorPosition.call(this, input, position);
          return;
        }
        position = getCursorPosition(input);
        this.params.mobile.number = temp;
        this.input();
        if (n === (temp.length < 4 && temp || temp.length < 8 && temp.slice(0, 3) + " " + temp.slice(3) || temp.slice(0, 3) + " " + temp.slice(3, 7) + " " + temp.slice(7))) {
          //光标在最后面一段,在删除最后一个空格的时候也可以满足该条件表达式,但是并不会走到这里,因为前面已经return了
          setCursorPosition.call(this, input, position);
        } else {//光标不在最后面一段
          this.chinaMobile = temp.length < 4 && temp || temp.length < 8 && temp.slice(0, 3) + " " + temp.slice(3) || temp.slice(0, 3) + " " + temp.slice(3, 7) + " " + temp.slice(7);
        }
        ;
      }
    },
    methods: {
      close() {
        this.$emit('update:open', false);
        this.visible.world = false;
      },
      winclick() {
        this.visible.world = false;
      },
      focus(e) {
        e.target.parentNode.className += " focus"
      },
      blur(e) {
        e.target.parentNode.className = e.target.parentNode.className.replace(" focus", "");
      },
      cover(ref) {
        this.$refs[ref].parentNode.className += " focus"
        this.$refs[ref].focus();
      },
      //setp1
      chooseArea(item) {
        this.params.area = item;
        this.visible.world = false;
        this.input();
      },
      input() {
        let vm = this;
        if (debounce) {
          clearTimeout(debounce);
        }
        let cb = function () {
          let type = vm.type;
          let number = vm.params[type].number;
          let ac = vm.params.area.code;
          if (check(number, type, ac)) {
            let param;
            switch (type) {
              //无论是短信还是语音,在判断该手机号是否注册的时候传过去的type都是sms
              case 'mobile':
                param = {
                  type: 'sms',
                  area: ac,
                  mobile: number
                };
                break;
              case 'email':
                param = {
                  type: 'email',
                  email: number
                };
                break;
              default:
                throw new Error('未知的type');
            }
            // console.log("pass");
            vm.isRegistered = vm.visible.pass = false;
            vm.api.getRegisterState(param).then(res => {
              vm.isRegistered = !!res.uid; //该账号有没有被注册过
              vm.visible.pass = !!-res.ispwd; //该账号有没有设置过密码
              if (vm.visible.pass) {
                vm.step(3, type, 'password');
              }
              else {
                vm.step(2, type);
              }
              //params.verification.enable是计算属性,变为false的时候就会自动倒计时
              if (!vm.isRegistered) {  //没有注册直接发送验证码
                vm.getVerification(param.type, 'quick');
                //在createScript中会将vm.params.verification.enable = false;
              }
              else {
                vm.params.verification.enable = true;
              }
            });
          }
          else {
            vm.step(1);
          }
        };
        debounce = setTimeout(cb, 300);
      },
      countdown() {
        if (countdown) {
          clearTimeout(countdown);
        }
        let vm = this;
        if (vm.params.verification.seconds) {
          vm.params.verification.seconds--;
          countdown = setTimeout(vm.countdown, 1000);
          //本来这里可以直接传递一个max参数,但是iE9或者更早版本的浏览器不支持,所以这里吧max作为全局变量
        } else {
          vm.params.verification.enable = true;
          vm.params.verification.seconds = this.maxSeconds;
        }
      },
      getVerification(type, codetype) {
        let vm = this;
        let params = {platkey: this.platkey, businessId: "", ticket: ""};
        //quick:快速登录注册   set_password:设置密码   reset:忘记密码
        if (codetype === 'quick' || codetype === 'set_password') {
          Object.assign(params, {codetype, param: 'entranceRandom4'});
        }
        if (codetype === 'reset') {
          Object.assign(params, {codetype: 'reset_password', param: 'entranceDateTime|entranceRandom4'});
        }
        switch (vm.type) {
          case 'mobile':
            Object.assign(params, {area: vm.params.area.code, mobile: vm.params.mobile.number});
            break;
          case 'email':
            Object.assign(params, {email: vm.params.email.number});
            break;
        }
        type || (type = vm.type === 'mobile' ? 'sms' : 'email');
        switch (type) {
          case 'sms':
            vm.api.getCodeBySms(params).then(res => {
              createScript(res.data, vm, params)
            });
            break;
          case 'voice':
            vm.api.getCodeByVoice(params).then(res => {
              createScript(res.data, vm, params)
            });
            break;
          case 'email':
            vm.api.getCodeByEmail(params).then(res => {
              createScript(res.data, vm, params)
            });
            break;
        }
      },
      //变化到指定的步骤
      step(number, type, login, mobiletype, callback) {
        let vm = this;
        if (number === 0) {
          // vm.params[vm.type].number = "";
          number = 1;
        }
        if (number === 5) {
          vm.params[vm.type].password = "";
        }
        debounce && clearTimeout(debounce);
        countdown && clearTimeout(countdown);
        vm.params.verification.enable = true;
        vm.params.verification.seconds = vm.maxSeconds;
        vm.params.verification.number = "";
        number && (vm.visible.step = number);
        type && (vm.type != type) && (vm.type = type) && (vm.params[type].number = vm.params[type].number || vm.userinfoIsRemember && userinfo[type].number || '');
        login && (vm.visible.login = login) || (vm.visible.login = 'verification');
        mobiletype && (vm.params.mobile.type = mobiletype);
        (typeof callback === 'function') && callback.call(vm);
        if (number === 1) {
          vm.$nextTick(function () {
            vm.input();
          })
        }
        if (number === 3) {
          vm.$nextTick(function () {
            vm.$refs.step3input && vm.$refs.step3input.focus();
          })
        }
        if (number===4) {
          this.getVerification(null,'set_password')
        }
      },
      setPassword() {
        let vm = this;
        //检查验证码
        if (!check(vm.params.verification.number, 'verification')) {
          this.notify.warn('请填写正确的验证码!');
          return false;
        }
        //检查密码
        if (!check(vm.params[vm.type].password, 'password')) {
          this.notify.warn('密码字符个数至少为6位!');
          return false;
        }
        let params = {
          password: vm.params[vm.type].password,
          code: vm.params.verification.number
        };
        if (vm.type === 'mobile') {
          Object.assign(params, {
            type: 'sms',
            area: vm.params.area.code,
            mobile: vm.params.mobile.number,
          });
        }
        if (vm.type === 'email') {
          Object.assign(params, {
            type: 'email',
            email: vm.params.email.number
          });
        }
        vm.api.setPassword(params).then(res => {
          this.notify.success('设置密码成功!');
          vm.params[vm.type].password = "";
          vm.visible.pass = true;
          vm.step(3, null, 'password');
        });
      },
      submit() {
        let vm = this;
        if(!(vm.visibility && (vm.visible.step==2 || vm.visible.step == 3))){
          return;
        }
        let params = {
          ticket: "",
          businessId: "",
          redirect_uri: "suibiantian"
        };
        // 检查手机号和邮箱
        if (!check(vm.params[vm.type].number, vm.type, vm.params.area.code)) {
          if (vm.type === 'mobile') {
            this.notify.warn('请填写正确的手机号码!');
          }
          else if (vm.type === 'email') {
            this.notify.warn('请填写正确的邮箱!');
          }
          return false;
        }
        if (vm.type === 'mobile') {
          Object.assign(params, {
            type: 'sms',
            mobile: vm.params.mobile.number,
            area: vm.params.area.code
          });
        } else if (vm.type === 'email') {
          Object.assign(params, {
            type: 'email',
            email: vm.params.email.number
          });
        }
        if (vm.visible.step == 2) {
          //检查验证码
          if (!check(vm.params.verification.number, 'verification')) {
            this.notify.warn('请填写正确的验证码!');
            return false;
          }
          Object.assign(params, {
            code: vm.params.verification.number,
            logintype: 'code'
          });
          if (vm.isRegistered) {
            vm.api.login(params).then(res => {
              this.notify.success('登录成功!');
              //如果选择了记住密码，则存储userinfo
              if(vm.userinfoIsRemember){
                let {area, mobile, email} = vm.params;
                cookie.set('userinfo', JSON.stringify({area, mobile, email}), 864000);
              }
              //登录成功清空表单信息
              vm.resetInfo();
              vm.visible.context = false;
              vm.step(0, 'mobile', null, null, false);
              vm.callback && vm.callback('login', res);
            });
          } else {
            params = this.invite && {...params, invite_code: this.invite} || params
            vm.api.register(params).then(res => {
              this.notify.success('注册成功!');
              vm.isRegistered = true;
              vm.visible.context = false;
              // vm.callback && vm.callback('register', res);
              vm.api.login(params).then(res => {
                this.notify.success('登录成功!');
                //如果选择了记住密码，则存储userinfo
                if(vm.userinfoIsRemember){
                  let {area, mobile, email} = vm.params;
                  cookie.set('userinfo', JSON.stringify({area, mobile, email}), 864000);
                }
                //登录成功清空表单信息
                vm.resetInfo();
                vm.visible.context = false;
                vm.step(0, 'mobile', null, null, false);
                vm.callback && vm.callback('login', res);
              })
              // notify:error(err.message);
            })
            // notify:error(err.message);
          }
        } else {
          //检查密码
          if (!check(vm.params[vm.type].password, 'password')) {
            this.notify.warn('密码字符个数至少为6位!');
            return false;
          }
          Object.assign(params, {
            logintype: 'password',
            password: vm.params[vm.type].password
          });
          vm.api.isCaptcha({
            type: "login"
          }).then(res => {
            createScriptForLoginByPassword(res, vm, params);
          });
        }
      },
      //记住密码
      remember() {
        const flag = this.userinfoIsRemember;
        if (flag) {
          cookie.remove('userinfo');
          this.userinfoIsRemember = false;
        } else {
          //修改记住密码flag为true，但真正记住密码只在登录成功后才记录
          this.userinfoIsRemember = true;
        }
      },
      resetPassword() {
        let vm = this;
        //检查密码
        if (!check(vm.params[vm.type].password, 'password')) {
          this.notify.warn('密码字符个数至少为6位!');
          return false;
        }
        let params = {
          password: vm.params[vm.type].password,
          code: vm.params.verification.number
        };
        if (vm.type === 'mobile') {
          Object.assign(params, {
            type: 'sms',
            area: vm.params.area.code,
            mobile: vm.params.mobile.number,
          });
        }
        if (vm.type === 'email') {
          Object.assign(params, {
            type: 'email',
            email: vm.params.email.number
          });
        }
        this.api.resetPassword(params).then(res => {
          this.notify.success('密码重新设置成功!');
          vm.step(3, null, 'password');
        });
        // notify:error(err.message)
      },
      resetInfo(){
        let userinfo1 = cookie.get('userinfo') && JSON.parse(cookie.get('userinfo')) || {
          area: {
            code: '86',
            name: '中国'
          },
          mobile: {
            type: 'sms',
            number: "",
            password: ""
          },
          email: {
            number: "",
            password: ""
          }
        };
        this.params={
          ...userinfo1,
          verification: {
            number: "",
            enable: false,
            seconds: this.maxsec || 60
          }
        };
        this.chinaMobile = this.params.mobile.number;
      }
    },
    created() {
      //将当前组件的上下文绑定到外面去(推荐绑定到vuex里面的store.state.lr.context中)
      this.context && this.context(this);
      this.chinaMobile = sessionStorage.getItem('setParam')&&JSON.parse(sessionStorage.getItem('setParam')).mobile || '';
    }
  };
</script>
<!--in>./src/entrance-ui/packages/logreg/src/logreg.scss</in-->
<style lang="scss">
  // .blink:after {
  //   content: "";
  //   display:inline-block;
  //   float:left;
  //   width: 1px;
  //   height: 20px;
  //   margin-top:10px;
  //   vertical-align: top;
  //   background-color: #FF0000;
  //   display: inline-block;
  //   animation: blink .5s infinite alternate;
  // }
  //
  // @keyframes blink {
  //     to { background-color: transparent }
  // }

  .entrance-logreg-wrap {
    color: #333333;
    user-select: none;
    position: fixed;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    div,
    em,
    input,
    li,
    span,
    ul {
      padding: 0;
      margin: 0;
      vertical-align: top;
      box-sizing: border-box;
      color: inherit;
    }
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      cursor: default;
    }
    .icon-1 {
      float: left;
      width: 14px;
      height: 14px;
      line-height: 16px;
      border-radius: 4px;
      margin: 2px 2px 0 0;
      overflow: hidden;
    }
    .icon-3 {
      float: left;
      width: 14px;
      height: 14px;
      line-height: 16px;
      border-radius: 4px;
      margin: 2px 2px 0 0;
      overflow: hidden;
    }
    .icon-2 {
      transition: .2s;
      height: 40px;
      cursor: pointer;
      line-height: 40px;
      text-align: center;
      display: inline-block;
    }
    .icon-act {
      transform: rotate(180deg);
    }
    .full {
      width: 100%;
    }
    .center {
      text-align: center;
    }
    .most {
      width: 220px;
    }

    .nopassword {
      display: flex;
      flex-direction: column;
      height: 100px;
      border-top: 1px solid #DDDDDD;
      align-items: center;
      justify-content: center;
      span {
        margin: 4px;
      }
    }
    .submit {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
    .control {
      text-align: center;
      cursor: pointer;
      margin: 40px 0 25px;
    }
    .center {
      text-align: center;
    }
    .step-box {
      margin-top: -6px;
      position: relative;
      text-align: center;
      width: 100%;
      span {
        display: block;
        height: 46px;
      }
    }
    .step {
      color: #CE181D;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
    }
    .control {
      position: relative;
      display: flex;
      justify-content: space-between;
      .back,
      .ok {
        width: 140px;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
      }
      .back {
        color: #CE181D;
        border: 1px solid #CE181D;
      }
      .ok {
        color: #FFFFFF;
        background-color: #CE181D;
      }
    }
    .step3 {
      position: relative;
      .remember-item, .forget-item {
        position: absolute;
        top: 50px;
        cursor: pointer;
        color: #828282;
      }
      .remember-item {
        left: 0;
        &.active {
          color: #CE181D;
        }
      }
      .forget-item {
        right: 0;
      }
    }
    .mobile {
      .code {
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
        width: 46px;
        display: inline-block;
        color: inherit;
        font-size: 16px;
        font-style: normal;
      }
      .world {
        position: absolute;
        top: 42px;
        width: 160px;
        border-radius: 4px;
        box-shadow: 0 0 9px rgba(206, 24, 29, .2);
        z-index: 99;
        overflow-y: auto;
        max-height: 200px;
        .country {
          width: 100%;
          height: 40px;
          padding-left: 16px;
          line-height: 2.5;
          font-size: 16px;
          em {
            display: inline-block;
            font-style: normal;
            width: 44px;
          }

        }
      }
    }
    .email {
      input {
        width: 250px;
        text-align: center;
      }
    }
    .entrance-logreg-win {
      ::-webkit-input-placeholder {
        font-size: 14px;
        text-align: center;
      }
      width: 350px;
      max-height: 80%;
      padding: 30px 0 0;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 4px;
      box-sizing: border-box;
      .item {
        display: block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 18px;
      }
      .edit-box {
        position: relative;
        background-color: #FEF7F7;
        border-radius: 4px;
        height: 40px;
        color: #333333;
        &.focus {
          box-shadow: 0 0 9px rgba(206, 24, 29, .2);
          background-color: #FFFFFF;
          border-radius: 4px;
        }
      }
      .logo {
        height: 80px;
        text-align: center;
      }
      input {
        position: absolute;
        outline: none;
        background: transparent;
        border: 0;
        top: 0;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        // padding-left: 6px;
        text-align: center;
        &.transparent {
          color: transparent;
        }
      }
      .default {
        .tabc {
          padding: 0 30px;
          .submit {
            margin: 40px 0 28px;
            background-color: #CE181D;
            color: #FFFFFF;
          }
          .mobile {
            input {
              width: 180px;
            }
          }
          .step1 {
            .email,
            .mobile {
              position: relative;
              width: 290px;
              overflow: visible;
              color: inherit;
            }
            input {
              right: 40px;
              text-align: center;
            }
          }
          .step2 {
            .email,
            .mobile .sms {
              position: relative;
              width: 290px;
              border-radius: 4px;
              background-color: #FFFFFF;
              overflow: visible;
              color: inherit;
              input {
                left: 0;
                width: 190px;
              }
            }
            .mobile .note {
              position: relative;
              color: #888888;
              font-size: 14px;
              height: 40px;
              line-height: 60px;
              margin-bottom: -20px;
              text-align: center;
              span {
                color: #CE181D;
                cursor: pointer;
                padding-left: 4px;
              }
            }
            .mobile .voice {
              position: relative;
              width: 290px;
              border-radius: 4px;
              background-color: #FFFFFF;
              overflow: visible;
              color: inherit;
              input {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
            }
          }
          .step3 {
            .edit-box {
              i {
                position: absolute;
                right: 10px;
              }
            }
            .remember-item{
              line-height: 24px;
              display: flex;
              align-items: center;
              .check{
                width: 16px;
                height: 16px;
                border-radius: 4px;
                background-color: #f7e1e1;
                margin-right: 6px;
                display: flex;
                align-items: center;
              }
            }
          }
        }
      }
      .step4{
        padding-left: 30px;
        padding-right: 30px;
      }
      .step5{
        .tabc{
          padding: 0 30px;
        }
      }
      .tabs {
        position: relative;
        display: flex;
        height: 40px;
        padding-top: 6px;
        color: #CE181D;
        font-size: 14px;
        line-height: 20px;
        .tab {
          display: flex;
          flex: 1;
          justify-content: center;
          cursor: pointer;
          margin: 0 40px;
        }
        .line {
          position: absolute;
          width: 20px;
          height: 2px;
          background-color: #CE181D;
          top: 28px;
        }
      }
      .mobile {
        .world {
          background-color: #FFFFFF;
          .country {
            color: rgba(51, 51, 51, 1);
            &:hover {
              height: 60px;
              line-height: 3.75;
              background-color: #FEF7F7;
            }
          }
        }
      }
      .btn-verification, .countdown {
        position: absolute;
        right: 0;
        top: 0;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        font-size: 14px;
      }
      .btn-verification {
        color: #CE181D;
        cursor: pointer;
      }
      .countdown {
        color: #333333;
        span {
          display: inline-block;
          width: 20px;
        }
      }
    }

    .entrance-logreg-mb {
      ::-webkit-input-placeholder {
        color: #8a97a5;
        font-size: 16px;
        text-align: left;
      }
      width: 100%;
      height: 100%;
      padding: 30px 15px 0 15px;
      background-color: #262b31;
      box-sizing: border-box;
      color: #c8d3de;
      .item {
        display: block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
      }
      .edit-box {
        position: relative;
        border-bottom: 1px solid #8a97a5;
        height: 40px;
        display: flex;
        padding-left: 15px;
      }
      .mobile {
        padding-left: 0;
        input {
          margin-left: 10px;
        }
      }
      .logo {
        height: 80px;
        text-align: center;
      }
      input {
        outline: none;
        background: transparent;
        border: 0;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        text-align: left;
        &.transparent {
          color: transparent;
        }
      }
      .default {
        color: #c8d3de;
        .tabs {
          position: relative;
          display: flex;
          justify-content: center;
          height: 32px;
          font-size: 16px;
          .tab {
            width: 98px;
            height: 32px;
            /*background-color: #c8d3de;*/
            background-color: #262b31;
            border: 1px solid #c8d3de;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .tab:nth-of-type(1) {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          .tab:nth-of-type(2) {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
          .active {
            background-color: #c8d3de;
            color: #2f343a;
            font-weight: 700;
          }
          .line {
            display: none;
          }
        }
        .tabc {
          .mb-none {
            display: none;
          }
          .step1 {
            .email, .mobile {
              position: relative;
              overflow: visible;
              color: inherit;
            }
          }
          .step2 {
            .email,
            .mobile .sms {
              position: relative;
              border-radius: 4px;
              overflow: visible;
              color: inherit;
              margin-right: 110px;
            }
            .mobile .note {
              position: relative;
              color: #888888;
              font-size: 14px;
              height: 40px;
              line-height: 40px;
              margin-bottom: -20px;
              text-align: left;
              span {
                color: #0ae;
                cursor: pointer;
                padding-left: 4px;
              }
            }
            .mobile .voice {
              position: relative;
              width: 290px;
              border-radius: 4px;
              background-color: #FFFFFF;
              overflow: visible;
              color: inherit;
              input {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
            }
          }
          .step3 {
            height: 90px;
            i {
              margin-right: 10px;
              color: #8a97a5;
            }
            .active {
              color: #c8d3de;
            }
            .remember-item {
              display: none;
            }
            .forget-item {
              color: #c8d3de;
              font-size: 14px;
              top: 70px;
            }
          }
          .submit {
            margin-top: 28px;
            background-color: #c8d3de;
            color: #262b31;
          }
          .step-box {
            margin-top: 30px;
            span {
              color: #0ae;
            }
          }
        }
      }
      .step5 {
        .tabs {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          .line {
            display: none;
          }
        }
        .tabc {
          margin-top: 10px;
          .edit-box:nth-of-type(2) {
            margin-right: 110px;
            width: auto;
          }
        }
        .control {
          font-size: 16px;
          .back {
            border: 1px solid #c8d3de;
            color: #c8d3de;
          }
          .ok {
            background-color: #c8d3de;
            color: #2f343a;
            font-weight: 700;
          }
        }
      }
      .mobile {
        .world {
          background-color: #3A4048;
          .country {
            color: #C8D3DE;
            &:hover {
              background-color: #424952;
            }
          }
        }
      }
      .btn-verification, .countdown {
        position: absolute;
        right: -110px;
        top: 0;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        font-size: 14px;
      }
      .btn-verification {
        color: #0ae;
      }
      .countdown {
        color: #0ae;
        span {
          display: inline-block;
          width: 20px;
        }
      }
    }
  }

  .entrance-logreg-wrap.absolute {
    position: absolute;
  }

  .entrance-logreg-wrap.relative {
    position: relative;
  }

  .entrance-logreg-wrap.auto {
    width: auto;
    height: auto;
  }
</style>
