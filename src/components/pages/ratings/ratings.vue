<template>
<div class="ratings" ref="ratings">
	<div class="ratings-content">
		<div class="overview">
			<div class="overview-left">
				<h1 class="score">{{ seller.score }}</h1>
				<div class="title">综合评分</div>
				<div class="rank">高于周边商家{{ seller.rankRate }}</div>
			</div>
			<div class="overview-right">
				<div class="score-wrapper">
					<span class="title">服务态度</span>
					<v-star :size="36" :score="seller.serviceScore"></v-star>
					<span class="score">{{ seller.serviceScore }}</span>
				</div>
				<div class="score-wrapper">
					<span class="title">商品评分</span>
					<v-star :size="36" :score="seller.foodScore"></v-star>
					<span class="score">{{ seller.foodScore }}</span>
				</div>
				<div class="delivery-wrapper">
					<span class="title">送达时间</span>
					<span class="delivery">{{ seller.deliveryTime }}分钟</span>
				</div>
			</div>
		</div>
		<v-split></v-split>
		<v-ratingselect 
			:select-type="selectType"
			:only-content="onlyContent"
			:desc="desc"
			:ratings="ratings"
			v-on:select="select"
			v-on:toggleCotent="toggleCotent"
		>
		</v-ratingselect>
		<div class="rating-wrapper">
			<ul>
				<li v-for="rating in ratings" class="rating-item border-1px" v-show="needShow(rating.rateType, rating.text)">
					<div class="avatar">
						<img width="28" height="28" :src="rating.avatar">
					</div>
					<div class="content">
						<h1 class="name">{{ rating.username }}</h1>
						<div class="star-wrapper">
							<v-star :size="24" :score="rating.score"></v-star>
							<span class="delivery" v-show="rating.deliveryTime">{{ rating.deliveryTime }}分钟送达</span>
						</div>
						<p class="text">{{ rating.text }}</p>
						<div class="recommend" v-show="rating.recommend && rating.recommend.length">
							<!-- TODO: 差评图标显示不出来 -->
							<i :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}"></i>
							<span v-for="item in rating.recommend" class="item">{{ item }}</span>
						</div>
						<div class="time">
							{{ rating.rateTime | formatDate }}
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>
import {formatDate} from '@/utils/formatDate';
import BScroll from 'better-scroll';
import star from '@/components/common/star/star';
import Split from '@/components/common/split/split';
import RatingSelect from '@/components/common/ratingselect/ratingselect';

const ALL = 2;
const ERR_OK = 0;

export default{
	props: {
		seller: {
			type: Object
		}
	},
	data() {
		return {
			ratings: [],
			showFlag: false,
			selectType: ALL,
			onlyContent: false,
			desc: {
				all: '全部',
				positive: '满意',
				negative: '不满意'
			}
		}
	},
	created() {
		this.$http.get('/api/ratings').then((response)=>{
			response = response.body;
			if(response.errno === ERR_OK){
				this.ratings = response.data;
				// 拿到数据之后要进行初始化BScroll
				this.$nextTick(()=>{
					this.scroll = new BScroll(this.$refs.ratings, {
						click: true
					});
				});
			}
		});
	},
	components: {
		'v-star': star,
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
	},
	methods: {
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
	}
};
</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.ratings{
	position: absolute;
	top: 4.64rem;
	bottom: 0;
	left: 0;
	width: 100%;
	overflow: hidden;
	.overview{
		display: flex;
		padding: 0.48rem 0;
		.overview-left{
			flex: 0 0 3.653333rem;
			width: 3.653333rem;
			border-right: 1px solid rgba(7, 17, 27, 0.1);
			text-align: center;
			padding: 0.16rem 0;
			@media only screen and (max-width: 320px){
				flex: 0 0 3.2rem;
				width: 3.2rem;
			}
			.score{
				line-height: 0.746667rem;
				font-size: 0.64rem;
				color: rgb(255, 153, 0);
			}
			.title{
				line-height: 0.32rem;
				font-size: 0.32rem;
				color: rgb(7, 17, 27);
				margin-bottom: 0.213333rem;
			}
			.rank{
				line-height: 0.266667rem;
				font-size: 0.266667rem;
				color: rgb(147, 153, 159);
			}
		}
		.overview-right{
			flex: 1;
			padding: 0.16rem 0 0.16rem 0.64rem;
			@media only screen and (max-width: 320px){
				padding-left: 0.16rem;
			}
			.score-wrapper{
				margin-bottom: 0.213333rem;
				font-size: 0;
				.title{
					display: inline-block;
					line-height: 0.48rem;
					vertical-align: top;
					font-size: 0.32rem;
					color: rgb(7, 17, 27);
				}
				.star{
					display: inline-block;
					vertical-align: top;
					margin: 0 0.32rem;
				}
				.score{
					display: inline-block;
					line-height: 0.48rem;
					vertical-align: top;
					font-size: 0.32rem;
					color: rgb(255, 153, 0);
				}
			}
			.delivery-wrapper{
				font-size: 0;
				.title{
					line-height: 0.48rem;
					font-size: 0.32rem;
					color: rgb(7, 17, 27);
				}
				.delivery{
					margin-left: 0.32rem;
					font-size: 0.32rem;
					color: rgb(147, 153, 159);
				}
			}
		}
	}
	.rating-wrapper{
		padding: 0 0.48rem;
		.rating-item{
			display: flex;
			padding: 0.48rem 0;
			@include border-1px(rgba(7, 17, 27, 0.1));
			.avatar{
				flex: 0 0 0.746667rem;
				width: 0.746667rem;
				margin-right: 0.32rem;
				img{
					border-radius: 50%;
				}
			}
			.content{
				position: relative;
				flex: 1;
				.name{
					margin-bottom: 0.106667rem;
					line-height: 0.32rem;
					font-size: 0.266667rem;
					color: rgb(7, 17, 27);
				}
				.star-wrapper{
					margin-bottom: 0.16rem;
					font-size: 0;
					.star{
						display: inline-block;
						vertical-align: top;
						margin-right: 0.16rem;
					}
					.delivery{
						display: inline-block;
						vertical-align: top;
						line-height: 0.32rem;
						font-size: 0.266667rem;
						color: rgb(147, 153, 159);
					}
				}
				.text{
					margin-bottom: 0.48rem;
					line-height: 0.48rem;
					color: rgb(7, 17, 27);
					font-size: 0.32rem;
				}
				.recommend{
					line-height: 0.426667rem;
					font-size: 0;
					.icon-thumb_up, .icon-thumb_down, .item{
						display: inline-block;
						margin: 0 0.213333rem 0.106667rem 0;
						font-size: 0.24rem;
					}
					.icon-thumb_up{
						color: rgb(0, 160, 220);
					}
					.icon-thumb_down{
						color: rgb(183, 187, 191);
					}
					.item{
						padding: 0 0.16rem;
						border: 1px solid rgba(7, 17, 27, 0.1);
						border-radius: 0.026667rem;
						color: rgb(147, 153, 159);
						background: #fff;
					}
				}
				.time{
					position: absolute;
					top: 0;
					right: 0;
					line-height: 0.32rem;
					color: rgb(147, 153, 159);
					font-size: 0.266667rem;
				}
			}
		}
	}
}
</style>