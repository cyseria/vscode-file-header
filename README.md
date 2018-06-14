# vscode-file-header

一个自动生成文件头部的插件 💪

## quick start
进入 首选项 -> 设置 (快捷键 `command` + `,`)

修改个人信息, 例如
```json
"fileheader.custom": {
    "author": "Cyseria", // 个人名字, 用于创建文件和最后修改文件
    "email": "xcyseria@gmail.com", // 个人邮箱
    "saveTime": 10 // 保存更新时间间隔, 例如这里距离上次改动超过 10s 才会更新
},
```

## how to dev
在 `vscode` 中打开该项目, 进入调试面板, 点击调试
等待 `vscode` 默认打开一个新面板之后, 直接使用 `command+shift+h` 初始化头部. 或者按 `command+shift+p` 调出命令面板, 输入 `addFileHeader` 点击选项

## build

需要安装 M 家的工具 `vsce`:

```bash
npm install -g vsce
```

自行打包二进制文件使用

```bash
vsce package
```

然后就可以看到一个 .vsix 的文件, 打开 vscode 进入拓展面板, 点击搜索框右上角的 更多icon(三个点) -> 从 vsix 安装

至于发布线上, 有兴趣自行查找 :)

## Features

- [] add test
- [] 配置模板

