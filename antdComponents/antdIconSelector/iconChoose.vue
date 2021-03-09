<template>
  <div>
    <div style="display: flex">
      <a-input v-model="currentValue" @on-change="handleChange" :placeholder="placeholder" :size="size" :disabled="disabled"
        :readOnly="readonly" :maxLength="maxlength" :icon="currentValue" />
      <a-button @click="iconChooseVisible = true" :size="size" :disabled="disabled" :icon="icon" style="margin-left: 10px">
        选择图标
      </a-button>
    </div>

    <!-- 选择图标弹窗 -->
    <icons 
      @choose="handleIconChoose" @close="handleIconCancel" :iconChooseVisible="iconChooseVisible">
    </icons>
  </div>
</template>

<script>
import Icons from "./modules/icons"
export default {
  name: "iconChoose",
  components: {
    Icons
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    size: String,
    placeholder: {
      type: String,
      default: "输入图标名或选择图标",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    maxlength: Number,
    icon: {
      type: String,
      default: "setting",
    },
  },
  data() {
    return {
      // iconModalVisible: false,
      iconChooseVisible: false,
      currentValue: this.value,
      iconData: [],
      key: "",
      tip: "输入英文关键词搜索，比如 success",
    }
  },
  methods: {
    handleIconCancel() {
      this.iconChooseVisible = false
    },
    handleChange(v) {
      this.$emit("input", this.currentValue)
      this.$emit("on-change", this.currentValue)
    },
    setCurrentValue(value) {
      if (value === this.currentValue) {
        return
      }
      this.currentValue = value
    },
    handleIconChoose(v) {
      this.currentValue = v
      this.$emit("input", this.currentValue)
      this.$emit("on-change", this.currentValue)
      this.iconModalVisible = false
      this.iconChooseVisible = false
    },
  },
  watch: {
    value(val) {
      this.setCurrentValue(val)
    }
  }
}
</script>

<style lang="less" scoped>
.icon-search {
  position: relative;
  margin: 20px auto 30px;
  text-align: center;
  input {
    width: 500px;
    box-sizing: border-box;
    border: 0;
    border-radius: 4px;
    background: #f5f5f5;
    text-align: center;
    font-size: 14px;
    outline: none;
    margin: 0 auto;
    padding: 8px 0;
  }
}
.icon-block {
  display: flex;
  flex-wrap: wrap;
  max-height: 500px;
  overflow: auto;
}
.icon-bar {
  overflow: auto;
  overflow-x: hidden;
}
.icon-bar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.icon-bar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #c3c3c3;
}

.icon-bar::-webkit-scrollbar-track {
  background: #fff;
}
.icon-wrap {
  :hover {
    color: #1890ff;
    transition: color 0.3s;
  }
}
.icons-item {
  margin: 6px 6px 6px 0;
  width: 145px;
  text-align: center;
  list-style: none;
  cursor: pointer;
  height: 100px;
  color: #5c6b77;
  transition: all 0.2s ease;
  position: relative;
  padding-top: 10px;
  p {
    padding-top: 15px;
    margin: 5px;
    font-size: 14px;
  }
}
</style>

