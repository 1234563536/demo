<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
          <el-button
            size="small"
            type="success"
            @click="exportData"
            v-has="'user-update'"
            >普通excel导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'user-create'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has="'user-patch-delete'"
          >批量删除</el-button
        >
      </div>
      <el-alert type="info" show-icon :closable="false">
        <p>
          用户数据是公司宝贵的财产，删除用户并不会直接从数据库中删除，而是将他们的状态修改为离职
        </p>
        <br />
        <p>管理员默认拥有所有权限</p>
      </el-alert>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" v-has="'user-edit'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="handleDel(scope.row)"
              v-has="'user-delete'"
              :disabled="scope.row.userName === 'admin'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="action === 'add' ? '用户新增' : '用户编辑'"
      v-model="showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form
        ref="dialogForm"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action == 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
            placeholder="请输入用户邮箱"
          >
            <!-- <template #append>@imooc.com</template> -->
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from "./../utils/utils";
export default {
  name: "user",
  setup() {
    //  获取Composition API 上下文对象
    const { proxy } = getCurrentInstance();
    // 初始化用户表单对象
    const user = reactive({
      state: 1,
    });

    // 初始化用户列表数据
    const userList = ref([]);

    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 100,
    });

    // 选中用户列表对象
    const checkedUserIds = ref([]);

    // 弹框显示对象
    const showModal = ref(false);

    // 新增用户Form对象
    const userForm = reactive({
      state: 1,
    });

    // 所有角色列表
    const roleList = ref([]);
    // 所有部门列表
    const deptList = ref([]);
    // 定义用户操作行为
    const action = ref("add");

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
      deptId: [
        {
          required: true,
          message: "请输入部门",
          trigger: "blur",
        },
      ],
    });

    // 定义动态表格-格式
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        width: 180,
        formatter: (row, column, value) => {
          //console.log(value) 比如说value是从数据库过来的数据 假如是 2021-01-17T13:32:06.381Z 经过format函数后 变成了2021-01-17 21:32:06 因此把它展示到页面中，逻辑没问题了
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        width: 180,
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
        },
      },
    ]);
    const hireType = reactive([
      {
        state: 1,
        value: "在职",
      },
      {
        state: 2,
        value: "离职",
      },
      {
        state: 3,
        value: "试用期",
      },
    ]);
    onMounted(() => {
      getUserList();
      getDeptList();
      getRoleAllList();
    });

    const exportData = () => {
      const headers = {
        用户Id: "userId",
        姓名: "userName",
        邮箱: "userEmail",
        用户状态: "state",
        手机号: "mobile",
        用户工作: "job",
        注册时间: "createTime",
        最后登录时间: "lastLoginTime",
      };
      import("../utils/Export2Excel").then(async (excel) => {
        // 获取所有的员工列表数据
        const res = await proxy.$api.getAllUserList();
        // rows是所有的员工列表数据
        // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]

        // excel导出的默认对象
        excel.export_json_to_excel({
          filename: "用户信息表",
          header: Object.keys(headers),
          data: formatJSON(headers, res),
        });
      });
    };
    // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]
    // 数据的顺序是按照headers中key的顺序来的
    // 格式化json数据
    const formatJSON = (headers, rows) => {
      // rows 是一行一行的  =>  [{},{}] => [[],[]]
      return rows.map((item) => {
        // item {username: '张三', mobile: 123}  现在是对象 => []
        // ["姓名","手机号"] => [ '张三', '123']
        return Object.keys(headers).map((key) => {
          // key是中文 headers[key]是英文 // item是 英文 {username: '张三', mobile: 123}
          if (
            headers[key] === "createTime" ||
            headers[key] === "lastLoginTime"
          ) {
            // 如果是日期的话 就需要格式化日期
            return utils.formateDate(new Date(item[headers[key]]));
          } else if (headers[key] === "state") {
            // 要把聘用形式转化成文本
            const obj = hireType.find((o) => o.state === item[headers[key]]);
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    };
    // 获取用户列表

    const getUserList = async () => {
      let params = { ...user, ...pager };
      try {
        const { list, page } = await proxy.$api.getUserList(params);
        userList.value = list;
        console.log(userList);
        pager.total = page.total;
      } catch (error) {}
    };

    //  查询事件，获取用户列表
    const handleQuery = () => {
      //我的mock接口数据还没改，意味着无论我传递什么样的参数，返回的数据都是一样的
      getUserList();
    };
    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };

    // 分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };
    // 用户单个删除 bug没解决 如何禁用删除按钮
    const handleDel = async (row) => {
      const res = await proxy.$api.userDel({
        userIds: [row.userId], //可单个删除，也可批量删除
      });
      proxy.$message.success("删除成功");
      getUserList();
    };

    // 批量删除 bug已解决
    const handlePatchDel = async () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error("请选择要删除的用户");
        return;
      }
      const res = await proxy.$api.userDel({
        userIds: checkedUserIds.value, //可单个删除，也可批量删除
      });
      console.log(checkedUserIds.value);

      if (res.modifiedCount > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("删除失败");
      }
    };

    // 表格多选
    const handleSelectionChange = (list) => {
      let arr = [];
      list.map((item) => {
        arr.push(item.userId);
      });
      checkedUserIds.value = arr;
    };

    // 用户新增
    const handleCreate = () => {
      action.value = "add";
      showModal.value = true;
    };

    //获取部门列表
    const getDeptList = async () => {
      let list = await proxy.$api.getDeptList();
      deptList.value = list;
    };

    // 角色列表查询
    const getRoleAllList = async () => {
      let list = await proxy.$api.getRoleAllList();
      roleList.value = list;
    };
    // 用户弹窗关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };

    // 用户提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm);
          //params.userEmail += "@imooc.com";
          params.action = action.value;
          params.createTime = new Date().toISOString();
          params.lastLoginTime = new Date().toISOString();
          let res = await proxy.$api.userSubmit(params); //就是user/operate的接口
          showModal.value = false;
          if (action.value === "edit") {
            proxy.$message.success("用户编辑成功");
          } else {
            proxy.$message.success("用户创建成功");
          }
          handleReset("dialogForm");
          getUserList();
        }
      });
    };

    // 用户编辑
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      proxy.$nextTick(() => {
        Object.assign(userForm, row);
      });
    };

    return {
      user,
      userList,
      columns,
      pager,
      checkedUserIds,
      showModal,
      userForm,
      rules,
      roleList,
      deptList,
      action,
      hireType,
      formatJSON,
      exportData,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDel,
      handlePatchDel,
      handleSelectionChange,
      handleCreate,
      getDeptList,
      getRoleAllList,
      handleClose,
      handleSubmit,
      handleEdit,
    };
  },
};
</script>
<style lang="scss">
</style>
