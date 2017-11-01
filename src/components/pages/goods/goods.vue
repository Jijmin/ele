<template>
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,$index) in goods" class="menu-item" :class="{'current':currentIndex===$index}" @click="selectMenu($index,$event)">
					<span class="text border-1px">
						<span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>{{ item.name }}
					</span>
				</li>
			</ul>
			</div>
			<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li class="food-list food-list-hook" v-for="item in goods">
					<h1 class="title">{{ item.name }}</h1>
					<ul>
						<li class="food-item border-1px" v-for="food in item.foods" @click="selectFood(food, $event)">
							<div class="icon">
								<img :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{ food.name }}</h2>
								<p class="desc">{{ food.description }}</p>
								<div class="extra">
									<span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{ food.price }}</span><span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<v-cartcontral :food="food" v-on:cartadd="_drop"></v-cartcontral>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
			</div>
		<v-shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
		<v-food :food="selectedFood" ref="food"></v-food>
		</div>
</template>

<script>
import ShopCart from '@/components/pages/shopcart/shopcart';
import Food from '@/components/pages/food/food';
import CartContral from '@/components/common/cartcontrol/cartcontrol';
import BScroll from 'better-scroll';

const ERR_OK = 0;
export default{
	props: {
		seller: {
			type: Object
		}
	},
	components: {
		'v-shopcart': ShopCart,
		'v-cartcontral': CartContral,
		'v-food': Food
	},
	data() {
		return {
			goods: [],
			listHeight: [],
			scrollY: 0,
			selectedFood: {}
		};
	},
	computed:{
		currentIndex() {
			for(let i = 0; i< this.listHeight.length; i++){
				// 计算出高度差
				let height1 = this.listHeight[i];
				let height2 = this.listHeight[i + 1];
				// 根据高度差返回页面一个索引值
				if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
					return i;
				}
			}
			return 0;
		},
		selectFoods() {
			let foods = [];
			this.goods.forEach((good) => {
				good.foods.forEach((food) => {
					if(food.count){
						foods.push(food);
					}
				});
			});
			return foods;
		}
	},
	created() {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		this.$http.get('/api/goods').then((response)=>{
			response = response.body;
			if(response.errno === ERR_OK){
				this.goods = response.data;
				// Vue更改数据是异步加载，通过nextTick去初始化scroll
				this.$nextTick(()=>{
					// 初始化better-scroll
					this._initScroll();
					// 计算高度
					this._calculateHeight();
				});
			}
		});
	},
	methods: {
		selectMenu(index, event) {
			// 左侧菜单栏和右侧进行点击时联动
			if(!event._constructed){// 如果pc端，就不需要派发这个事件
				return;
			}
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
			let el = foodList[index];
			this.foodsScroll.scrollToElement(el, 300);
		},
		_initScroll() {
			// 滚动初始化，使用$els获取到DOM上的v-el元素，better-scroll默认是屏蔽了点击事件的，设置为true会派发事件
			this.menuScroll = new BScroll(this.$refs.menuWrapper, {
				click: true
			});
			// probeType: 3 滚动的时候实时告诉我们滚动的位置
			this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
				click: true,
				probeType: 3
			});
			// 监听一个滚动事件
			this.foodsScroll.on('scroll', (pos)=>{
				// 将滚动的值存入scrollY中
				this.scrollY = Math.abs(Math.round(pos.y));
			});
		},
		_calculateHeight() {
			// 获取到高度，获取到li，一个分类的元素
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
			let height = 0;
			this.listHeight.push(height);
			for(let i = 0; i < foodList.length; i++){
				let item = foodList[i];
				// 计算高度
				height += item.clientHeight;
				// 将每个分类中的高度添加进数组中
				this.listHeight.push(height);
			}
		},
		_drop(target) {
			// ref获取到子组件，调用子组件的drop方法
			// 体验优化，异步执行下落动画
			this.$nextTick(()=>{
				this.$refs.shopcart.drop(target);
			});
		},
		selectFood(food, event) {
			if(!event._constructed){// 如果pc端，就不需要派发这个事件
				return;
			}
			this.selectedFood = food;
			// 调用子组件方法
			this.$refs.food.show();
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.goods{
	display: flex;
	position: absolute;
	top: 4.64rem;
	bottom: 1.226667rem;
	width: 100%;
	overflow: hidden;
	.menu-wrapper{
		flex: 0 0 2.133333rem;
		width: 2.133333rem;
		background: #f3f5f7;
		.menu-item{
			display: table;
			height: 1.44rem;
			width: 1.493333rem;
			padding: 0 0.32rem;
			line-height: 0.373333rem;
			&.current{
				position :relative;
				z-index: 10;
				margin-top: -0.013333rem;
				background: #fff;
				font-weight: 700;
				.text{
					@include border-none();
				}
			}
			.icon{
				display: inline-block;
				vertical-align: top;
				width: 0.32rem;
				height: 0.32rem;
				margin-right: 0.053333rem;
				background-size: 0.32rem 0.32rem;
				background-repeat: no-repeat;
				&.decrease{
					@include bg-image('decrease_3');
				}
				&.discount{
					@include bg-image('discount_3');
				}
				&.special{
					@include bg-image('special_3');
				}
				&.invoice{
					@include bg-image('invoice_3');
				}
				&.guarantee{
					@include bg-image('guarantee_3');
				}
			}
			.text{
				display: table-cell;
				width: 1.493333rem;
				vertical-align: middle;
				@include border-1px(rgba(7, 17, 27, 0.1));
				font-size: 0.32rem;
			}
		}
	}
	.foods-wrapper{
		flex: 1;
		.title{
			padding-left: 0.373333rem;
			height: 0.693333rem;
			line-height: 0.693333rem;
			border-left: 2px solid #d9dde1;
			font-size: 0.32rem;
			color: rgb(147, 153, 159);
			background: #f3f5f7;
		}
		.food-item{
			display: flex;
			margin: 0.48rem;
			padding-bottom: 0.48rem;
			@include border-1px(rgba(7, 17, 27, 0.1));
			&:last-child{
				@include border-none();
				margin-bottom: 0;
			}
			.icon{
				flex: 0 0 1.52rem;
				margin-right: 0.266667rem;
				img{
					width: 1.52rem;
					height: 1.52rem;
				}
			}
			.content{
				flex: 1;
				.name{
					margin: 0.053333rem 0 0.213333rem 0;
					line-height: 0.373333rem;
					height: 0.373333rem;
					font-size: 0.373333rem;
					color: rgb(7, 17, 27);
				}
				.desc, .extra{
					line-height: 0.266667rem;
					font-size: 0.266667rem;
					color: rgb(147, 153, 159);
				}
				.desc{
					margin-bottom: 0.213333rem;
					line-height: 0.32rem;
				}
				.extra{
					.count{
						margin-right: 0.32rem;
					}
				}
				.price{
					font-weight: 700;
					line-height: 0.64rem;
					.now{
						margin-right: 16px;
						font-size: 0.373333rem;
						color: rgb(240, 20, 20);
					}
					.old{
						text-decoration: line-through;
						font-size: 0.266667rem;
						color: rgb(147, 153, 159);
					}
				}
				.cartcontrol-wrapper{
					position: absolute;
					right: 0;
					bottom: 0.32rem;
				}
			}
		}
	}
}
</style>
