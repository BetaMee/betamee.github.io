const { v5 } = require('uuid');

// 生成一个独特的 uuid，作为 namespace
// https://www.uuidgenerator.net/version4
const BLOG_NAMESPACE = '011dc097-8b07-4e8e-b006-8a3d482c47df'

/**
 * https://github.com/uuidjs/uuid
 * @param post 文章的名称
 * @param category 文章的类别
 * @returns {*}
 */
const getUniquePostId = (post) => {
    return v5(post, BLOG_NAMESPACE).replace(/-/g, '')
}

module.exports = getUniquePostId;
