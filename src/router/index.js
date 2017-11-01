import Vue from 'vue';
import VueResource from 'vue-resource';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import Router from 'vue-router';
import Goods from '@/components/pages/goods/goods';
import Ratings from '@/components/pages/ratings/ratings';
import Sellers from '@/components/pages/sellers/sellers';

Vue.use(Router);
Vue.use(VueResource);
Vue.use(VueAwesomeSwiper);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'goods'
      }
    },{
      path: '/goods',
      name: 'goods',
      component: Goods
    },{
      path: '/ratings',
      name: 'ratings',
      component: Ratings
    },{
      path: '/sellers',
      name: 'sellers',
      component: Sellers
    }
  ]
})
