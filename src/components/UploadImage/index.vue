<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="limit"
      :class="{hidden:fileList.length === limit}"
      accept="image/png, image/jpg, image/jpeg, image/gif"
      :on-change="handleChange"
      :file-list="fileList"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-progress :percentage="percent" style="width:200px"></el-progress>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDSkodDZhZCajcGfoiOwEH6i7HCsJVS9cp',
  SecretKey: '1nKcfT2MSJvIQJwPeePuBE3dy4vYw5zd'
})
export default {
  name: 'UploadImage',
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      percent: 0
    }
  },
  methods: {
    handleRemove (file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    handleChange (file, fileList) {
      this.fileList = fileList
    },
    handleRequest (obj) {
      const that = this
      cos.putObject({
        Bucket: 'hr-admin-1313062420', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: Date.now() + '_' + obj.file.name, /* 必须 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        onProgress: function (progressData) {
          that.percent = Math.ceil(progressData.loaded / progressData.total * 100)
        }
      }, function (err, data) {
        console.log(err || data)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
