<template>
	<view class="culture-detail-container">
		<!-- 图片轮播 -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(image, index) in cultureInfo.images" :key="index">
				<image :src="image" mode="aspectFill" @click="previewImage(index)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 基本信息 -->
		<view class="info-section">
			<view class="title-row">
				<text class="name">{{cultureInfo.name}}</text>
				<view class="views">{{cultureInfo.views}}浏览</view>
			</view>
			<view class="tags">
				<text v-for="(tag, index) in cultureInfo.tags" :key="index">{{tag}}</text>
			</view>
			<text class="description">{{cultureInfo.description}}</text>
		</view>
		
		<!-- 文化介绍 -->
		<view class="content-section">
			<view class="section-title">文化介绍</view>
			<rich-text :nodes="cultureInfo.content"></rich-text>
		</view>
		
		<!-- 用户评价 -->
		<view class="section">
			<view class="section-header">
				<text class="title">用户评价</text>
			</view>
			<view class="review-list">
				<view class="review-item" v-for="(item, index) in cultureInfo.reviews" :key="index">
					<view class="user-info">
						<image :src="item.avatar" mode="aspectFill"></image>
						<text class="nickname">{{item.nickname}}</text>
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
				<view class="action-item" @click="handleCollect">
					<text class="icon">{{isCollected ? '❤️' : '🤍'}}</text>
					<text>收藏</text>
				</view>
				<view class="action-item" @click="handleShare">
					<text class="icon">📤</text>
					<text>分享</text>
				</view>
			</view>
		</view>
		
		<!-- 评论弹窗 -->
		<review-popup
			:show="showReview"
			type="culture"
			:targetId="id"
			@close="hideReviewPopup"
			@submit="handleReviewSubmit"
		/>
	</view>
</template>

<script>
import ReviewPopup from '@/components/review-popup/review-popup.vue'
import { formatDate, formatRelativeTime } from '@/utils/date.js'

/**
 * 文化详情页面
 * @description 展示文化详情信息，包括图片、介绍、评论等
 */
export default {
	components: {
		ReviewPopup
	},
	data() {
		return {
			id: '',
			cultureInfo: {
				name: '',
				description: '',
				content: '',
				images: [],
				tags: [],
				views: 0,
				reviews: []
			},
			isCollected: false,
			showReview: false
		}
	},
	onLoad(options) {
		this.id = options.id
		this.loadCultureDetail()
		this.checkCollectionStatus()
	},
	methods: {
		/**
		 * 加载文化详情
		 */
		async loadCultureDetail() {
			try {
				const res = await uniCloud.callFunction({
					name: 'culture-center',
					data: {
						action: 'getCultureDetail',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							id: this.id
						}
					}
				})
				
				if (res.result.code === 0) {
					this.cultureInfo = res.result.data
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
					name: 'culture-center',
					data: {
						action: 'checkCollection',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							cultureId: this.id
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
		 * 处理收藏
		 */
		async handleCollect() {
			if (!uni.getStorageSync('userInfo')) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			
			try {
				const res = await uniCloud.callFunction({
					name: 'culture-center',
					data: {
						action: 'toggleCollection',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							cultureId: this.id
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
					title: '操作失败，请重试',
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
				title: this.cultureInfo.name,
				summary: this.cultureInfo.description,
				imageUrl: this.cultureInfo.images[0],
				success: function (res) {
					console.log("success:" + JSON.stringify(res));
				},
				fail: function (err) {
					console.log("fail:" + JSON.stringify(err));
				}
			});
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
			this.loadCultureDetail()
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
.culture-detail-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 100rpx;
	
	.swiper {
		height: 500rpx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.info-section {
		padding: 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		
		.title-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			
			.name {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
			
			.views {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.tags {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 20rpx;
			
			text {
				padding: 4rpx 16rpx;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
				font-size: 24rpx;
				color: #007AFF;
				background-color: rgba(0, 122, 255, 0.1);
				border-radius: 4rpx;
			}
		}
		
		.description {
			font-size: 28rpx;
			color: #666;
			line-height: 1.6;
		}
	}
	
	.content-section {
		padding: 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
	}
	
	.section {
		padding: 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		
		.section-header {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
		}
		
		.review-list {
			.review-item {
				padding: 20rpx 0;
				border-bottom: 2rpx solid #f5f5f5;
				
				&:last-child {
					border-bottom: none;
				}
				
				.user-info {
					display: flex;
					align-items: center;
					margin-bottom: 16rpx;
					
					image {
						width: 64rpx;
						height: 64rpx;
						border-radius: 32rpx;
						margin-right: 16rpx;
					}
					
					.nickname {
						font-size: 28rpx;
						color: #333;
						margin-right: 16rpx;
					}
				}
				
				.content {
					font-size: 28rpx;
					color: #333;
					line-height: 1.6;
					margin-bottom: 16rpx;
				}
				
				.images {
					display: flex;
					flex-wrap: wrap;
					margin: 0 -8rpx;
					
					image {
						width: calc(33.33% - 16rpx);
						height: 200rpx;
						margin: 8rpx;
						border-radius: 8rpx;
					}
				}
				
				.time {
					font-size: 24rpx;
					color: #999;
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
	
	.bottom-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #fff;
		border-top: 2rpx solid #f5f5f5;
		
		.left {
			display: flex;
			
			.action-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-left: 30rpx;
				
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
}
</style> 