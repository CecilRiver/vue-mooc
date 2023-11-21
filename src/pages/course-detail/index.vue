<template>
  <div class="course-detail">
    <!-- 头部 -->
    <course-header :base="courseDetail" />

    <!-- 内容部分 -->
    <course-content :data="courseDetail" />
  </div>
</template>
<script>
import CourseHeader from './header.vue'
import CourseContent from './content.vue'
import { getLessonDetail } from 'api/lesson.js'
import { ERR_OK } from 'api/config.js'
export default {
  name: 'CourseDetail',
  data () {
    return {
      courseDetail: {
        base: {}
      }
    }
  },
  mounted () {
    //this.getCourseDetailData()
  },
  props: {
            courseId: {
                type: String,
                required: true
            }
  },
  methods: {
    // 获取课程详情
    getCourseDetailData (courseId) {
      console.log(courseId)
      getLessonDetail(courseId).then(res => {
        let { msg, courses, code } = res.data
        if (code === 0) {
          this.courseDetail = courses
        } else {
          this.courseDetail = {}
          this.$message.error(msg)
        }
      }).catch (() => {
        this.courseDetail = {}
        this.$message.error('接口异常')
      })
    }
  },
  components: {
    CourseHeader,
    CourseContent
  },
  created() {
        this.getCourseDetailData(this.courseId);
        
  },
}
</script>
