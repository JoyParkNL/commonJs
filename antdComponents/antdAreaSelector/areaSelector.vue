<template>
  <div class='select'>
    <a-select style="width:150px" @change="handleProvinceChange" placeholder="请选择省/直辖市">
      <a-select-option v-for="province in provinceList" :key="province">
        {{ province }}
      </a-select-option>
    </a-select>
    <a-select v-model="secondCity" style="margin-left:20px;width:150px" @change="handleCityChange" placeholder="请选择城市">
      <a-select-option v-for="city in cities" :key="city">
        {{ city }}
      </a-select-option>
    </a-select>
    <a-select v-model="district" style="margin-left:20px;width:150px" @change="handleDistrictChange" placeholder="请选择区县">
      <a-select-option v-for="district in counties" :key="district">
        {{ district }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import city from './data/city'
import options from './data/cities'
export default {
  data() {
    return {
      provinceList: [],
      // 城市
      cityList: {},
      secondCity: undefined,
      cities: [],
      // 区域
      districtList: {},
      district: undefined,
      counties: []
    }
  },
  created() {
    this.provinceFormat()
    this.cityFormat()
    this.districtFormat()
    // this.getCities()
    // console.log(this.provinceList)
    // console.log(this.cityList)
    // console.log(this.districtList)

  },
  methods: {
    getCities() {
      this.cities = this.cityList[this.provinceList[0]]
    },
    // 省级数组
    provinceFormat() {
      let arr = []
      options.forEach(e => {
        arr.push(e.label)
      })
      this.provinceList = arr
    },
    // 市级对象
    cityFormat() {
      let cities = {}
      options.forEach(e => {
        let arr = []
        if(e.label != "北京市" && e.label != "天津市" && e.label != "上海市" && e.label != "重庆市") {
          e.children.forEach(c => {
            arr.push(c.label)
          })
        } else {
          arr.push(e.label)
        }
        cities[`${e.label}`] = arr
      })
      this.cityList = cities
    },
    // 区域对象
    districtFormat() {
      let counties = {}
      options.forEach(e => {
        if(e.label != "北京市" && e.label != "天津市" && e.label != "上海市" && e.label != "重庆市") {
          e.children.forEach(c => {
            let arr = []
            c.children.forEach(d => {
              arr.push(d.label)
            })
            counties[`${c.label}`] = arr
          })
        } else {
          let arr = []
          e.children.forEach(c => {
            arr.push(c.label)
          })
          counties[`${e.label}`] = arr
        }
      })
      this.districtList = counties     
    },
    handleProvinceChange(value) {
      // console.log(value)
      this.cities = this.cityList[value]
      this.secondCity = this.cityList[value][0]
      this.counties = this.districtList[this.secondCity]
      this.district = this.districtList[this.secondCity][0]
      let arr = []
      arr.push(this.cities[0])
      arr.push(this.secondCity)
      arr.push(this.district)
      this.$emit('on-change', arr)
    },
    handleCityChange(value) {
      // console.log(value)
      this.counties = this.districtList[value]
      this.district = this.districtList[value][0]
      let arr = []
      arr.push(this.cities[0])
      arr.push(this.secondCity)
      arr.push(this.district)
      this.$emit('on-change', arr)
    },
    handleDistrictChange(value) {
      this.district = value
      let arr = []
      arr.push(this.cities[0])
      arr.push(this.secondCity)
      arr.push(this.district)
      this.$emit('on-change', arr)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>