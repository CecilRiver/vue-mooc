<template>
  <div class="course mx-center">
    <!-- 搜索模块 -->
    <div class="course-search">
      <div class="search-tag">
        <img src="https://www.imooc.com/static/img/course/logo-course2.png" width="96" height="60" alt="">
        <!-- <img src="https://www.imooc.com/static/img/course/course-top.png" width="96" height="60" alt=""> -->
      </div>
      <!-- 使用子组件并监听子组件的自定义事件 -->
      <course-search @searchEvent="getChangeCourse"></course-search>
    </div>

    <!-- 导航模块 -->
    <course-nav v-if="navList.length" :list="navList" :params.sync="params" />
    
    <!-- 课程列表 -->
    <course-list :list="courseList" :sort.sync="sort" />

    <!-- 分页 -->
    <pagination :total="total" :page.sync="page" :size="size" @change="handlePaginationChange" />
  </div>
</template>
<script>
import axios from 'utils/axios.js'
// 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:7000/';
axios.defaults.withCredentials = false;// Cookie跨域
import CourseSearch from './search.vue'
import CourseNav from './nav.vue'
import CourseList from './list.vue'
import Pagination from 'components/pagination/pagination.vue'
import { getLessonNav, getLessonList, getLessionLimit } from 'api/lesson.js'
import getUserName from 'api/user.js'
import { ERR_OK } from 'api/config.js'
export default {
  data () {
    return {
      sort: '',
      params: {},
      navList: [],
      courseList: [],
      page: 1,
      size: 15,
      total: 0,
    }
  },

     mounted() {
  // 先执行获取导航和课程数据
   this.getCourseNavList();
   this.getCourseListData();

},
  methods: {

    //处理子组件搜索事件的方法
    // handleSearch(keyword){
    //   console.log("父组件中获取的搜索关键字：",keyword);
    // },
  




     processCourseList() {

    // 遍历courseList数组进行处理
    for (let i = 0; i < this.courseList.length; i++) {


        this.getLessionType(this.courseList[i].categoryId)
        .then(response => {
         const categoryName = response;
        // 将item.categoryId替换为categoryName
        this.courseList[i].categoryId = categoryName;
       })
        .catch(error => {
    console.error("请求失败或出现错误:", error);
     
  });


    }
    console.log("courseList:", this.courseList.length);
    console.log(this.courseList);
  },
    

    // 导航值更新事件
    handleNavChange (params) {
      this.params = params
      this.getChangeCourse()
    },
    // 分页值更新
    handlePaginationChange (page) {
      this.page = page
      this.getChangeCourse()
    },
    // 收藏or取消收藏点击事件
    handleCollectClick (item, index) {
      this.courseList[index].isLike = !this.courseList[index].isLike
    },
    // 获取课程导航信息
    getCourseNavList () {
      getLessonNav().then(res => {
        console.log(res);   
        let { msg, code, page } = res.data
        if (code === 0) {
          this.navList = page.list
        } else {
          this.navList = []
          this.$message.error('获取课程分类数据失败')
        }
      }).catch(() => {
        this.navList = []
        this.$message.error('接口异常1')
      })
    },
            // 获取课程种类接口
        getCourseTypeData () {

      getLessonList(item.categoryId).then(res => {
        console.log(res);   
        let { msg, code, categories} = res.data
        if(code === 0) {
          this.type = categories
        } else {
          this.type = []
          this.$message.error(msg)
        }
      }).catch(() => {
        this.typet = []
        this.$message.error('接口异常2')
      })
    },


    getChangeCourse(keyword){
      const params = {
        categoryId:this.params.category,
        courseLevel:this.params.diff,
        creationDate: this.sort,
        courseName:keyword
      }
      console.log(params)
      getLessionLimit(params).then(res => {
        let {msg,code,page} = res.data
        if(code === 0){
          this.courseList = page.list
          this.total = page.totalCount
          this.page = page.totalPage
          this.size = page.pageSize
           // 在这里继续处理courseList
        //  this.processCourseList();
        }
      }).catch(() => {
        this.courseList = []
        this.total = 0
        this.$message.error('接口异常la')
      })

    },

    // 获取课程信息接口
    getCourseListData () {
      const params = {
        // page: this.page,
        // size: this.size,
        // type: 0,
        // category: this.params.direction,
        // label: this.params.category,
        // diff: this.params.diff,
        // sort: this.sort
      }
      getLessonList(null).then(res => {  
        let { msg, code, page } = res.data
        if(code === 0) {
          this.courseList = page.list
          this.total = page.totalCount
          this.page = page.totalPage
          this.size = page.pageSize
           // 在这里继续处理courseList
         // this.processCourseList();
        } else {
          this.courseList = []
          this.total = 0
          this.$message.error(msg)
        }
      }).catch(() => {
        this.courseList = []
        this.total = 0
        this.$message.error('接口异常2')
      })
    },
    
    getLessionType(categoryId) {
      //axios.get(`/course/categories/info/${params.id}`);
    // 发送请求，获取类型数据
    
    return axios.get(`/course/categories/info/${categoryId}`)
      .then(response => {
        const data = response.data;
        if (data.code === 0) {
          return data.categories.categoryName;
         
        } else {
          throw new Error(data.msg);
        }
      });
  }
  },
  watch: {
    params () {
      this.page = 1
      this.getChangeCourse()
    },
    sort () {
      this.getChangeCourse()
    }
  },
  components: {
    CourseSearch,
    CourseNav,
    CourseList,
    Pagination
  }
}
</script>
<style lang="stylus" scoped>
  @import '~assets/stylus/variables.styl';
  .course
    padding-top: 20px;
    .course-search
      padding: 12px 0;
      border-bottom: 1px solid $border-second-color;
      .search-tag
        display: inline-block;
        & > img:nth-child(2)
          margin-left: 16px;
</style>
