<template>
	<view class="review-popup" v-if="show">
		<view class="mask" @click="handleClose"></view>
		<view class="content">
			<view class="header">
				<text class="title">发表评论</text>
				<text class="close" @click="handleClose">×</text>
			</view>
			<view class="form">
				<view class="score-section" v-if="type === 'scenic' || type === 'food'">
					<text class="label">评分</text>
					<view class="score-input">
						<slider 
							:value="score * 10" 
							:min="0" 
							:max="50" 
							:step="1"
							:show-value="false"
							@change="handleScoreChange"
						/>
						<text class="score-text">{{score}}分</text>
					</view>
				</view>
				<textarea 
					v-model="content" 
					placeholder="说说你的想法..." 
					:maxlength="500"
					auto-height
				></textarea>
				<view class="image-list" v-if="images.length > 0">
					<image 
						v-for="(item, index) in images" 
						:key="index" 
						:src="item" 
						mode="aspectFill"
						@click="previewImage(index)"
					></image>
				</view>
				<view class="upload-btn" @click="chooseImage" v-if="images.length < 9">
					<text class="icon">+</text>
					<text class="text">添加图片</text>
				</view>
			</view>
			<view class="footer">
				<button class="submit-btn" @click="handleSubmit">发表评论</button>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 评论弹窗组件
 * @description 用于发表评论的弹窗组件
 * @property {Boolean} show 是否显示弹窗
 * @property {String} type 评论类型 (scenic/food/culture/guide)
 * @property {String} targetId 评论目标ID
 * @event {Function} close 关闭弹窗
 * @event {Function} submit 提交评论
 */
export default {
	name: 'review-popup',
	props: {
		show: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			required: true
		},
		targetId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			content: '',
			images: [],
			score: 5.0,
			maxImages: 9
		}
	},
	methods: {
		/**
		 * 处理评分变化
		 */
		handleScoreChange(e) {
			this.score = Number((e.detail.value / 10).toFixed(1))
		},
		
		/**
		 * 关闭弹窗
		 */
		handleClose() {
			this.$emit('close')
			this.content = ''
			this.images = []
			this.score = 5.0
		},
		
		/**
		 * 选择图片
		 */
		chooseImage() {
			uni.chooseImage({
				count: 9 - this.images.length,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: async (res) => {
					uni.showLoading({
						title: '上传中...'
					})
					
					try {
						const uploadTasks = res.tempFilePaths.map(path => {
							return uniCloud.uploadFile({
								filePath: path,
								cloudPath: `review/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`
							})
						})
						
						const results = await Promise.all(uploadTasks)
						this.images = [...this.images, ...results.map(item => item.fileID)]
					} catch (e) {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						})
					} finally {
						uni.hideLoading()
					}
				}
			})
		},
		
		/**
		 * 预览图片
		 */
		previewImage(index) {
			uni.previewImage({
				urls: this.images,
				current: this.images[index]
			})
		},
		
		/**
		 * 提交评论
		 */
		async handleSubmit() {
			if (!this.content.trim()) {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none'
				})
				return
			}
			
			const userInfo = uni.getStorageSync('userInfo')
			if (!userInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			
			try {
				const centerMap = {
					scenic: 'scenic-center',
					food: 'food-center',
					culture: 'culture-center',
					guide: 'guide-center'
				}
				
				const res = await uniCloud.callFunction({
					name: centerMap[this.type],
					data: {
						action: 'addReview',
						params: {
							USERID: userInfo._id,
							[`${this.type}_id`]: this.targetId,
							content: this.content,
							images: this.images,
							score: this.score
						}
					}
				})
				
				if (res.result.code === 0) {
					uni.showToast({
						title: '评论成功'
					})
					this.$emit('submit')
					this.handleClose()
				} else {
					uni.showToast({
						title: res.result.message || '评论失败',
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '评论失败',
					icon: 'none'
				})
				console.error(e)
			}
		}
	}
}
</script>

<style lang="scss">
.review-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	
	.mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.content {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx;
		
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.close {
				font-size: 40rpx;
				color: #999;
				padding: 10rpx;
			}
		}
		
		.form {
			.score-section {
				margin-bottom: 20rpx;
				
				.label {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 10rpx;
					display: block;
				}
				
				.score-input {
					display: flex;
					align-items: center;
					
					slider {
						flex: 1;
						margin-right: 20rpx;
					}
					
					.score-text {
						font-size: 32rpx;
						color: #ff4d4f;
						width: 80rpx;
						text-align: right;
					}
				}
			}
			
			textarea {
				width: 100%;
				min-height: 200rpx;
				padding: 20rpx;
				background-color: #f5f5f5;
				border-radius: 12rpx;
				font-size: 28rpx;
				margin-bottom: 20rpx;
			}
			
			.image-list {
				display: flex;
				flex-wrap: wrap;
				margin: 0 -10rpx;
				
				image {
					width: calc(33.33% - 20rpx);
					height: 200rpx;
					margin: 10rpx;
					border-radius: 8rpx;
				}
			}
			
			.upload-btn {
				width: calc(33.33% - 20rpx);
				height: 200rpx;
				margin: 10rpx;
				background-color: #f5f5f5;
				border-radius: 8rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				
				.icon {
					font-size: 48rpx;
					color: #999;
					margin-bottom: 10rpx;
				}
				
				.text {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
		
		.footer {
			margin-top: 30rpx;
			
			.submit-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				background-color: #007AFF;
				color: #fff;
				border-radius: 40rpx;
				font-size: 28rpx;
			}
		}
	}
}
</style> 