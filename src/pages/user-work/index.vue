<template>
    <div>
        <template>
            <el-card class="assignment-info">
                <div slot="header" class="clearfix">
                <span>{{ assignment.title }}</span>
                </div>
                <div slot="header" class="clearfix">
                <span>{{ courseName }}</span>
                </div>
                <div v-html="assignment.description" class="assignment-content"></div>
                <div class="assignment-due-date">
                截止日期: {{ new Date(assignment.dueDate).toLocaleString() }}
                </div>
                <div class="assignment-start-date">
                开始日期: {{ new Date(assignment.startDate).toLocaleString() }}
                </div>
            </el-card>
        </template>

        <div> <!-- 添加一个根元素来包裹所有内容 -->
            <quill-editor 
                class="ql-editor"
                v-model="content" 
                ref="myQuillEditor" 
                :options="editorOption" 
                @blur="onEditorBlur($event)" 
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
                @ready="onEditorReady($event)">
            </quill-editor>

            <el-upload
                name="file"
                action="http://localhost:88/courese"
                v-show="false"
                class="avatar-uploader"
                :data='fileUpload'
                :show-file-list="false"
                :http-request="onUploadHandler"
            >
            </el-upload>

            <el-upload
                name="fileUp"
                action="http://localhost:88/courese"
                v-show="false"
                class="uploadFile"
                :data='file'
                :show-file-list="false"
                :http-request="handleFileSuccess"
            >
            </el-upload>
        </div>
        <div class="button-container">
            <el-button v-if="!isSubmitted && isStartDatePassed && !isDueDatePassed" 
                    type="primary" 
                    size="medium" 
                    @click="submitAssignment">
            提交作业
            </el-button>
            <span v-else-if="!isStartDatePassed">未开始</span>
            <span v-else-if="isSubmitted">已提交</span>
            <span v-else>已结束</span>
        </div>
    </div>
