<template>
	<view class="food-detail-container">
		<!-- 轮播图 -->
		<swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in foodDetail.images" :key="index">
				<image :src="item" mode="aspectFill" @click="previewImage(foodDetail.images, index)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 基本信息 -->
		<view class="info-section">
			<view class="name-price">
				<text class="name">{{foodDetail.name}}</text>
				<text class="price">¥{{foodDetail.price}}起</text>
			</view>
			<view class="location">
				<text class="icon">📍</text>
				<text>{{foodDetail.location}}</text>
			</view>
			<view class="tags">
				<text v-for="(tag, index) in foodDetail.tags" :key="index">{{tag}}</text>
			</view>
		</view>
		
		<!-- 美食介绍 -->
		<view class="section">
			<view class="section-title">美食介绍</view>
			<rich-text :nodes="foodDetail.description"></rich-text>
		</view>
		
		<!-- 用户评价 -->
		<view class="section">
			<view class="section-header">
				<text class="title">用户评价</text>
				<text class="score">{{foodDetail.score}}分</text>
			</view>
			<view class="review-list">
				<view class="review-item" v-for="(item, index) in foodDetail.reviews" :key="index">
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
			<button class="write-review-btn" @click="showReviewPopup">写评价</button>
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
		</view>
	</view>
	
	<!-- 评论弹窗 -->
	<review-popup
		:show="showReview"
		type="food"
		:targetId="id"
		@close="hideReviewPopup"
		@submit="handleReviewSubmit"
	/>
</template>

<script>
import ReviewPopup from '@/components/review-popup/review-popup.vue'
import { formatDate } from '@/utils/date.js'


/**
 * 美食详情页面
 * @description 展示美食详细信息，包括介绍、评价等
 */
export default {
	components: {
		ReviewPopup
	},
	data() {
		return {
			id: '',
			isCollected: false,
			showReview: false,
			foodDetail: {
				name: '',
				price: 0,
				location: '',
				images: [],
				tags: [],
				description: '',
				score: 0,
				reviews: []
			}
		}
	},
	onLoad(options) {
		this.id = options.id
		this.loadFoodDetail()
		this.checkCollectionStatus()
	},
	methods: {
		/**
		 * 加载美食详情
		 */
		async loadFoodDetail() {
			try {
				const res = await uniCloud.callFunction({
					name: 'food-center',
					data: {
						action: 'getFoodDetail',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							id: this.id
						}
					}
				})
				
				if (res.result.code === 0) {
					this.foodDetail = res.result.data
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
					name: 'food-center',
					data: {
						action: 'checkCollection',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							foodId: this.id
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
					name: 'food-center',
					data: {
						action: 'toggleCollection',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							foodId: this.id
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
				title: this.foodDetail.name,
				summary: this.foodDetail.description,
				imageUrl: this.foodDetail.images[0],
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
			this.loadFoodDetail()
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
.food-detail-container {
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