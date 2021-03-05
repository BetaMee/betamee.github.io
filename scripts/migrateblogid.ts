/**
 * 迁移文章内容，为所有的文章 meta 新增 uniqueid 信息
 */

const fs = require('fs').promises;
const path =require('path');
const ConcurrencyPromisePool = require('./utils/ConcurrencyPromisePool');
const getUniquePostId = require('./utils/getUniquePostId');
// 文件位置
const pathname = path.resolve(__dirname, '../content');
// 一个控制并发器，异步处理文件太多，需要拆分任务
const pool  = new ConcurrencyPromisePool(2);
// 匹配文章的 meta 信息
const META_REG = /---\r?\n(([^\r\n]+: [^\r\n]+)\r?\n)+---\r?\n/g;

(async () => {
    try {
        // 所有文件夹
        const dirs = await fs.readdir(pathname)
        // 所有文件路径
        const files = dirs.filter(dir => {
            // 去除 .DS_Store
            if (dir === '.DS_Store') {
                return false
            } else {
                return true
            }
        }).map(dir => path.resolve(__dirname, `../content/${dir}/index.md`));
        // 生成异步操作的 promise
        const dealFilePromises = files
            .map(fileName => () =>new Promise(async (resolve, reject) => {
                try {
                    // 文章的内容
                    const fileData = await fs.readFile(fileName, 'utf-8');
                    // 文章的 meta 信息
                    const regdata = fileData.match(META_REG);
                    if (!regdata) {
                        resolve(true)
                        return;
                    }
                    const metaDataArr = regdata[0].split(/\r?\n/);
                    const postName = metaDataArr[1].split(': ')[1];
                    const newUniqueID = getUniquePostId(postName);
                    const newUniqueIDMeta = `uninqueid: ${newUniqueID}`;
                    metaDataArr.splice(-2, -1, newUniqueIDMeta);
                    const newMetaData = metaDataArr.join('\r\n');
                    // 生成新的 filedata
                    const newFileData = fileData.replace(META_REG, newMetaData);
                    await fs.writeFile(fileName, newFileData);
                    resolve(fileData);
                } catch(e) {
                    reject(e);
                }
        }));
        // 开始处理
        pool.all(dealFilePromises)
            .then((result) => {
                console.log('done!')
            }).catch(e => {
                console.log(e)
            })
    } catch(e) {
        console.log(e)
    }
})();
