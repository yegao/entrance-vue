import './assets/c/index.css'
import Entrance from './index.vue'
Entrance.install = function (Vue) {
    Vue.component(Entrance.name,Entrance)
    // 添加全局方法或属性

    // 添加全局过滤器 Vue.filter()

    // 注入组件 Vue.mixin()

    // 添加实例方法 Vue.prototype
}

let install = function(Vue) {
  Vue.component(Entrance.name, Entrance);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {version: '1.0.2', install}

// module.exports = {
//   version: '1.0.2',
//   install
// };
//
// module.exports.default = module.exports;
