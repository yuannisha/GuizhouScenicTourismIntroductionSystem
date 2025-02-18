<template>
	<view class="food-list-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input type="text" v-model="searchKeyword" placeholder="搜索美食" />
			<button @click="handleSearch">搜索</button>
		</view>
		
		<!-- 分类标签 -->
		<scroll-view class="category-scroll" scroll-x>
			<view class="category-list">
				<view 
					class="category-item" 
					:class="{ active: currentCategory === item.id }"
					v-for="(item, index) in categoryList" 
					:key="index"
					@click="handleCategoryChange(item)"
				>
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		
		<!-- 美食列表 -->
		<scroll-view 
			class="food-list"
			scroll-y
			@scrolltolower="loadMore"
			:style="{ height: listHeight + 'px' }"
		>
			<view 
				class="food-item"
				v-for="(item, index) in foodList"
				:key="index"
				@click="goToDetail(item)"
			>
				<image :src="item.cover" mode="aspectFill"></image>
				<view class="info">
					<view class="name-price">
						<text class="name">{{item.name}}</text>
						<text class="price">¥{{item.price}}起</text>
					</view>
					<text class="location">{{item.location}}</text>
					<text class="description">{{item.description}}</text>
					<view class="tags">
						<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
					</view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-status">
				<text v-if="loading">加载中...</text>
				<text v-else-if="noMore">没有更多了</text>
				<text v-else-if="foodList.length === 0">暂无数据</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
/**
 * 美食列表页面
 * @description 展示美食列表，支持分类筛选和搜索
 */
export default {
	data() {
		return {
			searchKeyword: '',
			currentCategory: 0,
			categoryList: [
				{ id: 0, name: '全部' },
				{ id: 1, name: '特色小吃' },
				{ id: 2, name: '地方菜系' },
				{ id: 3, name: '传统美食' },
				{ id: 4, name: '创新菜品' }
			],
			foodList: [],
			page: 1,
			pageSize: 10,
			loading: false,
			noMore: false,
			listHeight: 0
		}
	},
	onLoad() {
		// 计算列表高度
		const systemInfo = uni.getSystemInfoSync()
		// 减去搜索栏和分类标签的高度
		this.listHeight = systemInfo.windowHeight - uni.upx2px(180)
		
		this.loadFoodList()
	},
	methods: {
		/**
		 * 加载美食列表
		 */
		async loadFoodList() {
			if (this.loading || this.noMore) return
			
			this.loading = true
			console.log("当前分类",this.currentCategory)
			
			try {
				const res = await uniCloud.callFunction({
					name: 'food-center',
					data: {
						action: 'getFoodList',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							page: this.page,
							pageSize: this.pageSize,
							category: this.currentCategory,
							keyword: this.searchKeyword
						}
					}
				})
				
				if (res.result.code === 0) {
					const { list, total } = res.result.data
					
					if (this.page === 1) {
						this.foodList = list
					} else {
						this.foodList = [...this.foodList, ...list]
					}
					
					this.noMore = this.foodList.length >= total
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
			}
		},
		
		/**
		 * 处理搜索
		 */
		handleSearch() {
			this.page = 1
			this.noMore = false
			this.loadFoodList()
		},
		
		/**
		 * 处理分类切换
		 */
		handleCategoryChange(category) {
			this.currentCategory = category.id
			this.page = 1
			this.noMore = false
			this.loadFoodList()
		},
		
		/**
		 * 加载更多
		 */
		loadMore() {
			if (!this.loading && !this.noMore) {
				this.page++
				this.loadFoodList()
			}
		},
		
		/**
		 * 跳转到详情页
		 */
		goToDetail(item) {
			uni.navigateTo({
				url: `/pages/food/detail?id=${item._id}`
			})
		}
	}
}
</script>

<style lang="scss">
.food-list-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	
	.search-bar {
		display: flex;
		padding: 20rpx;
		background-color: #fff;
		
		input {
			flex: 1;
			height: 72rpx;
			padding: 0 20rpx;
			background-color: #f5f5f5;
			border-radius: 36rpx;
			font-size: 28rpx;
		}
		
		button {
			width: 120rpx;
			height: 72rpx;
			margin-left: 20rpx;
			line-height: 72rpx;
			font-size: 28rpx;
			color: #fff;
			background-color: #007AFF;
			border-radius: 36rpx;
		}
	}
	
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
	
	.food-list {
		padding: 20rpx;
		box-sizing: border-box;
		
		.food-item {
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
				
				.name-price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;
					
					.name {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
					}
					
					.price {
						font-size: 28rpx;
						color: #ff4d4f;
					}
				}
				
				.location {
					font-size: 24rpx;
					color: #666;
					margin-bottom: 10rpx;
				}
				
				.description {
					font-size: 26rpx;
					color: #666;
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