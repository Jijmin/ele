<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count > 0">{{ food.count }}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script>
import Vue from 'vue';
export default{
	props: {
		food: {
			type: Object
		}
	},
	created() {
	},
	methods: {
		addCart(event) {
			if(!event._constructed){// 如果pc端，就不需要派发这个事件
				return;
			}
			// props可以给一个不存在的属性直接赋值，但是检测不到属性的变化
			if(!this.food.count){
				Vue.set(this.food, 'count', 1);
				// this.food.count = 1;
			}else{
				this.food.count ++;
			}
			this.$emit('cartadd',event.target);
		},
		decreaseCart(event) {
			if(!event._constructed){// 如果pc端，就不需要派发这个事件
				return;
			}
			if(this.food.count){
				this.food.count --;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.cartcontrol{
	font-size: 0;
	.cart-decrease{
		display: inline-block;
		padding: 0.16rem;
		transition: all 0.4s linear;
		&.move-enter-active, &.move-leave-active{
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
		.inner{
			display: inline-block;
			font-size: 0.64rem;
			line-height: 0.64rem;
			color: rgb(0, 160, 220);
			transition: all 0.4s linear;
			transform: rotate(0);
		}
		&.move-enter, &.move-leave-to{
			opacity: 0;
			transform: translate3d(0.64rem, 0, 0);
			.inner{
				transform: rotate(180deg);
			}
		}
	}
	.cart-count{
		display: inline-block;
		vertical-align: top;
		width: 0.32rem;
		padding-top: 0.16rem;
		line-height: 0.64rem;
		text-align: center;
		font-size: 0.266667rem;
		color: rgb(147, 153, 159);
	}
	.cart-add{
		display: inline-block;
		padding: 0.16rem;
		font-size: 0.64rem;
		line-height: 0.64rem;
		color: rgb(0, 160, 220);
	}
}
</style>
