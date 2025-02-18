<template>
	<view class="orders-container">
		<!-- 订单列表 -->
		<scroll-view 
			class="orders-list"
			scroll-y
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="refresh"
		>
			<view 
				class="order-item"
				v-for="(item, index) in orderList"
				:key="index"
			>
				<view class="scenic-info" @click="goToDetail(item)">
					<image :src="item.scenic.cover" mode="aspectFill"></image>
					<view class="info">
						<text class="name">{{item.scenic.name}}</text>
						<text class="location">{{item.scenic.location}}</text>
					</view>
				</view>
				<view class="order-info">
					<view class="booking-info">
						<text class="date">预订日期：{{formatDate(item.booking_date)}}</text>
						<text class="ticket">{{item.ticket_type}} x {{item.quantity}}</text>
						<text class="price">¥{{item.total_price}}</text>
					</view>
					<view class="status-action">
						<text class="status" :class="item.status">{{statusText[item.status]}}</text>
						<button 
							class="cancel-btn" 
							v-if="item.status === 'pending' && !isExpired(item.booking_date)"
							@click="handleCancel(item._id)"
						>取消预订</button>
					</view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-status">
				<text v-if="loading">加载中...</text>
				<text v-else-if="noMore">没有更多了</text>
				<text v-else-if="orderList.length === 0">暂无订单</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { formatDate } from '@/utils/date.js'
/**
 * 我的订单页面
 * @description 展示用户的景区门票预订订单
 */
export default {
	data() {
		return {
			orderList: [],
			page: 1,
			pageSize: 10,
			loading: false,
			noMore: false,
			isRefreshing: false,
			statusText: {
				pending: '待使用',
				cancelled: '已取消'
			}
		}
	},
	onLoad() {
		this.loadOrders()
	},
	methods: {
		/**
		 * 加载订单列表
		 */
		async loadOrders() {
			if (this.loading || this.noMore) return
			
			this.loading = true
			
			try {
				const res = await uniCloud.callFunction({
					name: 'scenic-center',
					data: {
						action: 'getBookingList',
						params: {
							USERID: uni.getStorageSync('userInfo')._id,
							page: this.page,
							pageSize: this.pageSize
						}
					}
				})
                console.log("订单列表",res)
				
				if (res.result.code === 0) {
					const list = res.result.data
                    const total = res.result.data.length
					
					if (this.page === 1) {
						this.orderList = list
					} else {
						this.orderList = [...this.orderList, ...list]
					}
					
					this.noMore = this.orderList.length >= total
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
				this.loading = false
				this.isRefreshing = false
			}
		},
		
		/**
		 * 处理取消预订
		 */
		async handleCancel(orderId) {
			uni.showModal({
				title: '提示',
				content: '确定要取消预订吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							const res = await uniCloud.callFunction({
								name: 'scenic-center',
								data: {
									action: 'cancelBooking',
									params: {
										USERID: uni.getStorageSync('userInfo')._id,
										bookingId: orderId
									}
								}
							})
							
							if (res.result.code === 0) {
								uni.showToast({
									title: '取消成功'
								})
								this.refresh()
							} else {
								uni.showToast({
									title: res.result.message || '取消失败',
									icon: 'none'
								})
							}
						} catch (e) {
							uni.showToast({
								title: '取消失败，请重试',
								icon: 'none'
							})
							console.error(e)
						}
					}
				}
			})
		},
		
		/**
		 * 判断是否过期
		 */
		isExpired(date) {
			return new Date(date) < new Date()
		},
		
		/**
		 * 跳转到景点详情
		 */
		goToDetail(item) {
			uni.navigateTo({
				url: `/pages/scenic/detail?id=${item.scenic_id}`
			})
		},
		
		/**
		 * 刷新列表
		 */
		refresh() {
			this.isRefreshing = true
			this.page = 1
			this.noMore = false
			this.loadOrders()
		},
		
		/**
		 * 加载更多
		 */
		loadMore() {
			if (!this.loading && !this.noMore) {
				this.loadOrders()
			}
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
.orders-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 20rpx;
	
	.orders-list {
		height: 100vh;
		
		.order-item {
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 12rpx;
			
			.scenic-info {
				display: flex;
				margin-bottom: 20rpx;
				
				image {
					width: 160rpx;
					height: 120rpx;
					border-radius: 8rpx;
					margin-right: 20rpx;
				}
				
				.info {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					
					.name {
						font-size: 28rpx;
						font-weight: bold;
						color: #333;
					}
					
					.location {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
			
			.order-info {
				.booking-info {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 20rpx;
					
					.date {
						font-size: 24rpx;
						color: #666;
					}
					
					.ticket {
						font-size: 24rpx;
						color: #666;
					}
					
					.price {
						font-size: 28rpx;
						color: #ff4d4f;
						font-weight: bold;
					}
				}
				
				.status-action {
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.status {
						font-size: 24rpx;
						
						&.pending {
							color: #faad14;
						}
						
						&.confirmed {
							color: #52c41a;
						}
						
						&.cancelled {
							color: #999;
						}
					}
					
					.cancel-btn {
						margin: 0;
						padding: 0 20rpx;
						height: 48rpx;
						line-height: 48rpx;
						font-size: 24rpx;
						color: #666;
						background-color: #f5f5f5;
						border-radius: 24rpx;
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