<template>
	<view class="login-container">
		<view class="login-form">
			<view class="logo">
				<image src="/static/logo.png" mode="aspectFit"></image>
			</view>
			<view class="input-group">
				<input type="text" v-model="phone" placeholder="请输入手机号" maxlength="11" />
                <view class="verify-code">
					<input type="text" v-model="verifyCode" placeholder="请输入验证码" maxlength="6" />
					<button :disabled="counting" @click="getVerifyCode">
						{{counting ? `${countdown}s后重试` : '获取验证码'}}
					</button>
				</view>
				<input type="password" v-model="password" placeholder="请输入密码" />
			</view>
			<view class="btn-group">
				<button type="primary" @click="handleLogin">登录</button>
				<button type="default" @click="goToRegister">注册账号</button>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 登录页面
 * @description 用户登录界面，支持手机号密码登录
 */
export default {
	data() {
		return {
			phone: '',
            verifyCode:'',
			password: '',
            counting: false,
			countdown: 60
		}
	},
	methods: {

        /**
		 * 获取验证码
		 */
		async getVerifyCode() {
			if (this.counting) return
			
			if (!this.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				})
				return
			}
			
			if (!/^1[3-9]\d{9}$/.test(this.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				})
				return
			}
			
			try {
				const res = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'sendVerifyCode',
						params: {
							phone: this.phone
						}
					}
				})
				
				if (res.result.code === 0) {
					uni.showToast({
						title: '验证码已发送'
					})
					this.startCountdown()
				} else {
					uni.showToast({
						title: res.result.message || '发送失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '发送失败，请稍后重试',
					icon: 'none'
				})
				console.error(e)
			}
		},

        /**
		 * 开始倒计时
		 */
		startCountdown() {
			this.counting = true
			this.countdown = 60
			const timer = setInterval(() => {
				if (this.countdown > 0) {
					this.countdown--
				} else {
					this.counting = false
					clearInterval(timer)
				}
			}, 1000)
		},

		/**
		 * 处理登录请求
		 */
		async handleLogin() {
			if (!this.phone || !this.password || !this.verifyCode) {
				uni.showToast({
					title: '请输入手机号和密码',
					icon: 'none'
				})
				return
			}
			
			// 验证手机号格式
			if (!/^1[3-9]\d{9}$/.test(this.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				})
				return
			}
			
			try {
				const res = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'login',
						params: {
							phone: this.phone,
                            verifyCode:this.verifyCode,
							password: this.password
						}
					}
				})
				
				if (res.result.code === 0) {
					// 存储用户信息
					uni.setStorageSync('userInfo', res.result.data)
					uni.showToast({
						title: '登录成功'
					})
					// 跳转到首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 1500)
				} else {
					uni.showToast({
						title: res.result.message || '登录失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '登录失败，请稍后重试',
					icon: 'none'
				})
				console.error(e)
			}
		},
		
		/**
		 * 跳转到注册页面
		 */
		goToRegister() {
			uni.navigateTo({
				url: '/pages/register/register'
			})
		}
	}
}
</script>

<style lang="scss">
.login-container {
	min-height: 100vh;
	padding: 60rpx;
	background-color: #f5f5f5;
	
	.login-form {
		padding: 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
		
		.logo {
			text-align: center;
			margin-bottom: 60rpx;
			
			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
		
		.input-group {
			margin-bottom: 40rpx;
			
			input {
				width: 100%;
				height: 88rpx;
				margin-bottom: 20rpx;
				padding: 0 20rpx;
				border: 2rpx solid #dcdcdc;
				border-radius: 8rpx;
				font-size: 28rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
			}

            .verify-code {
				display: flex;
				margin-bottom: 20rpx;
				
				input {
					flex: 1;
					margin-bottom: 0;
					margin-right: 20rpx;
				}
				
				button {
					width: 200rpx;
					height: 88rpx;
					line-height: 88rpx;
					font-size: 26rpx;
					padding: 0;
				}
			}
		}
		
		.btn-group {
			button {
				margin-bottom: 20rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
}
</style> 