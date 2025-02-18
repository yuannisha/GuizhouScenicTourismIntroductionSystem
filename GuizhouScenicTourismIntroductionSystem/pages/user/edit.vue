<template>
	<view class="edit-profile-container">
		<view class="form-group">
			<!-- 头像 -->
			<view class="form-item avatar-item">
				<text class="label">头像</text>
				<view class="avatar-wrapper" @click="handleChooseAvatar">
					<image :src="formData.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
					<text class="tip">点击更换头像</text>
				</view>
			</view>
			
			<!-- 昵称 -->
			<view class="form-item">
				<text class="label">昵称</text>
				<input 
					type="text"
					v-model="formData.nickname"
					placeholder="请输入昵称"
					maxlength="32"
				/>
			</view>
			
			<!-- 手机号 -->
			<view class="form-item">
				<text class="label">手机号</text>
				<text class="phone">{{formData.phone}}</text>
			</view>
		</view>
		
		<!-- 保存按钮 -->
		<view class="btn-group">
			<button type="primary" @click="handleSave">保存</button>
		</view>
	</view>
</template>

<script>
/**
 * 用户资料编辑页面
 * @description 编辑用户个人资料
 */
export default {
	data() {
		return {
			formData: {
				avatar: '',
				nickname: '',
				phone: ''
			}
		}
	},
	onLoad() {
		this.loadUserInfo()
	},
	methods: {
		/**
		 * 加载用户信息
		 */
		loadUserInfo() {
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) {
				this.formData = {
					avatar: userInfo.avatar || '',
					nickname: userInfo.nickname || '',
					phone: userInfo.phone || ''
				}
			}
		},
		
		/**
		 * 处理选择头像
		 */
		handleChooseAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: async (res) => {
					const tempFilePath = res.tempFilePaths[0]
					
					// 显示上传中
					uni.showLoading({
						title: '上传中...'
					})
					
					try {
						// 上传图片到云存储
						const uploadRes = await uniCloud.uploadFile({
							filePath: tempFilePath,
							cloudPath: `avatar/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`
						})
						
						this.formData.avatar = uploadRes.fileID
					} catch (e) {
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						})
						console.error(e)
					} finally {
						uni.hideLoading()
					}
				}
			})
		},
		
		/**
		 * 处理保存
		 */
		async handleSave() {
			if (!this.formData.nickname.trim()) {
				uni.showToast({
					title: '请输入昵称',
					icon: 'none'
				})
				return
			}
			
			try {
				const res = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'updateProfile',
						params: {
                            USERID:uni.getStorageSync('userInfo')._id,
							avatar: this.formData.avatar,
							nickname: this.formData.nickname
						}
					}
				})
				
				if (res.result.code === 0) {
					// 更新本地存储的用户信息
					const userInfo = uni.getStorageSync('userInfo')
					userInfo.avatar = this.formData.avatar
					userInfo.nickname = this.formData.nickname
					uni.setStorageSync('userInfo', userInfo)
					
					uni.showToast({
						title: '保存成功'
					})
					
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} else {
					uni.showToast({
						title: res.result.message || '保存失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '保存失败，请重试',
					icon: 'none'
				})
				console.error(e)
			}
		}
	}
}
</script>

<style lang="scss">
.edit-profile-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 20rpx;
	
	.form-group {
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		
		.form-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 2rpx solid #f5f5f5;
			
			&:last-child {
				border-bottom: none;
			}
			
			.label {
				width: 120rpx;
				font-size: 28rpx;
				color: #333;
			}
			
			input {
				flex: 1;
				height: 60rpx;
				font-size: 28rpx;
			}
			
			.phone {
				flex: 1;
				font-size: 28rpx;
				color: #666;
			}
			
			&.avatar-item {
				padding: 40rpx 30rpx;
				
				.avatar-wrapper {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					
					image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 60rpx;
						margin-bottom: 20rpx;
					}
					
					.tip {
						font-size: 24rpx;
						color: #999;
					}
				}
			}
		}
	}
	
	.btn-group {
		margin-top: 60rpx;
		padding: 0 40rpx;
		
		button {
			width: 100%;
		}
	}
}
</style> 