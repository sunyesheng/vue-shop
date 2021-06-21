<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="rolesDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表表格区 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>
                  {{ item1.authName }}
                  <i class="el-icon-caret-right"></i>
                </el-tag>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  class="vcenter"
                >
                  <el-col span="6">
                    <el-tag type="warning"
                      >{{ item2.authName }}<i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                  <!--  -->
                  <el-col span="18">
                    <el-tag
                      type="success"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色ID" prop="id"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changeRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色按键 -->
    <el-dialog
      @close="rloesDialogClosed"
      title="添加角色"
      :visible.sync="rolesDialogVisible"
      width="30%"
    >
      <el-form
        :model="addRoleObj"
        :rules="rolesRules"
        ref="addRoleObjRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleObj.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleObj.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有角色的列表数据
      roleList: [],
      rolesDialogVisible: false,
      addRoleObj: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      rolesRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        roleDesc: []
      }
    }
  },
  methods: {
    // 获取所有角色的列表
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败')
      }
      this.roleList = res.data
    },
    // 重置表单功能
    rloesDialogClosed () {
      this.$refs.addRoleObjRef.resetFields()
    },
    // 添加角色功能
    addRoles () {
      this.$refs.addRoleObjRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('roles', this.addRoleObj)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        console.log(res)
        this.rolesDialogVisible = false
        this.getRoleList()
      })
    },
    // 根据ID删除角色
    async delRoleById (id) {
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRoleList()
    },
    changeRoles (id) {
      // console.log(id)
      this.$message.error('功能暂未实现')
    }
  },
  // 生命周期函数
  created () {
    this.getRoleList()
  }
}
</script>
<style scoped>
.el-button {
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px;
  font-size: 15px;
  border-bottom: 1px solid #ccc;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
