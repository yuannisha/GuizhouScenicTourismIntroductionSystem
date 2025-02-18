<template>
	<view class="booking-popup" v-if="show">
		<view class="mask" @click="handleClose"></view>
		<view class="content">
			<view class="header">
				<text class="title">预订门票</text>
				<text class="close" @click="handleClose">×</text>
			</view>
			<view class="form">
				<view class="form-item">
					<text class="label">预订日期</text>
					<picker 
						mode="date" 
						:start="startDate" 
						:end="endDate" 
						:value="bookingDate"
						@change="handleDateChange"
					>
						<view class="picker">{{bookingDate}}</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="label">票种</text>
					<picker 
						:range="ticketTypes" 
						range-key="name"
						:value="selectedTicketIndex"
						@change="handleTicketChange"
					>
						<view class="picker">
							{{ticketTypes[selectedTicketIndex].name}}
							(¥{{ticketTypes[selectedTicketIndex].price}})
						</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="label">数量</text>
					<view class="quantity-control">
						<text class="minus" @click="handleQuantityChange(-1)">-</text>
						<text class="number">{{quantity}}</text>
						<text class="plus" @click="handleQuantityChange(1)">+</text>
					</view>
				</view>
				<view class="total">
					<text class="label">总价</text>
					<text class="price">¥{{totalPrice}}</text>
				</view>
			</view>
			<view class="footer">
				<button class="submit-btn" @click="handleSubmit">确认预订</button>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 预订弹窗组件
 * @description 用于预订门票的弹窗组件
 * @property {Boolean} show 是否显示弹窗
 * @property {String} scenicId 景点ID
 * @property {Array} tickets 门票列表
 * @event {Function} close 关闭弹窗
 * @event {Function} submit 提交预订
 */
export default {
	name: 'booking-popup',
	props: {
		show: {
			type: Boolean,
			default: false
		},
		scenicId: {
			type: String,
			required: true
		},
		tickets: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			bookingDate: this.getDefaultDate(),
			selectedTicketIndex: 0,
			quantity: 1
		}
	},
	computed: {
		startDate() {
			const today = new Date()
			return this.formatDate(today)
		},
		endDate() {
			const date = new Date()
			date.setDate(date.getDate() + 30)
			return this.formatDate(date)
		},
		ticketTypes() {
			return this.tickets || []
		},
		totalPrice() {
			if (!this.ticketTypes.length) return 0
			return (this.ticketTypes[this.selectedTicketIndex].price * this.quantity).toFixed(2)
		}
	},
	methods: {
		getDefaultDate() {
			return this.formatDate(new Date())
		},
		formatDate(date) {
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		},
		handleClose() {
			this.$emit('close')
			this.resetForm()
		},
		handleDateChange(e) {
			this.bookingDate = e.detail.value
		},
		handleTicketChange(e) {
			this.selectedTicketIndex = Number(e.detail.value)
		},
		handleQuantityChange(delta) {
			const newQuantity = this.quantity + delta
			if (newQuantity >= 1 && newQuantity <= 10) {
				this.quantity = newQuantity
			}
		},
		resetForm() {
			this.bookingDate = this.getDefaultDate()
			this.selectedTicketIndex = 0
			this.quantity = 1
		},
		async handleSubmit() {
			const userInfo = uni.getStorageSync('userInfo')
			if (!userInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			
			try {
				const res = await uniCloud.callFunction({
					name: 'scenic-center',
					data: {
						action: 'createBooking',
						params: {
							USERID: userInfo._id,
							scenicId: this.scenicId,
							bookingDate: this.bookingDate,
							ticketType: this.ticketTypes[this.selectedTicketIndex].name,
							quantity: this.quantity,
							totalPrice: Number(this.totalPrice)
						}
					}
				})
				
				if (res.result.code === 0) {
					uni.showToast({
						title: '预订成功'
					})
					this.$emit('submit')
					this.handleClose()
				} else {
					uni.showToast({
						title: res.result.message || '预订失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '预订失败',
					icon: 'none'
				})
				console.error(e)
			}
		}
	}
}
</script>

<style lang="scss">
.booking-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	
	.mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.content {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx;
		
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.close {
				font-size: 40rpx;
				color: #999;
				padding: 10rpx;
			}
		}
		
		.form {
			.form-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30rpx;
				
				.label {
					font-size: 28rpx;
					color: #333;
				}
				
				.picker {
					font-size: 28rpx;
					color: #666;
				}
				
				.quantity-control {
					display: flex;
					align-items: center;
					
					.minus, .plus {
						width: 60rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						background-color: #f5f5f5;
						border-radius: 30rpx;
						font-size: 32rpx;
						color: #333;
					}
					
					.number {
						width: 80rpx;
						text-align: center;
						font-size: 28rpx;
						color: #333;
					}
				}
			}
			
			.total {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 30rpx;
				padding-top: 30rpx;
				border-top: 1rpx solid #eee;
				
				.label {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}
				
				.price {
					font-size: 36rpx;
					font-weight: bold;
					color: #ff4d4f;
				}
			}
		}
		
		.footer {
			margin-top: 30rpx;
			
			.submit-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				background-color: #007AFF;
				color: #fff;
				border-radius: 40rpx;
				font-size: 28rpx;
			}
		}
	}
}
</style> 