<template>
  <div class="search-wrapper">
    <input type="text" placeholder="搜索感兴趣的内容" v-model="searchKeyword" @focus="isFocus=true" @blur="isFocus=false" @keydown.enter="searchCourses">
    <i class="iconfont" @click="searchCourses">&#xe63c;</i>
    <ul v-if="isFocus" class="search-result">
      <li v-for="(item,index) in result" :key="index" class="result-item">
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>
<script>
import { getSearchHistory } from 'api/common.js'
import { ERR_OK } from 'api/config.js'
export default {
  data () {
    return {
      isFocus: false,
      result: [],
      searchKeyword: "",//用于存储搜索关键字
    }
  },
  mounted () {
   // this.getSearchHistoryList()
  },
  methods: {

    //获取搜索结果
    searchCourses(){
      //接口未完成
      //若搜索关键词为空
      if(this.searchKeyword === ""){
        this.result = [];
        console.log("是空的")
        return;
      }else{
        console.log(this.searchKeyword)
        //触发自定义事件，将搜索关键字传递给父组件
        this.$emit('searchEvent',this.searchKeyword);
        //清空关键字
        this.searchKeyword = "";
        return;
      }

      
    },



    // 获取搜索热词
    getSearchHistoryList () {
      getSearchHistory().then(res => {
        let { code, data, msg } = res
        if (code === ERR_OK) {
          this.result = data
        } else {
          this.result = []
          this.$message.error(msg)
        }
      }).catch(() => {
        this.result = []
        this.$message.error('接口异常-search')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~assets/stylus/variables.styl';
  .search-wrapper
    position: relative;
    float: right;
    width: 466px;
    height: 60px;
    line-height: 60px;
    .iconfont
      position: absolute;
      right: 15px;
      top: 20px;
      font-size: 24px;
      color: $font-four-color;
      cursor: pointer;
      line-height: 1;
    input
      padding: 0 16px;
      width: 100%;
      height: 36px;
      box-sizing: border-box;
      line-height: 36px;
      border-radius: 5px;
      outline: none;
      background: #f3f5f6;
      font-size: 14px;
      color: $font-first-color;
    .search-result
      z-index: 99;
      position: absolute;
      left: 0;
      top: 52px;
      right: 0;
      background-color: #fff;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 4px 8px 0px $shadow;
      .result-item
        padding-left: 20px;
        line-height: 50px;
        color: $font-first-color;
        cursor: pointer;
        font-size: 14px;
        &:hover
          background: #f3f5f6;
</style>
