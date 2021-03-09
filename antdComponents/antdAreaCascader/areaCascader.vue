<template>
  <div>
    <a-cascader :options="position" :disabled="disabled" :size="size" :placeholder="placeholder"  @change="handleChange" :value="setValue"/>
  </div>
</template>

<script>
import position from './data/position'
import util from "./util/index"
export default {
  name: "Cascader",
  props: {
    value: Array,
    disabled: {
      type: Boolean,
      default: false,
    },
    size: String,
    placeholder: {
      type: String,
      default: '请选择所在省市'
    }
  },
  data() {
    return {
      position: position,
      setValue: []
    }
  },
  watch: {
    value: {
      handler(val, oval) {
        this.setData(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setData(val) {
      // console.log("set", val)
      this.setValue = val
      this.$emit("on-change", val)
    },
    handleChange(val) {
      this.$emit("on-change", val)
    }
  }
}
</script>
