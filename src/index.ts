import { Config } from "./config/Config";
import { parseConfig } from "./config/ConfigParser";
import { excelToJson } from "./exporter/JsonExporter";
import { exportTsClass } from "./exporter/TsClassExporter";
import { Logger } from "./logger/Logger";
import { ExcelStruct, parseExcelStruct } from "./parser/ExcelParser";
import { getXLSXFiles } from "./utils/FileUtils";
import fs from "fs";

const dirname = __dirname;
const HEAD_ROW_COUNT = 5;     // 表头行数
// 读取配置文件
parseConfig(dirname);

const excelPath = Config.EXCEL_PATH;
const excelPathArray = getXLSXFiles(excelPath);

if (excelPathArray.length == 0) {
    Logger.error(`没有找到Excel文件`);
    throw new Error("没有找到Excel文件");
}

Logger.clear();

// 删除导出目录下的所有文件
const exportJsonPath = Config.EXPORT_JSON_PATH;
const exportClassPath = Config.EXPORT_CLASS_PATH;

if (fs.existsSync(exportJsonPath)) {
    fs.rmdirSync(exportJsonPath, { recursive: true })
};
fs.mkdirSync(exportJsonPath);

if (fs.existsSync(exportClassPath)) {
    fs.rmdirSync(exportClassPath, { recursive: true })
};

function exportJsonAndTs(excelIndex : number) {

    if (Logger.errorLogDataList.length > 100) {
        Logger.error("错误日志过多, 导出终止, 请查看日志文件, 修复错误后再次导出");
        return
    }

    if (Logger.isBreak) {
        Logger.error("发生阻断性错误, 导出终止....");
        return;   
    }


    const path = excelPathArray[excelIndex];
    const configName = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
    Logger.currentConfigName = configName;
    Logger.log(`开始解析Excel文件: ${path}`);

    // 解析Excel结构
    parseExcelStruct(path).then((value: ExcelStruct | null) => {
        if (!value) {
            Logger.error("解析Excel结构失败....导出终止....")
            // if (excelIndex < excelPathArray.length - 1) {
            //     exportJsonAndTs(excelIndex + 1);
            // }
            return;
        }

        if (value.rowCount == null || value.rowCount <= HEAD_ROW_COUNT) {
            Logger.error(configName + ": Excel行数错误...., rowCount: " + value.rowCount);
            return;
        }

        // 导出json
        excelToJson(value, Config.EXPORT_JSON_PATH + value.configName + ".json");
        if (Logger.isBreak) {
            Logger.error("发生阻断性错误, 导出终止....");
            return;   
        }
        // 导出.d.ts
        exportTsClass(value, Config.EXPORT_CLASS_PATH + value.configName + ".d.ts");
        if (excelIndex < excelPathArray.length - 1) {
            exportJsonAndTs(excelIndex + 1);
        }
    });
}

// 同一时间一次只处理一个Excel文件
exportJsonAndTs(0);

const errorData = Logger.errorLogDataList;
if (errorData.length > 0 || Logger.isBreak) {
    console.error("error: 导出失败, 请查看日志");
}