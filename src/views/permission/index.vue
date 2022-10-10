<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool #right style="margin-bottom:30px">
        <el-button type="primary" size="mini" @click="showVisible('0')">添加权限</el-button>
      </PageTool>
      <el-card>
        <el-table border :data="roleList" row-key="id">
          <el-table-column label="名称" prop="name">
          </el-table-column>
          <el-table-column label="标识" prop="code"></el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
               <el-button v-if="scope.row.id" type="text" @click="showVisible(scope.row.id)">添加</el-button>
               <span v-else style="width:2em" display="inline-block"></span>
            <el-button type="text" @click="editDialog(scope.row)">编辑</el-button>
            <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog :visible.sync="dialogVisible" title="新增权限">
        <el-form ref="permission" label-width="80px" :rules="permissionFormRules" :model="permissionForm">
          <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
          <el-input v-model="permissionForm.code"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
          <el-input v-model="permissionForm.description"></el-input>
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="permissionForm.enVisible"></el-switch>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" size="mini" @click="addPermission">确定</el-button>
          <el-button size="mini" @click="reset">取消</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PageTool from '@/components/PageTool'
import { getPermissions, addPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils/index'
export default {
  filters: {},
  components: { PageTool },
  data () {
    return {
      roleList: [],
      dialogVisible: false,
      permissionForm: {
        name: '',
        code: '',
        description: '',
        enVisible: false,
        type: '',
        pid: ''
      },
      permissionFormRules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ]
      },
      id: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getPermissions()
  },
  methods: {
    async getPermissions () {
      let res = await getPermissions()
      res = tranferListToTree(res, '0')
      console.log(res)
      this.roleList = res
    },
    showVisible (id) {
      this.id = id
      this.dialogVisible = true
    },
    reset() {
      this.dialogVisible = false
      this.$refs.permission.resetFields()
    },
    async addPermission () {
      this.permissionForm.pid = this.id || '0'
      this.permissionForm.type = this.id === '0' ? '1' : '2'
      const res = await addPermission(this.permissionForm)
      console.log(res)
      this.dialogVisible = false
      this.getPermissions()
      this.$refs.permission.resetFields()
    },
    editDialog(row) {
      this.permissionForm = row
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
