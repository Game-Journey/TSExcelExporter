import { Config } from "./config/Config";
import { parseConfig } from "./config/ConfigParser";
import { excelToJson } from "./exporter/JsonExporter";
import { exportTsClass } from "./exporter/TsClassExporter";
import { exportCsClass } from "./exporter/CsClassExporter";
import { exportTsConfigEnum } from "./exporter/TsConfigEnumExporter";
import { Logger } from "./logger/Logger";
import { ExcelStruct, parseExcelStruct } from "./parser/ExcelParser";
import { checkDuplicateFileName, filterFiles, getXLSXFiles } from "./utils/FileUtils";
import fs from "fs";
import path from "path";
import { pathToNormal } from "./utils/StringUtils";
import { EncryptEnum } from "./encrypt/EncryptEnum";
import { xorEncryptData } from "./encrypt/XOREncrypt";
import { exportCsConfigNameList } from "./exporter/CsConfigNameListExporter";

const dirname = __dirname;
const HEAD_ROW_COUNT = 5;     // 表头行数
// 读取配置文件
parseConfig(dirname);

Logger.log(`读取配置文件成功: ${dirname}`);

const excelPath = Config.EXCEL_PATH;
let excelPathArray = getXLSXFiles(excelPath);
Logger.log(`读取Excel文件成功，总数量: ${excelPathArray.length}个`);

excelPathArray = filterFiles(excelPathArray, Config.EXCLUDE_EXCEL_FILES);
Logger.log(`过滤Excel文件成功，过滤后数量: ${excelPathArray.length}个`);

checkDuplicateFileName(excelPathArray);
if (Logger.isBreak) {
    throw new Error("文件名重复, 请检查Excel文件");
}

if (excelPathArray.length == 0) {
    Logger.error(`没有找到Excel文件`);
    throw new Error("没有找到Excel文件");
}

Logger.clear();

// 删除导出目录下的所有文件
const exportJsonPath = Config.EXPORT_JSON_PATH;
const exportClassPath = Config.EXPORT_CLASS_PATH;
const filesToKeep = ["README.md", "ExcelInterfaces.cs"]

