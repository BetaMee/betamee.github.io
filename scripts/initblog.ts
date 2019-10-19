import readline from 'readline'
import fs from 'fs'
import { promisify } from 'util'

const QuestionsPrompt = [
  '请输入文章\x1b[37;44m 标题 \x1b[0m\x1b[37;46m > \x1b[0m',
  '请输入文章\x1b[37;44m 类别 \x1b[0m\x1b[37;46m > \x1b[0m ',
  '请输入文章\x1b[37;44m 标签 \x1b[0m\x1b[37;46m > \x1b[0m',
  '是否需要开启\x1b[37;44m 打赏[y or n] \x1b[0m\x1b[37;46m > \x1b[0m'
]

// 最终的结果数据
const MetaResult: Array<string | boolean> = []

// 创建一个 readline 实例
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: QuestionsPrompt[0]
})

// 出提示
rl.prompt()


const handleSetDataFromReadline = (line: string) => {
  let result = ''
  switch(MetaResult.length) {
    case 0: // 文章
      result = line.trim()
      if (result === '') {
        process.stdout.write('内容不能为空！\r\n')
        // 出提示
        rl.prompt()
        return
      }
      // 存入数据
      MetaResult.push(line)
      // 进行下一步提问
      rl.setPrompt(`${QuestionsPrompt[1]}`)
      rl.prompt()
      break
    case 1: // 类别
      result = line.trim()
      if (result === '') {
        process.stdout.write('内容不能为空！\r\n')
        // 出提示
        rl.prompt()
        return
      }
      // 存入数据
      MetaResult.push(line)
      // 进行下一步提问
      rl.setPrompt(`${QuestionsPrompt[2]}`)
      rl.prompt()
      break
    case 2: // 标签
      result = line.trim()
      if (result === '') {
        process.stdout.write('内容不能为空！\r\n')
        // 出提示
        rl.prompt()
        return
      }
      // 存入数据
      MetaResult.push(line)
      // 进行下一步提问
      rl.setPrompt(`${QuestionsPrompt[3]}`)
      rl.prompt()
      break
    case 3: // 打赏
      result = line.trim()
      if (result === '') {
        process.stdout.write('内容不能为空！\r\n')
        // 出提示
        rl.prompt()
        return
      }

      if (result === 'y') {
        // 存入数据
        MetaResult.push(true)
        // 进行下一步提问
        rl.close()
      } else {
        process.stdout.write('输入只能为 y or n\r\n')
        // 出提示
        rl.prompt()
        return
      }
      break
    default: // 退出
      // 关闭命令行
      rl.close()
      break;
  }
}

const newPostDirPath = `${__dirname}/../content/`

// const fsStatAsync = promisify(fs.stat)
const fsMkdirAsync = promisify(fs.mkdir)
const fsWriteFileAsync = promisify(fs.writeFile)

const createDate = () => {
  const date = new Date()

  const year = date.getFullYear()
  const month = date.getMonth() > 9 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`

  const hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`
  const min = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
  const sec = date.getSeconds() > 9 ? date.getSeconds() : `0${ date.getSeconds()}`

  const createDate = `${year}-${month}-${day} ${hour}:${min}:${sec}` 
  return createDate
}

const handleCreateNewTemplate = async () => {
  // tslint:disable-next-line: max-line-length
  const metaInfo = `---\r\ntitle: ${MetaResult[0]}\r\ndate: ${createDate()}\r\ncategory: ${MetaResult[1]}\r\ntags: ${MetaResult[2]}\r\nopenreward: ${MetaResult[3]}\r\n---`

  const newPostDir = `${newPostDirPath}${MetaResult[1]}-${MetaResult[0]}`
  // 创建目录
  await fsMkdirAsync(newPostDir)
  // 创建文件
  await fsWriteFileAsync(`${newPostDir}/index.md`, metaInfo, 'utf8')
  // 创建成功后关闭
  process.exit(0)
  console.log('再见!');
}

rl.on('line', (line: string) => {
  handleSetDataFromReadline(line)
}).on('close', () => {
  // 生成新的文章模版
  if (MetaResult.length === 4) {
    handleCreateNewTemplate()
  }
})
