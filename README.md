# TS Excel Exporter

TSExcelExporter 是一个用于导出excel表格的工具，支持导出为json、.d.ts文件。

## 初始化环境

1. 安装nodejs
2. 根目录下执行 ```npm i```

## 配表设置说明

设置文件在根目录的config.json中

```json
{
    "defaultSheetName":"MainSheet",

    "excelRelativePath":"../test/excel/",
    "logRelativePath":"../log",
    "fontRelativePath":"../test/font/",

    "exportRelativePath":"../test/json/",
    "exportClassRelativePath":"../test/ts/",
    "exportFontRelativePath":"../test/mini-font/",

    "excludeExcelFiles":[]
}
```

defaultSheetName: 默认的表名

excelRelativePath: excel文件的相对路径
logRelativePath: log文件的相对路径
fontRelativePath: 字体文件的相对路径

exportRelativePath: 导出文件的相对路径
exportClassRelativePath: 导出类文件的相对路径
exportFontRelativePath: 导出字体文件的相对路径

excludeExcelFiles: 排除的excel文件列表


## 如何导出index.js

1. 打开终端
2. 输入 ```npx ncc build src/index.ts -o out```
3. 输出的文件在out目录下

## 如何测试导出的index.js

1. 打开终端
2. 输入 ```node out/index.js```