try {
    if (fs.existsSync(exportJsonPath)) {
        fs.rmdirSync(exportJsonPath, { recursive: true })
    };
    fs.mkdirSync(exportJsonPath);

    // if (fs.existsSync(exportClassPath)) {
    //     fs.rmdirSync(exportClassPath, { recursive: true })
    // };
    // fs.mkdirSync(exportClassPath);
    if (fs.existsSync(exportClassPath)) {
        const files = fs.readdirSync(exportClassPath);

        files.forEach(file => {
            // 如果当前文件不在保留列表中
            if (!filesToKeep.includes(file)) {
                const curPath = path.join(exportClassPath, file);
                fs.rmSync(curPath, { recursive: true, force: true });
            }
        });
    } else {
        fs.mkdirSync(exportClassPath);
    }
    Logger.log(`清空导出目录成功: ${exportJsonPath}, ${exportClassPath}\n`);

    function exportJsonAndTs(excelIndex: number) {

        if (Logger.errorLogDataList.length > 100) {
            Logger.error("错误日志过多, 导出终止, 请查看日志文件, 修复错误后再次导出");
            throw new Error("错误日志过多, 导出终止, 请查看日志文件, 修复错误后再次导出");
        }

        if (Logger.isBreak) {
            Logger.error("发生阻断性错误, 导出终止....");
            throw new Error("发生阻断性错误, 导出终止....");
        }

        const path = pathToNormal(excelPathArray[excelIndex]);
        const configName = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
        Logger.currentConfigName = configName;
        Logger.log(`开始解析Excel文件: ${path}`);

        // 解析Excel结构
        parseExcelStruct(path).then((value: ExcelStruct | null) => {
            if (!value) {
                Logger.error("解析Excel结构失败....导出终止....")
                throw new Error("解析Excel结构失败....导出终止....");
            }

            if (value.rowCount == null || value.rowCount <= HEAD_ROW_COUNT) {
                Logger.error(configName + ": Excel行数错误, 必须大于5行, rowCount: " + value.rowCount);
                throw new Error(configName + ": Excel行数错误...., rowCount: " + value.rowCount);
            }

            Logger.log(`解析Excel结构成功: ${path}`);

            // 导出json
            excelToJson(value, Config.EXPORT_JSON_PATH + value.configName + ".json", Config.ENCRYPT_MODE);
            if (Logger.isBreak) {
                Logger.error("发生阻断性错误, 导出终止....");
                throw new Error("发生阻断性错误, 导出终止....");
            }
            Logger.log(`导出json成功: ${path}`);
            // 导出.d.ts
            if (Config.CLASS_TYPE == "ts") {
                exportTsClass(value, Config.EXPORT_CLASS_PATH + value.configName + ".d.ts");                
                Logger.log(`导出.d.ts文件成功: ${path} \n`);
            }
            else if (Config.CLASS_TYPE == "cs") {
                exportCsClass(value, Config.EXPORT_CLASS_PATH + value.configName + ".cs");
                Logger.log(`导出.cs文件成功: ${path} \n`);
            }
            else {
                Logger.error(`不支持的类类型: ${Config.CLASS_TYPE}, 只支持ts或cs`);
                throw new Error(`不支持的类类型: ${Config.CLASS_TYPE}, 只支持ts或cs`);
            }
            
            if (excelIndex < excelPathArray.length - 1) {
                exportJsonAndTs(excelIndex + 1);
            }
            else {
                // 导出完成了
                // 导出加密信息的json文件
                const encryptJsonPath = Config.EXPORT_ENCRYPT_JSON_PATH + "encrypt.json";
                if (!fs.existsSync(Config.EXPORT_ENCRYPT_JSON_PATH)) {
                    fs.mkdirSync(Config.EXPORT_ENCRYPT_JSON_PATH, { recursive: true });
                }
                if (Config.ENCRYPT_MODE == EncryptEnum.XOR) {
                    let encryptJson = JSON.stringify(xorEncryptData, null, 4);
                    // base64加密
                    encryptJson = Buffer.from(encryptJson).toString("base64");
                    fs.writeFileSync(encryptJsonPath, encryptJson);
                    Logger.log(`导出加密信息成功: ${encryptJsonPath}`);
                }
                else if (Config.ENCRYPT_MODE == EncryptEnum.None) {
                    // 无加密
                    fs.writeFileSync(encryptJsonPath, "{}"); 
                }
            }
        });
    }

    // 同一时间一次只处理一个Excel文件
    exportJsonAndTs(0);

    const errorData = Logger.errorLogDataList;
    if (errorData.length > 0 || Logger.isBreak) {
        console.error("error: 导出失败, 请查看日志");
        throw new Error("导出配表失败, 请查看日志");
    }

    if (Config.CLASS_TYPE == "ts") {
        exportTsConfigEnum(excelPathArray, Config.EXPORT_CLASS_PATH + "ExcelName.ts");
        Logger.log(`导出ExcelName.ts成功: ${Config.EXPORT_CLASS_PATH}ExcelName.ts`);
        // 导出 IExcelConfig
        fs.writeFileSync(Config.EXPORT_CLASS_PATH + "IExcelConfig.d.ts", `// This file is auto generated by ExcelExportTools, do not modify it.\n\nexport interface IExcelConfig { }\n`);
    }
    else if (Config.CLASS_TYPE == "cs") {
        exportCsConfigNameList(excelPathArray, Config.EXPORT_CLASS_PATH + "ExcelName.cs");
        Logger.log(`导出ExcelName.cs成功: ${Config.EXPORT_CLASS_PATH}ExcelName.cs`);
    }
    else {
        Logger.error(`不支持的类类型: ${Config.CLASS_TYPE}, 只支持ts或cs`);
        throw new Error(`不支持的类类型: ${Config.CLASS_TYPE}, 只支持ts或cs`);
    }


  
} catch (error) {
    Logger.error("导出失败, 程序出现错误, 请查看日志.....", error);
    throw error;
}