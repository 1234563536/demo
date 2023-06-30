<template>
  <el-card class="box-card">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="账号设置" name="first">
        <el-form
          :model="form"
          label-width="120px"
          :rules="rules"
          ref="updateForm"
        >
          <el-form-item label="用户ID" prop="userId">
            <el-input v-model="form.userId" :disabled="true" />
          </el-form-item>
          <el-form-item label="用户部门" prop="deptName">
            <el-input v-model="form.deptName" :disabled="true" />
          </el-form-item>
          <el-form-item label="用户角色" prop="roleName">
            <el-input v-model="form.roleName" :disabled="true" />
          </el-form-item>
          <el-form-item label="用户职位" prop="job">
            <el-input v-model="form.job" :disabled="true" />
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" />
          </el-form-item>
          <el-form-item label="用户邮箱" prop="userEmail">
            <el-input v-model="form.userEmail" />
          </el-form-item>
          <el-form-item label="用户手机号" prop="mobile">
            <el-input v-model="form.mobile" />
          </el-form-item>
          <el-form-item label="新密码" prop="userPwd">
            <el-input v-model="form.userPwd" placeholder="初始密码为123456" />
          </el-form-item>
          <el-alert type="info" show-icon :closable="false">
            <p>请输入新密码，若未输入密码，则不可以更新账号信息</p>
          </el-alert>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSubmit"
              v-has="'edit-update'"
              >更新</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="反馈意见" name="second">
        <el-form ref="forms" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="标题" prop="stem">
            <el-input v-model="form.stem" placeholder="输入意见标题"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <!-- 注意: 这个quill-editor不是element的表单元素, 不受element的直接控制, blur无效的
               需要手动注册blur事件, 调用form的校验 :modules="modules"
          -->

            <QuillEditor
              :options="options"
              v-model:content="form.content"
              ref="quilleditor"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitmessage"
              v-has="'edit-submit'"
              >提交</el-button
            >
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="工作日历" name="third">
        <el-config-provider :locale="locale">
          <el-calendar>
            <template #date-cell="{ data }">
              <el-row :class="data.isSelected ? 'is-selected' : 'sds'">
                {{ data.day.split("-").slice(1).join("-") }}
                {{ data.isSelected ? "✔️" : "" }}
              </el-row>
              <div v-for="(item, index) in textContent(data.day)" :key="index">
                <e-row>
                  <el-col class="center">
                    <el-tag type="warning" class="tag">
                      <el-row v-if="item.xianyue == 0">
                        <el-col :span="17" class="tag">
                          <span>当日限约</span>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="6" class="tag2">
                          <span>0</span>
                        </el-col>
                      </el-row>
                      <el-row v-else>
                        <el-col :span="17" class="tag">
                          <span>当日限约</span>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="6" class="tag2">
                          <span>{{ item.xianyue }}</span>
                        </el-col>
                      </el-row>
                    </el-tag>
                  </el-col>
                </e-row>
                <el-row
                  style="margin-top: 10px"
                  class="yuyue"
                  v-if="item.yiyue && item.sy == 0"
                >
                  <el-col :span="11" class="center">
                    <span>已约</span
                    ><span class="center2" style="">0</span></el-col
                  >
                  <el-col :span="2" class="center">|</el-col>
                  <el-col :span="11" class="center">
                    <span>剩余</span><span class="center2">0</span></el-col
                  >
                </el-row>
                <el-row style="margin-top: 10px" class="yuyue" v-else>
                  <el-col :span="11" class="center">
                    <span>已约</span
                    ><span class="center2" style="">{{
                      item.yiyue
                    }}</span></el-col
                  >
                  <el-col :span="2" class="center">|</el-col>
                  <el-col :span="11" class="center">
                    <span>剩余</span
                    ><span class="center2">{{ item.sy }}</span></el-col
                  >
                </el-row>
              </div>
            </template>
          </el-calendar>
        </el-config-provider>
        <div class="header headTit box-card">
          <span>帮助链接</span>
        </div>
        <div class="sideLink">
          <el-row>
            <el-col :span="8">
              <a href="#">
                <span class="icon iconGuide" />
                <p>入门指南</p>
              </a>
            </el-col>
            <el-col :span="8">
              <a
                href="https://www.apifox.cn/apidoc/shared-d81f4269-1126-4f86-af7c-b1d74db73b37/api-66845996"
                target="_blank"
              >
                <span class="icon iconHelp" />
                <p>在线接口文档</p>
              </a>
            </el-col>
            <el-col :span="8">
              <a href="#">
                <span class="icon iconTechnology" />
                <p>联系技术支持</p>
              </a>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="更新日志" name="fourth">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="v1.2.1-2020/04/05" name="9">
            <div>
              <ul>
                <li>1修复反馈意见bug，原因是quill富文本编辑器参数设置有误</li>
              </ul>
            </div>
          </el-collapse-item>
          <el-collapse-item title="v1.2.0-2020/03/13" name="8">
            <div>
              <ul>
                <li>1尝试在客户端中引入聊天模块</li>
                <li>
                  2基本实现客户端聊天模块，修复聊天内容有bug的问题，原因是userId存储形式是整数类型，而后台自动把它转化成了字符串类型，导致使用===运算符判断出错
                </li>
                <li>
                  3引入聊天模块路由，经过调试修复，将路由插入到首页管理中，理解为单独一个模块
                </li>
                <li>4拟实现图像上传模块，日志管理模块</li>
                <li>
                  5页面刷新后，聊天页面数据会丢失，待修复，初步检查应该是钩子函数的位置不对。想使用聊天页面，不要刷新
                </li>
              </ul>
            </div>
          </el-collapse-item>
          <el-collapse-item title="v1.1.4-2020/03/06" name="7">
            <div>
              <ul>
                <li>1调整用户邮箱和手机号验证规则</li>
                <li>2修复审批后noticecount数据不能实时更新问题</li>
                <li>3完善管理员逻辑，管理员默认拥有所有权限，可以不设置</li>
                <li>
                  4完善noticecount机制，取消它的状态管理，用组件通信实时更新它
                </li>
                <li>5完成Apifox接口开发文档1.0</li>
              </ul>
            </div>
          </el-collapse-item>
          <el-collapse-item title="v1.1.3-2020/03/03" name="6">
            <div>
              <ul>
                <li>1实现个人中心功能</li>
              </ul>
              <ol>
                <li>
                  2在使用vue-quill-editor的过程中，是属于第三方模块，没有ts对应的包，并且项目本身基于vite进行开发，所以不兼容这个插件。于是改成使用quill-editor来进行富文本编辑器的开发
                </li>
                <li>
                  3解决页面大小缩放，echarts图不会随之更新的Bug。解决方案是在windows下的onreise方法中调用echarts的方法
                </li>
                <li>4解决用户管理界面按钮文字显示异常的问题</li>
                <li>
                  5富文本编辑器上传HTML标签，可以在前端重新渲染成HTML标签,已经解决上传图片问题
                </li>
                <li>
                  6饼状图待开发，每个部门的员工数量，员工性别没有什么参考价值，所以目前没有设置这个字段
                </li>
                <li>7完成Excel表格下载导出功能</li>
                <li>8实现账号设置的获得部门和角色的前后端接口的实现</li>
                <li>
                  9修复审批流异常bug，同一个用户可以对应多个负责人，因此对后端代码逻辑进行了更改
                </li>
              </ol>
            </div>
          </el-collapse-item>
          <el-collapse-item title="v1.1.2-2020/02/28" name="5">
            <div>
              <ul>
                <li>
                  1通过Nodejs实现后端接口，打通数据流通，完成数据联调，实现与数据库双向绑定
                </li>
                <li>
                  2密码修改功能，所有人的密码由管理员分配，默认是123456,用户可以自己修改个人信息和密码
                </li>
                <li>3审批流程中，如果审批通过就变成绿色，方便查看</li>
                <li>
                  4后端产生的bug，日期无法实时更新，原因是字段错误。首先在前端是可以登录时间这个属性的，也可以由后台数据库自动生成。原先是通过new
                  Date()生成了Tue Feb 28 2023 18:35:37 GMT+0800
                  (中国标准时间)，然后在mongodb内部，将这个时间戳转化成了ISODate模型
                  ISODate("2023-02-28T10:35:37.726Z")(其实这一步可以理解为通过toISOString这个方法来实现的)，最后前端渲染这个value值（"2023-02-28T10:35:37.726Z"）通过format函数，将其标准化展示到页面中(2023-02-28
                  18:35:37)，其中特别注意的是时间往后加8个小时，这是format函数的作用。
                </li>
                <li>
                  5解决登录时间的更新问题，理解为登录就调用接口，由前端传递时间，存储到数据库中，这个bug已解决
                </li>
                <li>
                  6如果服务崩溃，手动运行\**node
                  node_modules/esbuild/install.js\**来解决esbuild安装问题
                  安装完成之后，再次运行 npm run dev 即可
                </li>
              </ul>
            </div>
          </el-collapse-item>
          <el-collapse-item title="v1.1.1-2020/02/22" name="4">
            <div>
              <ul>
                <li>1实现审批管理功能</li>
                <li>
                  2为什么是三级联动审批，前端部门的用户Jack发起申请后，需要经过前端部门的负责人FE审批，然后是人事部门负责人Baidu审批，最后是Ali财务部门审批。需要三个部门都审核通过。也就是说任何部门休假，都需要自己部门，人事部门和财务部门的审批
                </li>
              </ul>
            </div>
          </el-collapse-item>
          <el-collapse-item title="v1.1.0-2020/02/15" name="3">
            <div>
              <ul>
                <li>1实现系统管理功能</li>
                <li>
                  2@vitejs/create-app is deprecated, use npm init vite
                  instead.@vitejs/create应用程序已弃用，请改用npm init vite
                  使用npm init vite 项目名称 即可创建vite的项目 npm create
                  vite@latest my-vue-app -- --template vue
                </li>
                <li>
                  3用户管理界面：按钮禁用问题，<strong>bug尚未解决</strong>。处于离职期的用户，是不可以删除的。所以我们要根据user.state禁用删除按钮。我们也不可以删除自己
                </li>
                <li>
                  4数据库返回字段问题,修改数据库时，返回的不是nModified。版本已经更新，返回的是res.modifiedCount。bug已解决
                </li>
                <li>
                  5由于element-plus的版本升级，现已不采用i标签来调用icon，于是根据文档采用全局引入的方式来引入icon
                </li>
                <li>
                  6在后端返回的 ctx.body = util.fail('删除失败')
                  这种东西是返回的状态信息，不会展示到前端页面中。bug已解决
                </li>
                <li>
                  7el-pagination组件需要提供默认值，如果不给默认值，会给出警告。所以做法是随便给个初始值，页面渲染时，这个初始值就会被自动覆盖掉。bug已解决
                </li>
                <li>
                  8用户ID自增，所以单独创建一个集合counterSchema不可以使用users集合中的_id字段，这个不是递增的。已解决
                </li>
                <li>
                  9编辑按钮，点击取消是正常重置了表单数据的。但是如果点击叉
                  是不会重置表单数据的。在遮罩空白处点击:close-on-click-modal='false'
                  按下esc键:close-on-press-escape='false'
                  点击右上角的X按钮:show-close="false" 强制加三个属性 bug已解决
                </li>
                <li>
                  10表单重置问题，部门管理的表单无法重置。原因是要给el-form表单绑定ref属性，并且要给el-form-item表单同时绑定prop属性，才能生效表单重置功能。
                </li>
              </ul>
            </div>
          </el-collapse-item>
          <el-collapse-item title="v1.0.1-2020/02/08" name="2">
            <div>
              <ul>
                <li>1设计数据库ER图</li>
                <li>2测试MongoDB数据库连接</li>
                <li>3采用Mock数据，测试接口性能</li>
              </ul>
            </div>
          </el-collapse-item>
          <el-collapse-item title="v1.0.0-2020/02/01" name="1">
            <div>
              <ul>
                <li>1完成系统设计和架构图,明确系统功能</li>
                <li>2完成审批流设计</li>
                <li>3完成用户登录逻辑设计</li>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from "./../utils/utils";
