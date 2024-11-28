"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./config/Config");
const ConfigParser_1 = require("./config/ConfigParser");
const JsonExporter_1 = require("./exporter/JsonExporter");
const TsClassExporter_1 = require("./exporter/TsClassExporter");
const TsConfigEnumExporter_1 = require("./exporter/TsConfigEnumExporter");
const Logger_1 = require("./logger/Logger");
const ExcelParser_1 = require("./parser/ExcelParser");
const FileUtils_1 = require("./utils/FileUtils");
const fs_1 = __importDefault(require("fs"));
const StringUtils_1 = require("./utils/StringUtils");
const dirname = __dirname;
const HEAD_ROW_COUNT = 5; // 表头行数
// 读取配置文件
(0, ConfigParser_1.parseConfig)(dirname);
Logger_1.Logger.log(`读取配置文件成功: ${dirname}`);
const excelPath = Config_1.Config.EXCEL_PATH;
let excelPathArray = (0, FileUtils_1.getXLSXFiles)(excelPath);
Logger_1.Logger.log(`读取Excel文件成功，总数量: ${excelPathArray.length}个`);
excelPathArray = (0, FileUtils_1.filterFiles)(excelPathArray, Config_1.Config.EXCLUDE_EXCEL_FILES);
Logger_1.Logger.log(`过滤Excel文件成功，过滤后数量: ${excelPathArray.length}个`);
(0, FileUtils_1.checkDuplicateFileName)(excelPathArray);
if (Logger_1.Logger.isBreak) {
    throw new Error("文件名重复, 请检查Excel文件");
}
if (excelPathArray.length == 0) {
    Logger_1.Logger.error(`没有找到Excel文件`);
    throw new Error("没有找到Excel文件");
}
Logger_1.Logger.clear();
// 删除导出目录下的所有文件
const exportJsonPath = Config_1.Config.EXPORT_JSON_PATH;
const exportClassPath = Config_1.Config.EXPORT_CLASS_PATH;
try {
    if (fs_1.default.existsSync(exportJsonPath)) {
        fs_1.default.rmdirSync(exportJsonPath, { recursive: true });
    }
    ;
    fs_1.default.mkdirSync(exportJsonPath);
    if (fs_1.default.existsSync(exportClassPath)) {
        fs_1.default.rmdirSync(exportClassPath, { recursive: true });
    }
    ;
    fs_1.default.mkdirSync(exportClassPath);
    Logger_1.Logger.log(`清空导出目录成功: ${exportJsonPath}, ${exportClassPath}\n`);
    function exportJsonAndTs(excelIndex) {
        if (Logger_1.Logger.errorLogDataList.length > 100) {
            Logger_1.Logger.error("错误日志过多, 导出终止, 请查看日志文件, 修复错误后再次导出");
            return;
        }
        if (Logger_1.Logger.isBreak) {
            Logger_1.Logger.error("发生阻断性错误, 导出终止....");
            return;
        }
        const path = (0, StringUtils_1.pathToNormal)(excelPathArray[excelIndex]);
        const configName = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
        Logger_1.Logger.currentConfigName = configName;
        Logger_1.Logger.log(`开始解析Excel文件: ${path}`);
        // 解析Excel结构
        (0, ExcelParser_1.parseExcelStruct)(path).then((value) => {
            if (!value) {
                Logger_1.Logger.error("解析Excel结构失败....导出终止....");
                // if (excelIndex < excelPathArray.length - 1) {
                //     exportJsonAndTs(excelIndex + 1);
                // }
                return;
            }
            if (value.rowCount == null || value.rowCount <= HEAD_ROW_COUNT) {
                Logger_1.Logger.error(configName + ": Excel行数错误...., rowCount: " + value.rowCount);
                return;
            }
            Logger_1.Logger.log(`解析Excel结构成功: ${path}`);
            // 导出json
            (0, JsonExporter_1.excelToJson)(value, Config_1.Config.EXPORT_JSON_PATH + value.configName + ".json");
            if (Logger_1.Logger.isBreak) {
                Logger_1.Logger.error("发生阻断性错误, 导出终止....");
                return;
            }
            Logger_1.Logger.log(`导出json成功: ${path}`);
            // 导出.d.ts
            (0, TsClassExporter_1.exportTsClass)(value, Config_1.Config.EXPORT_CLASS_PATH + value.configName + ".d.ts");
            Logger_1.Logger.log(`导出.d.ts文件成功: ${path} \n`);
            if (excelIndex < excelPathArray.length - 1) {
                exportJsonAndTs(excelIndex + 1);
            }
        });
    }
    // 同一时间一次只处理一个Excel文件
    exportJsonAndTs(0);
    const errorData = Logger_1.Logger.errorLogDataList;
    if (errorData.length > 0 || Logger_1.Logger.isBreak) {
        console.error("error: 导出失败, 请查看日志");
    }
    (0, TsConfigEnumExporter_1.exportTsConfigEnum)(excelPathArray, Config_1.Config.EXPORT_CLASS_PATH + "ExcelName.ts");
    Logger_1.Logger.log(`导出ExcelName.ts成功: ${Config_1.Config.EXPORT_CLASS_PATH}ExcelName.ts`);
}
catch (error) {
    Logger_1.Logger.error("导出失败, 程序出现错误, 请查看日志.....");
}
//# sourceMappingURL=index.js.map