<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="loading" style="min-height:700px;">
        <el-tabs>
          <el-tab-pane label="用户管理" style="padding: 30px 140px; font-size: 14px">
            <!-- 用了一个行列布局 -->
            <TreeItem :node="titleObj" @delDepartment="getDepartmentsList"></TreeItem>

            <el-tree :data="data" default-expand-all>
              <template v-slot="scope">
                <TreeItem :node="scope.node" @delDepartment="getDepartmentsList"></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

      <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<script>
import TreeItem from './components/TreeItem.vue'
import { getDepartmentsList } from '@/api/departments'
export default {
  name: 'Departments',
  filters: {},
  components: {
    TreeItem
  },
  data () {
    return {
      data: [],
      titleObj: {},
      loading: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentsList()
  },
  methods: {
    async getDepartmentsList () {
      try {
        const res = await getDepartmentsList()
        console.log('架构列表', res)

        const tranferListToTree = (arr, pid) => {
          const list = []
          arr.forEach(item => {
            if (item.pid === pid) {
              list.push(item)
              item.children = tranferListToTree(arr, item.id)
            }
          })
          return list
        }
        this.data = tranferListToTree(res.depts, '')
        this.titleObj = res.depts[0]
        this.loading = false
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  .head {
    margin-right: 20px;
    color: rgb(229, 69, 25);
    font-size: 16px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