import Quill from "quill";
// import BlotFormatter from "quill-blot-formatter/dist/BlotFormatter";
// import AlignAction from "quill-blot-formatter/dist/actions/align/AlignAction";
// import DeleteAction from "quill-blot-formatter/dist/actions/DeleteAction";
// import ImageSpec from "quill-blot-formatter/dist/specs/ImageSpec";
import ImageResize from "quill-image-resize-module";
//import { imageDrop } from "quill-image-drop-module";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
//import { ElMessage, ElMessageBox } from "element-plus";
//Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageResize", ImageResize);
// class CustomImageSpec extends ImageSpec {
//   getActions() {
//     return [AlignAction, DeleteAction];
//   }
// }
export default {
  name: "edit",
  components: {
    //QuillEditor,
    ElConfigProvider,
  },

  setup() {
    const { proxy } = getCurrentInstance();
    //根据deptId去找

    const activeName = ref("first");
    const calendar = ref();
    const activeNames = ref(["8"]);
    const state = reactive({
      tableData: [],
      //测试数据
      calendarData: [
        {
          day: "2023-03-04",
          xianyue: 400,
          yiyue: 5,
          sy: 1,
        },
        {
          day: "2022-11-05",
          xianyue: 500,
          yiyue: 5,
          sy: 1,
        },
        {
          day: "2022-11-06",
          xianyue: 200,
          yiyue: 5,
          sy: 1,
        },
        {
          day: "2022-11-07",
          xianyue: 0,
          yiyue: 0,
          sy: 0,
        },
      ],
    });
    const toolbarOptions = reactive({
      container: [
        ["bold", "italic", "underline", "strike"],
        // 加粗，斜体，下划线，删除线
        ["blockquote", "code-block"], //引用，代码块
        [{ header: 1 }, { header: 2 }], // 几级标题
        [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
        [{ script: "sub" }, { script: "super" }], // 下角标，上角标
        [{ indent: "-1" }, { indent: "+1" }], // 缩进
        [{ direction: "rtl" }], // 文字输入方向
        [{ size: ["small", false, "large", "huge"] }], // 字体大小
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
        [{ color: [] }, { background: [] }], // 颜色选择
        [{ font: [] }], // 字体
        [{ align: [] }], // 居中
        ["clean"], // 清除样式,
        ["link", "image"], // 上传图片、上传视频
      ],
    });

    const options = reactive({
      name: "blotFormatter",
      debug: "warn",
      placeholder: "详细描述意见内容",
      modules: {
        toolbar: toolbarOptions,
        imageResize: {
          displaySize: true,
        },
      },
    });
    const editorOption = reactive({});
    const form = reactive({
      userId: proxy.$store.state.userInfo.userId,
      userName: proxy.$store.state.userInfo.userName,
      userPwd: "",
      userEmail: proxy.$store.state.userInfo.userEmail,
      mobile: proxy.$store.state.userInfo.mobile,
      stem: "", // 标题
      content: {}, // content
      deptId: proxy.$store.state.userInfo.deptId,
      deptName: "",
      roleName: "",
      roleList: proxy.$store.state.userInfo.roleList,
      job: proxy.$store.state.userInfo.job,
    });
    let color = ref("#5b8cff");

    // 定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          pattern:
            /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
          message: "请输入正确的邮箱格式",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          required: true,
          pattern:
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      userPwd: [
        {
          required: true,
          pattern: /^\d{1,9}$/,
          message: "用户密码只能由数字组成，且长度不超过9位",
          trigger: "blur",
        },
      ],
      stem: [{ required: true, message: "请输入面经标题", trigger: "blur" }],
    });
    const handleSubmit = () => {
      proxy.$refs.updateForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(form);
          try {
            let res = await proxy.$api.updateInfo(params);
            proxy.$message.success("用户信息更新成功,请重新登录");
            setTimeout(() => {
              proxy.$router.push("/login");
            }, 1500);
          } catch (error) {
            proxy.$message.error("用户信息更新失败");
          }
        }
      });
    };
    const getDay = (date) => {
      return date.getDate();
    };
    const isWeek = (date) => {
      return date.getDay() === 6 || date.getDay() === 0;
    };
    const handlereset = () => {
      proxy.form.stem = "";
      proxy.$refs.quilleditor.setText("");
    };
    const submitmessage = async () => {
      let params = toRaw(form);
      let data = {
        stem: params.stem,
        insert: proxy.$refs.quilleditor.getHTML(),
        userId: proxy.$store.state.userInfo.userId,
        userName: proxy.$store.state.userInfo.userName,
        userEmail: proxy.$store.state.userInfo.userEmail,
        mobile: proxy.$store.state.userInfo.mobile,
      };
      let res = await proxy.$api.submitMessage(data);
      proxy.$message.success("提交成功");
      handlereset();
    };

    //处理日期获取后台数据动态渲染上去
    const textContent = (date) => {
      //当前date是拿到上面日历组件当前的日期值 根据该值去筛选测试数据找到对应各个日期下对应的数据return出去
      return state.calendarData.filter((item) => {
        return date === item.day;
      });
    };
    onMounted(async () => {
      const res = await proxy.$api.getdeptName(form.deptId);
      for (var i = 0; i < res.length; i++) {
        form.deptName = form.deptName + " " + res[i].deptName;
      }
      const res2 = await proxy.$api.getroleName(form.roleList);
      for (var i = 0; i < res2.length; i++) {
        form.roleName = form.roleName + " " + res2[i].roleName;
      }
    });
    return {
      toolbarOptions,
      state,
      form,
      rules,
      activeName,
      options,
      locale: zhCn,
      calendar,
      color,
      value: new Date(),
      activeNames,
      editorOption,
      textContent,
      handleSubmit,
      submitmessage,
      handlereset,
      getDay,
      isWeek,
    };
  },
};
</script>
<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-input {
  width: 320px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.el-calendar {
  width: 80%;
}

.sideLink {
  text-align: center;
  .icon {
    display: inline-block;
    width: 76px;
    height: 76px;
    background: url("@/assets/images/icon.png") no-repeat;
  }
  .iconGuide {
    background-position: 0 0;
  }
  .iconHelp {
    background-position: -224px 0;
  }
  .iconTechnology {
    background-position: -460px 0;
  }
}
.box-card {
  padding: 30px 10px;
  margin-top: 20px;
  .header {
    span {
      color: #2c3e50;
      font-size: 24px;
    }
    .item {
      color: #97a8be;
      float: right;
      padding: 3px 0;
    }
  }
  .headTit {
    span {
      border-bottom: 4px solid #8a97f8;
      padding-bottom: 10px;
    }
  }
}
a {
  color: black;
}
:deep .el-form-item__content {
  display: block;
}
:deep .ql-container {
  height: 350px;
}
:deep .el-calendar {
  margin: 0 auto;
}

:deep .el-calendar-table__row {
  height: 100px !important;
}
:deep .el-calendar__body {
  padding: 4px 20px 35px;
}
:deep .el-calendar-table thead th {
  color: #303133;
  font-weight: normal;
  font-size: 15px;
}
.tag {
  display: flex;
  align-items: center;
  height: 2.5vh;
  justify-content: center;
}
.tag2 {
  display: flex;
  align-items: center;
  height: 2.5vh;
  justify-content: center;
  font-size: 10px;
}
.aaa .is-selected .yuyue {
  color: #303133;
}
.aaa .datastyle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #353636;
  font-weight: 600;
}
:deep .el-calendar-table .el-calendar-day:hover {
  background-color: #faecd8;
}
:deep .el-calendar {
  --el-calendar-selected-bg-color: #faecd8;
}
.aaa .is-selected .datastyle {
  color: #303133;
}
.aaa .prev .datastyle {
  color: #c4c5c8;
}
.aaa .next .datastyle {
  color: #c4c5c8;
}
:deep .el-calendar {
  --el-calendar-cell-width: 130px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.center2 {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #303133;
  margin-left: 5px;
  font-size: 10px;
}
:deep .el-calendar__header {
  justify-content: center;
}
:deep .el-calendar-table td.is-today {
  color: #303133;
}
:deep .el-calendar-table .el-calendar-day:hover,
:deep .el-calendar-table td.is-selected {
  background-color: #5b8cff;
}
</style>