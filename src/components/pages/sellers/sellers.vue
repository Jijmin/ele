<template>
<div class="sellers" ref="sellers">
	<div class="sellers-content">
		<div class="overview">
			<div class="overview-top border-1px">
				<div class="title">
					<div class="name">{{ sellers.name }}</div>
					<v-star :size="36" :score="sellers.score"></v-star>
					<span class="ratingCount">({{ sellers.ratingCount }})</span>
					<span class="sellCount">月售{{ sellers.sellCount }}单</span>
				</div>
				<div class="favorite" @click="favorite" :class="{'on': this.isFavorite}">
					<i class="icon-favorite"></i>
					<div class="text" v-show="!isFavorite">收藏</div>
					<div class="text" v-show="isFavorite">已收藏</div>
				</div>
			</div>
			<div class="overview-bottom">
				<div class="overview-item">
					<div class="title">起送价</div>
					<div class="minPrice">
						<span class="num">{{ sellers.minPrice }}</span>元
					</div>
				</div>
				<div class="overview-item">
					<div class="title">商家配送</div>
					<div class="deliveryPrice">
						<span class="num">{{ sellers.deliveryPrice }}</span>元
					</div>
				</div>
				<div class="overview-item">
					<div class="title">平均配送时间</div>
					<div class="deliveryTime">
						<span class="num">{{ sellers.deliveryTime }}</span>分钟
					</div>
				</div>
			</div>
		</div>
		<v-split></v-split>
		<div class="notice">
			<div class="title">公告与活动</div>
			<div class="desc border-1px">{{ sellers.bulletin }}</div>
			<ul v-if="sellers.supports" class="supports">
				<li class="support-item" v-for="(item, $index) in sellers.supports">
					<span class="icon" :class="classMap[sellers.supports[$index].type]"></span>
					<span class="text">{{ sellers.supports[$index].description }}</span>
				</li>
			</ul>
		</div>
		<v-split></v-split>
		<div class="real">
			<div class="title">商家实景</div>
			<div class="swiper">
				<swiper :options="swiperOption" ref="mySwiper">
			    <swiper-slide key="pic" v-for="pic in sellers.pics"><img :src="pic"></swiper-slide>
			  </swiper>
			</div>
		</div>
		<v-split></v-split>
		<div class="seller-info">
			<div class="title">商家信息</div>
			<ul class="infos">
				<li class="info" v-for="info in sellers.infos">{{ info }}</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>
import BScroll from 'better-scroll';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import star from '@/components/common/star/star';
import Split from '@/components/common/split/split';

const ERR_OK = 0;

