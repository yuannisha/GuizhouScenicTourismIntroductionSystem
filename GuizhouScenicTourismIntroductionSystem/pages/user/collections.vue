<template>
	<view class="collections-container">
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
		
		<!-- 收藏列表 -->
		<scroll-view 
			class="collection-list"
			scroll-y
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="refresh"
		>
			<!-- 景点收藏 -->
			<view v-if="currentCategory === 'scenic'" class="collection-items">
				<view 
					class="scenic-item"
					v-for="(item, index) in collectionList"
					:key="index"
					@click="goToDetail(item)"
				>
					<image :src="item.cover" mode="aspectFill"></image>
					<view class="info">
						<text class="name">{{item.name}}</text>
						<text class="location">{{item.location}}</text>
						<text class="price">¥{{item.price}}起</text>
						<view class="tags">
							<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 美食收藏 -->
			<view v-if="currentCategory === 'food'" class="collection-items">
				<view 
					class="food-item"
					v-for="(item, index) in collectionList"
					:key="index"
					@click="goToDetail(item)"
				>
					<image :src="item.cover" mode="aspectFill"></image>
					<view class="info">
						<text class="name">{{item.name}}</text>
						<text class="location">{{item.location}}</text>
						<text class="price">¥{{item.price}}</text>
						<view class="tags">
							<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 文化收藏 -->
			<view v-if="currentCategory === 'culture'" class="collection-items">
				<view 
					class="culture-item"
					v-for="(item, index) in collectionList"
					:key="index"
					@click="goToDetail(item)"
				>
					<image :src="item.cover" mode="aspectFill"></image>
					<view class="info">
						<text class="name">{{item.name}}</text>
						<text class="description">{{item.description}}</text>
						<view class="tags">
							<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 攻略收藏 -->
			<view v-if="currentCategory === 'guide'" class="collection-items">
				<view 
					class="guide-item"
					v-for="(item, index) in collectionList"
					:key="index"
					@click="goToDetail(item)"
				>
					<image :src="item.cover" mode="aspectFill"></image>
					<view class="info">
						<text class="name">{{item.name}}</text>
						<text class="description">{{item.description}}</text>
						<view class="bottom">
							<view class="tags">
								<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
							</view>
							<text class="views">{{item.views}}浏览</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-status">
				<text v-if="loading">加载中...</text>
				<text v-else-if="noMore">没有更多了</text>
				<text v-else-if="collectionList.length === 0">暂无收藏</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
/**
 * 我的收藏页面
 * @description 展示用户收藏的景点、美食、文化和攻略
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
			collectionList: [],
			page: 1,
			pageSize: 10,
			loading: false,
			noMore: false,
			isRefreshing: false
		}
	},
	onLoad() {
		this.loadCollections()
	},
	methods: {
		/**
		 * 加载收藏列表
		 */
		async loadCollections() {
			if (this.loading || this.noMore) return
			
			this.loading = true
            console.log("当前分类",this.currentCategory)
			
			try {
				const res = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'getCollections',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							type: this.currentCategory,
							page: this.page,
							pageSize: this.pageSize
						}
					}
				})
				console.log("收藏列表",res)	
				if (res.result.code === 0) {
					const { list, total } = res.result.data
					
					if (this.page === 1) {
						this.collectionList = list
					} else {
						this.collectionList = [...this.collectionList, ...list]
					}
					
					this.noMore = this.collectionList.length >= total
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
			this.collectionList = []
			this.loadCollections()
		},
		
		/**
		 * 加载更多
		 */
		loadMore() {
			if (!this.loading && !this.noMore) {
				this.page++
				this.loadCollections()
			}
		},
		
		/**
		 * 刷新列表
		 */
		refresh() {
			this.isRefreshing = true
			this.page = 1
			this.noMore = false
			this.loadCollections()
		},
		
		/**
		 * 跳转到详情页
		 */
		goToDetail(item) {
			let url = ''
			switch (this.currentCategory) {
				case 'scenic':
					url = `/pages/scenic/detail?id=${item._id}`
					break
				case 'food':
					url = `/pages/food/detail?id=${item._id}`
					break
				case 'culture':
					url = `/pages/culture/detail?id=${item._id}`
					break
				case 'guide':
					url = `/pages/guide/detail?id=${item._id}`
					break
			}
			if (url) {
				uni.navigateTo({ url })
			}
		}
	}
}
</script>

<style lang="scss">
.collections-container {
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
	
	.collection-list {
		height: calc(100vh - 100rpx);
		padding: 20rpx;
		box-sizing: border-box;
		
		.collection-items {
			.scenic-item,
			.food-item,
			.culture-item,
			.guide-item {
				display: flex;
				padding: 20rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				border-radius: 12rpx;
				
				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 8rpx;
					margin-right: 20rpx;
				}
				
				.info {
					flex: 1;
					display: flex;
					flex-direction: column;
					
					.name {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
						margin-bottom: 10rpx;
					}
					
					.location,
					.description {
						font-size: 26rpx;
						color: #666;
						margin-bottom: 10rpx;
					}
					
					.price {
						font-size: 28rpx;
						color: #ff4d4f;
						margin-bottom: 10rpx;
					}
					
					.tags {
						display: flex;
						flex-wrap: wrap;
						
						text {
							padding: 4rpx 12rpx;
							margin-right: 10rpx;
							margin-bottom: 10rpx;
							font-size: 22rpx;
							color: #007AFF;
							background-color: rgba(0, 122, 255, 0.1);
							border-radius: 4rpx;
						}
					}
					
					.bottom {
						margin-top: auto;
						display: flex;
						justify-content: space-between;
						align-items: center;
						
						.views {
							font-size: 24rpx;
							color: #999;
						}
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