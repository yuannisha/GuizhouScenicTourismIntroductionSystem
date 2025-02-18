'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const { action, params } = event
	
	switch (action) {
		case 'getScenicList':
			return await handleGetScenicList(params)
		case 'getScenicDetail':
			return await handleGetScenicDetail(params)
		case 'checkCollection':
			return await handleCheckCollection(params, context)
		case 'toggleCollection':
			return await handleToggleCollection(params, context)
		case 'addReview':
			return await handleAddReview(params)
		case 'createBooking':
			return await handleCreateBooking(params)
		case 'getBookingList':
			return await handleGetBookingList(params)
		case 'cancelBooking':
			return await handleCancelBooking(params)
		default:
			return {
				code: 1,
				message: '未知的操作类型'
			}
	}
}

/**
 * 处理获取景点列表请求
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function handleGetScenicList(params) {
	const { page = 1, pageSize = 10, category = 0, keyword = '' , USERID} = params
    if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		let query = db.collection('scenics')
		
		// 构建查询条件
		const where = {}
		if (category > 0) {
			where.category = category
		}
		if (keyword) {
			where.name = new RegExp(keyword, 'i')
		}
		
		// 执行查询
		const countResult = await query.where(where).count()
		const total = countResult.total
		
		const listResult = await query
			.where(where)
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('created_at', 'desc')
			.get()
		
		return {
			code: 0,
			message: '获取成功',
			data: {
				list: listResult.data,
				total
			}
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '获取失败'
		}
	}
}

/**
 * 处理获取景点详情请求
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function handleGetScenicDetail(params) {
	const { id , USERID} = params
    if(!USERID){
        return {
            code: 1,
            message: '请先登录'
        }
    }
	console.log(id)
	try {
		const result = await db.collection('scenics')
			.doc(id)
			.get()
		
		if (!result.data || !result.data.length) {
			return {
				code: 1,
				message: '景点不存在'
			}
		}
		
		// 获取评论列表
		const reviewsResult = await db.collection('scenic_reviews')
			.where({
				scenic_id: id
			})
			.orderBy('created_at', 'desc')
			.limit(10)
			.get()
		
		const scenic = result.data[0]
		scenic.reviews = reviewsResult.data
		
		return {
			code: 0,
			message: '获取成功',
			data: scenic
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '获取失败'
		}
	}
}

/**
 * 处理检查收藏状态请求
 * @param {Object} params 请求参数
 * @param {Object} context 请求上下文
 * @returns {Promise<Object>} 处理结果
 */
async function handleCheckCollection(params, context) {
	const { scenicId } = params
	const { USERID } = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		const result = await db.collection('user_collections')
			.where({
				user_id: USERID,
				scenic_id: scenicId
			})
			.get()
		
		return {
			code: 0,
			message: '获取成功',
			data: {
				isCollected: result.data.length > 0
			}
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '获取失败'
		}
	}
}

/**
 * 处理切换收藏状态请求
 * @param {Object} params 请求参数
 * @param {Object} context 请求上下文
 * @returns {Promise<Object>} 处理结果
 */
async function handleToggleCollection(params, context) {
	const { scenicId } = params
	const { USERID } = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		const collection = await db.collection('user_collections')
			.where({
				user_id: USERID,
				scenic_id: scenicId
			})
			.get()
		
		if (collection.data.length) {
			// 取消收藏
			await db.collection('user_collections')
				.doc(collection.data[0]._id)
				.remove()
		} else {
			// 添加收藏
			await db.collection('user_collections')
				.add({
					user_id: USERID,
					scenic_id: scenicId,
                    type:'scenic',
					created_at: Date.now()
				})
		}
		
		return {
			code: 0,
			message: '操作成功'
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '操作失败'
		}
	}
}

/**
 * 处理添加评论请求
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function handleAddReview(params) {
	const { USERID, scenic_id, content, images = [] , score} = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	if (!content.trim()) {
		return {
			code: 1,
			message: '评论内容不能为空'
		}
	}
	
	try {
		const userInfo = await db.collection('users_info').doc(USERID).get()
		if (!userInfo.data || !userInfo.data.length) {
			return {
				code: 1,
				message: '用户不存在'
			}
		}
		
		await db.collection('scenic_reviews').add({
			user_id: USERID,
			scenic_id,
            score,
			content,
			images,
			nickname: userInfo.data[0].nickname,
			avatar: userInfo.data[0].avatar,
			created_at: Date.now()
		})

        // 更新景点评分
			const reviews = await db.collection('scenic_reviews')
            .where({
                scenic_id: scenic_id
            })
            .get()
        //以下结果都保留一位小数
        const totalScore = reviews.data.reduce((sum, review) => sum + review.score, 0)
        const averageScore = Number((totalScore / reviews.data.length).toFixed(1))
        
        await db.collection('scenics')
            .doc(scenic_id)
            .update({
                score: averageScore
            })
        
		
		return {
			code: 0,
			message: '评论成功'
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '评论失败'
		}
	}
}

/**
 * 处理创建预订请求
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function handleCreateBooking(params) {
	const { USERID, scenicId, bookingDate, ticketType, quantity, totalPrice } = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		const booking = {
			user_id: USERID,
			scenic_id: scenicId,
			booking_date: new Date(bookingDate),
			ticket_type: ticketType,
			quantity,
			total_price: totalPrice,
			status: 'pending',
			created_at: Date.now(),
			updated_at: Date.now()
		}
		
		const result = await db.collection('scenic_bookings').add(booking)
		
		return {
			code: 0,
			message: '预订成功',
			data: {
				bookingId: result.id
			}
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '预订失败'
		}
	}
}

/**
 * 处理获取预订列表请求
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function handleGetBookingList(params) {
	const { USERID, status } = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		const query = {
			user_id: USERID
		}
		
		if (status) {
			query.status = status
		}
		
		const bookings = await db.collection('scenic_bookings')
			.where(query)
			.orderBy('created_at', 'desc')
			.get()
		
		// 获取景点信息
		const scenicIds = [...new Set(bookings.data.map(item => item.scenic_id))]
		const scenics = await db.collection('scenics')
			.where({
				_id: db.command.in(scenicIds)
			})
			.get()
		
		const scenicMap = {}
		scenics.data.forEach(item => {
			scenicMap[item._id] = item
		})
		
		const result = bookings.data.map(booking => ({
			...booking,
			scenic: scenicMap[booking.scenic_id]
		}))
		
		return {
			code: 0,
			message: '获取成功',
			data: result
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '获取失败'
		}
	}
}

/**
 * 处理取消预订请求
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function handleCancelBooking(params) {
	const { USERID, bookingId } = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		const booking = await db.collection('scenic_bookings')
			.doc(bookingId)
			.get()
		
		if (!booking.data || !booking.data.length) {
			return {
				code: 1,
				message: '预订不存在'
			}
		}
		
		if (booking.data[0].user_id !== USERID) {
			return {
				code: 1,
				message: '无权操作'
			}
		}
		
		if (booking.data[0].status === 'cancelled') {
			return {
				code: 1,
				message: '预订已取消'
			}
		}
		
		await db.collection('scenic_bookings')
			.doc(bookingId)
			.update({
				status: 'cancelled',
				updated_at: Date.now()
			})
		
		return {
			code: 0,
			message: '取消成功'
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '取消失败'
		}
	}
} 