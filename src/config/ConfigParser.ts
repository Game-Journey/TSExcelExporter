
import fs from "fs";
import path from "path";
import { Config } from "./Config";

export function parseConfig(rootPath: string) {

    let configStr: string = "";
    if (fs.existsSync(path.join(rootPath, "./config.json"))) {
        configStr = fs.readFileSync(path.join(rootPath, "./config.json"), "utf-8");
    }
    else {
        configStr = fs.readFileSync(path.join(rootPath, "../config.json"), "utf-8");
    }

    const configJson = JSON.parse(configStr);
    Config.DEFAULT_SHEET_NAME = configJson["defaultSheetName"];
    
    Config.EXCEL_PATH = path.join(rootPath, configJson["excelRelativePath"]);
    Config.LOG_PATH = path.join(rootPath, configJson["logRelativePath"]);
    Config.FONT_PATH = path.join(rootPath, configJson["fontRelativePath"]);

    Config.EXPORT_JSON_PATH = path.join(rootPath, configJson["exportRelativePath"]);
    Config.EXPORT_ENCRYPT_JSON_PATH = path.join(rootPath, configJson["exportEncryptRelativePath"]);
    Config.EXPORT_CLASS_PATH = path.join(rootPath, configJson["exportClassRelativePath"]);
    Config.EXPORT_FONT_PATH = path.join(rootPath, configJson["exportFontRelativePath"]);

    Config.EXCLUDE_EXCEL_FILES = configJson["excludeExcelFiles"];

    Config.ENCRYPT_FILES = configJson["encryptFiles"];
    Config.ENCRYPT_MODE = configJson["encryptMode"];
}
