<template>
<div class="ratingselect">
	<div class="rating-type border-1px">
		<span @click="select(2, $event)" class="block positive" :class="{'active':this.selecttype === 2}">
			{{ desc.all }}
			<span class="count">{{ ratings.length }}</span>
		</span>
		<span @click="select(0, $event)" class="block positive" :class="{'active':this.selecttype === 0}">
			{{ desc.positive }}
			<span class="count">{{ positives.length }}</span>
		</span>
		<span @click="select(1, $event)" class="block negative" :class="{'active':this.selecttype === 1}">
			{{ desc.negative }}
			<span class="count">{{ negatives.length }}</span>
		</span>
	</div>
	<div @click="toggleCotent" class="switch border-1px" :class="{'on':this.onlycontent}">
		<span class="icon-check_circle"></span>
		<span class="text">只看有内容的评价</span>
	</div>
</div>
</template>

<script>
const POSITIVE = 0;// 满意
const NEGATIVE = 1;// 不满意
const ALL = 2;// 全部
export default{
	props: {
		ratings: {
			type: Array,
			default() {
				return [];
			}
		},
		selectType: {
			type: Number,
			default: ALL
		},
		onlyContent: {
			type: Boolean,
			default: false
		},
		desc: {
			type: Object,
			default() {
				return {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		}
	},
	data() {
		// props是从父组件那获得的，不能随便更改，需要用data做中转
		return {
			selecttype:this.selectType,
   		onlycontent:this.onlyContent
		}
	},
	computed: {
		positives() {
			// 过滤拿到所有为0(POSITIVE)的数组
			return this.ratings.filter((rating)=>{
				return rating.rateType === POSITIVE;
			});
		},
		negatives() {
			return this.ratings.filter((rating)=>{
				return rating.rateType === NEGATIVE;
			});
		}
	},
	methods: {
		select(type, event) {
			// 阻止better-scroll的事件冒泡
			if(!event._constructed){
				return;
			}
			// 设置为我们传入的type
			this.selecttype = type;
			// 通知父组件type的更改
			this.$emit('select', type);
		},
		toggleCotent(event){
			if(!event._constructed){
				return;
			}
			this.onlycontent = !this.onlycontent;
			this.$emit('toggleCotent', this.onlycontent);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.ratingselect{
	.rating-type{
		padding: 0.48rem 0;
		margin: 0 0.48rem;
		@include border-1px(rgba(7, 17, 27, 0.1));
		font-size: 0;
		.block{
			display: inline-block;
			padding: 0.213333rem 0.32rem;
			margin-right: 0.213333rem;
			border-radius: 0.026667rem;
			color: rgb(77, 85, 93);
			font-size: 0.32rem;
			&.active{
				color: #fff;
			}
			&.positive{
				background: rgba(0, 160, 220, 0.2);
				&.active{
					background: rgb(0, 160, 220);
				}
			}
			&.negative{
				background: rgba(77, 85, 93, 0.2);
				&.active{
					background: rgb(77, 85, 93);
				}
			}
			.count{
				font-size: 0.213333rem;
				margin-left: 0.053333rem;
				line-height: 0.426667rem;
			}
		}
	}
	.switch{
		padding: 0.32rem 0.48rem;
		line-height: 0.64rem;
		@include border-1px(rgba(7, 17, 27, 0.1));
		color: rgb(147, 153, 159);
		font-size: 0;
		&.on{
			.icon-check_circle{
				color: #00c850;
			}
		}
		.icon-check_circle{
			display: inline-block;
			vertical-align: top;
			margin-right: 0.373333rem;
			font-size: 0.64rem;
		}
		.text{
			display: inline-block;
			vertical-align: top;
			font-size: 0.32rem;
		}
	}
}
</style>
