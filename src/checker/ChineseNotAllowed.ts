import { Worksheet } from "exceljs";
import { ExcelStruct } from "../parser/ExcelParser";
import { Logger } from "../logger/Logger";


export function chineseNotAllowed(excel: ExcelStruct, column: number): boolean {
    if (excel == null || excel.sheet == null || column < 1) {
        return false;
    }
    const worksheet: Worksheet = excel.sheet;
    const columnData = worksheet.getColumn(column);
    if (columnData == null) {
        return false;
    }

    const beginRow = 6; // 从第6行开始检查
    const endRow = excel.rowCount; // 结束行数
    for (let i = beginRow; i <= endRow; i++) {
        const rowData = excel.sheet.getRow(i);
        const cellValue = rowData.getCell(column).text;
        if (/[^\x00-\x7F]/.test(cellValue)) { // 检查是否包含非ASCII字符（即中文字符）
            Logger.error(`${excel.configName}: 第${i}行，第${column}列包含中文字符: ${cellValue}`);
            return true; // 如果发现中文字符，返回true
        }
    }
    return false; // 如果没有发现中文字符，返回false
}
