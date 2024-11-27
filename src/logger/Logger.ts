import { Config } from "../config/Config";
import path from "path";
import fs from "fs";

export class LogData {
    public configName: string = "";
    public sheetName: string = "";
    public columnName: string = "";
    public row: number = 0;

    public message: string = "";
    public args: any[] = [];
    public stack: string = "";
}

export class Logger {

    private static _errorLogDataList: LogData[] = [];
    public static get errorLogDataList(): LogData[] {
        return Logger._errorLogDataList;
    }

    private static _logDataList: LogData[] = [];

    private static _isBreak: boolean = false;
    public static get isBreak(): boolean {
        return Logger._isBreak;
    }

    // 当前解析的配置名、表名、列名、行号, 用于错误日志记录
    private static _currentConfigName: string = "";
    public static set currentConfigName(value: string) {
        Logger._currentConfigName = value;
    }
    private static _currentSheetName: string = "";
    public static set currentSheetName(value: string) {
        Logger._currentSheetName = value;
    }
    private static _currentColumnName: string = "";
    public static set currentColumnName(value: string) {
        Logger._currentColumnName = value;
    }
    private static _currentRow: number = 0;
    public static set currentRow(value: number) {
        Logger._currentRow = value;
    }

    public static break() {
        this._isBreak = true;
    }

    public static error(message: string, ...args: any[]) {
        const logData = new LogData();
        logData.configName = Logger._currentConfigName;
        logData.sheetName = Logger._currentSheetName;
        logData.columnName = Logger._currentColumnName;
        logData.row = Logger._currentRow;
        logData.message = message;
        logData.args = args;
        logData.stack = new Error().stack || "";
        Logger._errorLogDataList.push(logData);
        console.error(message, ...args);
        this.saveErrorLogToFile();
    }

    private static _warnLogDataList: LogData[] = [];
    public static get warnLogDataList(): LogData[] {
        return Logger._warnLogDataList;
    }

    public static warn(message: string, ...args: any[]) {
        const logData = new LogData();
        logData.configName = Logger._currentConfigName;
        logData.sheetName = Logger._currentSheetName;
        logData.columnName = Logger._currentColumnName;
        logData.row = Logger._currentRow;
        logData.message = message;
        logData.args = args;
        logData.stack = new Error().stack || "";
        Logger._warnLogDataList.push(logData);
        console.warn(message, ...args);
    }
    
    public static log(message: string, ...args: any[]) {
        console.log(message, ...args);
        const logData = new LogData();
        logData.message = message;
        logData.args = args;
        Logger._logDataList.push(logData);
        this.saveLogToFile();
    }

    // 持有当前日志文件
    private static _logFile: fs.WriteStream | null = null;
    private static _errorLogFile: fs.WriteStream | null = null;

    public static saveLogToFile() {
        const logPath = path.join(Config.LOG_PATH, "log.log");
        if (this._logFile == null) {
            this._logFile = fs.createWriteStream(logPath, { flags: "w" });
        }

        let logStr = "";
        const logData = Logger._logDataList[Logger._logDataList.length - 1];

        logStr += `message: ${logData.message}\n`;
        if (logData.args && logData.args.length > 0) {
            logStr += `args: ${logData.args}\n`;                
        }

        this._logFile.write(logStr);
    }
        

    public static saveErrorLogToFile() {
        const errorPath = path.join(Config.LOG_PATH, "error.log");
        if (this._errorLogFile == null) {
            this._errorLogFile = fs.createWriteStream(errorPath, { flags: "w" });
        }
        let errorLogStr = "";

        const logData = Logger._errorLogDataList[Logger._errorLogDataList.length - 1];
        errorLogStr += `-------> configName: ${logData.configName}, sheetName: ${logData.sheetName}\n`;
        errorLogStr += `column: ${logData.columnName}, row: ${logData.row}, message: ${logData.message}\n`;
        errorLogStr += `args: ${logData.args}\n`;
        errorLogStr += `stack: ${logData.stack}\n\n`;
        errorLogStr += "\n";
    
        this._errorLogFile.write(errorLogStr);
    }

    public static clear() {
        Logger._errorLogDataList = [];
        Logger._warnLogDataList = [];
        
        Logger._currentConfigName = "";
        Logger._currentSheetName = "";
        Logger._currentColumnName = "";
        Logger._currentRow = 0;

        const errorPath = path.join(Config.LOG_PATH, "error.log");
        if (fs.existsSync(errorPath)) {
            fs.unlinkSync(errorPath);   // 删除文件
        }
    }

}
