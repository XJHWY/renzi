<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form ref="userFormRef"
          style="width:400px;margin-left:200px;margin-top:30px;"
          :model="userInfo"
          :rules="userInfoRules"
          label-width="100px">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">更新</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <UserInfo :id="id"></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <JobInfo></JobInfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveEmployee } from '@/api/employee'
import UserInfo from './components/UserInfo.vue'
import JobInfo from './components/JobInfo.vue'
export default {
  filters: {},
  components: {
    UserInfo,
    JobInfo
  },
  props: {
    id: {
      required: true,
      type: [Number, String]
    }
  },
  data () {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: ''
      },
      userInfoRules: {
        username: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    handleClick () { },
    async getUserDetailById() {
      const res = await getUserDetailById(this.id)
      console.log(res)
      res.password = null
      this.userInfo = res
    },
    async save() {
      this.$refs.userFormRef.validate(async isOk => {
        if (!isOk) {
          return this.$message.error('表单校验失败')
        }
        const res = await saveEmployee(this.id, this.userInfo)
        console.log(res)
        this.$message.success('员工信息更新成功')
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
