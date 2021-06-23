<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <div slot="header">
        <el-alert
          title="注意：只允许为第三级分类设置相关参数"
          type="warning"
          :closable="false"
        ></el-alert>
      </div>
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectcatList"
            :options="catList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handelTab">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            @click="adddialogVisible = true"
            >添加参数</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="showeditDiolog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeP(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            @click="adddialogVisible = true"
            >添加属性</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="showeditDiolog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeP(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹出的对话框 -->
    <el-dialog
      :title="'添加' + titletext"
      :visible.sync="adddialogVisible"
      width="30%"
      @close="adddiologclosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="100px"
      >
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改的对话框 -->
    <el-dialog
      :title="'修改' + titletext"
      :visible.sync="editdialogVisible"
      width="30%"
      @close="editdiologclosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormrules"
        ref="editFormref"
        label-width="100px"
      >
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表
      catList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数据
      selectcatList: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 两个表格的参数 动态和静态属性数据
      manyTableData: [],
      onlyTableData: [],
      // 控制显示对话框
      adddialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {},
      addFormrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改对话框
      editdialogVisible: false,
      editForm: {},
      editFormrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 如果按钮需要被禁用 则返回false
    isBtnDisable () {
      if (this.selectcatList.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId () {
      if (this.selectcatList.length === 3) {
        return this.selectcatList[2]
      }
      return null
    },
    // 动态计算标题的文本
    titletext () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.catList = res.data
    },
    // 级联选择框选中项变化 触发的时间
    handleChange () {
      this.getParamsData()
    },
    // tab页签点击事件处理
    handelTab () {
      this.getParamsData()
    },
    // 获取参数
    async getParamsData () {
      if (this.selectcatList.length !== 3) {
        // 证明选中的不是三级分类
        this.selectcatList = []
        return this.$message.error('请选择三级分类操作')
      }
      // 根据所选分类的id和所处的面板获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      // 判断数据到底是那个表格的数据
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 关闭对话框的事件
    adddiologclosed () {
      this.$refs.addFormref.resetFields()
    },
    // 点击确定 添加参数
    addParams () {
      this.$refs.addFormref.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入属性内容')
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.adddialogVisible = false
        this.getParamsData()
        return this.$message.success('添加参数成功')
      })
    },
    // 展示按钮修改的对话框
    async showeditDiolog (id) {
      // 发起请求 渲染修改
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data
      this.editdialogVisible = true
    },
    editdiologclosed () {
      this.$refs.editFormref.resetFields()
    },
    // 点击按钮修改参数
    editParams () {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入要修改的内容')
        }
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('成功修改')
        this.editdialogVisible = false
        return this.getParamsData()
      })
    },
    // 删除
    async removeP (id) {
      const conres = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (conres !== 'confirm') {
        return this.$message.info('已取消操作')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除信息成功')
      return this.getParamsData()
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style scoped>
.el-cascader {
  margin-left: 20px;
}
.el-button {
  margin-bottom: 15px;
}
</style>
