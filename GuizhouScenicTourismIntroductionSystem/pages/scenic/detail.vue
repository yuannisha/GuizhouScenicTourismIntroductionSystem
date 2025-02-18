<template>
	<view class="scenic-detail-container">
		<!-- 轮播图 -->
		<swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in scenicDetail.images" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		
		<!-- 基本信息 -->
		<view class="info-section">
			<view class="name-price">
				<text class="name">{{scenicDetail.name}}</text>
				<text class="price">¥{{scenicDetail.price}}起</text>
			</view>
			<view class="location">
				<text class="icon">📍</text>
				<text>{{scenicDetail.location}}</text>
			</view>
			<view class="tags">
				<text v-for="(tag, index) in scenicDetail.tags" :key="index">{{tag}}</text>
			</view>
		</view>
		
		<!-- 景点介绍 -->
		<view class="section">
			<view class="section-title">景点介绍</view>
			<rich-text :nodes="scenicDetail.description"></rich-text>
		</view>
		
		<!-- 开放时间 -->
		<view class="section">
			<view class="section-title">开放时间</view>
			<view class="time-info">
				<view class="time-item" v-for="(item, index) in scenicDetail.openingHours" :key="index">
					<text class="day">{{item.day}}</text>
					<text class="time">{{item.time}}</text>
				</view>
			</view>
		</view>
		
		<!-- 交通指南 -->
		<view class="section">
			<view class="section-title">交通指南</view>
			<view class="traffic-info">
				<view class="traffic-item" v-for="(item, index) in scenicDetail.traffic" :key="index">
					<text class="type">{{item.type}}</text>
					<text class="desc">{{item.description}}</text>
				</view>
			</view>
		</view>
		
		<!-- 门票信息 -->
		<view class="section">
			<view class="section-title">门票信息</view>
			<view class="ticket-info">
				<view class="ticket-item" v-for="(item, index) in scenicDetail.tickets" :key="index">
					<view class="ticket-name-price">
						<text class="name">{{item.name}}</text>
						<text class="price">¥{{item.price}}</text>
					</view>
					<text class="desc">{{item.description}}</text>
				</view>
			</view>
		</view>
		
		<!-- 用户评价 -->
		<view class="section">
			<view class="section-header">
				<text class="title">用户评价</text>
				<text class="score">{{scenicDetail.score}}分</text>
			</view>
			<view class="review-list">
				<view class="review-item" v-for="(item, index) in scenicDetail.reviews" :key="index">
					<view class="user-info">
						<image :src="item.avatar" mode="aspectFill"></image>
						<text class="nickname">{{item.nickname}}</text>
						<text class="score">{{item.score}}分</text>
					</view>
					<text class="content">{{item.content}}</text>
					<view class="images" v-if="item.images && item.images.length">
						<image 
							v-for="(img, imgIndex) in item.images" 
							:key="imgIndex" 
							:src="img" 
							mode="aspectFill"
							@click="previewImage(item.images, imgIndex)"
						></image>
					</view>
					<text class="time">{{formatDate(item.created_at)}}</text>
				</view>
			</view>
			<button class="write-review-btn" @click="showReviewPopup">我要评论</button>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="left">
				<view class="action-item" @click="toggleCollect">
					<text class="icon">{{isCollected ? '❤️' : '🤍'}}</text>
					<text>收藏</text>
				</view>
				<view class="action-item" @click="handleShare">
					<text class="icon">📤</text>
					<text>分享</text>
				</view>
			</view>
			<view class="right">
				<button type="primary" @click="showBookingPopup">立即预订</button>
			</view>
		</view>
	</view>
	
	<!-- 评论弹窗 -->
	<review-popup
		:show="showReview"
		type="scenic"
		:targetId="id"
		@close="hideReviewPopup"
		@submit="handleReviewSubmit"
	/>
	
	<!-- 预订弹窗 -->
	<booking-popup
		:show="showBooking"
		:scenicId="id"
		:tickets="scenicDetail.tickets"
		@close="hideBookingPopup"
		@submit="handleBookingSubmit"
	/>
</template>

<script>
import ReviewPopup from '@/components/review-popup/review-popup.vue'
import BookingPopup from '@/components/booking-popup/booking-popup.vue'
import { formatDate, formatRelativeTime } from '@/utils/date.js'

/**
 * 景点详情页面
 * @description 展示景点详细信息，包括介绍、门票、评价等
 */
