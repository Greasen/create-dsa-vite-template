import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'
import { red, reset } from 'kolorist'
import { templates } from './templates'
import { logger } from './utils/log'

logger(`\n🍰 Welcome Use Vite To Create Template!\n`)

const cwd = process.cwd()

const variants = templates

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore'
}

const defaultTargetDir = 'dsa-vite-project'

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
          message: reset('项目名称:'),
          initial: defaultTargetDir,
          onState: (state: { value: string | undefined }) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          }
        },
        {
          type: "select",
          name: 'variant',
          message: reset('选择一个模板:'),
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

  // user choice associated with prompts
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

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir: string, destDir: string) {
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
