import fs from "fs";
import path from "path";

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
                files.push(filePath);
            }
        }
    });
    return files;
}