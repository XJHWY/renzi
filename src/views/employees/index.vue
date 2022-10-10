<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="一条记录">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel">普通excel导出</el-button>
          <el-button type="info" size="mini" @click="exportExcel1">复杂表头excel导出</el-button>
          <el-button type="success" size="mini" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button type="primary" size="mini" @click="addDialogVisible = true">新增员工</el-button>
        </template>
      </PageTool>

      <!-- 表格 -->
      <el-card style="margin-top:15px;">
        <el-table border :data="employees">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="姓名" sortable prop="username"></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img v-imgError :src="scope.row.staffPhoto" style="width: 40px;height:40px"
              @click="showQrDialog(scope.row.staffPhoto)" />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatterEmployee"></el-table-column>
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry"></el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350px" align="center">
            <template v-slot="scope">
              <el-button type="text" @click="$router.push('/employees/detail/' + scope.row.id)">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="roleShow(scope.row)">角色</el-button>
              <el-button type="text" @click="deleteEmployees(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 新增员工 -->
      <el-dialog
        title="新增员工"
        :visible.sync="addDialogVisible"
        width="50%"
        :before-close="addHandleClose"
      >
        <el-form
          ref="addEmployeesFormRef"
          :model="addEmployeesForm"
          label-width="100px"
          :rules="addEmployeesRules"
        >
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addEmployeesForm.username" placeholder="请输入姓名" style="width:290px"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addEmployeesForm.mobile" placeholder="请输入手机号" style="width:290px"></el-input>
          </el-form-item>

          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker
              v-model="addEmployeesForm.timeOfEntry"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择入职时间"
              style="width: 290px;"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="聘用形式" prop="formOfEmployment">
            <el-select v-model="addEmployeesForm.formOfEmployment" placeholder="请选择聘用形式">
              <el-option label="正式" value="1"></el-option>
              <el-option label="非正式" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="工号" prop="workNumber">
            <el-input v-model="addEmployeesForm.workNumber" placeholder="请输入工号" style="width:290px"></el-input>
          </el-form-item>

          <el-form-item label="部门" prop="departmentName">
            <el-input
              v-model="addEmployeesForm.departmentName"
              placeholder="请选择部门"
              style="width:290px"
              @focus="departmentFocus"
            ></el-input>
            <el-tree
              v-if="treeShow"
              :data="treeList"
              default-expand-all
              node-key="id"
              :props="{ children: 'children',label: 'name'}"
              @node-click="handleNodeClick"
            ></el-tree>
          </el-form-item>

          <el-form-item label="转正时间">
            <el-date-picker
              v-model="addEmployeesForm.correctionTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择转正时间"
              style="width: 290px;"
            ></el-date-picker>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 角色弹出 -->
      <el-dialog
        title="分配角色"
        :visible.sync="assignRolesDialog"
        width="50%"
        :before-close="assignHandleClose"
      >
      <!-- 绑定同一数组 -->
        <el-checkbox-group v-model="userRoles">
          <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>

        <span slot="footer" class="dialog-footer">
          <el-button @click="assignRolesDialog = false">取 消</el-button>
          <el-button type="primary" @click="assignRolesConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 头像二维码 -->
      <el-dialog title="图片二维码" :visible.sync="qrcodeVisible" width="30%">
        <el-row type="flex" justify="center">
          <canvas id="canvas"></canvas>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getEmployee, addEmployees, getEmployeesInfo, getRoleList, assignPrem, deleteEmployees } from '@/api/employee'
