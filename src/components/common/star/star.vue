<template>
	<div class="star" :class="starType">
		<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" track-by="$index"></span>
	</div>
</template>

<script>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';
export default{
	props: {
		size: {
			type: Number
		},
		score: {
			type: Number
		}
	},
	computed: {
		starType() {
			return 'star-' + this.size;
		},
		itemClasses() {
			let result = [];
			// 可以计算出哪些分数有半星
			let score = Math.floor(this.score * 2) / 2;
			// 判断是否有半星
			let hasDecimal = score % 1 !== 0;
			// 获取到全星的部分
			let integer = Math.floor(score);
			for(let i = 0; i < integer; i++){
				// 将前面的全星push到数组中
				result.push(CLS_ON);
			}
			// 有半星就push进数组
			if(hasDecimal){
				result.push(CLS_HALF);
			}
			// 补全剩下的空星
			while(result.length < LENGTH){
				result.push(CLS_OFF);
			}
			return result;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.star{
	font-size: 0;
	.star-item{
		display: inline-block;
		background-repeat: no-repeat;
	}
	&.star-48{
		.star-item{
			width: 0.533333rem;
			height: 0.533333rem;
			margin-right: 0.586667rem;
			background-size: 0.533333rem 0.533333rem;
			&:last-child{
				margin-right: 0;
			}
			&.on{
				@include bg-image('star48_on');
			}
			&.half{
				@include bg-image('star48_half');
			}
			&.off{
				@include bg-image('star48_off');
			}
		}
	}
	&.star-36{
		.star-item{
			width: 0.4rem;
			height: 0.4rem;
			margin-right: 0.16rem;
			background-size: 0.4rem 0.4rem;
			&:last-child{
				margin-right: 0;
			}
			&.on{
				@include bg-image('star36_on');
			}
			&.half{
				@include bg-image('star36_half');
			}
			&.off{
				@include bg-image('star36_off');
			}
		}
	}
	&.star-24{
		.star-item{
			width: 0.266667rem;
			height: 0.266667rem;
			margin-right: 0.08rem;
			background-size: 0.266667rem 0.266667rem;
			&:last-child{
				margin-right: 0;
			}
			&.on{
				@include bg-image('star24_on');
			}
			&.half{
				@include bg-image('star24_half');
			}
			&.off{
				@include bg-image('star24_off');
			}
		}
	}
}
</style>
