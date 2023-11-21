<template>
  <div class="free-course">
    <dl>
      <dt>
        <span
          v-for="(tab,index) in tabList"
          :key="index"
          :class="{active: currentTabIndex==index}"
          @click="handleTabClick(tab,index)"
        >{{ tab.title }}</span>
        <mooc-button size="mini" round @click="handleEditClick" style="justify-content: flex-end; ">
          <i class="iconfont">&#xe600;</i>
          创建课程
        </mooc-button>
      </dt>
      
      <template v-if="lessonList.length">
        <dd v-for="(item,index) in lessonList" :key="index" class="course-item">
          <div class="img-box">
            <img :src="item.courseImg" alt="">
          </div>
          <div class="course-content">
            <p class="title">
              {{ item.courseName }}
            </p>
            <p class="learn">
              <!-- <span class="rate">已学{{ item.percent }}%</span> -->
              <span class="duration">类型：{{item.category}}  </span>
              <span class="duration">老师：{{item.username}}  </span>
              <span class="duration">难度：{{item.courseLevel}}  </span>
              <span class="duration">学时：{{item.courseTime}}  </span>
              <!-- <span v-if="item.lastChapter" class="chapter">学习至{{ 空数据 }}</span> -->
            </p>
            <p class="other">
              <!-- <span>笔记{{ item.notes }}</span>
              <span>代码{{ item.codes }}</span>
              <span>问答{{ item.questions }}</span>
              <span class="learn-btn">继续学习</span> -->
            </p>

    <!-- 创建课程弹窗 -->
    <mooc-dialog title="创建课程" :visible.sync="dialogVisible" width="600px">
      <el-form ref="editForm" :model="editForm" label-width="80px" label-position="rigth">
        <el-form-item label="课程名称">
          <el-input v-model="editForm.coursename" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程介绍">
          <el-input v-model="editForm.description" placeholder="请输入课程介绍"></el-input>
        </el-form-item>
        <el-form-item label="课程类别">
          <el-input v-model="editForm.category" placeholder="请输入课程类别"></el-input>
        </el-form-item>
        <el-form-item label="课程图片">
          <el-input v-model="editForm.img" placeholder="请输入课程图片URL"></el-input>
        </el-form-item>
        <el-form-item label="课程难度">
          <el-input v-model="editForm.level" placeholder="请输入课程难度"></el-input>
        </el-form-item>
        <el-form-item label="课程学时">
          <el-input v-model="editForm.time" placeholder="请输入课程学时"></el-input>
        </el-form-item>

      </el-form>
      <template slot="footer">
        <mooc-button size="small" @click="dialogVisible=false">关闭</mooc-button>
        <mooc-button size="small" type="primary" :disabled="isLoading" @click="handleSaveClick">保存</mooc-button>
      </template>
    </mooc-dialog>

          </div>
        </dd>

      </template>
      <empty v-else message="暂无创建课程信息"></empty>
    </dl>

    <!-- 分页 -->
    <pagination
      v-if="lessonList.length"
      :page.sync="page"
      :total="total"
      @change="handlePaginationChange"
    ></pagination>
  </div>
</template>
<script>
import Pagination from 'components/pagination/pagination.vue'
import Empty from 'components/empty/empty.vue'
import { getTeacherCourse } from 'api/user.js'
import { ERR_OK } from 'api/config.js'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      isLoading: false,
      dialogVisible: false,
      page: 1,
      total: 0,
      lessonList: [],
      currentTabIndex: 0,
      tabList: [],
      editForm: {
        coursename: '',
        description: '',
        category: '',
        img: '',
        level: '',
        time: '',
      }
    }
  },
  created () {
    // 初始化选项卡数据
    this.tabList = [
      { title: '全部课程', type: '' },
      // { title: '免费课程', type: 0 },
      // { title: '实战课程', type: 1 }
    ]
  },
  mounted () {
    this.getUserCourseData()
  },
  methods: {

    // 创建课程
    handleEditClick () {
      this.dialogVisible = true
      // this.editForm = {
      //   username: this.userinfo[0].username,
      //   email: this.userinfo[0].email,
      //   // city: this.userinfo.city,
      //   sex: this.userinfo[0].sex,
      //   intro: this.userinfo[0].intro
      // }
      // this.$nextTick(() => {
      //   this.$refs.editForm.resetFields()
      // })
    },

        // 保存个人信息
    handleSaveClick () {
      this.isLoading = true
      // updateUserInfo(this.editForm).then(res => {
      //   this.isLoading = false
      //   const { code, msg } = res
      //   if (code === ERR_OK) {
      //     this.dialogVisible = false
      //     this.$message.success(msg)
      //     this.$emit('componentClick', 'userinfo')
      //   } else {
      //     this.$message.error(msg)
      //   }
      // }).catch(() => {
      //   this.isLoading = false
      //   this.$message.error('接口异常')
      // })
    },

    // 选项卡点击事件
    handleTabClick (tab, index) {
      this.currentTabIndex = index
      this.getUserCourseData()
    },
    // 分页值更新
    handlePaginationChange (page) {
      this.page = page
      this.getUserCourseData()
    },
    // 获取老师创建的课程信息
    getUserCourseData () {
      const userInfo = this.$store.getters.userInfo;
      const params = {
       userId: userInfo.userId
      }
      getTeacherCourse(params).then(res => {
        console.log(res.data)
        let { msg, code, page } = res.data
        if (code === ERR_OK) {
          this.lessonList = page.list
          this.total = page.totalCount
          console.log(this.lessonList)
        } else {
          this.lessonList = []
          this.$message.error(msg)
        }
      }).catch(() => {
        this.lessonList = []
        this.$message.error('接口异常呜呜呜')
      })
    }
  },
  computed: {
    currentType () {
      return this.tabList[this.currentTabIndex].type
    }
  },
  components: {
    Pagination,
    Empty
  }
}
</script>
<style lang="stylus" scoped>
  .free-course
    dt
      border-bottom: 1px solid #d0d6d9;
      & > span
        margin-right: 48px;
        display: inline-block;
        vertical-align: middle;
        height: 48px;
        line-height: 48px;
        box-sizing: border-box;
        font-size: 14px;
        color: #787d82
        cursor: pointer;
        &:last-child
          margin-right: 0;
        &.active
          color: #f01414;
          border-bottom: 2px solid #f01414;
    .course-item
      display: flex;
      align-items: flex-start;
      padding: 30px 0;
      border-bottom: 1px solid #eff1f0;
      &:last-child
        border-bottom: none;
      .img-box
        flex: 0 0 200px;
        width: 200px;
        height: 113px;
        & > img
          display: block;
          width: 100%;
          height: 100%;
      .course-content
        flex: 1;
        margin-left: 30px;
        .title
          font-size: 18px;
          font-weight: 700;
          line-height: 30px;
          .status
            float: right;
            margin-right: 25px;
            font-size: 14px;
            color: #787d82;
        .learn
          padding: 10px 0 22px;
          & > span
            display: inline-block;
            vertical-align: middle;
            margin-right: 15px;
            color: #787d82;
            line-height: 20px;
            font-size: 14px;
            &:last-child
              margin-right: 0;
            &.rate
              color: #f01414;
        .other
          & > span
            margin-right: 100px;
            display: inline-block;
            vertical-align: middle;
            font-size: 14px;
            color: #787d82;
            &.learn-btn
              float: right;
              margin-right: 0;
              width: 104px;
              height: 36px;
              background-color: #f01414;
              border-radius: 18px;
              text-align: center;
              line-height: 36px;
              color: #fff;
              cursor: pointer;
</style>