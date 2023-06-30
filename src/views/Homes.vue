<template>
  <div class="home" v-loading="loading">
    <div class="home-container">
      <div class="home-menu">
        <div class="menu-header">
          <img class="user-avatar" :src="currentUser.avatar" />
          <div class="user-profile">
            <div class="user-profile-main">
              <div class="user-profile-header">
                <img :src="currentUser.avatar" />
                <div>{{ currentUser.name }}</div>
              </div>
              <div class="user-profile-info">
                <div class="user-profile-info-title">邮箱</div>
                <div>{{ currentUser.email }}</div>
              </div>
              <div class="user-profile-info">
                <div class="user-profile-info-title">手机</div>
                <div>{{ currentUser.phone }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="menu-box">
          <div class="menu-list">
            <router-link class="menu-item" to="/conversations" replace>
              <i class="iconfont icon-zaixiankefu"></i>
              <span v-if="unreadAmount" class="menu-unread">{{
                unreadAmount
              }}</span>
            </router-link>
            <router-link class="menu-item" to="/contacts" replace>
              <i class="iconfont icon-haoyou"></i>
            </router-link>
          </div>
          <div class="exit">
            <i class="iconfont icon-h" @click="logout"></i>
          </div>
        </div>
      </div>
      <div class="home-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import restApi from "../api/restapi";
export default {
  data() {
    return {
      currentUser: null,
      unreadAmount: null,
      loading: true,
    };
  },
  // mounted() {
  //   // 监听浏览器的刷新事件
  //   window.addEventListener("beforeunload", this.unload);
  //   // window.addEventListener('beforeunload', e => this.unload) // 注册一个匿名函数
  // },
  // destroyed() {
  //   // 销毁这个监听事件，需要找到这个函数，如果使用的是匿名函数的话，无法查找这个函数，这个事件也就没有办法被移除 ，在其他页面仍然会执行这个监听事件
  //   window.removeEventListener("beforeunload", this.unload);
  // },

  beforeCreate() {
    this.$api.getAllUserList().then((res) => {
      let result = res.map((o) => {
        return {
          id: o.userId.toString(),
          name: o.userName,
          email: o.userEmail,
          phone: o.mobile,
          avatar: `/static/images/Avatar-1.png`,
        };
      });

      restApi.users = [...result];
      let result2 = [
        {
          id: "group-123",
          name: "小程序交流群",
          avatar: "/static/images/wx.png",
          userList: ["1000002", "1000003", "1000005", "1000013"],
        },
        {
          id: "group-234",
          name: "UniApp交流群",
          avatar: "/static/images/uniapp.png",
          userList: ["1000002", "1000003", "1000005", "1000013"],
        },
        {
          id: "group-345",
          name: "GoEasy交流群",
          avatar: "/static/images/goeasy.jpeg",
          userList: ["1000002", "1000003"],
        },
      ];
      restApi.groups = [...result2];
    });
  },
  created() {
    this.stopF5Refresh();
    this.currentUser = this.globalData.currentUser;
    if (this.goEasy.getConnectionStatus() === "disconnected") {
      this.connectGoEasy(); //连接goeasy
    }
    this.goEasy.im.on(
      this.GoEasy.IM_EVENT.CONVERSATIONS_UPDATED,
      this.setUnreadNumber
    );
  },
  methods: {
    stopF5Refresh() {
      document.onkeydown = function (e) {
        var evt = window.event || e;
        var code = evt.keyCode || evt.which;
        //屏蔽F1---F12
        if (code > 111 && code < 124) {
          if (evt.preventDefault) {
            evt.preventDefault();
          } else {
            evt.keyCode = 0;
            evt.returnValue = false;
          }
        }
      };
      //禁止鼠标右键菜单
      // document.oncontextmenu = function (e) {
      //   return false;
      // };
      //阻止后退的所有动作，包括 键盘、鼠标手势等产生的后退动作。
      history.pushState(null, null, window.location.href);
      window.addEventListener("popstate", function () {
        history.pushState(null, null, window.location.href);
      });
    },
    connectGoEasy() {
      this.goEasy.connect({
        id: this.currentUser.id,
        data: { name: this.currentUser.name, avatar: this.currentUser.avatar },
        onSuccess: () => {
          //连接成功
          console.log("GoEasy connect successfully."); //连接成功
          this.loading = false;
        },
        onFailed: function (error) {
          //连接失败
          console.log(
            "Failed to connect GoEasy, code:" +
              error.code +
              ",error:" +
              error.content
          );
        },
        onProgress: function (attempts) {
          //连接或自动重连中
          console.log("GoEasy is connecting", attempts);
        },
      });
    },
    setUnreadNumber(content) {
      this.unreadAmount = content.unreadTotal;
    },
    logout() {
      // if (confirm("确认要退出登录吗？")) {
      //   this.goEasy.disconnect({
      //     onSuccess: () => {
      //       //this.globalData.currentUser = null;
      //       this.$router.push({ path: "welcome" });
      //     },
      //     onFailed: (error) => {
      //       console.log(
      //         "Failed to disconnect GoEasy, code:" +
      //           error.code +
      //           ",error:" +
      //           error.content
      //       );
      //     },
      //   });
      // }
      ElMessageBox.alert("确认要退出聊天对话吗？", "提示", {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: "OK",
        callback: (action) => {
          ElMessage({
            type: "success",
            message: `退出会话成功`,
          });
          this.goEasy.disconnect({
            onSuccess: () => {
              //this.globalData.currentUser = null;
              this.$router.push({ path: "/welcome" });
            },
            onFailed: (error) => {
              console.log(
                "Failed to disconnect GoEasy, code:" +
                  error.code +
                  ",error:" +
                  error.content
              );
            },
          });
        },
      });
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 1000px) {
  .home-container {
    width: 850px;
    height: 450px;
  }
}
@media screen and (min-width: 1000px) {
  .home-container {
    width: 850px;
    height: 650px;
  }
}

.home {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("@/assets/images/login.jpg") center;
}

.home-container {
  background: #ffffff;
  display: flex;
  position: relative;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.home-menu {
  width: 60px;
  background-color: #f7f7f7;
  border-right: 1px solid #eeeeee;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-header {
  margin: 20px auto;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
}

.user-avatar:hover + .user-profile {
  display: block;
}

.user-profile {
  display: none;
  color: #ffffff;
  position: absolute;
  top: 0;
  left: 70px;
  width: 250px;
  height: 200px;
  background: #ffffff;
  z-index: 999;
}

.user-profile-main {
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  border-radius: 4px;
}

.user-profile-header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
}

.user-profile-header img {
  width: 45px;
  height: 45px;
}

.user-profile-info {
  display: flex;
  padding: 10px 20px;
  font-size: 14px;
  color: #666666;
  line-height: 28px;
}

.user-profile-info-title {
  width: 70px;
}

.menu-box {
  padding: 40px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-item {
  color: #303133;
  cursor: pointer;
  height: 56px;
  position: relative;
}

.menu-unread {
  position: absolute;
  top: -5px;
  right: 5px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  background-color: #d02129;
  color: #ffffff;
}

.router-link-active i {
  color: #d02129 !important;
}

.iconfont {
  padding: 15px;
  font-size: 28px;
  color: #606266;
  cursor: pointer;
}

.iconfont:active {
  color: #d02129;
}

.home-main {
  padding: 0;
  flex: 1;
}
</style>
