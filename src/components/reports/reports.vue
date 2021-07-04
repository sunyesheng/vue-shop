<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 900px; height: 400px"></div>
    </el-card>
  </div>
</template>
<script>
// 导入echarts
import echarts from 'echarts'
import _ from 'lodash'
// 装备盒子
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {},
  created () { },
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 获取数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据表失败')
    }
    const data = _.merge(res.data, this.options)
    // 展示数据
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(data)
  }
}
</script>
<style scoped>
</style>
