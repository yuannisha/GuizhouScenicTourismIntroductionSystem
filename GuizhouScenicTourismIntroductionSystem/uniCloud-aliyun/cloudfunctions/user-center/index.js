'use strict';

const db = uniCloud.database()
const crypto = require('crypto')

/**
 * 生成随机验证码
 * @param {number} length 验证码长度
 * @returns {string} 验证码
 */
function generateVerifyCode(length = 6) {
	return Math.random().toString().slice(2, 2 + length)
}

/**
 * 加密密码
 * @param {string} password 原始密码
 * @returns {string} 加密后的密码
 */
function encryptPassword(password) {
	return crypto.createHash('md5').update(password).digest('hex')
}

exports.main = async (event, context) => {
	const { action, params } = event
	
	switch (action) {
		case 'sendVerifyCode':
			return await handleSendVerifyCode(params)
		case 'register':
			return await handleRegister(params)
		case 'login':
			return await handleLogin(params)
		case 'updateProfile':
			return await handleUpdateProfile(params, context)
		case 'getCollections':
			return await handleGetCollections(params)
		case 'getReviews':
			return await handleGetReviews(params)
		default:
			return {
				code: 1,
				message: '未知的操作类型'
			}
	}
}

/**
 * 处理发送验证码请求
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function handleSendVerifyCode(params) {
	const { phone } = params
	
	try {
		// 生成验证码
		const verifyCode = generateVerifyCode()
		
		// 保存验证码到数据库
		await db.collection('verify_codes').add({
			phone,
			code: verifyCode,
			created_at: Date.now(),
			expired_at: Date.now() + 5 * 60 * 1000 // 5分钟有效期
		})
		
		// TODO: 实际项目中这里需要调用短信服务发送验证码
		console.log(`模拟发送验证码到${phone}: ${verifyCode}`)
		
		return {
			code: 0,
			message: '发送成功'
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '发送失败'
		}
	}
}

/**
 * 处理登录请求
 * @param {Object} params 请求参数
 * @returns {Promise} 返回登录结果
 */
async function handleLogin(params) {
	const { phone, password, verifyCode } = params
	
	if (!phone || !password || !verifyCode) {
		return {
			code: 1,
			message: '请填写完整信息'
		}
	}
	
	try {
		// 验证验证码
		const verifyResult = await db.collection('verify_codes')
			.where({
				phone,
				code: verifyCode,
				expired_at: db.command.gt(Date.now())
			})
			.get()
			
		if (!verifyResult.data.length) {
			return {
				code: 1,
				message: '验证码错误或已过期'
			}
		}
		
		// 验证用户信息
		const userInfo = await db.collection('users_info')
			.where({
				phone,
				password: encryptPassword(password)
			})
			.get()
			
		if (!userInfo.data.length) {
			return {
				code: 1,
				message: '手机号或密码错误'
			}
		}
		
		// 删除已使用的验证码
		await db.collection('verify_codes')
			.doc(verifyResult.data[0]._id)
			.remove()
		
		return {
			code: 0,
			message: '登录成功',
			data: userInfo.data[0]
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '登录失败'
		}
	}
}

/**
 * 处理注册请求
 * @param {Object} params 请求参数
 * @returns {Promise} 返回注册结果
 */
async function handleRegister(params) {
	const { phone, password, verifyCode } = params
	
	if (!phone || !password || !verifyCode) {
		return {
			code: 1,
			message: '请填写完整信息'
		}
	}
	
	try {
		// 验证验证码
		const verifyResult = await db.collection('verify_codes')
			.where({
				phone,
				code: verifyCode,
				expired_at: db.command.gt(Date.now())
			})
			.get()
			
		if (!verifyResult.data.length) {
			return {
				code: 1,
				message: '验证码错误或已过期'
			}
		}
		
		// 检查手机号是否已注册
		const existUser = await db.collection('users_info')
			.where({
				phone
			})
			.get()
			
		if (existUser.data.length) {
			return {
				code: 1,
				message: '该手机号已注册'
			}
		}
		
		// 创建用户
		const userResult = await db.collection('users_info')
			.add({
				phone,
				password: encryptPassword(password),
				nickname: `用户${phone.substr(-4)}`,
				avatar: '',
				created_at: Date.now()
			})
			
		// 删除已使用的验证码
		await db.collection('verify_codes')
			.doc(verifyResult.data[0]._id)
			.remove()
			
		// 获取新创建的用户信息
		const newUser = await db.collection('users_info')
			.doc(userResult.id)
			.get()
			
		return {
			code: 0,
			message: '注册成功',
			data: newUser.data[0]
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '注册失败'
		}
	}
}

