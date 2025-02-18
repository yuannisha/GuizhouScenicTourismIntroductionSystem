<template>
	<view class="guide-list-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input type="text" v-model="keyword" placeholder="搜索攻略" />
			<button @click="handleSearch">搜索</button>
		</view>
		
		<!-- 标签列表 -->
		<scroll-view 
			class="tags-scroll" 
			scroll-x="true" 
			show-scrollbar="false"
		>
			<view class="tags-list">
				<text 
					class="tag-item" 
					:class="{ active: currentTag === '' }"
					@click="handleTagChange('')"
				>全部</text>
				<text 
					v-for="(tag, index) in tags" 
					:key="index"
					class="tag-item"
					:class="{ active: currentTag === tag }"
					@click="handleTagChange(tag)"
				>{{tag}}</text>
			</view>
		</scroll-view>
		
		<!-- 攻略列表 -->
		<scroll-view 
			class="guide-scroll"
			scroll-y="true"
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="refresh"
		>
			<view class="guide-list">
				<view 
					class="guide-item"
					v-for="(item, index) in guideList"
					:key="index"
					@click="goDetail(item._id)"
				>
					<image 
						class="cover"
						:src="item.cover || '/static/default-cover.png'"
						mode="aspectFill"
					></image>
					<view class="info">
						<text class="name">{{item.name}}</text>
						<text class="description">{{item.description}}</text>
						<view class="tags">
							<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
						</view>
						<view class="stats">
							<text class="views">{{item.views}}浏览</text>
							<text class="likes">{{item.likes}}点赞</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-status">
				<view v-if="loading" class="loading">加载中...</view>
				<view v-else-if="!hasMore" class="no-more">没有更多了</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
/**
 * 攻略列表页面
 * @description 展示攻略列表,支持搜索、标签筛选、下拉刷新、上拉加载更多
 */
export default {
	data() {
		return {
			keyword: '',
			currentTag: '',
			tags: ['美食', '景点', '住宿', '交通', '购物', '娱乐'],
			guideList: [],
			page: 1,
			pageSize: 10,
			loading: false,
			hasMore: true,
			isRefreshing: false,
			total: 0
		}
	},
	onLoad() {
		this.loadGuideList()
	},
	methods: {
		/**
		 * 加载攻略列表
		 */
		async loadGuideList() {
			if (this.loading || !this.hasMore) return
			
			this.loading = true
			
			try {
				const res = await uniCloud.callFunction({
					name: 'guide-center',
					data: {
						action: 'getGuideList',
						params: {
							USERID: uni.getStorageSync('userInfo')?._id,
							page: this.page,
							pageSize: this.pageSize,
							keyword: this.keyword,
							tag: this.currentTag
						}
					}
				})
				
				if (res.result.code === 0) {
					const { list, total } = res.result.data
					
					if (this.page === 1) {
						this.guideList = list
					} else {
						this.guideList = [...this.guideList, ...list]
					}
					
					this.total = total
					this.hasMore = this.guideList.length < total
				} else {
					uni.showToast({
						title: res.result.message || '加载失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
				console.error(e)
			} finally {
				this.loading = false
				this.isRefreshing = false
			}
		},
		
		/**
		 * 处理搜索
		 */
		handleSearch() {
			this.page = 1
			this.hasMore = true
			this.loadGuideList()
		},
		
		/**
		 * 处理标签切换
		 */
		handleTagChange(tag) {
			this.currentTag = tag
			this.page = 1
			this.hasMore = true
			this.loadGuideList()
		},
		
		/**
		 * 加载更多
		 */
		loadMore() {
			if (this.hasMore) {
				this.page++
				this.loadGuideList()
			}
		},
		
		/**
		 * 刷新列表
		 */
		async refresh() {
			this.isRefreshing = true
			this.page = 1
			this.hasMore = true
			await this.loadGuideList()
		},
		
		/**
		 * 跳转到详情页
		 */
		goDetail(id) {
			uni.navigateTo({
				url: `/pages/guide/detail?id=${id}`
			})
		}
	}
}
</script>

<style lang="scss">
.guide-list-container {
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
			font-size: 28rpx;
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
	
	.tags-scroll {
		background-color: #fff;
		white-space: nowrap;
		
		.tags-list {
			display: inline-flex;
			padding: 20rpx;
			
			.tag-item {
				padding: 8rpx 24rpx;
				margin-right: 20rpx;
				font-size: 28rpx;
				color: #666;
				background-color: #f5f5f5;
				border-radius: 28rpx;
				
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
	
	.guide-scroll {
		height: calc(100vh - 200rpx);
		
		.guide-list {
			padding: 20rpx;
			
			.guide-item {
				display: flex;
				padding: 20rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				border-radius: 12rpx;
				
				.cover {
					width: 200rpx;
					height: 200rpx;
					margin-right: 20rpx;
					border-radius: 8rpx;
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
					
					.description {
						font-size: 28rpx;
						color: #666;
						margin-bottom: 10rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					
					.tags {
						display: flex;
						flex-wrap: wrap;
						margin-bottom: 10rpx;
						
						text {
							padding: 4rpx 16rpx;
							margin-right: 16rpx;
							margin-bottom: 10rpx;
							font-size: 24rpx;
							color: #007AFF;
							background-color: rgba(0, 122, 255, 0.1);
							border-radius: 4rpx;
						}
					}
					
					.stats {
						display: flex;
						align-items: center;
						font-size: 24rpx;
						color: #999;
						
						.views {
							margin-right: 20rpx;
						}
					}
				}
			}
		}
		
		.loading-status {
			padding: 20rpx;
			text-align: center;
			font-size: 28rpx;
			color: #999;
		}
	}
}
</style> 