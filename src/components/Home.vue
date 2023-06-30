<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="./../assets/logo.png" />
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :unique-opened="true"
        :default-active="activeMenu"
        background-color="#5b8cff"
        text-color="#fff"
        router
        :collapse="isCollapse"
        class="nav-menu"
      >
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon><fold /></el-icon>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <div class="screenfull_icon" @click="screenfull">
            <svg-icon icon-class="fullscreen" class="fullscreen" />
            <el-icon><FullScreen /></el-icon>
          </div>
          <el-badge
            :is-dot="this.$store.state.noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <el-icon><bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout" style="vertical-align: baseline">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon><SwitchButton /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout"
                  >退出：你有{{ noticeCount }}条消息未处理</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>
import TreeMenu from "./TreeMenu.vue";
import BreadCrumb from "./BreadCrumb.vue";
import screenfull from "screenfull";
import ScreenFull from "./ScreenFull.vue";
import mitt from "./mitt";
import ua2obj from "ua2obj";
export default {
  name: "Home",
  components: { TreeMenu, BreadCrumb, ScreenFull },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1),
      iconclass: [],
      fullscreen: ["icon", "iconfont", "icon-fullscreen"],
      exitFullscreen: ["icon", "iconfont", "icon-fullscreen-exit"],
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
    ua2obj();
    this.init();
    mitt.on("countNumber-Leave", () => {
      this.getNoticeCount();
    });
    mitt.on("countNumber-Approve", () => {
      this.getNoticeCount();
    });
  },
  methods: {
    init() {
      if (screenfull.isEnabled) {
        this.iconclass = this.fullscreen;
        screenfull.on("change", this.change);
      }
    },

    change() {
      if (screenfull.isFullscreen) {
        this.iconclass = this.exitFullscreen;
      } else {
        this.iconclass = this.fullscreen;
      }
    },
    screenfull() {
      if (!screenfull.isEnabled) {
        this.$message({ message: "你的浏览器不支持全屏", type: "warning" });
        return false;
      }
      screenfull.toggle();
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    handleLogout(key) {
      if (key == "email") return;
      this.$store.commit("saveUserInfo", "");
      this.userInfo = {};
      this.$router.push("/login");
    },

    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount();
        this.$store.commit("saveNoticeCount", count);
        this.noticeCount = count;
      } catch (error) {
        console.error(error);
      }
    },
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList();
        this.userMenu = list;
        const { menuList, actionList } = await this.$api.getPermissionList();
        this.$store.commit("saveMenuList", menuList);
        this.$store.commit("saveActionList", actionList);
        this.userMenu = menuList;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style lang="scss">
.el-menu-item.is-active {
  color: black !important;
}
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background: -webkit-linear-gradient(bottom, #3d6df8, #5b8cff);
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    overflow: hidden;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }

    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      //background: #3d6df8;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      min-height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
.screenfull_icon {
  float: left;
  line-height: 50px;
  margin-right: 10px;
  cursor: pointer;
}
</style>
