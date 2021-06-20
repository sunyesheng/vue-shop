<template>
  <div class="con">
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span >电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">logout</el-button>
        </el-header>
        <!-- 主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
            <!-- 折叠按钮 -->
            <div class="toggle-button" @click="toggleClick">|||</div>
                <!-- 侧边栏菜单区 -->
                    <el-menu
                        :router="true"
                        :collapse-transition="false"
                        :collapse="isCollapse"
                        unique-opened="true"
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409BFF">
                        <!-- 一级菜单 -->
                        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                            <!-- 一级菜单模板漆 -->
                            <template slot="title">
                                <i :class="menuListIcon[item.id]"></i>
                                <span slot="title">{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :index="'/'+childitem.path" v-for="childitem in item.children" :key="childitem.id">
                                <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{childitem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
            </el-aside>
            <!-- 主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      menuListIcon: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMeunList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    // 实现点击折叠
    toggleClick () {
      this.isCollapse = !this.isCollapse
    }
  },
  created () {
    this.getMeunList()
  }
}
</script>

<style  scoped>
.con {
    height: 100%;
}
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    padding-left: 0;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
}
.el-header div {
    display: flex;
    align-items: center;
}
.el-header div span {
    margin-left: 45px;
}

.el-aside {
    background-color: #333744;
}
.el-aside .el-menu {
    border-right: 0;
}
.el-container {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    height: 24px;
    background-color: #4a5046;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
}
.toggle-button:hover {
    background-color: #409BFF;
}
</style>
