
const utils = require('../utils')
const logger = require('../logger')
const { URLSearchParams } = require('url')


/**
 * @param {Object} obj
 * @param {import('../types').AuthBase} obj.auth
 * @param {String} [obj.source]
 * @returns {Promise<Object>}
 */
async function getProducts({ auth, source }) {
    const fnName = 'getProducts'
    logger.debug(fnName)
    const queryData = { locale: auth.locale }
    utils.addParam(queryData, 'source', source ? source : 'google-play')
    const queryStr = new URLSearchParams(queryData)
    const url = `/subs/v2/products?${queryStr}`
    const reqConfig = {
        method: 'get',
        headers: { 'Authorization': auth.token }
    }
    return utils.makeRequest(fnName, url, reqConfig)
}


/**
 * @param {Object} obj
 * @param {import('../types').AuthBase} obj.auth
 * @param {String} obj.externalId
 * @returns {Promise<Object>}
 */
async function getUserBenefits({ auth, externalId }) {
    const fnName = 'getUserBenefits'
    logger.debug(fnName)
    const queryData = { locale: auth.locale }
    const queryStr = new URLSearchParams(queryData)
    const url = `/subs/v1/subscriptions/${externalId}/benefits?${queryStr}`
    const reqConfig = {
        method: 'get',
        headers: { 'Authorization': auth.token }
    }
    return utils.makeRequest(fnName, url, reqConfig)
}


/**
 * @param {Object} obj
 * @param {import('../types').AuthBase} obj.auth
 * @param {String} obj.externalId
 * @returns {Promise<Object>}
 */
async function getUserSubscription({ auth, externalId }) {
    const fnName = 'getUserSubscription'
    logger.debug(fnName)
    const queryData = { locale: auth.locale }
    const queryStr = new URLSearchParams(queryData)
    const url = `/subs/v1/subscriptions/${externalId}/products?${queryStr}`
    const reqConfig = {
        method: 'get',
        headers: { 'Authorization': auth.token }
    }
    return utils.makeRequest(fnName, url, reqConfig)
}


module.exports = {
    getProducts,
    getUserBenefits,
    getUserSubscription
}
