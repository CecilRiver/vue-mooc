<template>
  <div class="course-nav">
    <dl>
      <dt>分类：</dt>
      <dd
        v-for="(item, index) in list"
        :key="item.categoryId"
        :class="{ active: index === categoryIndex }"
        @click="handleNavClick('category', index)"
      >
        {{ item.categoryName }}
      </dd>
    </dl>

    <dl>
      <dt>难度：</dt>
      <dd
        v-for="(diff, index) in diffList"
        :key="index"
        :class="{ active: index === diffIndex }"
        @click="handleNavClick('diff', index)"
      >
        {{ diff.title }}
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      categoryIndex: 0,
      diffIndex: 0,
      categoryList:[],
      diffList: [
        { title: '全部', code: '' },
        { title: '入门', code: 0 },
        { title: '初级', code: 1 },
        { title: '中级', code: 2 },
        { title: '高级', code: 3 },
      ],
    };
  },
  methods: {
    // 导航点击事件
    handleNavClick(type, index) {
      switch (type) {
        case 'category':
          this.categoryIndex = index;
          console.log(index);
          break;
        case 'diff':
          this.diffIndex = index;
          break;
      }
      this.$emit('update:params', this.emitParams);
    },
  },


  mounted() {
  // 创建类似于diffList的数据结构
  this.categoryList = this.list.map(item => {
    return {
      title: item.categoryName,
      code: item.categoryId
    };
  });
},




  computed: {
    currentLabels() {
      let ret = this.list.slice();
      ret.unshift({
        categoryName: '全部',
      });
      return ret;
    },
    emitParams() {
     // const category = this.currentLabels[this.categoryIndex].categoryName;
      const category = this.categoryList[this.categoryIndex];
      const diff = this.diffList[this.diffIndex];
      console.log(category.title)
      return {
        category: category.title === '全部' ? '' : category.code,
        diff: diff.title === '全部' ? '' : diff.code,
      };
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import '~assets/stylus/variables.styl';
  .course-nav
    dl
      position: relative;
      padding: 16px 0 10px 52px;
      border-bottom: 1px solid $border-three-color;
      font-size: 14px;
      dt
        position: absolute;
        left: 0;
        top: 22px;
        color: $font-first-color;
        font-weight: 700;
      dd
        display: inline-block;
        padding: 0 10px;
        margin: 0 5px 10px 0;
        height: 30px;
        line-height: 30px;
        color: $font-first-color;
        cursor: pointer;
        &.active
          background-color: rgba(242,13,13,.06);
          border-radius: 6px;
          color: $theme-red-color;
          font-weight: 700;
        &:hover
          color: $theme-red-color;
</style>