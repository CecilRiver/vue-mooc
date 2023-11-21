## vue-pithy-rate 评分组件重构

### vue-pithy-rate@0.1.3 发现在vue3中使用不了，因为是2年前编写的组件库，使用webpack进行打包构建，可能一些构建上的语法不兼容vue3，这次重构就用了rollup进行打包构建，进测试，兼容vue2和vue3，且包体积减少了。

### vue-pithy-calendar@0.1.2

**下载**

```bash
npm i vue-pithy-rate@0.1.3 -D
```

**引入**
```js
//main.js
import VuePithyRate from 'vue-pithy-rate'

import 'vue-pithy-rate/dist/vue-pithy-rate.css'

Vue.use(VuePithyRate)
```

**使用**
```js
//vue2
<template>
  <div id="app">
    <!-- 可评分，显示分数 -->
     <vue-pithy-rate :score.sync="score" showScore      @handleUpdateScore="handleUpdateScore"/>
    <!-- 只读，不显示分数 -->
    <vue-pithy-rate :score="1.5" disabled />
    <!-- 只读，显示分数 -->
    <vue-pithy-rate :score="3.6" disabled showScore />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      score: 0,
    };
  },
    methods:{
        handleUpdateScore(scoreNum){
        this.score = scoreNum
       }
    }
};
</script>

<style>
</style>
```


## 重构版本

### vue-pithy-rate@latest

**下载**

```bash
npm i vue-pithy-rate@latest -D
```

**使用**
```js
//vue3
<template>
    <div>
         <!-- 可评分，显示分数 -->
     <i class="iconfont icon-star-half"></i>
     <vue-pithy-rate :score="score" :star-size="20" showScore @handleUpdateScore="handleUpdateScore"/>
    <!-- 只读，不显示分数 -->
    <vue-pithy-rate :score="1.5" disabled />
    <!-- 只读，显示分数 -->
    <vue-pithy-rate :score="3.6" disabled showScore />
    </div>
</template>
<script>
import {  ref } from 'vue'

import VuePithyRate from 'vue-pithy-rate'
const score = ref(0)

const handleUpdateScore = (scoreNum)=>{
  score.value = scoreNum
}
</script>

```

说明：

|  参数名   |  类型   | 是否必传 |                 说明                  |    默认    |
| :-------: | :-----: | :------: | :-----------------------------------: | :-----:  |
|   score   | Number  |    是    |      分数 ，保留一位小数       | 0 |
| disabled  | Boolean |    否    | 是否只读，鼠标点击可以打分 | false |
| showScore | Boolean |    否    |        是否显示分数      | false |
| starColor | String |    否    |        星星颜色    | #000 | 
| starSize | Number |    否    |        星星大小    |  16 |
| scoreColor | String |    否    |        评分颜色    |  #000 |



效果：

![](https://i.loli.net/2021/05/11/B3QyHCUxEe9cji4.png)