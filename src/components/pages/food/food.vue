<template>
	<transition name="move">
		<div class="food" v-show="showFlag" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image">
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{ food.name }}</h1>
					<div class="detail">
						<span class="sell-count">月售{{ food.sellCount }}份</span>
						<span class="rating">好评率{{ food.rating }}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{ food.price }}</span><span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<v-cartcontral :food="food"></v-cartcontral>
					</div>
					<transition name="fade">
						<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
					</transition>
				</div>
				<v-split v-show="food.info"></v-split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{ food.info }}</p>
				</div>
				<v-split></v-split>
				<div class="rating">
					<div class="title">商品评价</div>
					<v-ratingselect 
						:select-type="selectType"
						:only-content="onlyContent"
						:desc="desc"
						:ratings="food.ratings"
						v-on:select="select"
						v-on:toggleCotent="toggleCotent"
					>
					</v-ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
								<div class="user">
									<span class="name">{{ rating.username }}</span>
									<img :src="rating.avatar" width="12" height="12" class="avatar">
								</div>
								<div class="time">{{ rating.rateTime | formatDate }}</div>
								<div class="text">
									<span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}"></span>
									{{ rating.text }}
								</div>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
// 导入的是一个function
import {formatDate} from '@/utils/formatDate';
import CartContral from '@/components/common/cartcontrol/cartcontrol';
import Split from '@/components/common/split/split';
import RatingSelect from '@/components/common/ratingselect/ratingselect';

const ALL = 2;// 全部

export default{
	props: {
		food: {
			type: Object
		}
	},
	data() {
		return {
			showFlag: false,
			selectType: ALL,
			onlyContent: false,
			desc: {
				all: '全部',
				positive: '推荐',
				negative: '吐槽'
			}
		}
	},
	methods: {
		show() {
			this.showFlag = true;
			// 将ratingselect组件置为初始化
			this.selectType = ALL;
			this.onlyContent = false;
			this.$nextTick(()=>{
				if(!this.scroll){
					this.scroll = new BScroll(this.$refs.food, {
						click: true
					});
				}else{
					this.scroll.refresh();
				}
			});
		},
		hide() {
			this.showFlag = false;
		},
		addFirst(event) {
			if(!event._constructed){
				return;
			}
			// TODO: 抛物线小球动画，会在点击的时候添加一个display:none;这个时候会不好找到小球这个元素来进行计算
			// 解决办法：可以让“加入购物车”添加一个动画
			// 第一次可能没有传入的food
			Vue.set(this.food, 'count', 1);
		},
		needShow(type, text){
			// 只看有内容的评价并且没有文本
			if(this.onlyContent && !text){
				return false;
			}
			if(this.selectType === ALL){
				return true;
			}else{
				return type === this.selectType;
			}
		},
		select(type) {
			this.selectType = type;
			// 没有产生DOM的更新，所以refresh时是不会重新计算高度的，要使用$nextTick
			this.$nextTick(()=>{
				this.scroll.refresh();
			});
		},
		toggleCotent(onlyContent){
			this.onlyContent = onlyContent;
			this.$nextTick(()=>{
				this.scroll.refresh();
			});
		}
	},
	components: {
		'v-cartcontral': CartContral,
		'v-split': Split,
		'v-ratingselect': RatingSelect
	},
	filters: {
		formatDate(time) {
			// 将时间戳转换成一个date的类型的对象
			let date = new Date(time);
			// 添加一个函数，可以穿入转换格式
			// 将formatDate这个方法抽象成一个模块，放在utils中作为工具类
			return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.food{
	position: fixed;
	left: 0;
	top: 0;
	bottom: 1.28rem;
	z-index: 30;
	width: 100%;
	background: #fff;
	transition: all 0.2s linear;
	transform: translate3d(0, 0, 0);
	&.move-enter,&.move-leave-to{
		transform: translate3d(100%, 0, 0);
	}
	.image-header{
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 100%;/* 相对于盒子的宽度去计算，宽高相等 */
		img{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.back{
			position: absolute;
			top: 0.266667rem;
			left: 0;
			.icon-arrow_lift{
				display: block;
				padding: 0.266667rem;
				font-size: 0.533333rem;
				color: #fff;
			}
		}
	}
	.content{
		position: relative;
		padding: 0.48rem;
		.title{
			line-height: 0.373333rem;
			margin-bottom: 0.213333rem;
			font-size: 0.373333rem;
			font-weight: 700;
			color: rgb(7, 17, 27);
		}
		.detail{
			margin-bottom: 0.48rem;
			line-height: 0.266667rem;
			height: 0.266667rem;
			font-size: 0;
			.sell-count, .rating{
				font-size: 0.266667rem;
				color: rgb(147, 153, 159);
			}
			.sell-count{
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
			right: 0.32rem;
			bottom: 0.32rem;
		}
		.buy{
			position: absolute;
			right: 0.48rem;
			bottom: 0.48rem;
			z-index: 10;
			height: 0.64rem;
			line-height: 0.64rem;
			padding: 0 0.32rem;
			box-sizing: border-box;
			font-size: 0.266667rem;
			border-radius: 0.32rem;
			color: #fff;
			background: rgb(0, 160, 220);
			transition: all 0.2s;
			opacity: 1;
			&.fade-enter,&.fade-leave-to{
				opacity: 0;
			}
		}
	}
	.info{
		padding: 0.48rem;
		.title{
			line-height: 0.373333rem;
			font-size: 0.373333rem;
			margin-bottom: 0.16rem;
			color: rgb(7, 17, 27);
		}
		.text{
			line-height: 0.64rem;
			padding: 0 0.213333rem;
			font-size: 0.32rem;
			color: rgb(77, 85, 93);
		}
	}
	.rating{
		padding-top: 0.48rem;
		.title{
			line-height: 0.373333rem;
			font-size: 0.373333rem;
			margin-left: 0.48rem;
			color: rgb(7, 17, 27);
		}
		.rating-wrapper{
			padding: 0 0.48rem;
			.rating-item{
				position: relative;
				padding: 0.426667rem 0;
				@include border-1px(rgba(7, 17, 27, 0.1));
				.user{
					position: absolute;
					right: 0;
					top: 0.426667rem;
					font-size: 0;
					line-height: 0.32rem;
					.name{
						display: inline-block;
						vertical-align: top;
						margin-right: 0.16rem;
						font-size: 0.266667rem;
						color: rgb(147, 153, 159);
					}
					.avatar{
						border-radius: 50%;
					}
				}
				.time{
					margin-bottom: 0.16rem;
					line-height: 0.32rem;
					font-size: 0.266667rem;
					color: rgb(147, 153, 159);
				}
				.text{
					line-height: 0.426667rem;
					font-size: 0.32rem;
					color: rgb(7, 17, 27);
					.icon-thumb_up, .icon-thumb_down{
						margin-right: 0.106667rem;
						line-height: 0.426667rem;
						font-size: 0.32rem;
					}
					.icon-thumb_up{
						color: rgb(0, 160, 220);
					}
					.icon-thumb_down{
						color: rgb(147, 153, 159);
					}
				}
			}
		}
		.no-rating{
			padding: 0.426667rem 0;
			font-size: 0.32rem;
			color: rgb(147, 153, 159);
		}
	}
}
</style>
