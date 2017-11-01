<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img :src="seller.avatar">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{ seller.name }}</span>
				</div>
				<div class="description">
					{{ seller.description }}/{{ seller.deliveryTime }}分钟送达
				</div>
				<div class="support" v-if="seller.supports">
					<i class="icon" :class="classMap[seller.supports[0].type]"></i>
					<span class="text">{{ seller.supports[0].description }}</span>
				</div>
			</div>
			<div class="support-count" v-if="seller.supports" @click="showDetail">
				<span class="count">{{ seller.supports.length }}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<transition name="fade">
		<div class="detail" v-show="detailShow" transition="fade">
			<div class="detail-wrapper clearfix">
				<div class="detail-main">
					<h1 class="name">{{seller.name}}</h1>
					<div class="star-wrapper">
						<v-star :size="48" :score="seller.score"></v-star>			
					</div>
					<div class="title">
						<div class="line"></div>
						<div class="text">优惠信息</div>
						<div class="line"></div>
					</div>
					<ul v-if="seller.supports" class="supports">
						<li class="support-item" v-for="(item, $index) in seller.supports">
							<span class="icon" :class="classMap[seller.supports[$index].type]"></span>
							<span class="text">{{ seller.supports[$index].description }}</span>
						</li>
					</ul>
					<div class="title">
						<div class="line"></div>
						<div class="text">商家公告</div>
						<div class="line"></div>
					</div>
					<div class="bulletin">
						<div class="content">{{ seller.bulletin }}</div>
					</div>
				</div>
			</div>
			<div class="detail-close">
				<i class="icon-close" @click="hideDetail"></i>
			</div>
		</div>
		</transition>
	</div>
</template>

<script>
import star from '@/components/common/star/star';
export default{
	props: {
		seller: {
			type: Object
		}
	},
	data() {
		return {
			detailShow: false
		}
	},
	methods: {
		showDetail() {
			this.detailShow = true;
		},
		hideDetail() {
			this.detailShow = false;
		}
	},
	created() {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	},
	components: {
		'v-star': star
	}
};
</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.header{
	position: relative;
	color: #fff;
	overflow: hidden;
	background: rgba(7, 17, 27, 0.5);
	.content-wrapper{
		position: relative;
		padding: 0.64rem 0.32rem 0.48rem 0.64rem;
		font-size: 0;
		.avatar{
			display: inline-block;
			vertical-align: top;
			img{
				width: 1.706667rem;
				height: 1.706667rem;
				border-radius: 0.026667rem;
			}
		}
		.content{
			display: inline-block;
			margin-left: 0.426667rem;
			.title{
				margin: 0.053333rem 0 0.213333rem 0;
				.brand{
					display: inline-block;
					vertical-align: top;
					width: 0.8rem;
					height: 0.48rem;
					@include bg-image('brand');
					background-size: 0.8rem 0.48rem;
					background-repeat: no-repeat;
				}
				.name{
					margin-left: 0.16rem;
					font-size: 0.426667rem;
					font-weight: bold;
					line-height: 0.48rem;
				}
			}
			.description{
				margin-bottom: 0.266667rem;
				font-size: 0.32rem;
				line-height: 0.32rem;
			}
			.support{
				.icon{
					display: inline-block;
					vertical-align: top;
					width: 0.32rem;
					height: 0.32rem;
					margin-right: 0.106667rem;
					background-size: 0.32rem 0.32rem;
					background-repeat: no-repeat;
					&.decrease{
						@include bg-image('decrease_1');
					}
					&.discount{
						@include bg-image('discount_1');
					}
					&.special{
						@include bg-image('special_1');
					}
					&.invoice{
						@include bg-image('invoice_1');
					}
					&.guarantee{
						@include bg-image('guarantee_1');
					}
				}
				.text{
					font-size: 0.266667rem;
					line-height: 0.32rem;
				}
			}
		}
		.support-count{
			position: absolute;
			right: 0.32rem;
			bottom: 0.373333rem;
			padding: 0 0.213333rem;
			height: 0.64rem;
			line-height: 0.64rem;
			border-radius: 0.373333rem;
			background: rgba(0, 0, 0, 0.2);
			text-align: center;
			.count{
				vertical-align: top;
				font-size: 0.266667rem;
			}
			.icon-keyboard_arrow_right{
				margin-left: 0.053333rem;
				line-height: 0.64rem;
				font-size: 0.266667rem;
			}
		}
	}
	.bulletin-wrapper{
		position: relative;
		height: 0.746667rem;
		line-height: 0.746667rem;
		padding: 0 0.586667rem 0 0.32rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		background: rgba(7, 17, 27, 0.2);
		.bulletin-title{
			display: inline-block;
			vertical-align: top;
			margin-top: 0.213333rem;
			width: 0.586667rem;
			height: 0.32rem;
			@include bg-image('bulletin');
			background-size: 0.586667rem 0.32rem;
			background-repeat: no-repeat;
		}
		.bulletin-text{
			vertical-align: top;
			margin: 0 0.106667rem;
			font-size: 0.266667rem;
		}
		.icon-keyboard_arrow_right{
			position: absolute;
			font-size: 0.266667rem;
			right: 0.32rem;
			top: 0.213333rem;
		}
	}
	.background{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		filter: blur(0.266667rem);
	}
	.detail{
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background: rgba(7, 17, 27, 0.8);
		transition: all .5s;
		background-filter: blur(0.266667rem);
		&.fade-enter-active{
			opacity: 1;
		}
		&.fade-enter,&.fade-leave-active{
			opacity: 0;
		}
		.detail-wrapper{
			min-height: 100%;
			width: 100%;
			.detail-main{
				margin-top: 1.706667rem;
				padding-bottom: 1.706667rem;
				.name{
					line-height: 0.426667rem;
					text-align: center;
					font-size: 0.426667rem;
					font-weight: 700;
				}
				.star-wrapper{
					margin-top: 0.48rem;
					padding: 0.053333rem 0;
					text-align: center;
				}
				.title{
					display: flex;
					width: 80%;
					margin: 0.746667rem auto 0.64rem;
					.line{
						flex: 1;
						position: relative;
						top: -0.16rem;
						@include border-1px(rgba(255, 255, 255, 0.2));
					}
					.text{
						padding: 0 0.32rem;
						font-weight: 700;
						font-size: 0.373333rem;
					}
				}
				.supports{
					width: 80%;
					margin: 0 auto;
					.support-item{
						padding: 0 0.32rem;
						margin-bottom: 0.32rem;
						font-size: 0;
						&:last-child{
							margin-bottom: 0;
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
								@include bg-image('decrease_2');
							}
							&.discount{
								@include bg-image('discount_2');
							}
							&.special{
								@include bg-image('special_2');
							}
							&.invoice{
								@include bg-image('invoice_2');
							}
							&.guarantee{
								@include bg-image('guarantee_2');
							}
						}
						.text{
							line-height: 0.426667rem;
							font-size: 0.32rem;
						}
					}
				}
				.bulletin{
					width: 80%;
					margin: 0 auto;
					.content{
						padding: 0 0.32rem;
						line-height: 0.64rem;
						font-size: 0.32rem;
					}
				}
			}
		}
		.detail-close{
			position: relative;
			width: 0.853333rem;
			height: 0.853333rem;
			margin: -128px auto 0 auto;
			clear: both;
			font-size: 0.853333rem;
		}
	}
}
</style>
