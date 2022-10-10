<template>
<div>
  <el-row type="flex" justify="end" :gutter="10">
   <el-col :span="6">
     <el-select v-model="year" size="mini" style="100%" @change="handleChange">
      <el-option v-for="(item,index) in 11" :key="index" :value="year-6 + item" :label="year-6 + item"></el-option>
    </el-select>
   </el-col>
    <el-col :span="6">
      <el-select v-model="month" size="mini" style="100%" @change="handleChange">
      <el-option v-for="item in 12" :key="item" :value="item">{{ item }}</el-option>
    </el-select>
    </el-col>
  </el-row>
  <el-calendar v-model="value">
    <template #dateCell="scope">
    {{ scope.date.getDate() }}
      <div v-if="scope.date.getDay() === 0 || scope.date.getDay() === 6" class="rest">休</div>
    </template>
  </el-calendar>
</div>
</template>

<script>
export default {
  data() {
    return {
      month: (new Date()).getMonth() + 1,
      year: (new Date()).getFullYear(),
      value: new Date()
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.month = newVal.getMonth() + 1
        this.year = newVal.getFullYear()
      },
      deep: true
    }
  },
  methods: {
    handleChange() {
      var str = this.year + '-' + this.month
      this.value = new Date(str)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-calendar__header {
  display: none;
}
::v-deep .el-calendar__body {
  padding: 0;
}
::v-deep .el-calendar-table td {
  text-align: center;
  border: none;
}
::v-deep .el-calendar-table tr td:first-child {
  border: none;
}
::v-deep .el-calendar-table tr:first-child td {
  border: none;
}
.rest {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  background-color: orange;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
}
</style>
