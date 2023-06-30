<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm" v-loading="loading">
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model="queryForm.userId" placeholder="请输入用户Id" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMessage(queryForm.userId)">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table" v-show="this.isshow" >
      <el-table :data="messageList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        <template #default="scope" v-if="item.prop==='insert'">
          <span v-html="scope.row.insert" class="contents"></span>
        </template>
        </el-table-column>


        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              @click="handleDrawerOpen(scope.$index)"
              type="primary"
              v-has="'findmessage-query'"
              :data-id="scope.$index"
              >查看</el-button
            >
            <el-button
              type="danger"
              @click="handleDel(scope.$index)"
              v-has="'findmessage-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-drawer
        ref="Drawer"
        v-model="this.drawer"
        :title="this.title"
        :direction="this.direction"
        :before-close="this.handleClose"
      >
        <span class="view" v-html="this.message"></span>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import utils from "../utils/utils";
import { ElMessageBox } from "element-plus";
export default {
  name: "findmessage",
  data() {
    return {
      queryForm: {
        UserId: "",
      },
      drawer: false,
      isshow:false,
      direction: "rtl",
      messageList: [],
      message: "",
      loading:true,
      columns: [
       {
          label: "意见Id",
          prop: "opinionId",
          width: 100,
        },
        {
          label: "用户Id",
          prop: "userId",
          width: 100,
        },
        {
          label: "用户名",
          prop: "userName",
          width:100,
        },
        {
          label: "意见标题",
          prop: "stem",
        },
        {
          label: "意见内容",
          prop: "insert",
          formatter(row, column, value) {
            return value;
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
          width: 150,
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
          width: 150,
        },
      ],
      showModal: false,
      action: "",
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getMessage();
  },
created(){
  this.render()
},
  methods: {
    render(){
      setTimeout(()=>{
  
      const lis=document.querySelectorAll(".contents");
      for(var i=0;i<lis.length;i++){
        lis[i].innerText=lis[i].innerText.substring(0,15)
      }
      this.loading=false;
      this.isshow=true;
      
    },1000)
    },
    // 菜单列表初始化
    async getMessage(userId) {
      try {
         this.loading=true;
          this.isshow=false;
        this.messageList=[]
        if(userId){
            //说明此次是查询操作
           const list = await this.$api.getMessage({userId:userId});
           this.messageList = list;
           this.render()
        }else{
         const list = await this.$api.getMessage({});
         this.messageList = list;
          this.render()
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    // 表单重置
    async handleReset(form) {
      this.$refs[form].resetFields();
     
      this.getMessage();
    },
    handleClose(done) {
      ElMessageBox.confirm("确定要关闭弹框吗?")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    },
    handleDrawerOpen(id) {
      this.drawer = true;
      this.message = this.messageList[id].insert;
      this.title=this.messageList[id].stem;
    },
    async handleDel(index) {
      await this.$api.messageDelete({_id:this.messageList[index]._id});
      this.$message.success("删除成功");
       this.isshow=false;
      this.getMessage();
    },
  },
};
</script>

<style lang="scss">
.view{
    word-break: break-all;
    white-space: normal;
    line-height: 2
}
 .el-drawer__body{
  border-top: 1px solid #72767B;
}
//  .el-drawer{
//   width: 60%!important;;
// }
</style>