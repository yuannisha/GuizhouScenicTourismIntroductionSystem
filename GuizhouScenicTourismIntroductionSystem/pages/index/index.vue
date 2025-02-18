<template>
	<view class="container">
		
		<!-- 轮播图 -->
		<swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in bannerList" :key="index">
				<image :src="item.image" mode="aspectFill" @click="handleBannerClick(item)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 功能导航 -->
		<view class="nav-grid">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="handleNavClick(item)">
				<image :src="item.icon" mode="aspectFit"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		
		<!-- 热门景点 -->
		<view class="section">
			<view class="section-header">
				<text class="title">热门景点</text>
				<text class="more" @click="goToScenicList">查看更多</text>
			</view>
			<scroll-view class="scenic-scroll" scroll-x>
				<view class="scenic-list">
					<view 
						class="scenic-item" 
						v-for="(item, index) in hotScenics" 
						:key="index"
						@click="goToScenicDetail(item)"
					>
						<image :src="item.cover" mode="aspectFill"></image>
						<view class="info">
							<text class="name">{{item.name}}</text>
							<text class="price">¥{{item.price}}起</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 特色文化 -->
		<view class="section">
			<view class="section-header">
				<text class="title">特色文化</text>
				<text class="more" @click="goToCultureList">查看更多</text>
			</view>
			<view class="culture-list">
				<view 
					class="culture-item" 
					v-for="(item, index) in cultures" 
					:key="index"
					@click="goToCultureDetail(item)"
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
		</view>
	</view>
</template>

<script>
/**
 * 首页
 * @description 展示热门景点、特色文化等内容
 */
export default {
	data() {
		return {
			searchKeyword: '',
			bannerList: [
				{
					id: 1,
					image: '/static/banner/1.jpg',
					url: '/pages/scenic/detail?id=1'
				},
				{
					id: 2,
					image: '/static/banner/2.jpg',
					url: '/pages/scenic/detail?id=2'
				},
				{
					id: 3,
					image: '/static/banner/3.jpg',
					url: '/pages/scenic/detail?id=3'
				}
			],
			navList: [
				{
					id: 1,
					name: '景点',
					icon: '/static/nav/scenic.png',
					url: '/pages/scenic/list'
				},
				{
					id: 2,
					name: '美食',
					icon: '/static/nav/food.png',
					url: '/pages/food/list'
				},
				{
					id: 3,
					name: '文化',
					icon: '/static/nav/culture.png',
					url: '/pages/culture/list'
				},
				{
					id: 4,
					name: '攻略',
					icon: '/static/nav/guide.png',
					url: '/pages/guide/list'
				}
			],
			hotScenics: [],
			cultures: []
		}
	},
	onShow(){
		if(!uni.getStorageSync('userInfo')){
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
		this.loadHotScenics()
		this.loadCultures()
	},
	onLoad() {
		this.loadHotScenics()
		this.loadCultures()
	},
	methods: {
		/**
		 * 加载热门景点
		 */
		async loadHotScenics() {
			try {
				const res = await uniCloud.callFunction({
					name: 'scenic-center',
					data: {
						action: 'getScenicList',
						params: {
							USERID: uni.getStorageSync('userInfo')?._id,
							page: 1,
							pageSize: 5,
							orderBy: 'score'
						}
					}
				})
				
				if (res.result.code === 0) {
					this.hotScenics = res.result.data.list
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		/**
		 * 加载特色文化
		 */
		async loadCultures() {
			try {
				const res = await uniCloud.callFunction({
					name: 'culture-center',
					data: {
						action: 'getCultureList',
						params: {
							USERID: uni.getStorageSync('userInfo')?._id,
							page: 1,
							pageSize: 4
						}
					}
				})
				
				if (res.result.code === 0) {
					this.cultures = res.result.data.list
				}
			} catch (e) {
				console.error(e)
			}
		},

		
		handleBannerClick(item) {
			uni.navigateTo({
				url: item.url
			})
		},
		
		handleNavClick(item) {
			console.log(item)
			if(item.url == '/pages/scenic/list'){
				uni.switchTab({	
					url: item.url
				})
			}else{
				uni.navigateTo({
					url: item.url
				})
			}
			
		},
		
		/**
		 * 跳转到景点列表
		 */
		goToScenicList() {
			uni.switchTab({
				url: '/pages/scenic/list'
			})
		},
		
		/**
		 * 跳转到景点详情
		 */
		goToScenicDetail(item) {
			uni.navigateTo({
				url: `/pages/scenic/detail?id=${item._id}`
			})
		},
		
		/**
		 * 跳转到文化列表
		 */
		goToCultureList() {
			uni.navigateTo({
				url: '/pages/culture/list'
			})
		},
		
		/**
		 * 跳转到文化详情
		 */
		goToCultureDetail(item) {
			uni.navigateTo({
				url: `/pages/culture/detail?id=${item._id}`
			})
		}
	}
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #f5f5f5;
	
	.search-section {
		padding: 20rpx;
		background-color: #fff;
		
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
	}
	
	.banner {
		height: 300rpx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.nav-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		
		.nav-item {
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx 0;
			
			image {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 10rpx;
			}
			
			text {
				font-size: 24rpx;
				color: #333;
			}
		}
	}
	
	.section {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: #fff;
		
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
			
			.more {
				font-size: 28rpx;
				color: #666;
			}
		}
		
		.scenic-scroll {
			white-space: nowrap;
			
			.scenic-list {
				display: flex;
				padding-bottom: 10rpx;
				
				.scenic-item {
					width: 300rpx;
					margin-right: 20rpx;
					border-radius: 12rpx;
					overflow: hidden;
					
					image {
						width: 100%;
						height: 200rpx;
					}
					
					.info {
						padding: 10rpx;
						
						.name {
							font-size: 28rpx;
							color: #333;
						}
						
						.price {
							font-size: 24rpx;
							color: #ff4d4f;
						}
					}
				}
			}
		}
		
		.culture-list {
			.culture-item {
				display: flex;
				margin-bottom: 20rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				image {
					width: 200rpx;
					height: 150rpx;
					border-radius: 8rpx;
					margin-right: 20rpx;
				}
				
				.info {
					flex: 1;
					
					.name {
						font-size: 28rpx;
						font-weight: bold;
						color: #333;
						margin-bottom: 10rpx;
					}
					
					.description {
						font-size: 24rpx;
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
		}
	}
}
</style>