import { getDepartmentsList } from '@/api/departments'
import { tranferListToTree } from '@/utils/index'
import employees from '@/employees'
import QRCode from 'qrcode'
export default {
  name: 'Employees',
  filters: {},
  components: {},
  data () {
    const noEmpty = { required: true, message: '不能为空', trigger: 'blur' }
    const mobileReg = /^(?:(?:\+|00)86)?1\d{10}$/
    return {
      paramsObj: {
        page: 1,
        size: 8
      },
      employees: [], // 员工列表
      roleList: [], // 所有角色列表
      total: null,
      addDialogVisible: false, // 新增弹出框
      addEmployeesForm: {
        username: '',
        mobile: '',
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 组织名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      addEmployeesRules: {
        username: [noEmpty, { min: 1, max: 4, message: '长度1-4位', trigger: 'blur' }],
        mobile: [noEmpty, { pattern: mobileReg, message: '手机号格式不正确', trigger: 'blur' }],
        timeOfEntry: [noEmpty],
        formOfEmployment: [noEmpty],
        workNumber: [noEmpty],
        departmentName: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      treeShow: false, // 树形图显示
      treeList: [], // 树形图数据
      assignRolesDialog: false, // 分配角色弹出
      userId: null, // 当前角色ID
      userRoles: [], // 个人角色列表
      qrcodeVisible: false // 图片二维码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
    this.getRoleList()
  },
  methods: {
    // 获取员工列表
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      console.log(res)
      this.employees = res.rows
      this.total = res.total
    },
    // 获取所有角色列表
    async getRoleList () {
      const res = await getRoleList()
      console.log('所有角色列表', res)
      this.roleList = res.rows
    },
    formatterEmployee (row, column, cellValue, index) {
      var obj = employees.hireType.find(item => item.id === cellValue - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue - 0).value
      } else {
        return '未知'
      }
    },
    // 导出简单表格
    async exportExcel () {
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      console.log(rows)
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })

      // const data = []
      // rows.forEach(item => {
      //   data.push(Object.values(item))
      // })

      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))

      const data = []
      rows.forEach(item => {
        const arr = []
        Object.keys(rows[0]).forEach(item1 => {
          arr.push(item[item1] || '')
        })
        data.push(arr)
      })

      console.log(data)
      console.log(tHeader)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '人力资源表', // 非必填
          autoWidth: true, // 非必填s
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 导出复杂表格
    exportExcel1 () {
      const multiHeader = [['', '主要信息', '', '', '', '', '']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    },
    // 关闭弹出层
    addHandleClose () {
      this.$refs.addEmployeesFormRef.resetFields()
      this.addEmployeesForm.correctionTime = ''
      this.addDialogVisible = false
    },
    // 分配弹出层关闭
    assignHandleClose() {
      this.assignRolesDialog = false
      this.userRoles = []
    },
    // 获取焦点显示部门树
    async departmentFocus () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const res = await getDepartmentsList()
      this.treeList = tranferListToTree(res.depts, '')
      console.log(this.treeList)
      loading.close()
      this.treeShow = true
    },
    // 点击树形图
    handleNodeClick (e) {
      console.log(e)
      this.addEmployeesForm.departmentName = e.name
      this.treeShow = false
    },
    // 确认添加
    addConfirm () {
      this.$refs.addEmployeesFormRef.validate(async isOk => {
        if (isOk) {
          await addEmployees(this.addEmployeesForm)
          this.$message.success('添加成功')
          this.getEmployee()
          this.addDialogVisible = false
        }
      })
    },
    // 角色弹出框显示
    async roleShow (info) {
      this.assignRolesDialog = true
      this.userId = info.id
      const res = await getEmployeesInfo(info.id)
      console.log('员工个人信息', res)
      const roleIds = res.roleIds // 员工个人角色列表
      let arr = []
      roleIds.forEach(item => {
        const index = this.roleList.findIndex(item1 => item === item1.id)
        arr.push(this.roleList[index]?.id)
      })
      arr = arr.filter(item => item)
      console.log('员工角色', arr)
      this.userRoles = arr
    },
    // 确认修改权限
    async assignRolesConfirm() {
      await assignPrem({ id: this.userId, roleIds: this.userRoles })
      this.assignRolesDialog = false
      this.$message.success('分配权限成功')
      this.getEmployee()
    },
    // 删除员工
    deleteEmployees(info) {
      console.log(info)
      this.$confirm('确认删除角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteEmployees(info.id)
        console.log(res)
        this.$message.success('删除成功')
        this.getEmployee()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 图片二维码
    showQrDialog(src) {
      this.qrcodeVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(document.getElementById('canvas'), src, function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
