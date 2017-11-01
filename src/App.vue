<template>
  <div id="app">
  	<v-header :seller="seller"></v-header>
  	<nav class="tab border-1px">
  		<router-link to="/goods">商品</router-link>
  		<router-link to="/ratings">评价</router-link>
  		<router-link to="/sellers">商家</router-link>
  	</nav>
  	<router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import Header from '@/components/common/header/header';

const ERR_OK = 0;

export default {
  name: 'app',
  data() {
    return {
      seller: {}
    }
  },
  created() {
    // 通过ajax获取数据
    this.$http.get('/api/seller').then((response) => {
      // 将数据解析为Object格式
      response = response.body;
      if(response.errno === ERR_OK){
        // 将数据传递给seller
        this.seller = response.data;
      }
    });
  },
  components: {
    'v-header': Header
  }
};
</script>

<style lang="scss" scoped>
@import "../static/css/index.scss";
.tab{
	display: flex;
  height: 1.066667rem;
  line-height: 1.066667rem;
	text-align: center;
  @include border-1px(rgba(7, 17, 27, 0.2));
	a{
    display: inline-block;
    flex: 1;
    font-size: 0.32rem;
		color: rgb(77, 85, 93);
    &.router-link-active{
      color: rgb(240, 20, 20);
    }
	}
}
</style>
