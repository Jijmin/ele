<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="[totalCount > 0 ? 'highlight' : '']">
							<i class="icon-shopping_cart" :class="[totalCount > 0 ? 'highlight' : '']"></i>
						</div>
						<div class="num" v-show="totalCount > 0 ">{{ totalCount }}</div>
					</div>
					<div class="price" :class="[totalPrice > 0 ? 'highlight' : '']">￥{{ totalPrice }}元</div>
					<div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
				</div>
				<div class="content-right" @click="pay">
					<div class="pay" :class="payClass">{{ payDesc }}</div>
				</div>
			</div>
			<div class="ball-container">
				<transition
					name="drop" 
					v-for="ball in balls"
					key="ball"
					@before-enter="beforeEnter"
					@enter="enter"
					@after-enter="afterEnter"
					>
					<div v-show="ball.show" class="ball">
								zzzzzzz
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click.stop.prevent="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{ food.name }}</span>
								<div class="price">
									<span>￥{{ food.price*food.count }}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<v-cartcontral :food="food"></v-cartcontral>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>

<script>
import BScroll from 'better-scroll';
import CartContral from '@/components/common/cartcontrol/cartcontrol';
export default{
	props: {
		selectFoods: {
			type: Array,
			default() {
				return [];
			}
		},
		deliveryPrice: {
			type: Number,
			default: 0
		},
		minPrice: {
			type:Number,
			default: 0
		}
	},
	data() {
		return {
			balls: [
				{
					show: false
				},{
					show: false
				},{
					show: false
				},{
					show: false
				},{
					show: false
				}
			],
			dropBalls: [],
			fold: true
		}
	},
	computed: {
		totalPrice() {
			let total = 0;
			//对从goods组件中传递过来的selectFoods数组进行遍历
			this.selectFoods.forEach((food)=>{
				total += food.price * food.count;
			});
			return total;
		},
		totalCount() {
			// 计算选择商品的总数量
			let count = 0;
			this.selectFoods.forEach((food)=>{
				count += food.count;
			});
			return count;
		},
		payDesc() {
			if(this.totalPrice === 0){
				return `￥${this.minPrice}元起送`;
			}else if(this.totalPrice < this.minPrice){
				let diff = this.minPrice - this.totalPrice;
				return `还差￥${diff}元起送`;
			}else{
				return '去结算';
			}
		},
		payClass() {
			if(this.totalPrice < this.minPrice){
				return 'not-enough';
			}else{
				return 'enough';
			}
		},
		listShow() {
			if(!this.totalCount){
				this.fold = true;
				return false;
			}
			let show = !this.fold;
			// 只要显示的情况才有滑动
			if(show){
				this.$nextTick(()=>{
					if(!this.scroll){
						this.scroll = new BScroll(this.$refs.listContent, {
							click: true
						});
					}else{
						this.scroll.refresh();
					}
				});
			}
			return show;
		}
	},
	methods: {
		drop(el) {
			// 对小球下落处理
			for(let i = 0; i < this.balls.length; i++){
				let ball = this.balls[i];
				if(!ball.show){// false将小球取出来
					ball.show = true;
					ball.el = el;
					// 小球已经下来了，存储在dropBalls中
					this.dropBalls.push(ball);
					return;
				}
			}
		},
		beforeEnter(el) {
			// TODO: 小球下落问题
			let count = this.balls.length;
			while (count--) {
				let ball = this.balls[count];
				// 为true的小球
				if(ball.show){
					// 获取到元素相当于视口的位置
					let rect = ball.el.getBoundingClientRect();
					// 计算差值
					let x = rect.left - 64;
					let y = -(window.innerHeight - rect.top - 44);
					// 设置初始位置
					el.style.display = '';
					el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
					el.style.transform = `translate3d(0, ${y}px, 0)`;
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
					inner.style.transform = `translate3d(${x}px, 0, 0)`;
				}
			}
		},
		enter(el, done) {
			/* eslint-disable no-unused-vars */
			// 获取到偏移量
			let rf = el.offsetHeight;
			// 改变DOM元素样式
			this.$nextTick(()=>{
				el.style.webkitTransform = 'translate3d(0, 0, 0)';
				el.style.transform = 'translate3d(0, 0, 0)';
				let inner = el.getElementsByClassName('inner-hook')[0];
				inner.style.webkitTransform = 'translate3d(0, 0, 0)';
				inner.style.transform = 'translate3d(0, 0, 0)';
			});
			done();
		},
		afterEnter(el) {
			let ball = this.dropBalls[0];
			// 将小球重置
			ball.show = false;
			el.style.display = 'none';
		},
		toggleList() {
			if(!this.totalCount){
				return;
			}
			this.fold = !this.fold;
		},
		empty() {
			this.selectFoods.forEach((food)=>{
				food.count = 0;
			});
		},
		hideList() {
			this.fold = true;
		},
		pay() {
			if(this.totalPrice < this.minPrice){
				return;
			}
			window.alert(`支付${this.totalPrice}元`);
		}
	},
	components: {
		'v-cartcontral': CartContral
	}
};
</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.shopcart{
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 50;
	width: 100%;
	height: 1.306667rem;
	.content{
		display: flex;
		background: #141d27;
		color: rgba(255, 255, 255, 0.4);
		.content-left{
			flex: 1;
			.logo-wrapper{
				display: inline-block;
				position: relative;
				top: -0.266667rem;
				margin: 0 0.32rem;
				padding: 0.16rem;
				width: 1.493333rem;
				height: 1.493333rem;
				box-sizing: border-box;
				vertical-align: top;
				border-radius: 50%;
				background: #141d27;
				.logo{
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background: #2b343c;
					text-align: center;
					&.highlight{
						background: rgb(0, 160, 220);
					}
					.icon-shopping_cart{
						line-height: 1.173333rem;
						font-size: 0.64rem;
						color: #80858a;
						&.highlight{
							color: #fff;
						}
					}
				}
				.num{
					position: absolute;
					top: 0;
					right: 0;
					width: 0.64rem;
					height: 0.426667rem;
					line-height: 0.426667rem;
					text-align: center;
					border-radius: 0.426667rem;
					font-size: 0.24rem;
					font-weight: 700;
					color: #fff;
					background: rgb(240, 20, 20);
					box-shadow: 0 0.106667rem 0.213333rem 0 rgba(0, 0, 0, 0.4);
				}
			}
			.price{
				display: inline-block;
				vertical-align: top;
				margin-top: 0.32rem;
				line-height: 0.64rem;
				padding-right: 0.32rem;
				box-sizing: border-box;
				border-right: 1px solid rgba(255, 255, 255, 0.1);
				font-size: 0.426667rem;
				font-weight: 700;
				&.highlight{
					color: #fff;
				}
			}
			.desc{
				display: inline-block;
				vertical-align: top;
				margin: 0.32rem 0 0 0.32rem;
				line-height: 0.64rem;
			}
		}
		.content-right{
			flex: 0 0 2.8rem;
			width: 2.8rem;
			.pay{
				height: 1.28rem;
				line-height: 1.28rem;
				text-align: center;
				font-size: 0.32rem;
				font-weight: 700;
				background: #2b333b;
				&.not-enough{
					background: #2b333b;
				}
				&.enough{
					background: #00b43c;
					color: #fff;
				}
			}
		}
	}
	.ball-container{
		.ball{
			position: fixed;
			left: 0.853333rem;
			bottom: 0.586667rem;
			z-index: 200;
			transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
			&.drop-enter{
				.inner{
					width: 0.426667rem;
					height: 0.426667rem;
					border-radius: 50%;
					background: rgb(0, 160, 220);
					transition: all 0.4s linear;
				}
			}
		}
	}
	.shopcart-list{
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 100%;
		transition: all 0.5s;
		transform: translate3d(0, -100%, 0);
		&.fold-enter, &.fold-leave-to{
			transform: translate3d(0, 0, 0);
		}
		.list-header{
			height: 1.066667rem;
			line-height: 1.066667rem;
			padding: 0 0.48rem;
			background: #f3f5f7;
			border-bottom: 1px solid rgba(7, 17, 27, 0.1);
			.title{
				float: left;
				font-size: 0.373333rem;
				color: rgb(7, 17, 27);
			}
			.empty{
				float: right;
				font-size: 0.32rem;
				color: rgb(0, 160, 220);
			}
		}
		.list-content{
			padding: 0 0.48rem;
			max-height: 5.786667rem;
			overflow: hidden;
			background: #fff;
			.food{
				position: relative;
				padding: 0.32rem 0;
				box-sizing: border-box;
				@include border-1px(rgba(7, 17, 27, 0.1));
				.name{
					line-height: 0.64rem;
					font-size: 0.373333rem;
					color: rgb(7, 17, 27);
				}
				.price{
					position: absolute;
					right: 2.4rem;
					bottom: 0.32rem;
					line-height: 0.64rem;
					font-size: 0.373333rem;
					font-weight: 700;
					color: rgb(240, 20, 20);
				}
				.cartcontrol-wrapper{
					position: absolute;
					right: 0;
					bottom: 0.16rem;
				}
			}
		}
	}
}
.list-mask{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 40;
	transition: all 0.5s;
	backdrop-filter: blur(0.266667rem);
	opacity: 1;
	background: rgba(7, 17, 27, 0.6);
	&.fade-enter, &.fade-leave-to{
		opacity: 0;
		background: rgba(7, 17, 27, 0);
	}
}
</style>
