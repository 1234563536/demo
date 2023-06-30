import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import request from './utils/request'
import storage from './utils/storage'
// 导入所有的el-icon图标
import * as ElIconModules from '@element-plus/icons-vue'
import api from './api'
import store from './store'
import {
    QuillEditor,
    Quill
} from '@vueup/vue-quill'
import GoEasy from 'goeasy'


import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.core.css'

//可以发现是开发环境还是生产环境
//  统一注册el-icon图标

const app = createApp(App);
app.component('QuillEditor', QuillEditor)
app.component('Quill', Quill)
app.directive('has', {
    beforeMount: function(el, binding) {
        let actionList = storage.getItem('actionList');
        let value = binding.value;
        let hasPermission = actionList.includes(value)
        if (!hasPermission) {
            el.style = 'display:none';
            setTimeout(() => {
                el.parentNode.removeChild(el);
            }, 0)
        }
    }
})

const goEasy = GoEasy.getInstance({
    host: 'hangzhou.goeasy.io', //应用所在的区域地址: [hangzhou.goeasy.io, 新加坡暂不支持IM，敬请期待]
    appkey: 'BC-883c3bf97f964218b69fcd58f1209041', // common key,
    modules: ['im'],
});
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.globalData = {
    currentUser: {
        id: '',
        name: '',
        password: '',
        avatar: '',
        email: '',
        phone: '',
    },
};
app.config.globalProperties.GoEasy = GoEasy;
app.config.globalProperties.goEasy = goEasy;
app.use(router).use(store).use(ElementPlus, {
    size: 'small'
}).mount('#app')