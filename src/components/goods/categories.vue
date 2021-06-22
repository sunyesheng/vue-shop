<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="catList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-row-hover
        show-index
        border
        class="treetable"
      >
        <!-- 是否有效模板区域 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row === false"
            style="color: red"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序模板 -->
        <template slot-scope="scope" slot="order">
          <el-tag v-if="scope.row.cat_level === 0">一级标签</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级标签</el-tag
          >
          <el-tag type="warning" v-else>三级标签</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot-scope="scope" slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCaleById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      @close="addlogClose"
      title="添加分类"
      :visible.sync="addCatdialogVisible"
      width="30%"
    >
      <!-- 表单 -->
      <el-form
        :model="addCatForm"
        :rules="rulesRules"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input> </el-form-item
        ><el-form-item label="父级分类">
          <el-cascader
            v-model="seletedKeys"
            :options="parentCateList"
            :props="castProps"
            @change="handleChange"
            clearable
          ></el-cascader></el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      // 商品分类的数据列表 默认为空
      catList: [],
      // 查询数据
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 控制添加对话框的显示与否
      addCatdialogVisible: false,
      // 总数据条数
      total: 0,
      // 添加分类的表单数据对象
      addCatForm: {
        cat_name: '',
        // 父级分类的名称
        cat_pid: 0,
        // 分类的等级默认是一级分类
        cat_level: 0
      },
      rulesRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      castProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选择的数据
      seletedKeys: []
    }
  },
  methods: {
    // 获取商品分类数据
    async getCatList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取信息失败')
      }
      this.catList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      // 发起请求
      this.getCatList()
    },
    // 监听pageNum的改变
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getCatList()
    },
    // 展示添加对话框的按钮
    showaddDialog () {
      this.getParentCatList()
      this.addCatdialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCatList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.parentCateList = res.data
    },
    handleChange () {
      // 只要选中项发生变化 添加到分类中
      if (this.seletedKeys.length > 0) {
        // 父级分类的id
        this.addCatForm.cat_pid =
          this.seletedKeys[this.seletedKeys.length - 1]
        // 为当前分类等级赋值
        this.addCatForm.cat_level = this.seletedKeys.length
      } else {
        // 父分类的id
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    // 提交表单
    addcat () {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('数据填写有误')
        }
        const { data: res } = await this.$http.post('categories', this.addCatForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.getCatList()
        this.addCatdialogVisible = false
      })
    },
    // 关闭对话框时  清空表单
    addlogClose () {
      this.$refs.ruleFormRef.resetFields()
      this.seletedKeys = []
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
    },
    // 根据id删除操作
    async deleteCaleById (id) {
      this.$confirm('此操作将永久删除，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status === 200) {
          this.$message.success('删除成功')
          return this.getCatList()
        } else {
          return this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }

  },
  created () {
    this.getCatList()
  }
}
</script>
<style scoped>
.treetable {
  margin-top: 15px;
}
</style>
