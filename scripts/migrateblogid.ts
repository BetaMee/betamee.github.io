/**
 * 迁移文章内容，为所有的文章 meta 新增 uniqueid 信息
 */
import fs from 'fs';
import path from 'path';
import ConcurrencyPromisePool from './utils/ConcurrencyPromisePool';
import getUniquePostId from './utils/getUniquePostId';
import AsyncIterator from './utils/AsyncIterator';

// *fs 的 promise 模块
const fsPromise = fs.promises;
// *文件位置
const pathname = path.resolve(__dirname, '../content');
// *匹配文章的 meta 信息
const META_REG = /---\r?\n(([^\r\n]+: [^\r\n]+)\r?\n)+---\r?\n/g;

async function asyncHandleFileMigration(fileName: string) {
    try {
        // 读取文章的内容
        const fileData = await fsPromise.readFile(fileName, 'utf-8');
        // 文章的 meta 信息
        const metaRegInfo = fileData.match(META_REG);
        if (!metaRegInfo) {
            throw new Error('file not match');
        }
        const metaDataArr = metaRegInfo[0].split(/\r?\n/);
        // 文章名
        const postName = metaDataArr[1].split(': ')[1];
        // 生成新的 ID
        const newUniqueID = getUniquePostId(postName);
        const newUniqueIDMeta = `uninqueid: ${newUniqueID}`;
        // 插入原来的 meta 数据中
        metaDataArr.splice(-2, -1, newUniqueIDMeta);
        const newMetaData = metaDataArr.join('\r\n');
        // 替代原来的文章，并写入文章
        const newFileData = fileData.replace(META_REG, newMetaData);
        await fsPromise.writeFile(fileName, newFileData);
        // 返回一个 true，表示成功处理
        return true;
    } catch(e) {
        throw new Error(e)
    }
}

// *问题的出现：
// 如何处理读取多个文件这种涉及多个异步任务的问题？
// 存在多个异步任务，要么一个个处理，那样效率就会很低，并且异步操作很容易写出回调嵌套函数这样难以理解的代码
// 要么使用类似 Promise.all 的方法，并发请求，但这样的话短时间内性能消耗很大，得不偿失。

// *方案一：使用异步并发控制器
// *方案思路：
// 既然不能将所有异步任务一起并发，那么可以拆分异步任务，用排队摇号的思路，设立一个最大异步并发数
// 每处理完一个补一个，直到都完成
// 有点类似于 Promise.all 的加强版
// 既不多消耗性能，也能保证效率
// 这个就是 ConcurrencyPromisePool 代码的思路
// *缺点：
// 思路上没有啥问题，但使用 ConcurrencyPromisePool 必须是等到所有的值都处理完才会返回最终 result 数组
// 无法迭代一个处理一个。要想像同步代码那样迭代处理，可以使用下面的方案二：异步迭代器
async function MigrateBlogWithConcurrencyPromisePool() {
    try {
        // 异步控制并发器，最多六个
        const pool  = new ConcurrencyPromisePool(6);
        // 读取所有文件夹
        const dirs = await fsPromise.readdir(pathname)
        // 读取所有文件路径
        const files = dirs
            .filter(dir => dir !== '.DS_Store')
            .map(dir => path.resolve(__dirname, `../content/${dir}/index.md`));
        // 生成异步操作的 promise
        const filePromises = files.map(fileName => asyncHandleFileMigration(fileName));
        // 开始处理
        await pool.all(filePromises);
        console.log('done!')
    } catch(e) {
        console.log(e)
    }
}

// *方案二：使用异步迭代器
// *方案思路：
// 使用异步迭代的思路，把 fs Promise list 当作要迭代处理的对象
// 用 for..wait..of 循环处理，优点在于语义非常直观，而且能在每一次迭代中得知异步结果
// 并且 AsyncIterator 设置了并发数，可以在一次迭代中并发消费多个 promise 对象，提高效率
// *缺点
// 目前没有支持 Symbol.asyncIterator 异步迭代器的原生对象，需要手动部署
// 这里使用的是异步生成器（Async Generator）来简化异步迭代器的写法
async function MigrateBlogWithAsyncIterator() {
    try {
        // 读取所有文件夹
        const dirs = await fsPromise.readdir(pathname)
        // 读取所有文件路径
        const files = dirs
            .filter(dir => dir !== '.DS_Store')
            .map(dir => path.resolve(__dirname, `../content/${dir}/index.md`));
        // 生成异步操作的 promise
        const filePromises = files.map(fileName => asyncHandleFileMigration(fileName));
        // 生成异步可迭代对象
        const filePromisesIterables  = new AsyncIterator(filePromises, 2);
        // 异步迭代
        for await (const fileResult of filePromisesIterables) {
            console.log(fileResult)
        }
        console.log('done')
    } catch(e) {
        console.log(e)
    }
}


// *start
// MigrateBlogWithConcurrencyPromisePool()
MigrateBlogWithAsyncIterator()
