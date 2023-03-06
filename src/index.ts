import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'
import { red, reset } from 'kolorist'
import { templates } from './templates'
import { logger } from './utils/log'

logger(`\n🍰 欢迎使用 vite 创建模板!\n`)

const cwd = process.cwd()

const variants = templates

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore'
}

const defaultTargetDir = 'dsa-vite-project'

/**
 * @Description 校验包名称
 * @date 2023-03-06
 * @param {any} projectName:string
 * @returns {any}
 */
function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

/**
 * @Description 新增包名称
 * @date 2023-03-06
 * @param {any} projectName:string
 * @returns {any}
 */
function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

/**
 * 初始化 core
 */
async function init() {
  let targetDir = defaultTargetDir

  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

  let result: prompts.Answers<
    'projectName' | 'variant'
  >

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultTargetDir,
          onState: (state: { value: string | undefined }) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          }
        },
        {
          type: 'text',
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
          type: "select",
          name: 'variant',
          message: reset('Select a framework:'),
          choices: () =>
            variants.map((variant) => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.name || variant.display),
                value: variant.name
              }
            })
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' 已取消操作')
        }
      }
    )
  } catch (cancelled: any) {
    logger(cancelled.message)
    return
  }

  // 选择 prompts 中与用户关联的模板
  const { variant } = result

  const root = path.join(cwd, targetDir)

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  // 确定模板
  const template: string = variant

  const pkgManager = 'npm'

  logger(`\n🚧 脚手架项目的路径在 => ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `template/${template}`
  )

  /**
   * @Description 写入文件
   * @date 2023-02-23
   * @param {any} file:string
   * @param {any} content?:string
   * @returns {any}
   */
  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f: string) => f !== 'package.json')) {
    write(file)
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8')
  )

  pkg.name = getProjectName()

  write('package.json', JSON.stringify(pkg, null, 2))

  logger(`\n🌸 河马温馨提示项目创建完成. 请运行以下命令来运行项目吧\n`)
  if (root !== cwd) {
    logger(`  cd ${path.relative(cwd, root)}`)
  }
  logger(`  ${pkgManager} install`)
  logger(`  ${pkgManager} run dev`)
}

/**
 * 输入项目名称
 * @param targetDir 
 * @returns 
 */
function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

/**
 * 拷贝复制文件
 * @param src 
 * @param dest 
 */
function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

/**
 * 拷贝文件路径
 * @param srcDir 
 * @param destDir 
 */
function copyDir(srcDir: string, destDir: string) {
  console.log(srcDir, destDir, 'srcDir');

  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

init().catch((e) => {
  console.error(e)
})
