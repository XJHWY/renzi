<template>
  <div class="role-manage">
    <el-button type="primary" size="small" style="margin-bottom:15px;"
    @click="roleDialogVisible = true;isEdit=false;form={}"
    >新增角色</el-button>

    <el-table :data="roleList" border align="center" stripe>
      <el-table-column label="序号" type="index" width="120px" align="center"></el-table-column>
      <el-table-column label="角色名" prop="name" sortable width="240px" align="center"></el-table-column>
      <el-table-column label="描述" prop="description" sortable align="center"></el-table-column>
      <el-table-column align="center">
        <template v-slot="scope">
          <el-button type="success" size="small" @click="showRight(scope.row.id)">分配权限</el-button>
          <el-button type="primary" size="small" @click="isEditShow(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="footer">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-sizes="[1, 2, 4, 8]"
        :page-size="paramsObj.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 分配权限弹出 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-tree v-if="rightDialogVisible" ref="myTree" :data="permission"
      :props="{label: 'name'}"
       default-expand-all
       show-checkbox
       node-key="id"
       :default-checked-keys="selectedPermission"
       ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增弹出层 -->
    <el-dialog
      :title="isEdit ? '编辑' :'新增'"
      :visible.sync="roleDialogVisible"
      width="50%"
       @close="reset"
    >
    <el-form ref="myForm" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="角色描述" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  name: 'RoleManage',
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        pagesize: 8
      },
      roleList: [],
      total: null,
      rightDialogVisible: false, // 分配
      permission: [],
      selectedPermission: [], // 默认选中
      id: null, // 被修改的角色
      roleDialogVisible: false, // 新增
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      console.log(res)
      this.roleList = res.rows
      this.total = res.total
    },
    // 条数改变
    handleSizeChange (val) {
      this.paramsObj.pagesize = val
      this.getRoleList()
    },
    // 当前页码改变
    handleCurrentChange (val) {
      this.paramsObj.page = val
      this.getRoleList()
    },
    // 点击删除
    del (id) {
      this.$confirm('确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 关闭弹出框
    handleClose () {
      this.rightDialogVisible = false
      this.id = null
      this.selectedPermission = []
    },
    // 分配权限弹出
    async showRight (id) {
      this.rightDialogVisible = true
      this.id = id
      // 获取所有权限点
      const res = await getPermissions()
      console.log(res)
      this.permission = tranferListToTree(res, '0')
      // 获取当前角色权限点
      const res1 = await getPermissionsById(id)
      this.selectedPermission = res1.permIds
      console.log(res1)
    },
    // 确认更改属性
    async save() {
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.id = null
      this.selectedPermission = []
      this.rightDialogVisible = false
      this.$message.success('分配权限成功')
    },
    // 确认添加
    onClick() {
      this.$refs.myForm.validate(async bool => {
        if (bool) {
          if (this.isEdit) {
            await editRole(this.form)
            this.$message.success('修改成功')
          } else {
            await addRole(this.form)
            this.$message.success('添加成功')
          }
          this.getRoleList()
          this.roleDialogVisible = false
        }
      })
    },
    // 关闭添加弹出层
    reset() {
      this.$refs.myForm.resetFields()
    },
    // 编辑弹出层
    isEditShow(row) {
      this.isEdit = true
      this.roleDialogVisible = true
      // this.form = { ...row }     // 解构赋值浅拷贝
      this.form = Object.assign({}, row) // API实现浅拷贝
    }
  }
}
</script>

<style scoped lang="scss">
.role-manage {
  .footer {
    display: flex;
    justify-content: end;
    margin-top: 10px;
  }
}
</style>
