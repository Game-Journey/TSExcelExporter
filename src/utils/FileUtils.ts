import fs from "fs";
import path from "path";
import { pathToNormal, toUpperCamelCase } from "./StringUtils";
import { Logger } from "../logger/Logger";

// 获取文件夹下所有.xlsx文件, 包括子目录, 递归查找
export function getXLSXFiles(dir: string): string[] {
    let files: string[] = [];
    const fileList = fs.readdirSync(dir);
    fileList.forEach((file) => {
        let filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            files = files.concat(getXLSXFiles(filePath));
        } else {
            if (file.endsWith(".xlsx") && !file.includes("~$")) {
                filePath = filePath.replace(/\\/g, "/");
                // 是否有多个.符号
                let index = filePath.lastIndexOf(".");
                if (filePath.substring(0, index).includes(".")) {
                    Logger.error(`检测到配表又多个.符号， 文件名中不能包含.符号: ${filePath}`);
                    Logger.break();
                    return;
                }

                files.push(filePath);
            }
        }
    });
    return files;
}

export function filterFiles(filePathArray:string[], excludes :string[]):string[]{
    let files:string[] = [];
    filePathArray.forEach((filePath)=>{
        filePath = pathToNormal(filePath);
        let fileName = filePath.substring(filePath.lastIndexOf("/")+1,filePath.lastIndexOf("."));
        if(!excludes.includes(fileName)){
            files.push(filePath);
        }
    });
    return files;
}

export function checkDuplicateFileName(filePathArray:string[]):void{
    let fileNameMap = new Map<string,string>();
    filePathArray.forEach((filePath)=>{
        filePath = pathToNormal(filePath);
        let fileName = filePath.substring(filePath.lastIndexOf("/")+1,filePath.lastIndexOf("."));
        fileName = toUpperCamelCase(fileName);
        if(fileNameMap.has(fileName)){
            Logger.error(`文件名重复: ${fileNameMap.get(fileName)}, ${filePath}`);
            Logger.break();
            return;
        }
        fileNameMap.set(fileName,filePath);
    });
}