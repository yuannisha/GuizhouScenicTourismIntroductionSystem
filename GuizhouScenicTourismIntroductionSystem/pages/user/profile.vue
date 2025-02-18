<template>
	<view class="profile-container">
		<!-- 用户信息 -->
		<view class="user-info" v-if="userInfo">
			<view class="avatar-nickname">
				<image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
				<text class="nickname">{{userInfo.nickname || userInfo.phone}}</text>
			</view>
			<button class="edit-btn" @click="handleEditProfile">编辑资料</button>
		</view>
		
		<!-- 未登录状态 -->
		<view class="not-login" v-else>
			<image src="/static/default-avatar.png" mode="aspectFill"></image>
			<view class="btn-group">
				<button type="primary" @click="goToLogin">登录</button>
				<button type="default" @click="goToRegister">注册</button>
			</view>
		</view>
		
		<!-- 功能菜单 -->
		<view class="menu-list">
			<view class="menu-item" @click="goToMyCollections">
				<view class="left">
					<text class="icon">❤️</text>
					<text class="name">我的收藏</text>
				</view>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="goToMyReviews">
				<view class="left">
					<text class="icon">📝</text>
					<text class="name">我的评价</text>
				</view>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="goToMyOrders">
				<view class="left">
					<text class="icon">🎫</text>
					<text class="name">我的订单</text>
				</view>
				<text class="arrow">></text>
			</view>
		</view>
		
		<!-- 其他功能 -->
		<view class="menu-list">
			<view class="menu-item" @click="handleFeedback">
				<view class="left">
					<text class="icon">💬</text>
					<text class="name">意见反馈</text>
				</view>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="handleAbout">
				<view class="left">
					<text class="icon">ℹ️</text>
					<text class="name">关于我们</text>
				</view>
				<text class="arrow">></text>
			</view>
		</view>
		
		<!-- 退出登录 -->
		<view class="logout-btn" v-if="userInfo" @click="handleLogout">
			<button type="warn">退出登录</button>
		</view>
	</view>
</template>

<script>
/**
 * 个人中心页面
 * @description 用户个人中心，展示用户信息和功能菜单
 */
export default {
	data() {
		return {
			userInfo: null
		}
	},
	onShow() {
        if(!uni.getStorageSync('userInfo')){
            this.goToLogin()
        }
		this.loadUserInfo()
	},
	methods: {
		/**
		 * 加载用户信息
		 */
		loadUserInfo() {
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) {
				this.userInfo = userInfo
			}
		},
		
		/**
		 * 跳转到登录页面
		 */
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		
		/**
		 * 跳转到注册页面
		 */
		goToRegister() {
			uni.navigateTo({
				url: '/pages/register/register'
			})
		},
		
		/**
		 * 处理编辑资料
		 */
		handleEditProfile() {
			uni.navigateTo({
				url: '/pages/user/edit'
			})
		},
		
		/**
		 * 跳转到我的收藏
		 */
		goToMyCollections() {
			if (!this.userInfo) {
				this.goToLogin()
				return
			}
			uni.navigateTo({
				url: '/pages/user/collections'
			})
		},
		
		/**
		 * 跳转到我的评价
		 */
		goToMyReviews() {
			if (!this.userInfo) {
				this.goToLogin()
				return
			}
			uni.navigateTo({
				url: '/pages/user/reviews'
			})
		},
		
		/**
		 * 跳转到我的订单
		 */
		goToMyOrders() {
			if (!this.userInfo) {
				this.goToLogin()
				return
			}
			uni.navigateTo({
				url: '/pages/user/orders'
			})
		},
		
		/**
		 * 处理意见反馈
		 */
		handleFeedback() {
			uni.navigateTo({
				url: '/pages/feedback/create'
			})
		},
		
		/**
		 * 处理关于我们
		 */
		handleAbout() {
			uni.navigateTo({
				url: '/pages/about/index'
			})
		},
		
		/**
		 * 处理退出登录
		 */
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync('userInfo')
						this.userInfo = null
						uni.showToast({
							title: '已退出登录'
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss">
.profile-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	
	.user-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		
		.avatar-nickname {
			display: flex;
			align-items: center;
			
			image {
				width: 120rpx;
				height: 120rpx;
				border-radius: 60rpx;
				margin-right: 20rpx;
			}
			
			.nickname {
				font-size: 32rpx;
				color: #333;
			}
		}
		
		.edit-btn {
			padding: 10rpx 30rpx;
			font-size: 28rpx;
			color: #666;
			background-color: #f5f5f5;
			border-radius: 30rpx;
		}
	}
	
	.not-login {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 40rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		
		image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			margin-bottom: 30rpx;
		}
		
		.btn-group {
			display: flex;
			
			button {
				margin: 0 20rpx;
				width: 200rpx;
			}
		}
	}
	
	.menu-list {
		background-color: #fff;
		margin-bottom: 20rpx;
		
		.menu-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 40rpx;
			border-bottom: 2rpx solid #f5f5f5;
			
			&:last-child {
				border-bottom: none;
			}
			
			.left {
				display: flex;
				align-items: center;
				
				.icon {
					margin-right: 20rpx;
					font-size: 40rpx;
				}
				
				.name {
					font-size: 28rpx;
					color: #333;
				}
			}
			
			.arrow {
				font-size: 28rpx;
				color: #999;
			}
		}
	}
	
	.logout-btn {
		padding: 40rpx;
		
		button {
			width: 100%;
		}
	}
}
</style> 