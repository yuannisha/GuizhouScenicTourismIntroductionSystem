<template>
	<view class="reviews-container">
		<!-- 分类标签 -->
		<scroll-view class="category-scroll" scroll-x>
			<view class="category-list">
				<view 
					class="category-item" 
					:class="{ active: currentCategory === item.value }"
					v-for="item in categories" 
					:key="item.value"
					@click="handleCategoryChange(item.value)"
				>
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		
		<!-- 评价列表 -->
		<scroll-view 
			class="review-list"
			scroll-y
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="refresh"
		>
			<view class="review-items">
				<view 
					class="review-item"
					v-for="(item, index) in reviewList"
					:key="index"
				>
					<view class="target-info" @click="goToDetail(item)">
						<image :src="item.cover" mode="aspectFill"></image>
						<view class="info">
							<text class="name">{{item.name}}</text>
							<text v-if="currentCategory === 'scenic' || currentCategory === 'food'" class="score">{{item.score}}分</text>
						</view>
					</view>
					<view class="review-content">
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
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-status">
				<text v-if="loading">加载中...</text>
				<text v-else-if="noMore">没有更多了</text>
				<text v-else-if="reviewList.length === 0">暂无评价</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { formatDate } from '@/utils/date.js'

/**
 * 我的评价页面
 * @description 展示用户发表的景点、美食、文化和攻略评价
 */
export default {
	data() {
		return {
			categories: [
				{ name: '景点', value: 'scenic' },
				{ name: '美食', value: 'food' },
				{ name: '文化', value: 'culture' },
				{ name: '攻略', value: 'guide' }
			],
			currentCategory: 'scenic',
			reviewList: [],
			page: 1,
			pageSize: 10,
			loading: false,
			noMore: false,
			isRefreshing: false
		}
	},
	onLoad() {
		this.loadReviews()
	},
	methods: {
		/**
		 * 加载评价列表
		 */
		async loadReviews() {
			if (this.loading || this.noMore) return
			
			this.loading = true
			
			try {
				const res = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'getReviews',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							type: this.currentCategory,
							page: this.page,
							pageSize: this.pageSize
						}
					}
				})
				
				if (res.result.code === 0) {
					const { list, total } = res.result.data
					
					if (this.page === 1) {
						this.reviewList = list
					} else {
						this.reviewList = [...this.reviewList, ...list]
					}
					
					this.noMore = this.reviewList.length >= total
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
			} finally {
				this.loading = false
				this.isRefreshing = false
			}
		},
		
		/**
		 * 处理分类切换
		 */
		handleCategoryChange(category) {
			this.currentCategory = category
			this.page = 1
			this.noMore = false
			this.reviewList = []
			this.loadReviews()
		},
		
		/**
		 * 加载更多
		 */
		loadMore() {
			if (!this.loading && !this.noMore) {
				this.page++
				this.loadReviews()
			}
		},
		
		/**
		 * 刷新列表
		 */
		refresh() {
			this.isRefreshing = true
			this.page = 1
			this.noMore = false
			this.loadReviews()
		},
		
		/**
		 * 跳转到详情页
		 */
		goToDetail(item) {
			let url = ''
			switch (this.currentCategory) {
				case 'scenic':
					url = `/pages/scenic/detail?id=${item.scenic_id}`
					break
				case 'food':
					url = `/pages/food/detail?id=${item.food_id}`
					break
				case 'culture':
					url = `/pages/culture/detail?id=${item.culture_id}`
					break
				case 'guide':
					url = `/pages/guide/detail?id=${item.guide_id}`
					break
			}
			if (url) {
				uni.navigateTo({ url })
			}
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
		 * 格式化日期
		 */
		formatDate(timestamp) {
			return formatDate(timestamp)
		}
	}
}
</script>

<style lang="scss">
.reviews-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	
	.category-scroll {
		background-color: #fff;
		white-space: nowrap;
		
		.category-list {
			display: flex;
			padding: 20rpx;
			
			.category-item {
				padding: 10rpx 30rpx;
				margin-right: 20rpx;
				font-size: 28rpx;
				color: #666;
				background-color: #f5f5f5;
				border-radius: 30rpx;
				
				&.active {
					color: #fff;
					background-color: #007AFF;
				}
				
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
	
	.review-list {
		height: calc(100vh - 100rpx);
		padding: 20rpx;
		box-sizing: border-box;
		
		.review-items {
			.review-item {
				padding: 20rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				border-radius: 12rpx;
				
				.target-info {
					display: flex;
					margin-bottom: 20rpx;
					
					image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 8rpx;
						margin-right: 20rpx;
					}
					
					.info {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						
						.name {
							font-size: 28rpx;
							font-weight: bold;
							color: #333;
							margin-bottom: 10rpx;
						}
						
						.score {
							font-size: 26rpx;
							color: #ff4d4f;
						}
					}
				}
				
				.review-content {
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
						margin-bottom: 16rpx;
						
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
		}
		
		.loading-status {
			text-align: center;
			padding: 20rpx;
			
			text {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}
</style> 