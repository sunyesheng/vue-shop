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
          :active="parseInt(activeIndex)"
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
          <el-tabs
            :tab-position="'left'"
            v-model="activeIndex"
            :before-leave="beforeLeave"
            @tab-click="tabClick"
          >
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
              <!-- 级联选择器 -->
              <el-form-item label="商品分类" prop="">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="catList"
                  :props="{
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children',
                  }"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="2">
              <!-- 渲染表单的item项 -->
              <el-form-item
                :label="item.attr_name"
                v-for="item in manyTableDate"
                :key="item.attr_id"
              >
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox
                    :border="true"
                    :label="cb"
                    v-for="(cb, i) in item.attr_vals"
                    :key="i"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="3">
              <el-form-item
                :label="item.attr_name"
                v-for="item in onlyTableData"
                :key="item.attr_id"
              >
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="4">
              <!-- action 表示图片上传的api -->
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers="headerObj"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :on-success="handleSuccess"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="5">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <!-- 添加商品按钮 -->
              <el-button type="primary" class="btnadd" @click="add"
                >添加商品</el-button
              >
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="preViewPath" class="previewimg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      dialogVisible: false,
      // 图片路径
      preViewPath: '',
      // 图片上传组件的headerObj请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 静态属性列表数据
      onlyTableData: [],
      // 动态参数列表数据
      manyTableDate: [],
      // 进度条的步骤
      activeIndex: '1',
      // 添加商品的表单数据的对象
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 富文本编辑器详情
        goods_introduce: '',
        attrs: []
      },
      addFormrules: {
        goods_name: { required: true, message: '请输入商品名称', trigger: 'blur' },
        goods_price: { required: true, message: '请输入商品价格', trigger: 'blur' },
        goods_weight: { required: true, message: '请输入商品重量', trigger: 'blur' },
        goods_numnber: { required: true, message: '请输入商品重量', trigger: 'blur' }
      },
      catList: []
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.catList = res.data
    },
    // 级联选择器变化触发函数
    handleChange () {
      // 只允许选择三级的子菜单
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '1' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选选择商品分类')
        return false
      }
    },
    async tabClick () {
      if (this.activeIndex === '2') {
        // 访问的是动态参数面板
        const { data: res } = await this.$http.get(`categories/${parseInt(this.cateId)}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数数据失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableDate = res.data
      } else if (this.activeIndex === '3') {
        const { data: res } = await this.$http.get(`categories/${parseInt(this.cateId)}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性数据失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.preViewPath = file.response.data.url
      this.dialogVisible = true
    },
    // 点击图片关闭叉号
    handleRemove (file) {
      const filePath = file.response.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象 添加到数组中 pics中
      this.addForm.pics.push(picInfo)
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        // 从数组变成字符串 错误方法
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // lodash进行深拷贝 cloneDeep(obj)
        const from = _.cloneDeep(this.addForm)
        from.goods_cat = from.goods_cat.join(',')
        this.manyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        from.attrs = this.addForm.attrs
        // 发起请求添加商品 商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', from)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        return this.$router.push('/goods')
      })
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style scoped>
.el-steps {
  margin-top: 24px;
}
.el-step__title {
  font-size: 10px;
}
.el-checkbok {
  margin: 0 5px 0 0 !important;
}
.previewimg {
  width: 100%;
}
.btnadd {
  margin-top: 15px;
}
</style>
