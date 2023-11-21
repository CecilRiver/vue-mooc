<template>
  <div class="task-details">
    <h1 class="page-title">作业互评页面</h1>
    <!-- <p class="task-id">任务ID: {{ internalTaskId }}</p> -->

    <div v-if="assignments" class="details-box assignment-details">
      <h2 class="section-title">作业详情</h2>
      <div class="detail-item">
        <label class="detail-label">作业标题:</label>
        <p class="detail-content">{{ assignments.title }}</p>
      </div>
      <div class="detail-item">
        <label class="detail-label">作业描述:</label>
        <p class="detail-content">{{ assignments.description }}</p>
      </div>
      <div class="detail-item">
        <label class="detail-label">截止日期:</label>
        <p class="detail-content">{{ assignments.dueDate }}</p>
      </div>
    </div>

    <div v-if="submissions" class="details-box submission-details">
      <h2 class="section-title">提交详情</h2>
      <div class="detail-item">
        <label class="detail-label">提交内容:</label>
        
        <div v-html="submissions.content" class="assignment-content"></div>
      </div>
      <div class="detail-item">
        <label class="detail-label">提交日期:</label>
        <p class="detail-content">{{ submissions.submissionDate }}</p>
      </div>
      <div class="detail-item">
        <label class="detail-label">相似度得分:</label>
        <p class="detail-content">{{ submissions.similarityScore }}</p>
      </div>
      <!-- <div class="detail-item">
        <label class="detail-label">初步评分:</label>
        <p class="detail-content">{{ submissions.preliminaryScore }}</p>
      </div> -->
    </div>

    <div v-if="evaluationRules" class="details-box evaluation-rules">
      <h2 class="section-title">评估规则</h2>
      <div class="detail-item">
        <label class="detail-label">评估规则描述:</label>
        <p class="detail-content">{{ evaluationRules.ruleDescription }}</p>
      </div>
    </div>

    <div class="details-box evaluation-rules">
    <h2 class="section-title">请打分：</h2>
     <input type="number" v-model="star" min="1" max="100" :style="{ color: 'red', fontWeight: 'bold' }" />
      <!-- <AwesomeVueStarRating 
        :star="this.star" 
        :disabled="this.disabled" 
        :maxstars="this.maxstars" 
        :starsize="this.starsize" 
        :hasresults="this.hasresults" 
        :hasdescription="this.hasdescription" 
        :ratingdescription="this.ratingdescription"  /> -->
    </div>

    <div class="edit_container">
        <quill-editor 
            v-model="content" 
            ref="myQuillEditor" 
            :options="editorOption" 
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
        </quill-editor>
    </div>
    <br>
  <!-- 模板中添加提交按钮 -->
     <button @click="submitEditorContent" class="submit-button">提交</button>

  </div>
</template>



<script>
import axios from 'utils/axios.js'
import AwesomeVueStarRating from "awesome-vue-star-rating";
import Qs from 'qs'


//引入富文本编辑器组件
import {quillEditor} from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';


