
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const config = require('../config/config.json')
const utils = require('../utils')
const logger = require('../logger')
const { Tokens } = require('../models/tokens')


/**
 * Return hardcode credentials to login
 * @returns {String}
 */
function getBasicToken() {
    const credenciales =  `${config.client_id}:${config.client_secret}`
    let buff = Buffer.from(credenciales)
    let base64data = buff.toString('base64')
    return base64data
}

/**
 * Make out system login
 * @param {import('../models/credentials').Credentials} credencials
 * @param {String} grantType
 * @returns {Promise<Tokens>}
 */
async function getToken(credencials, grantType) {
    const fnName = 'getToken'
    logger.debug(fnName)
    const basicToken = getBasicToken()
    const body = {
        username: credencials.username,
        password: credencials.password,
        grant_type: grantType
    }
    const url = `${config.url}/auth/v1/token`
    const reqConfig = {
        method: 'post',
        body:  new URLSearchParams(body),
        headers: {
            'Authorization': `Basic ${basicToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'ETP-Anonymous-ID': null,
        }
    }
    logger.debug(`${reqConfig.method} - ${url}`)
    const res = await fetch(url, reqConfig)
    await utils.logRes(fnName, res)
    const data = await res.json()
    const token = new Tokens()
    data.created_date = new Date().toISOString()
    token.fromJSON(data)
    return token
}

/**
 * Refresh access token.
 * Note: not really used
 * @param {import('../models/tokens').Tokens} token 
 * @returns {Promise<Tokens>}
 */
async function getRefreshToken(token) {
    const fnName = 'getRefreshToken'
    logger.debug(fnName)
    const basicToken = getBasicToken()
    const body = {
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
    }
    const url = `${config.url}/auth/v1/token`
    const reqConfig = {
        method: 'post',
        body:  new URLSearchParams(body),
        headers: {
            'Authorization': `Basic ${basicToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'ETP-Anonymous-ID': null,
        }
    }
    logger.debug(`${reqConfig.method} - ${url}`)
    const res = await fetch(url, reqConfig)
    await utils.logRes(fnName, res)
    const data = await res.json()
    const newToken = new Tokens()
    data.created_date = new Date().toISOString()
    newToken.fromJSON(data)
    return newToken
}

module.exports = {
    getToken,
    getRefreshToken,
}