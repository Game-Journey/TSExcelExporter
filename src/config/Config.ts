
export class Config {
    static DEFAULT_SHEET_NAME: string = "MainSheet";     // 默认表名

    static EXCEL_PATH: string = "../../config/";    // 配置文件相对路径
    static LOG_PATH: string = "../log/";          // 日志文件相对路径
    static FONT_PATH: string = "../../font/";        // 字体文件相对路径

    static EXPORT_JSON_PATH: string = "../../save/";      // 保存json文件相对路径
    static EXPORT_CLASS_PATH: string = "../../src/config/";      // 保存.d.ts文件相对路径
    static EXPORT_FONT_PATH: string = "../../save/font/";        // 保存字体文件相对路径

    static EXCLUDE_EXCEL_FILES: string[] = [""]; // 排除的Excel文件
    static ENCRYPT_MODE: number = 1; // 加密模式,对应EncryptEnum
}