</template>
    <script>
    
   
    import { imageUp,getAss,postAss,postSub } from '../../api/work';
    import { mapGetters } from 'vuex'
    import { mapMutations } from 'vuex'
    import { Quill } from 'vue-quill-editor';
    import { getLessonDetail } from '../../api/lesson';
    // 自定义插入a链接
    var Link = Quill.import('formats/link');
    class FileBlot extends Link {  // 继承Link Blot
        static create(value) {
        let node = undefined
        if (value&&!value.href){  // 适应原本的Link Blot
            node = super.create(value);
        }
        else{  // 自定义Link Blot
            node = super.create(value.href);
            // node.setAttribute('download', value.innerText);  // 左键点击即下载
            node.innerText = value.innerText;
            node.download = value.innerText;
        }
        return node;
        }
    }
    FileBlot.blotName = 'link';
    FileBlot.tagName = 'A';
    Quill.register(FileBlot);


    
    export default {
        data() {
            return {
            isSubmitted: false,
            courseName:"",
             assignment: {
                assignmentId: null,
                courseId: null,
                title: "",
                description: "",
                dueDate: "",
                categoryId: null,
                startDate:"",

            },
             fileUpload:{},
             file:{},
             content: ``, //双向数据绑定数据
             // 富文本编辑器配置
             editorOption: {
             modules: {
                 toolbar: {
                     container: [
                        ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
                        ['blockquote', 'code-block'], // 引用  代码块
                        [{ header: 1 }, { header: 2 }], // 1、2 级标题
                        [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
                        [{ script: 'sub' }, { script: 'super' }], // 上标/下标
                        [{ indent: '-1' }, { indent: '+1' }], // 缩进
                        [{ direction: 'rtl' }], // 文本方向
                        [{ size: ['12', '14', '16', '18', '20', '22', '24', '28', '32', '36'] }], // 字体大小
                        [{ header: [1, 2, 3, 4, 5, 6] }], // 标题
                        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                        // [{ font: ['songti'] }], // 字体种类
                        [{ align: [] }], // 对齐方式
                        ['clean'], 
                        ['image', 'video'], // 链接、图片、视频
                        ['addBtn'],
                    ],
                    handlers: {
                        'image': function (value) {
                            if (value) { // value === true
                            document.querySelector('.avatar-uploader input').click()
                            } else {
                            this.quill.format('image', false)
                            }
                        },
                        addBtn: (value => {
                            if (value) {
                            document.querySelector('.uploadFile input').click()
                            }
                        })
                    }
                    }
                },
                
                placeholder: '请输入正文'
            }
              }
                },
        props: {
            assignmentId: {
                type: String,
                required: true
            }
        },
        mounted () {
            const addBtn = document.querySelector('.ql-addBtn');
            if (addBtn) {
                addBtn.innerHTML = '上传'
                addBtn.style.width = '100px';
            }
        },
        computed: {
            isDueDatePassed() {
                const now = new Date();
                const dueDate = new Date(this.assignment.dueDate);
                return now > dueDate;
            },
            isStartDatePassed() {
                const now = new Date();
                const startDate = new Date(this.assignment.startDate); 
                return now >= startDate;
            },
            ...mapGetters(['userInfo','token']),
        },
        
        methods: {
            // 失去焦点事件
            onEditorBlur(quill) {
                console.log('editor blur!', quill)
            },
            // 获得焦点事件
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            // 准备富文本编辑器
            onEditorReady(quill) {
                console.log('editor ready!', quill)
            },
            // 内容改变事件
            onEditorChange({ quill, html, text }) {
                console.log('editor change!', quill, html, text)
                this.content = html
            },
            async onUploadHandler(file) {
                const func = imageUp;
                func(file).then( res => {
                    console.log(res)
                    let { code, imageUrl , msg} = res.data
                    //const imageUrl = res.data.imageUrl
                    console.log(imageUrl)
    
                    // 获取光标所在位置
                    let quill = this.$refs.myQuillEditor.quill
                    let length = quill.getSelection().index
                    // 插入图片  
                    quill.insertEmbed(length, 'image', imageUrl)
                    //quill.insertEmbed(length, 'image', 'http://154.8.177.155:8189/group1/M00/00/00/CgAIAmVW3gWAXCDYAAOEiL785KY295.jpg')
                    // 调整光标到最后
                    quill.setSelection(length + 1)
                    
                    console.log(this.content)
                }
                )
    
            },
            handleFileSuccess (file) {  
                const func = imageUp;
                func(file).then( res => {
                    console.log(res)
                    let { code, imageUrl , msg} = res.data
                    //const imageUrl = res.data.imageUrl
                    console.log(imageUrl)
                    console.log(file.file)
    
                    let fileNameLength = file.file.name.length
                    // 插入链接
                    let quill = this.$refs.myQuillEditor.quill
                    let length = quill.getSelection().index;
                    quill.insertEmbed(length, 'link', {href:imageUrl, innerText:file.file.name}, "api")
                    quill.setSelection(length + fileNameLength)
                    
                    console.log(this.content)
                }
                )     
                
            },
            loadAssignment(assignmentId) {
                const func = getAss;
                console.log(assignmentId)
                func(assignmentId).then(res => {
                    console.log(res.data.assignments)
                    this.assignment.assignmentId=res.data.assignments.assignmentId
                    this.assignment.title=res.data.assignments.title
                    this.assignment.description=res.data.assignments.description
                    this.assignment.dueDate=res.data.assignments.dueDate
                    this.assignment.startDate=res.data.assignments.startDate
                    this.assignment.courseId=res.data.assignments.courseId
                    const func2 = getLessonDetail
                    func2(res.data.assignments.courseId).then(res => {
                        this.courseName=res.data.courses.courseName
                    })
                    
                })
            },
            ...mapMutations('login', {
                'setUserInfo': 'SET_USER_INFO',
                'setShowLogin': 'SET_SHOW_LOGIN',
                'setToken':'SET_TOKEN',
            }),
            submitAssignment() {
                console.log(this.assignment.assignmentId)
                const params ={
                    assignmentId: this.assignment.assignmentId, // 作业ID
                    userId: this.userInfo.userId,      // 用户ID
                    content: this.content,       // 提交内容
                    submissionDate: new Date(), // 提交日期
                    similarityScore: null, // 相似度得分
                    preliminaryScore: null // 初步评分
                }
                const func = postSub;
                func(params).then(res => {
                    console.log(res)
                    if(res.status==200){
                        this.$message.success('提交成功')
                        this.isSubmitted=true;
                    }else{
                        this.$message.error('提交失败')
                    }
                    
                })
            }
        },
        created() {
            this.loadAssignment(this.assignmentId);
        },
    }
    </script>
    <style lang="stylus" scoped>
    .uploadFile{
        width: 0;
        height: 0;
        display: none;
    }
 
    .ql-upload{
        background: url("/src/assets/images/upload.svg") !important;
        background-size: 20px 20px !important;
        background-position: center center !important;
        background-repeat:no-repeat !important;
      }
      .assignment-info {
        width: 100%;
        margin-bottom: 20px;
        padding: 10px;
      }
      
      .assignment-content {
        max-width: 100%; /* 宽度最大不超过其父容器宽度 */
        max-height: 400px; /* 假设我们设置中等大小的高度为400px */
        overflow: auto; /* 如果内容超出则显示滚动条 */
        margin: auto; /* 水平居中（如果需要） */
        padding: 10px; /* 内填充，使内容不紧贴边缘 */
      }
      
      /* 如果需要图片也响应容器大小 */
      .assignment-content img {
        max-width: 100%;
        height: auto;
      }
      
      .assignment-due-date {
        margin-top: 20px;
      }
    .button-container {
        display: flex;
        justify-content: center; /* 水平居中 */
        margin-top: 20px; /* 或者您所需的任何间距 */
      }
      
    </style>
    