/**
 * 处理更新用户资料请求
 * @param {Object} params 请求参数
 * @param {Object} context 请求上下文
 * @returns {Promise<Object>} 处理结果
 */
async function handleUpdateProfile(params, context) {
	const { avatar, nickname } = params
	const { USERID } = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		await db.collection('users_info')
			.doc(USERID)
			.update({
				avatar,
				nickname
			})
		
		return {
			code: 0,
			message: '更新成功'
		}
	} catch (e) {
		console.error(e)
		return {
			code: 1,
			message: '更新失败'
		}
	}
}

/**
 * 获取用户收藏列表
 * @param {Object} params 请求参数
 * @returns {Promise} 返回收藏列表数据
 */
async function handleGetCollections(params) {
	const { USERID, type = 'scenic', page = 1, pageSize = 10 } = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		// 1. 获取收藏记录
		const collectionsResult = await db.collection('user_collections')
			.where({
				user_id: USERID,
				type: type
			})
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('created_at', 'desc')
			.get()
			
		// 2. 获取收藏总数
		const countResult = await db.collection('user_collections')
			.where({
				user_id: USERID,
				type: type
			})
			.count()
			
		// 3. 获取对应的内容信息
		const collectionMap = {
			scenic: 'scenics',
			food: 'foods',
			culture: 'cultures',
			guide: 'guides'
		}
		
		const idMap = {
			scenic: 'scenic_id',
			food: 'food_id',
			culture: 'culture_id',
			guide: 'guide_id'
		}
		
		const targetIds = collectionsResult.data.map(item => item[idMap[type]])
		const targetResult = await db.collection(collectionMap[type])
			.where({
				_id: db.command.in(targetIds)
			})
			.get()
			
		// 4. 组合数据
		const targetMap = {}
		targetResult.data.forEach(item => {
			targetMap[item._id] = item
		})
		
		const list = collectionsResult.data.map(collection => {
			const target = targetMap[collection[idMap[type]]] || {}
			return {
				...target,
				collection_id: collection._id,
				collected_at: collection.created_at
			}
		})
		
		return {
			code: 0,
			message: '获取成功',
			data: {
				list,
				total: countResult.total
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
 * 获取用户评价列表
 * @param {Object} params 请求参数
 * @returns {Promise} 返回评价列表数据
 */
async function handleGetReviews(params) {
	const { USERID, type, page = 1, pageSize = 10 } = params
	
	if (!USERID) {
		return {
			code: 1,
			message: '请先登录'
		}
	}
	
	try {
		const collectionMap = {
			scenic: 'scenic_reviews',
			food: 'food_reviews',
			culture: 'culture_reviews',
			guide: 'guide_reviews'
		}
		
		const targetCollectionMap = {
			scenic: 'scenics',
			food: 'foods',
			culture: 'cultures',
			guide: 'guides'
		}
		
		const idMap = {
			scenic: 'scenic_id',
			food: 'food_id',
			culture: 'culture_id',
			guide: 'guide_id'
		}
		
		// 获取评价列表
		const reviews = await db.collection(collectionMap[type])
			.where({
				user_id: USERID
			})
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('created_at', 'desc')
			.get()
			
		// 获取评价对象信息
		const targetIds = reviews.data.map(item => item[idMap[type]])
		const targets = await db.collection(targetCollectionMap[type])
			.where({
				_id: db.command.in(targetIds)
			})
			.field({
				_id: true,
				name: true,
				cover: true
			})
			.get()
			
		const targetInfoMap = {}
		targets.data.forEach(item => {
			targetInfoMap[item._id] = item
		})
		
		// 组装数据
		const list = reviews.data.map(review => {
			const target = targetInfoMap[review[idMap[type]]] || {}
			return {
				...review,
				name: target.name,
				cover: target.cover
			}
		})
		
		// 获取总数
		const countResult = await db.collection(collectionMap[type])
			.where({
				user_id: USERID
			})
			.count()
			
		return {
			code: 0,
			message: '获取成功',
			data: {
				list,
				total: countResult.total
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