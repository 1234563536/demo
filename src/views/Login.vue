<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form
        ref="userForm"
        :model="user"
        status-icon
        :rules="rules"
        autocomplete
      >
        <div class="title">后台管理系统</div>
        <el-form-item prop="userName">
          <el-input type="text" prefix-icon="user" v-model="user.userName" />
        </el-form-item>

        <el-form-item prop="userPwd">
          <el-input type="password" prefix-icon="view" v-model="user.userPwd" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
export default {
  name: "login",
  data() {
    return {
      user: {
        userName: "admin",
        userPwd: "",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        userPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async updateTime() {
      //         id: '08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a',
      //         name: 'Mattie',
      //         password: '123',
      //         avatar: '/static/images/Avatar-1.png',
      //         email: 'Mattie@goeasy.io',
      //         phone: '138xxxxxxxx',
      //     },
      //把userId改为id 把userName改为name 把userEmail改为email 把mobile改为phone

      const lastLoginTime = new Date().toISOString();
      const data = {
        lastLoginTime: lastLoginTime,
        userId: this.$store.state.userInfo.userId,
      };
      try {
        const res = await this.$api.updateTime(data);
      } catch (error) {
        console.error(error);
      }
    },
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then(async (res) => {
            console.log(res);
            this.globalData.currentUser.id = res.userId.toString();
            this.globalData.currentUser.name = res.userName;
            this.globalData.currentUser.email = res.userEmail;
            this.globalData.currentUser.phone = res.mobile;
            this.globalData.currentUser.avatar = "/static/images/Avatar-1.png";
            console.log(this.globalData.currentUser);
            this.$store.commit("saveUserInfo", res);
            //await this.loadAsyncRoutes();
            this.updateTime();
            this.$router.push("/welcome");
            // {
            //     id: '08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a',
            //     name: 'Mattie',
            //     password: '123',
            //     avatar: '/static/images/Avatar-1.png',
            //     email: 'Mattie@goeasy.io',
            //     phone: '138xxxxxxxx',
            // },
          });
        } else {
          return false;
        }
      });
    },
    goHome() {
      this.$router.push("/welcome");
    },
  },
};
</script>
<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("@/assets/images/login.jpg") center;
  background-color: #2d3a4b;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 50px;
    //background-color: #fff;
    border-radius: 4px;
    //box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 30px;
      color: #eee;
      font-weight: bold;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
