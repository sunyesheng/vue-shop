<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '0'"
              >一级权限</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.level === ''"
              >二级权限</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.level === '2'"
              >三级权限</el-tag
            >
            <el-tag type="info" v-else>用户权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 权限列表
      rightList: []
    }
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.rightList = res.data
      // console.log(this.rightList)
    }
  },
  // 获取所有的权限
  created () {
    this.getRightsList()
  }
}
</script>
<style scoped>
</style>
