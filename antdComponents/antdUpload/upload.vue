<template>
  <div class='upload'>

    <!-- link模式 -->
    <div class="link-upload" v-if="this.type == 'link'" style="display: flex">
      <a-input v-model="inputValue" class="link-input" :style="{width: width+'px'}" @change="inputChange" 
        :readOnly="readonly" :disabled="readonly" placeholder="上传图片地址" :maxLength="maxlength">
        <a-popover placement="right" slot="addonAfter">
          <a-icon type="eye" />
          <template slot="title">
            图片预览
          </template>
          <template slot="content">
            <img :src="inputValue" v-show="inputValue" style="width: 100%; margin: 0 auto; display: block;cursor: zoom-in;" @click="viewImage">
            <span v-show="!inputValue">无效的图片链接</span>
            <a v-show="inputValue" @click="viewImage" style="margin-top: 5px; text-align: right; display: block">查看大图</a>
          </template>
        </a-popover>
      </a-input>

      <a-upload :action="uploadUrl" :multiple="multiple" :headers="accessToken" :listType="listType" :accept="accept" :beforeUpload="beforeUpload" :showUploadList="false" @change="handleChange" :file-list="fileList">
        <a-button :loading="loading" :disabled="disabled" :icon="icon">上传图片</a-button>
      </a-upload>

      <!-- <a-upload :action="uploadUrl" :multiple="true" :file-list="fileList" @change="handleChange">
        <a-button>
          <a-icon type="upload" /> 上传图片
        </a-button>
      </a-upload> -->

    </div>

    <!-- avatar模式 -->
    <div class="avatar-upload" v-if="this.type == 'avatar'" style="display: flex;">
      <a-upload :action="uploadUrl" :headers="accessToken" :show-upload-list="false" listType="picture-card" :accept="accept" 
      :beforeUpload="beforeUpload" @change="handleChange">
        <img v-if="imageUrl" :src="imageUrl" />
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">
            上传
          </div>
        </div>
      </a-upload>
    </div>

  <!-- list模式 -->
  <div class="list-upload" v-if="this.type == 'list' || this.type == 'view'" style="display: flex">
    <a-upload
      :action="uploadUrl"
      :headers="accessToken"
      list-type="picture-card"
      :file-list="fileList"
      :accept="accept" 
      :beforeUpload="beforeUpload"
      @preview="viewImage"
      @change="handleChange">
      <div v-if="this.fileList.length < 6 && this.type != 'view'">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          上传
        </div>
      </div>
    </a-upload>
  </div>

</div>
</template>

<script>
import { uploadFile } from "@api/api"
import "viewerjs/dist/viewer.css"
import Viewer from "viewerjs"
export default {
  data() {
    return {
      uploadUrl: uploadFile,
      inputValue: "",
      loading: false,
      imageUrl: "",
      fileList: [],
    }
  },
  props: {
    readonly: {
      type: Boolean,
      default: true,
    },
    maxlength: Number,
    width: {
      type: Number,
      default: 200,
    },
    value: String | Array,
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: ".jpg, .jpeg, .png, .gif",
    },
    // listType 分为 picture picture-card text
    listType: {
      type: String,
      default: "picture",
    },
    // type 分为 link avatar list view
    type: {
      type: String,
      default: "avatar",
    },
    icon: {
      type: String,
      default: "upload",
    },
  },
  created() {
    this.accessToken = {
      accessToken: this.getStore("accessToken"),
    }
  },
  computed: {
    imgList() {
      let arr = []
      this.fileList.forEach(e => {
        if(e.url) {
          arr.push(e.url)
        } else {
          arr.push(e.response.data)
        }
      })
      return arr
    }
  },
  watch: {
    value: {
      handler(val, oval) {
        if (this.type == "link") {
          this.inputValue = val
        } else if (this.type == "avatar") {
          this.imageUrl = val
        } else if(this.type == 'list' || this.type == 'view') {
          // console.log("list or view", val)
          this.fileList = val
        }
      },
      immediate: true,
    }
  },
  methods: {
    // 查看大图
    viewImage(file) {
      // console.log(file)
      let image = new Image()
      if ((this.type == 'list'||this.type == 'view') && file.url) {
        image.src = file.url
      } else {
        image.src = this.inputValue
      }
      let viewer = new Viewer(image, {
        // toolbar: false,
        hidden: function () {
          viewer.destroy()
        },
      })
      viewer.show()
    },
    // 上传之前
    beforeUpload(file) {
      const isImage = file.type === "image/jpeg" || file.type === "image/png"
      if (!isImage) {
        this.$message.error("只能上传图片!")
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error("图片必须小于5MB!")
      }
      return isImage && isLt5M
    },
    // 输入框
    inputChange(val) {
      this.$emit("success", val.target.value)
    },
    // 回显avatar模式的图片
    getFile(val){
      this.imageUrl = val
    },
    // 上传、删除
    handleChange(info) {
      if(this.type == 'view') {
        return
      }
      this.fileList = info.fileList
      console.log(info)
      this.loading = true
      if (info.file.status === 'done' || info.file.status === 'removed') {
        let val
        if(info.file.status === 'done') {
          console.log("done", info)
          val = info.file.response.data
          this.inputValue = val
          this.imageUrl = val
        }
        if(this.type == 'list'){
          this.$emit("success", this.imgList)
        }else{
          this.$emit("success", val)
        }
        this.loading = false
        this.$message.success(info.file.status === 'done' ? `${info.file.name}上传成功.`:`${info.file.name}删除成功.`)
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
  },
}
</script>
<style lang='less' scoped>
.link-input {
  margin-right: 10px;
  margin-top: 4px;
}
</style>