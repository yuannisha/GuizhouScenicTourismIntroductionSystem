'use strict';

const db = uniCloud.database()
const guidesCollection = db.collection('guides')
const reviewsCollection = db.collection('guide_reviews')
const collectionsCollection = db.collection('user_collections')

/**
 * 获取攻略列表
 * @param {Object} params 
 * @returns {Promise}
 */
async function handleGetGuideList(params = {}) {
	const { page = 1, pageSize = 10, keyword = '' } = params
	
	try {
		let query = db.collection('guides')
		
		// 构建查询条件
		const where = {}
		if (keyword) {
			where.name = new RegExp(keyword, 'i')
		}
		
		// 计算总数
		const countResult = await query.where(where).count()
		const total = countResult.total
		
		// 分页查询
		const list = await query
			.where(where)
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('created_at', 'desc')
			.get()
			
		// 获取每个攻略的收藏数
		const guideIds = list.data.map(item => item._id)
		const collectionsResult = await db.collection('user_collections')
			.where({
				type: 'guide',
				guide_id: db.command.in(guideIds)
			})
			.get()
			
		// 统计每个攻略的收藏数
		const collectionsMap = {}
		collectionsResult.data.forEach(item => {
			if (!collectionsMap[item.guide_id]) {
				collectionsMap[item.guide_id] = 0
			}
			collectionsMap[item.guide_id]++
		})
		
		// 组装数据
		const formattedList = list.data.map(item => ({
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
 * 获取攻略详情
 * @param {Object} params 
 * @returns {Promise}
 */
async function handleGetGuideDetail(params = {}) {
	const { USERID, id } = params
	
	if (!id) {
		return {
			code: -1,
			message: '参数错误'
		}
	}
	
	try {
		// 获取攻略信息
		const guideInfo = await guidesCollection.doc(id).get()
		
		if (!guideInfo.data || !guideInfo.data.length) {
			return {
				code: -1,
				message: '攻略不存在'
			}
		}
		
		// 更新浏览量
		await guidesCollection.doc(id).update({
			views: db.command.inc(1)
		})
		
		// 获取收藏数
		const collectionsCount = await collectionsCollection
			.where({
				type: 'guide',
				guide_id: id
			})
			.count()
		
		// 获取评论列表
		const reviews = await reviewsCollection
			.where({
				guide_id: id
			})
			.orderBy('created_at', 'desc')
			.get()
			
		// 获取评论用户信息
		const userIds = reviews.data.map(item => item.user_id)
		const userInfos = await db.collection('users_info')
			.where({
				_id: db.command.in(userIds)
			})
			.field({
				_id: true,
				nickname: true,
				avatar: true
			})
			.get()
			
		const userInfoMap = {}
		userInfos.data.forEach(user => {
			userInfoMap[user._id] = user
		})
		
		// 组装评论数据
		const reviewList = reviews.data.map(review => {
			const userInfo = userInfoMap[review.user_id] || {}
			return {
				...review,
				nickname: userInfo.nickname,
				avatar: userInfo.avatar
			}
		})
		
		return {
			code: 0,
			message: '获取成功',
			data: {
				...guideInfo.data[0],
				likes: collectionsCount.total,
				reviews: reviewList
			}
		}
	} catch (e) {
		return {
			code: -1,
			message: '获取失败'
		}
	}
}

/**
 * 检查收藏状态
 * @param {Object} params 
 * @returns {Promise}
 */
async function handleCheckCollection(params = {}) {
	const { USERID, guideId } = params
	
	if (!USERID) {
		return {
			code: -1,
			message: '未登录'
		}
	}
	
	if (!guideId) {
		return {
			code: -1,
			message: '参数错误'
		}
	}
	
	try {
		const collection = await collectionsCollection
			.where({
				user_id: USERID,
				type: 'guide',
				target_id: guideId
			})
			.get()
			
		return {
			code: 0,
			message: '获取成功',
			data: {
				isCollected: collection.data.length > 0
			}
		}
	} catch (e) {
		return {
			code: -1,
			message: '获取失败'
		}
	}
}

/**
 * 切换收藏状态
 * @param {Object} params 
 * @returns {Promise}
 */
async function handleToggleCollection(params = {}) {
	const { USERID, guideId } = params
	
	if (!USERID) {
		return {
			code: -1,
			message: '未登录'
		}
	}
	
	if (!guideId) {
		return {
			code: -1,
			message: '参数错误'
		}
	}
	
	try {
		const collection = await collectionsCollection
			.where({
				user_id: USERID,
				type: 'guide',
				target_id: guideId
			})
			.get()
			
		if (collection.data.length > 0) {
			// 取消收藏
			await collectionsCollection.doc(collection.data[0]._id).remove()
		} else {
			// 添加收藏
			await collectionsCollection.add({
				user_id: USERID,
				type: 'guide',
				guide_id: guideId,
				created_at: Date.now()
			})
		}
		
		return {
			code: 0,
			message: '操作成功'
		}
	} catch (e) {
		return {
			code: -1,
			message: '操作失败'
		}
	}
}

/**
 * 添加评论
 * @param {Object} params 
 * @returns {Promise}
 */
async function handleAddReview(params = {}) {
	const { USERID, guide_id, content, images = [] } = params
	
	if (!USERID) {
		return {
			code: -1,
			message: '未登录'
		}
	}
	
	if (!guide_id || !content) {
		return {
			code: -1,
			message: '参数错误'
		}
	}
	
	try {
		const userInfo = await db.collection('users_info').doc(USERID).get()
		if (!userInfo.data || !userInfo.data.length) {
			return {
				code: -1,
				message: '用户不存在'
			}
		}
		
		try {
			// 添加评论
			await db.collection('guide_reviews').add({
				user_id: USERID,
				guide_id: guide_id,
				content,
				images,
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
		return {
			code: -1,
			message: '评论失败'
		}
	}
}

exports.main = async (event, context) => {
	const { action, params } = event
	
	switch (action) {
		case 'getGuideList':
			return await handleGetGuideList(params)
		case 'getGuideDetail':
			return await handleGetGuideDetail(params)
		case 'checkCollection':
			return await handleCheckCollection(params)
		case 'toggleCollection':
			return await handleToggleCollection(params)
		case 'addReview':
			return await handleAddReview(params)
		default:
			return {
				code: -1,
				message: '未知操作'
			}
	}
} 