/* eslint-disable */
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="用户头像" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="form"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item label="" prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="form.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary">login</el-button>
          <el-button type="info">resetting</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: 'Please enter a user name', trigger: 'blur' },
          { min: 5, max: 15, message: 'The length should be between 5 and 15 characters', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter a user password', trigger: 'blur' },
          { min: 5, max: 10, message: 'The length should be between 5 and 10 characters', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

/*只在当前组件内生效 */
<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: center;
}
.login_form {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
}
</style>
