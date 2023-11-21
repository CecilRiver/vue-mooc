<template>
    <el-form ref="assignmentForm" label-width="120px" class="assignment-form">
      
      
  
      <!-- 作业标题输入 -->
      <el-form-item label="作业标题:">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
  
      <!-- 作业分数输入 -->
      <el-form-item label="作业分数:">
        <el-input-number v-model="form.score" :min="0"></el-input-number>
      </el-form-item>

      <!-- 截止日期选择 -->
      <el-form-item label="开始日期:">
        <el-date-picker v-model="form.startDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
  
      <!-- 截止日期选择 -->
      <el-form-item label="截止日期:">
        <el-date-picker v-model="form.dueDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
  
      <!-- 作业内容编辑器 -->
      <el-form-item label="作业内容:">
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
      </el-form-item>

      <el-form-item label="选择批阅方式:">
        <el-select v-model="peerForm.type" placeholder="请选择">
          <el-option label="教师批阅" value="teacher"></el-option>
          <el-option label="学生互评" value="peer"></el-option>
          <el-option label="学生自评" value="student"></el-option>
        </el-select>
      </el-form-item>

      <template v-if="peerForm.type === 'peer'">
        <el-form-item label="每人互评份数:">
            <el-input-number v-model="peerForm.peerNum" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="互评开始时间:">
            <el-date-picker 
            v-model="peerForm.startDate" 
            type="datetime" 
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="互评截止时间:">
            <el-date-picker 
            v-model="peerForm.dueDate" 
            type="datetime" 
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="互评规则:">
            <el-input v-model="peerForm.ruleDescription"></el-input>
        </el-form-item>
      </template>

      <!-- 提交按钮 -->
      <el-form-item>
        
        <el-button v-if="!isSubmitted " type="primary" size="medium" @click="submitForm">发布作业</el-button>
        <span v-else="isSubmitted">已提交</span>
        
      </el-form-item>
    </el-form>
  </template>
  
  <script>
  
  import { mapGetters } from 'vuex'
  import { imageUp,postAss,postPeerRule } from '../../api/work';
    import { mapMutations } from 'vuex'
    import { Quill } from 'vue-quill-editor';
    
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
    name: 'AssignmentCreationForm',
    
    data() {
      return {
        isSubmitted: false,
        courseID:'',
        form: {
          
          title: '',
          
          score: null,
          dueDate: '',
          startDate:'',
          description: '',
         
        },
        peerForm:{
            assignmentId:null,
            ruleDescription:'',
            type: '', // 批阅方式
            peerNum: null, // 互评分数
            startDate: '', // 互评截止日期
            dueDate:'',
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
      };
    },
    mounted () {
            const addBtn = document.querySelector('.ql-addBtn');
            if (addBtn) {
                addBtn.innerHTML = '上传'
                addBtn.style.width = '100px';
            }
    },
    computed: {
          
        ...mapGetters(['userInfo','token']),
    },
    props: {
            courseId: {
                type: String,
                required: true
            }
    },
    methods: {
      submitForm() {
        console.log(this.form);
        // 在这里添加提交表单的逻辑
        const params ={
            title:this.form.title,
            score:this.form.score,
            startDate:this.form.startDate,
            dueDate:this.form.dueDate,
            description:this.content,
            courseId:this.courseID,
        }
        const func = postAss;
        func(params).then(res => {
            
            if(res.status==200){
                
                const params2 ={
                    assignmentId:res.data.assignment.assignmentId,
                    ruleDescription:this.peerForm.ruleDescription,
                    type: this.peerForm.type, // 批阅方式
                    peerNum: this.peerForm.peerNum, // 互评分数
                    startDate: this.peerForm.startDate, // 互评截止日期
                    dueDate:this.peerForm.dueDate,
                }
                console.log(params2)
                const func2 = postPeerRule;
                func2(params2).then(res => {
                    console.log(res)
                    if(res.status==200){
                        this.$message.success('提交成功')
                        this.isSubmitted=true;
                    }else{
                        this.$message.error('提交失败')
                    }
                })
                
            }else{
                this.$message.error('提交失败')
            }
            
        })
        //console.log(this.peerForm.assignmentId)
        
      },
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
        loadCouresId(courseId){
            this.courseID= courseId
            console.log("ID",this.courseID)
        }
    },
    created() {
        this.loadCouresId(this.courseId);
        console.log(this.courseId)
    },
  };    
  </script>
  
  <style scoped>
  .assignment-form {
    width: 60%;
    margin: 0 auto;
  }
  .uploadFile{
        width: 0;
        height: 0;
        display: none;
    }
  </style>
  