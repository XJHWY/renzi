<template>
  <div class="tree-item" style="width: 100%">
    <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col class="head">
            {{
            node.data ? node.data.manager : "负责人"
            }}
          </el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="command">
              <span>
                操作
                <i class="el-icon-arrow-down" />
              </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 添加弹出层 -->
    <el-dialog
      :title="title"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="handleClose"
      @click.native.stop
    >
      <el-form
        ref="addFormRef"
        label-width="100px"
        :model="addDepartmentForm"
        :rules="addDepartmentFormRules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addDepartmentForm.name" placeholder="2-10个字符"></el-input>
        </el-form-item>

        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addDepartmentForm.code" placeholder="1-50个字符"></el-input>
        </el-form-item>

        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="addDepartmentForm.manager"
            placeholder="请选择负责人"
            style="width:100%"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="addDepartmentForm.introduce" type="textarea" placeholder="1-300个字符"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteDepartments, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
import { getSimpleUserList } from '@/api/user'
export default {
  name: 'TreeItem',
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    //! 判断部门名是否重复
    const validateName = async (rules, value, callback) => {
      // 获取所有数据
      const res = await getDepartmentsList()
      if (this.isEdit) { // 编辑
        const pid = this.node.data.pid
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('已有该部门')) : callback()
      } else { // 添加
        // 拿到当前这条部门数据的id
        const id = this.node.data ? this.node.data.id : ''
        // 筛选给当前部门下的已有子部门            判断是否有重名的子部门
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('已有该部门')) : callback()
      }
    }

    //! 判断部门编码是否重复
    const validateCode = async (rules, value, callback) => {
      // 获取所有数据
      const res = await getDepartmentsList()
      if (this.isEdit) {
        const pid = this.node.data.pid
        // 筛选给当前部门下的已有子部门            判断是否有重名的子部门
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.code === value) ? callback(new Error('部门编码重复')) : callback()
      } else {
        // 拿到当前这条部门数据的id
        const id = this.node.data ? this.node.data.id : ''
        // 筛选给当前部门下的已有子部门            判断是否有重名的子部门
        res.depts.filter(item => item.pid === id).some(item => item.code === value) ? callback(new Error('部门编码重复')) : callback()
      }
    }
    return {
      addDialogVisible: false, // 添加弹出层
      addDepartmentForm: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      addDepartmentFormRules: {
        name: [
          { required: true, message: '请输入必填项', trigger: 'blur' },
          { min: 2, max: 10, message: '输入长度2~10', trigger: 'blur' },
          { validator: validateName, trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入必填项', trigger: 'blur' },
          { validator: validateCode, trigger: 'change' }
        ]
      },
      users: [],
      isEdit: false
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }

  },
  watch: {

  },
  methods: {
    async command (key) {
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        this.isEdit = false
        this.addDialogVisible = true
      } else if (key === 'b') {
        this.isEdit = true
        this.addDepartmentForm = { ...this.node.data }
        this.addDialogVisible = true
      } else {
        try {
          await this.$confirm('确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await deleteDepartments(this.node.data.id)
          this.$emit('delDepartment')
          this.$message.success('删除成功')
        } catch (err) {
          console.log(err)
          this.$notify({
            message: '取消删除',
            duration: 1500
          })
        }
      }
    },
    handleClose () {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    // 获取简单用户列表
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log('简单用户列表', res)
      this.users = res
    },
    // 确认提交
    async onSubmit () {
      if (this.isEdit) {
        delete this.addDepartmentForm.children
        await editDepartment(this.addDepartmentForm)
        this.$message.success('修改成功')
      } else {
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        const res = await addDepartment(this.addDepartmentForm)
        console.log(res)
        this.$message.success('添加成功')
      }
      // 告诉父组件重新获取数据
      this.$emit('delDepartment')
      this.handleClose()
    }
  }
}
</script>

<style scoped lang="scss"></style>
