<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
        <!-- 提示区域 -->
        <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false"
        >
        </el-alert>
        <!-- 不步骤条区域 -->
        <el-steps
          :space="200"
          :active="activeIndex"
          finish-status="success"
          :align-center="true"
        >
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <div>
        <!-- 表单区域 -->
        <el-form
          :model="addForm"
          :rules="addFormrules"
          ref="addFormRef"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
        >
          <!-- tab栏区域 -->
          <el-tabs :tab-position="'left'" v-model="activeIndex">
            <el-tab-pane label="基本信息" name="1">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input
                  v-model="addForm.goods_price"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input
                  v-model="addForm.goods_weight"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input
                  v-model="addForm.goods_number"
                  type="number"
                ></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="2"></el-tab-pane>
            <el-tab-pane label="商品属性" name="3"></el-tab-pane>
            <el-tab-pane label="商品图片" name="4"></el-tab-pane>
            <el-tab-pane label="商品内容" name="5"></el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 进度条的步骤
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0
      },
      addFormrules: {
        goods_name: { required: true, message: '请输入商品名称', trigger: 'blur' },
        goods_price: { required: true, message: '请输入商品价格', trigger: 'blur' },
        goods_weight: { required: true, message: '请输入商品重量', trigger: 'blur' },
        goods_numnber: { required: true, message: '请输入商品重量', trigger: 'blur' }
      }
    }
  },
  methods: {
  }
}
</script>
<style scoped>
.el-steps {
  margin-top: 25px;
}
.el-step__title {
  font-size: 10px;
}
</style>