export default {
	components: {
		ReviewPopup,
		BookingPopup
	},
	data() {
		return {
			id: '',
			isCollected: false,
			showReview: false,
			showBooking: false,
			scenicDetail: {
				name: '',
				price: 0,
				location: '',
				images: [],
				tags: [],
				description: '',
				openingHours: [],
				traffic: [],
				tickets: [],
				score: 0,
				reviews: []
			}
		}
	},
	onLoad(options) {
		this.id = options.id
		this.loadScenicDetail()
		this.checkCollectionStatus()
	},
	methods: {
		/**
		 * 加载景点详情
		 */
		async loadScenicDetail() {
			try {
				const res = await uniCloud.callFunction({
					name: 'scenic-center',
					data: {
						action: 'getScenicDetail',
						params: {
							id: this.id,
                            USERID:uni.getStorageSync('userInfo')._id
						}
					}
				})
				
				if (res.result.code === 0) {
					this.scenicDetail = res.result.data
                    console.log("景点详情",this.scenicDetail)
				} else {
					uni.showToast({
						title: res.result.message || '加载失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '加载失败，请稍后重试',
					icon: 'none'
				})
				console.error(e)
			}
		},
		
		/**
		 * 检查收藏状态
		 */
		async checkCollectionStatus() {
			try {
				const res = await uniCloud.callFunction({
					name: 'scenic-center',
					data: {
						action: 'checkCollection',
						params: {
							scenicId: this.id,
                            USERID:uni.getStorageSync('userInfo')._id
						}
					}
				})
				
				if (res.result.code === 0) {
					this.isCollected = res.result.data.isCollected
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		/**
		 * 切换收藏状态
		 */
		async toggleCollect() {
			try {
				const res = await uniCloud.callFunction({
					name: 'scenic-center',
					data: {
						action: 'toggleCollection',
						params: {
							scenicId: this.id,
                            USERID:uni.getStorageSync('userInfo')._id
						}
					}
				})
				
				if (res.result.code === 0) {
					this.isCollected = !this.isCollected
					uni.showToast({
						title: this.isCollected ? '收藏成功' : '已取消收藏',
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: res.result.message || '操作失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '操作失败，请稍后重试',
					icon: 'none'
				})
				console.error(e)
			}
		},
		
		/**
		 * 处理分享
		 */
		handleShare() {
			uni.share({
				provider: "weixin",
				scene: "WXSceneSession",
				type: 0,
				title: this.scenicDetail.name,
				summary: this.scenicDetail.description,
				imageUrl: this.scenicDetail.images[0],
				success: function (res) {
					console.log("success:" + JSON.stringify(res));
				},
				fail: function (err) {
					console.log("fail:" + JSON.stringify(err));
				}
			})
		},
		
		/**
		 * 预览图片
		 */
		previewImage(images, current) {
			uni.previewImage({
				urls: images,
				current: images[current]
			})
		},
		
		/**
		 * 显示评论弹窗
		 */
		showReviewPopup() {
			if (!uni.getStorageSync('userInfo')) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			this.showReview = true
		},
		
		/**
		 * 隐藏评论弹窗
		 */
		hideReviewPopup() {
			this.showReview = false
		},
		
		/**
		 * 处理评论提交
		 */
		handleReviewSubmit() {
			this.loadScenicDetail()
		},
		
		/**
		 * 显示预订弹窗
		 */
		showBookingPopup() {
			if (!uni.getStorageSync('userInfo')) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			this.showBooking = true
		},
		
		/**
		 * 隐藏预订弹窗
		 */
		hideBookingPopup() {
			this.showBooking = false
		},
		
		/**
		 * 处理预订提交
		 */
		handleBookingSubmit() {
			uni.navigateTo({
				url: '/pages/user/bookings'
			})
		},
		
		/**
		 * 格式化日期
		 */
		formatDate(timestamp) {
			return formatDate(timestamp)
		}
	}
}
</script>

<style lang="scss">
.scenic-detail-container {
	min-height: 100vh;
	padding-bottom: 100rpx;
	background-color: #f5f5f5;
	
	.banner {
		height: 400rpx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.info-section {
		padding: 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		
		.name-price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			
			.name {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
			
			.price {
				font-size: 32rpx;
				color: #ff4d4f;
			}
		}
		
		.location {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			font-size: 28rpx;
			color: #666;
			
			.icon {
				margin-right: 10rpx;
			}
		}
		
		.tags {
			display: flex;
			flex-wrap: wrap;
			
			text {
				padding: 4rpx 12rpx;
				margin-right: 10rpx;
				margin-bottom: 10rpx;
				font-size: 24rpx;
				color: #007AFF;
				background-color: rgba(0, 122, 255, 0.1);
				border-radius: 4rpx;
			}
		}
	}
	
	.section {
		padding: 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.score {
				font-size: 32rpx;
				color: #ff4d4f;
			}
		}
		
		.time-info {
			.time-item {
				display: flex;
				margin-bottom: 10rpx;
				
				.day {
					width: 120rpx;
					font-size: 28rpx;
					color: #666;
				}
				
				.time {
					flex: 1;
					font-size: 28rpx;
					color: #333;
				}
			}
		}
		
		.traffic-info {
			.traffic-item {
				margin-bottom: 20rpx;
				
				.type {
					display: block;
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
				}
				
				.desc {
					font-size: 26rpx;
					color: #666;
				}
			}
		}
		
		.ticket-info {
			.ticket-item {
				margin-bottom: 20rpx;
				
				.ticket-name-price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;
					
					.name {
						font-size: 28rpx;
						font-weight: bold;
						color: #333;
					}
					
					.price {
						font-size: 28rpx;
						color: #ff4d4f;
					}
				}
				
				.desc {
					font-size: 26rpx;
					color: #666;
				}
			}
		}
		
		.review-list {
			.review-item {
				margin-bottom: 30rpx;
				
				.user-info {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					
					image {
						width: 60rpx;
						height: 60rpx;
						border-radius: 30rpx;
						margin-right: 10rpx;
					}
					
					.nickname {
						flex: 1;
						font-size: 28rpx;
						color: #333;
					}
					
					.score {
						font-size: 28rpx;
						color: #ff4d4f;
					}
				}
				
				.content {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 10rpx;
				}
				
				.images {
					display: flex;
					flex-wrap: wrap;
					margin: 0 -5rpx;
					margin-bottom: 10rpx;
					
					image {
						width: calc(33.33% - 10rpx);
						height: 200rpx;
						margin: 5rpx;
						border-radius: 8rpx;
					}
				}
				
				.time {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}
	
	.bottom-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		
		.left {
			display: flex;
			
			.action-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 40rpx;
				
				.icon {
					font-size: 40rpx;
					margin-bottom: 4rpx;
				}
				
				text {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
		
		.right {
			button {
				width: 200rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 28rpx;
			}
		}
	}
	
	.write-review-btn {
		margin-top: 30rpx;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #f5f5f5;
		color: #666;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
}
</style> 