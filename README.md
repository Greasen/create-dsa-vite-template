# create vite app

## 介绍

无需配置Vite脚手架模板快速搭建vite开发模板高度定制化

## 特征

- ⚛️支持多种框架模板（Feature: 待开发）
- 📦开箱即用的中后台模板，可视化大屏模板
- 🚀对应框架的各种特性
- ✨各种Ui框架的选择，Theming和layout（Feature: 待开发）

## 搭建你的第一个Vite项目

> **兼容性说明:**
> Vite需要[Node.js](https://nodejs.org/en/)版本>=12.2.0。但是，有些模板需要更高的节点。js版本无法正常工作，如果您的软件包管理员发出警告，请升级

按照提示操作！!

还可以通过其他命令行选项直接指定要使用的项目名称和模板。例如，要构建Vite+Vue项目，请运行:

注：如果 npx 无法安装，请使用 npm

```bash
# npm
npm init dsa-vite-template

# npx
npx create-dsa-vite-template

# pnpm
pnpm init dsa-vite-template
```

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

## 颜色

```ts
// colors
black
red
green
yellow
blue
magenta
cyan
white
gray
lightGray
lightRed
lightGreen
lightYellow
lightBlue
lightMagenta
lightCyan

```

## 背景颜色

```ts
// background colors
bgBlack
bgRed
bgGreen
bgYellow
bgBlue
bgMagenta
bgCyan
bgWhite
bgGray
bgLightRed
bgLightGreen
bgLightYellow
bgLightBlue
bgLightMagenta
bgLightCyan
bgLightGray
```

# 开发模式

在 template 文件夹中新增自己的模板;
在 `src/index.ts` 中的 `FRAMEWORKS` 中新增自己所需的框架和框架模板，`variants` 中的 `name` 需要和框架中 `package.json` 中的`name`保持一致。
选项目标的颜色在上述中可自定义选择

```sh
pnpm install

```
