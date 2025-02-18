<template>
	<view class="culture-list-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input 
				type="text" 
				v-model="searchKeyword"
				placeholder="搜索文化"
				@confirm="handleSearch"
			/>
			<button @click="handleSearch">搜索</button>
		</view>
		
		<!-- 分类标签 -->
		<scroll-view scroll-x class="category-list">
			<view 
				class="category-item" 
				:class="{ active: currentCategory === index }"
				v-for="(item, index) in categories" 
				:key="index"
				@click="handleCategoryChange(index)"
			>
				{{item}}
			</view>
		</scroll-view>
		
		<!-- 文化列表 -->
		<scroll-view 
			scroll-y 
			class="culture-list"
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="refresh"
		>
			<view 
				class="culture-item"
				v-for="(item, index) in cultureList"
				:key="index"
				@click="goToDetail(item._id)"
			>
				<image :src="item.images[0]" mode="aspectFill"></image>
				<view class="info">
					<text class="name">{{item.name}}</text>
					<view class="tags">
						<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
					</view>
					<text class="description">{{item.description}}</text>
					<view class="bottom">
						<text class="views">{{item.views}}浏览</text>
					</view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-status">
				<text v-if="isLoading">加载中...</text>
				<text v-else-if="hasMore">上拉加载更多</text>
				<text v-else>没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
/**
 * 文化列表页面
 * @description 展示文化列表，支持分类筛选和搜索
 */
export default {
	data() {
		return {
			categories: ['全部', '民族文化', '历史文化', '饮食文化', '节日文化', '其他'],
			currentCategory: 0,
			searchKeyword: '',
			page: 1,
			pageSize: 10,
			total: 0,
			cultureList: [],
			isLoading: false,
			isRefreshing: false,
			hasMore: true
		}
	},
	onLoad() {
		this.loadCultureList()
	},
	methods: {
		/**
		 * 加载文化列表
		 */
		async loadCultureList() {
			if (this.isLoading || !this.hasMore) return
			
			this.isLoading = true
			console.log("当前分类",this.currentCategory)
			
			try {
				const res = await uniCloud.callFunction({
					name: 'culture-center',
					data: {
						action: 'getCultureList',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							page: this.page,
							pageSize: this.pageSize,
							category: this.currentCategory ,
							keyword: this.searchKeyword
						}
					}
				})
				
				if (res.result.code === 0) {
					const { list, total } = res.result.data
					
					if (this.page === 1) {
						this.cultureList = list
					} else {
						this.cultureList = [...this.cultureList, ...list]
					}
					
					this.total = total
					this.hasMore = this.cultureList.length < total
					this.page++
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
				this.isLoading = false
				this.isRefreshing = false
			}
		},
		
		/**
		 * 处理搜索
		 */
		handleSearch() {
			this.page = 1
			this.hasMore = true
			this.loadCultureList()
		},
		
		/**
		 * 处理分类切换
		 */
		handleCategoryChange(index) {
			this.currentCategory = index
			this.page = 1
			this.hasMore = true
			this.loadCultureList()
		},
		
		/**
		 * 加载更多
		 */
		loadMore() {
			this.loadCultureList()
		},
		
		/**
		 * 刷新列表
		 */
		refresh() {
			this.isRefreshing = true
			this.page = 1
			this.hasMore = true
			this.loadCultureList()
		},
		
		/**
		 * 跳转到详情页
		 */
		goToDetail(id) {
			uni.navigateTo({
				url: `/pages/culture/detail?id=${id}`
			})
		}
	}
}
</script>

<style lang="scss">
.culture-list-container {
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
			margin-right: 20rpx;
		}
		
		button {
			width: 120rpx;
			height: 72rpx;
			line-height: 72rpx;
			font-size: 28rpx;
			color: #fff;
			background-color: #007AFF;
			border-radius: 36rpx;
		}
	}
	
	.category-list {
		white-space: nowrap;
		padding: 20rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		
		.category-item {
			display: inline-block;
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
		}
	}
	
	.culture-list {
		height: calc(100vh - 220rpx);
		
		.culture-item {
			display: flex;
			margin: 20rpx;
			padding: 20rpx;
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
				
				.tags {
					display: flex;
					flex-wrap: wrap;
					margin-bottom: 10rpx;
					
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
				
				.description {
					font-size: 28rpx;
					color: #666;
					margin-bottom: 10rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				
				.bottom {
					margin-top: auto;
					
					.views {
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