export default{
	props: {
		seller: {
			type: Object
		}
	},
	data() {
		return {
			swiperOption: {
				autoplay: 2000,
				slidesPerView: 3,
        spaceBetween: 30,
        freeMode: false,
        loop : true
			},
			isFavorite: false,
			sellers: this.seller
		}
	},
	components: {
		'v-star': star,
		'v-split': Split,
		swiper,
    swiperSlide
	},
	methods: {
		favorite(event) {
			this.isFavorite = !this.isFavorite;
		}
	},
	created() {
		this.$http.get('/api/seller').then((response)=>{
			response = response.body;
			if(response.errno === ERR_OK){
				this.sellers = response.data;
				// 拿到数据之后要进行初始化BScroll
				this.$nextTick(()=>{
					this.scroll = new BScroll(this.$refs.sellers, {
						click: true
					});
				});
			}
		});
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	}
};
</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.sellers{
	position: absolute;
	top: 4.64rem;
	bottom: 0;
	left: 0;
	width: 100%;
	overflow: hidden;
	.overview{
		padding: 0.48rem;
		.overview-top{
			padding-bottom: 0.48rem;
			@include border-1px(rgba(7, 17, 27, 0.1));
			overflow: hidden;
			.title{
				float: left;
				font-size: 0;
				.name{
					font-size: 0.373333rem;
					line-height: 0.373333rem;
					color: rgb(7, 17, 27);
					padding-bottom: 0.213333rem;
				}
				.star, .ratingCount, .sellCount{
					display: inline-block;
					vertical-align: top;
					font-size: 0.266667rem;
					color: rgb(77, 85, 93);
					line-height: 0.48rem;
				}
				.ratingCount{
					padding: 0 0.32rem 0 0.213333rem;
				}
			}
			.favorite{
				float: right;
				text-align: center;
				.icon-favorite{
					font-size: 0.64rem;
					line-height: 0.64rem;
					padding-bottom: 0.106667rem;
					color: #d4d6d9;
				}
				.text{
					color: #93999f;
					font-size: 0.266667rem;
					line-height: 0.266667rem;

				}
				&.on{
					.icon-favorite{
						color: rgb(240, 20, 20);
					}
					.text{
						color: rgb(77, 85, 93);
					}
				}
			}
		}
		.overview-bottom{
			display: flex;
			padding: 0.48rem 0;
			text-align: center;
			.overview-item{
				flex: 1;
				border-right: 1px solid rgba(7, 17, 27, 0.1);
				&:last-child{
					border-right: none;
				}
				.title{
					font-size: 0.266667rem;
					line-height: 0.266667rem;
					color: rgb(147, 153, 159);
					padding-bottom: 0.106667rem;
				}
				.minPrice, .deliveryPrice, .deliveryTime{
					font-size: 0.266667rem;
				}
				.num{
					display: inline-block;
					font-size: 0.64rem;
					color: rgb(7, 17, 27);
					line-height: 0.64rem;
				}
			}
		}
	}
	.notice{
		padding: 0.48rem 0.48rem 0 0.48rem;
		.title{
			font-size: 0.373333rem;
			color: rgb(7, 17, 27);
			line-height: 0.373333rem;
			padding-bottom: 0.213333rem;
		}
		.desc{
			padding: 0 0.32rem 0.426667rem;
			font-size: 0.32rem;
			color: rgb(240, 20, 20);
			line-height: 0.64rem;
			@include border-1px(rgba(7, 17, 27, 0.1));
		}
		.supports{
			margin: 0 auto;
			.support-item{
				padding: 0.426667rem 0.32rem;
				font-size: 0;
				@include border-1px(rgba(7, 17, 27, 0.1));
				&:last-child{
					margin-bottom: 0;
					@include border-none();
				}
				.icon{
					display: inline-block;
					width: 0.426667rem;
					height: 0.426667rem;
					vertical-align: top;
					margin-right: 0.16rem;
					background-size: 0.426667rem 0.426667rem;
					background-repeat: no-repeat;
					&.decrease{
						@include bg-image('decrease_4');
					}
					&.discount{
						@include bg-image('discount_4');
					}
					&.special{
						@include bg-image('special_4');
					}
					&.invoice{
						@include bg-image('invoice_4');
					}
					&.guarantee{
						@include bg-image('guarantee_4');
					}
				}
				.text{
					line-height: 0.426667rem;
					font-size: 0.32rem;
				}
			}
		}
	}
	.real{
		padding: 0.48rem;
		.title{
			font-size: 0.373333rem;
			line-height: 0.373333rem;
			color: rgb(7, 17, 27);
			padding-bottom: 0.32rem;
		}
		.swiper{
			.swiper-container{
				.swiper-slide{
					img{
						width: 3.2rem;
						height: 2.4rem;
						margin-right: 0.16rem;
					}
				}
			}
		}
	}
	.seller-info{
		padding: 0.48rem;
		.title{
			font-size: 0.373333rem;
			line-height: 0.373333rem;
			color: rgb(7, 17, 27);
			padding-bottom: 0.32rem;
			@include border-1px(rgba(7, 17, 27, 0.1));
		}
		.info{
			padding: 0.426667rem 0.32rem;
			font-size: 0.32rem;
			line-height: 0.426667rem;
			color: rgb(7, 17, 27);
			@include border-1px(rgba(7, 17, 27, 0.1));
			&:last-child{
				@include border-none();
			}
		}
	}
}
</style>
