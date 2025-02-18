'use strict';

const db = uniCloud.database()

/**
 * 获取文化列表
 * @param {Object} params 请求参数
 * @returns {Promise} 返回文化列表数据
 */
async function handleGetCultureList(params) {
	const { page = 1, pageSize = 10, category = 0, keyword = '' } = params
	
	try {
		let query = db.collection('cultures')
		
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
			
		// 获取每个文化的收藏数
		const cultureIds = listResult.data.map(item => item._id)
		const collectionsResult = await db.collection('user_collections')
			.where({
				type: 'culture',
				culture_id: db.command.in(cultureIds)
			})
			.get()
			
		// 统计每个文化的收藏数
		const collectionsMap = {}
		collectionsResult.data.forEach(item => {
			if (!collectionsMap[item.culture_id]) {
				collectionsMap[item.culture_id] = 0
			}
			collectionsMap[item.culture_id]++
		})
		
		// 组装数据
		const formattedList = listResult.data.map(item => ({
			...item,
			likes: collectionsMap[item._id] || 0
		}))
		
		return {
			code: 0,
			message: '获取成功',
			data: {
				list: formattedList,
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
 * 获取文化详情
 * @param {Object} params 请求参数
 * @returns {Promise} 返回文化详情数据
 */
async function handleGetCultureDetail(params) {
	const { id } = params
	
	try {
		const result = await db.collection('cultures')
			.doc(id)
			.get()
		
		if (!result.data || !result.data.length) {
			return {
				code: 1,
				message: '文化不存在'
			}
		}
		
		// 更新浏览量
		await db.collection('cultures')
			.doc(id)
			.update({
				views: db.command.inc(1)
			})
		
		// 获取收藏数
		const collectionsCount = await db.collection('user_collections')
			.where({
				type: 'culture',
				culture_id: id
			})
			.count()
		
		// 获取评论列表
		const reviewsResult = await db.collection('culture_reviews')
			.where({
				culture_id: id
			})
			.orderBy('created_at', 'desc')
			.limit(10)
			.get()
		
		const culture = result.data[0]
		culture.reviews = reviewsResult.data
		culture.likes = collectionsCount.total
		
		return {
			code: 0,
			message: '获取成功',
			data: culture
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
 * 检查收藏状态
 * @param {Object} params 请求参数
 * @returns {Promise} 返回收藏状态
 */
async function handleCheckCollection(params) {
	const { USERID, cultureId } = params
	
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
				culture_id: cultureId,
				type: 'culture'
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
 * 切换收藏状态
 * @param {Object} params 请求参数
 * @returns {Promise} 返回操作结果
 */
async function handleToggleCollection(params) {
	const { USERID, cultureId } = params
	
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
				culture_id: cultureId,
				type: 'culture'
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
					culture_id: cultureId,
					type: 'culture',
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
 * 添加评论
 * @param {Object} params 请求参数
 * @returns {Promise} 返回操作结果
 */
async function handleAddReview(params) {
	const { USERID, culture_id, content, images = [], score } = params
	
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
			await db.collection('culture_reviews').add({
				user_id: USERID,
				culture_id,
				content,
				images,
				score,
				nickname: userInfo.data[0].nickname,
				avatar: userInfo.data[0].avatar,
				created_at: Date.now()
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
		case 'getCultureList':
			return await handleGetCultureList(params)
		case 'getCultureDetail':
			return await handleGetCultureDetail(params)
		case 'checkCollection':
			return await handleCheckCollection(params)
		case 'toggleCollection':
			return await handleToggleCollection(params)
		case 'addReview':
			return await handleAddReview(params)
		default:
			return {
				code: 1,
				message: '未知的操作类型'
			}
	}
} 