export default {
  components: {
    quillEditor,
    AwesomeVueStarRating,
  },
  props: ['taskId'],
  data() {
    return {
      star: 50,
        star2: 4,
        ratingdescription: [
        {
            text: "Poor",
            class: "star-poor",
        },
        {
            text: "Below Average",
            class: "star-belowAverage",
        },
        {
            text: "Average",
            class: "star-average",
        },
        {
            text: "Good",
            class: "star-good",
        },
        {
            text: "Excellent",
            class: "star-excellent",
        },
        ],
        ratingdescription2: [
        {
            text: "I hate it",
            class: "star-poor",
        },
        {
            text: "I dont like it",
            class: "star-belowAverage",
        },
        {
            text: "Its Okay",
            class: "star-average",
        },
        {
            text: "I like it",
            class: "star-good",
        },
        {
            text: "I Love it",
            class: "star-excellent",
        },
        ],
        hasresults: true,
        hasdescription: true,
        starsize: "lg", //[xs,lg,1x,2x,3x,4x,5x,6x,7x,8x,9x,10x],
        maxstars: 5,
        disabled: false,
        hasresults2: true,
        hasdescription2: true,
        starsize2: "lg", //[xs,lg,1x,2x,3x,4x,5x,6x,7x,8x,9x,10x],
        maxstars2: 5,
        disabled2: false,
        starsize3: "xs",


      selectedStars: 0, // 存储当前选中的星星数量

      internalTaskId: null, // 使用一个内部变量来保存 taskId 的值
      assignments: null,
      submissions: null,
      evaluationRules: null,
      content: `请认真评阅`,
      editorOption:{
        placeholder: "请在这里输入",
              modules:{
                toolbar:[
                          ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                          ['blockquote', 'code-block'],     //引用，代码块
                          [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                          [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                          [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                          [{ 'direction': 'rtl' }],             // 文本方向
                          [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                          [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                          [{ 'font': [] }],     //字体
                          [{ 'align': [] }],    //对齐方式
                          ['clean'],    //清除字体样式
                          ['image','video']    //上传图片、上传视频
                          ]
                      }

      },

      
    };
  },
  mounted() {
    // 使用 $route.params 获取路由参数中的 id
    const routeId = this.$route.params.id;
    console.log('从路由中获取的任务ID:', routeId);

    // 将路由参数中的 id 赋值给内部变量
    this.internalTaskId = this.taskId || routeId;
    console.log('最终任务ID:', this.internalTaskId);

    if (this.internalTaskId !== undefined) {
      this.loadData();
    } else {
      console.error('Task ID is undefined.');
    }
  },
  methods: {


     // 提交富文本编辑器内容
  submitEditorContent() {
  
    const userInfo = this.$store.getters.userInfo;
    const params ={
      submissionId: this.internalTaskId,
      reviewerId: userInfo[0].userId ,
      score : this.star,
      feedback:this.content
    }
    axios.defaults.withCredentials = false;// Cookie跨域
    axios.post(`http://localhost:88/courese/peerevaluation/peerreviews/createReview`,Qs.stringify(params))
    .then(response =>{
      const{code,msg} = response
          if(code === 0){
            this.dialogVisible = false
            this.$message.success(msg)    
          }
    })
  },
    loadData() {
      axios.defaults.withCredentials = false;// Cookie跨域
      axios.get(`http://localhost:88/courese/work/submissions/info/${this.internalTaskId}`)
        .then(response => {
          console.log(response.data)
          const data = response.data.data;
          this.assignments = data.assignments;
          this.submissions = data.submissions;
          this.evaluationRules = data.evaluationRules;
          console.log(this.assignments)
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
    },
    onEditorReady(editor) { // 准备编辑器
    
  },
  onEditorBlur(){}, // 失去焦点事件
  onEditorFocus(){}, // 获得焦点事件
  onEditorChange(){}, // 内容改变事件
  },
  computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    },

  created() {
    // 监听AwesomeVueStarRating组件的input事件
    this.$on('input', this.handleStarChange);
  },
    
};
</script>


<style scoped>
.task-details {
  margin: 20px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.task-id {
  font-size: 16px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.details-box {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  align-items: baseline; /* 调整为baseline以确保label和content对齐 */
}

.detail-label {
  font-weight: bold;
  margin-right: 1px;
}

.detail-content {
  font-size: 16px;
  margin-bottom: 1px;
}

.long-text {
  white-space: pre-line; /* 防止提交内容过长时换行 */
  line-height: 1.5; /* 调整行距 */
}

.detail-item {
  display: flex;
  align-items: baseline;
  margin-bottom: 5px; /* 减小间距，可以根据需要进行调整 */
}

.detail-label {
  font-weight: bold;
  margin-right: 10px;
  margin-bottom: 2px; /* 减小间距，可以根据需要进行调整 */
}

.detail-content {
  font-size: 16px;
  margin-bottom: 2px; /* 减小间距，可以根据需要进行调整 */
  flex: 3;
}

/* 添加样式 */
.submit-button {
  background-color: #4CAF50; /* 设置背景颜色 */
  color: white; /* 设置文字颜色 */
  padding: 10px 20px; /* 设置内边距 */
  font-size: 16px; /* 设置文字大小 */
  border: none; /* 移除边框 */
  border-radius: 5px; /* 设置边框圆角 */
  cursor: pointer; /* 添加鼠标悬停效果 */
}

.submit-button:hover {
  background-color: #45a049; /* 悬停时的背景颜色 */
}


</style>