'use strict';

const db = uniCloud.database()

/**
 * 获取美食列表
 * @param {Object} params 请求参数
 * @returns {Promise} 返回美食列表数据
 */
async function handleGetFoodList(params) {
	const { USERID, page = 1, pageSize = 10, category = 0, keyword = '' } = params
	
	if (!USERID) {
		return {
			code: 401,
			message: '请先登录'
		}
	}
	
	try {
		const collection = db.collection('foods')
		const skip = (page - 1) * pageSize
		
		// 构建查询条件
		const query = {}
		if (category !== 0) {
			query.category = category
		}
		if (keyword) {
			query.name = new RegExp(keyword, 'i')
		}
		
		// 查询总数
		const countResult = await collection.where(query).count()
		const total = countResult.total
		
		// 查询列表
		const listResult = await collection
			.where(query)
			.skip(skip)
			.limit(pageSize)
			.orderBy('created_at', 'desc')
			.get()
			
		return {
			code: 0,
			message: 'success',
			data: {
				list: listResult.data,
				total,
				page: Number(page),
				pageSize: Number(pageSize)
			}
		}
	} catch (e) {
		console.error(e)
		return {
			code: 500,
			message: '服务器错误'
		}
	}
}

/**
 * 获取美食详情
 * @param {Object} params 请求参数
 * @returns {Promise} 返回美食详情数据
 */
async function handleGetFoodDetail(params) {
	const { USERID, id } = params
	
	if (!USERID) {
		return {
			code: 401,
			message: '请先登录'
		}
	}
	
	try {
		// 获取美食基本信息
		const foodResult = await db.collection('foods')
			.doc(id)
			.get()
			
		if (!foodResult.data || !foodResult.data.length) {
			return {
				code: 404,
				message: '美食不存在'
			}
		}
		
		// 获取评价列表
		const reviewsResult = await db.collection('food_reviews')
			.where({
				food_id: id
			})
			.orderBy('created_at', 'desc')
			.limit(10)
			.get()
			
		const food = foodResult.data[0]
		food.reviews = reviewsResult.data
		
		return {
			code: 0,
			message: 'success',
			data: food
		}
	} catch (e) {
		console.error(e)
		return {
			code: 500,
			message: '服务器错误'
		}
	}
}

/**
 * 检查收藏状态
 * @param {Object} params 请求参数
 * @returns {Promise} 返回收藏状态
 */
async function handleCheckCollection(params) {
	const { USERID, foodId } = params
	
	if (!USERID) {
		return {
			code: 401,
			message: '请先登录'
		}
	}
	
	try {
		const result = await db.collection('user_collections')
			.where({
				user_id: USERID,
				food_id: foodId,
				type: 'food'
			})
			.get()
		
		return {
			code: 0,
			message: 'success',
			data: {
				isCollected: result.data.length > 0
			}
		}
	} catch (e) {
		console.error(e)
		return {
			code: 500,
			message: '服务器错误'
		}
	}
}

/**
 * 切换收藏状态
 * @param {Object} params 请求参数
 * @returns {Promise} 返回操作结果
 */
async function handleToggleCollection(params) {
	const { USERID, foodId } = params
	
	if (!USERID) {
		return {
			code: 401,
			message: '请先登录'
		}
	}
	
	try {
		const collection = await db.collection('user_collections')
			.where({
				user_id: USERID,
				food_id: foodId,
				type: 'food'
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
					food_id: foodId,
					type: 'food',
					created_at: Date.now()
				})
		}
		
		return {
			code: 0,
			message: 'success'
		}
	} catch (e) {
		console.error(e)
		return {
			code: 500,
			message: '服务器错误'
		}
	}
}

/**
 * 添加评论
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function handleAddReview(params) {
	const { USERID, food_id, content, images = [], score } = params
	
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
	
	if (score < 0 || score > 5) {
		return {
			code: 1,
			message: '评分范围为0-5分'
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
		
		
		try {
			// 添加评论
			await db.collection('food_reviews').add({
				user_id: USERID,
				food_id,
				content,
				images,
				score,
				nickname: userInfo.data[0].nickname,
				avatar: userInfo.data[0].avatar,
				created_at: Date.now()
			})
			
			// 更新美食评分
			const reviews = await db.collection('food_reviews')
				.where({
					food_id
				})
				.get()
			
			const totalScore = reviews.data.reduce((sum, review) => sum + review.score, 0)
			const averageScore = Number((totalScore / reviews.data.length).toFixed(1))
			
			await db.collection('foods')
				.doc(food_id)
				.update({
					score: averageScore
				})
			
			
			return {
				code: 0,
				message: '评论成功'
			}
		} catch (e) {
			throw e
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '评论失败'
		}
	}
}

exports.main = async (event, context) => {
	const { action, params } = event
	
	switch (action) {
		case 'getFoodList':
			return await handleGetFoodList(params)
		case 'getFoodDetail':
			return await handleGetFoodDetail(params)
		case 'checkCollection':
			return await handleCheckCollection(params)
		case 'toggleCollection':
			return await handleToggleCollection(params)
		case 'addReview':
			return await handleAddReview(params)
		default:
			return {
				code: 404,
				message: '未找到对应的处理函数'
			}
	}
} 