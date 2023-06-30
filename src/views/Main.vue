<template>
  <div class="dashboard-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="height: 140px" shadow="never">
          <el-icon><User /></el-icon>
          <h5 class="tit">活跃用户</h5>
          <h2 class="num">{{ this.active_user }}</h2>
          <p class="tag"><i>↑ 5.23%</i> 最近一个月</p>
        </el-card>
        <el-card style="height: 140px" shadow="never">
          <el-icon><Ticket /></el-icon>
          <h5 class="tit">平均访问量</h5>
          <h2 class="num">{{ this.active_number }}</h2>
          <p class="tag"><i class="red">↓ 8.56%</i> 截止最近一周</p>
        </el-card>
        <el-card class="row" style="height: 180px" shadow="never">
          <h4>
            <a
              href="https://gitee.com/huangzhengrui"
              target="_blank"
              style="color: #6c757d"
              >Want to Learn More,Please Click to Gitee →</a
            >
          </h4>
          <img src="./../assets/img.svg" alt="" />
        </el-card>
      </el-col>

      <el-col :span="18">
        <el-card style="height: 504px" shadow="never">
          <div ref="box" class="chart-box" style="height: 500px">
            <!-- 图表区域 -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import PubSub from "pubsub-js";
import * as echarts from "echarts";
export default {
  name: "Calendar",
  data() {
    return {
      value: new Date(),
      loading: true,
      count: [],
      active_user: 0,
      active_number: 0,
    };
  },
  computed: {
    selectDate() {
      return moment(this.value).format("YYYY-MM-DD");
    },
  },
  methods: {
    skip(flag) {
      if (flag === "preYear")
        this.value = new Date(
          this.value.setFullYear(this.value.getFullYear() - 1)
        );
      else if (flag === "preMonth")
        this.value = new Date(this.value.setMonth(this.value.getMonth() - 1));
      else if (flag === "preDay")
        this.value = new Date(this.value.setDate(this.value.getDate() - 1));
      else if (flag === "today") this.value = new Date();
      else if (flag === "postDay")
        this.value = new Date(this.value.setDate(this.value.getDate() + 1));
      else if (flag === "postMonth")
        this.value = new Date(this.value.setMonth(this.value.getMonth() + 1));
      else if (flag === "postYear")
        this.value = new Date(
          this.value.setFullYear(this.value.getFullYear() + 1)
        );
    },
    clickCalendar(data) {
      console.log(data);
      PubSub.publish("uploadWarningResultWarningTime", data.day);
    },
    async getState() {
      this.count = await this.$api.findState();
      const myChart = echarts.init(this.$refs.box);
      // 绘制图表
      myChart.setOption({
        title: {
          text: "用户状态详情",
        },
        tooltip: {},
        xAxis: {
          data: ["在职", "离职", "试用期", "全部"],
        },
        yAxis: {},
        series: [
          {
            name: "用户数量",
            type: "bar",
            data: [
              this.count[0],
              this.count[1],
              this.count[2],
              this.count.reduce((prev, curr) => {
                return prev + curr;
              }),
            ],
          },
        ],
      });
    },
    async getNumber() {
      const res = await this.$api.updateNumber();
      this.active_number = res.active_number;
      this.active_user = res.active_user;
    },
  },
  mounted() {
    // 基于准备好的dom => 初始化echarts实例
    this.getState();
    this.getNumber();
    if (this.$route.path === "/userinfo/main") {
      window.onresize = () => {
        const myChart = echarts.init(this.$refs.box);
        myChart.resize();
      };
    }
  },
};
</script>

<style lang="scss" scoped>
#customizedCalendar {
  width: 100%;
  height: 100%;

  #button {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #selectP {
    width: 30px;
    height: 30px;
    background-color: #15ff2c;
    position: absolute;
    border-radius: 50%;
    opacity: 0.6;
  }

  :deep .el-calendar__header {
    // 修改头部背景颜色
    background-color: #57617c;
    padding: 3px 5px;
    border: none;
    display: flex;
    justify-content: center;

    .el-calendar__button-group {
      // 隐藏原生按钮
      display: none;
    }

    .el-calendar__title {
      // 修改头部标题的字体颜色
      color: white !important;
      font-size: 18px;
      font-weight: bolder;
    }
  }

  :deep .el-calendar__body {
    // 修改主题部分
    padding: 0;
  }
  :deep .el-calendar-table td.is-selected {
    background-color: #5b8cff;
    color: white;
  }

  :deep .el-calendar-table {
    thead {
      th {
        // 修改头部星期部分
        padding: 0;
        background-color: #57617c;
        color: white;
      }
    }

    .is-selected {
      .el-calendar-day {
        p {
          // 选中日期颜色
          color: black;
        }
      }
    }

    .el-calendar-day {
      // 每天小块样式设置
      padding: 0;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        // 所有日期颜色
        color: black;
        z-index: 1;
        user-select: none;
        display: flex;
      }
    }
  }

  :deep .el-calendar-table__row {
    .prev,
    .next {
      // 修改非本月
      .el-calendar-day {
        p {
          color: #f0d9d5;
        }
      }
    }

    td {
      // 修改每一个日期td标签
      &:first-child,
      &:last-child {
        background-color: #f5f5f5;
      }
    }
  }

  button {
    padding: 3px 10px;
  }
}

.dashboard-page {
  .el-breadcrumb {
    margin-top: 10px;
    margin-bottom: 25px;
  }
  .el-card {
    margin-bottom: 20px;
    position: relative;
    &.row {
      h4 {
        width: 40%;
        float: left;
        font-size: 18px;
        margin-left: 5%;
      }
      img {
        width: 40%;
        float: left;
        margin-left: 10%;
        margin-top: 30px;
      }
    }
    [class^="el-icon"] {
      font-size: 30px;
      color: #ccc;
      position: absolute;
      right: 25px;
      top: 30px;
      font-weight: bold;
    }
    .tit {
      color: #6c757d;
      font-size: 14px;
      margin: 6px 0;
    }
    .num {
      color: #6c757d;
      font-size: 30px;
      margin: 6px 0;
    }
    .tag {
      color: #999;
      margin: 0;
      font-size: 14px;
      > i {
        font-style: normal;
        margin-right: 10px;
        color: rgb(10, 207, 151);
        &.red {
          color: #fa5c7c;
        }
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
    h4 {
      margin: 0;
      padding-bottom: 20px;
      color: #6c757d;
    }
  }
}
</style>
