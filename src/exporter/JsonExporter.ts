import { Row } from "exceljs";
import { Logger } from "../logger/Logger";
import { ExcelStruct } from "../parser/ExcelParser";
import DataParseFunc from "../parser/DataParseFunc";
import fs from "fs";

const HEAD_ROW_COUNT = 5;     // 表头行数

export function excelToJson(excelStruct: ExcelStruct, outPath: string) {

    if (excelStruct == null) {
        Logger.error(`excelToJson error, excelStruct is null`);
        return;
    }

    if (outPath == null || outPath == "") {
        Logger.error(`excelToJson error, outPath is error: ${outPath}`);
        return;
    }

    const worksheet = excelStruct.sheet;
    if (worksheet == null) {
        Logger.error(`excelToJson error, worksheet is null`);
        return;
    }
    const rowCount = excelStruct.rowCount;

    if (rowCount == null || rowCount <= HEAD_ROW_COUNT) {        // 5行是表头
        Logger.error(`excelToJson error, rowCount is error: ${rowCount}`);
        return;
    }

    // 主键列
    const mainKeyColumnData = excelStruct.columnDataList[excelStruct.mainKeyColumn];
    const mainKeyIndex = mainKeyColumnData.column;
    const mainKeyColumn = worksheet.getColumn(mainKeyIndex);
    if (mainKeyColumn == null) {
        Logger.error(`excelToJson error, mainKeyColumn is null, index: ${mainKeyIndex}`);
        return;
    }
    // 子键列
    let subKeyColumnData = null;
    let subKeyIndex = -1;
    let subKeyColumn = null;
    if (excelStruct.subKeyColumn != -1) {
        subKeyColumnData = excelStruct.columnDataList[excelStruct.subKeyColumn];
        subKeyIndex = subKeyColumnData.column;
        subKeyColumn = worksheet.getColumn(subKeyColumnData.column);
    }

    let jsonData: { [key: string]: any } | { [key: string]: { [key: string]: any } } = {};

    for (let i = HEAD_ROW_COUNT + 1, len = rowCount; i <= len; i++) {
        const row = worksheet.getRow(i);
        Logger.currentRow = i;
        if (row) {
            let mainKey = row.getCell(mainKeyIndex).text;
            if (mainKey == null || mainKey.trim() == "") {
                Logger.error(`excelToJson error, 主Key为空, row: ${i}`);
                Logger.break();
                continue;
            }
            mainKey = mainKey.trim();

            if (subKeyIndex != -1) {
                if (!jsonData[mainKey]) {
                    jsonData[mainKey] = {};
                }

                let subKey = row.getCell(subKeyIndex).text;
                if (subKey == null || subKey.trim() == "") {
                    Logger.error(`excelToJson error, 子Key为空, row: ${i}`);
                    Logger.break();
                    continue;
                }
                subKey = subKey.trim();
                if (!jsonData[mainKey][subKey]) {
                    jsonData[mainKey][subKey] = exportRow(row, excelStruct);
                }
                else {
                    Logger.error(`excelToJson error, 子Key重复, row: ${i}`);
                    Logger.break();
                }

            }
            else {
                if (!jsonData[mainKey]) {
                    jsonData[mainKey] = exportRow(row, excelStruct);
                }
                else {
                    Logger.error(`excelToJson error, 主Key重复, row: ${i}`);
                    Logger.break();
                }
            }
        }
    }

    fs.writeFileSync(outPath, JSON.stringify(jsonData, null, 4));
}


function exportRow(row: Row, excelStruct: ExcelStruct): { [key: string]: any } | null {
    let rowData: { [key: string]: any } = {};
    const columnDataList = excelStruct.columnDataList;
    if (columnDataList == null || columnDataList.length == 0) {
        Logger.error(`exportRow error, columnDataList is null`);
        return rowData;
    }

    for (let i = 0, len = columnDataList.length; i < len; i++) {
        const columnData = columnDataList[i];
        const cell = row.getCell(columnData.column);
        
        Logger.currentColumnName = columnData.fieldName;

        try {
            const parseFunc = DataParseFunc.get(columnData.dataType);
            if (parseFunc == null) {
                Logger.error(`exportRow error, parseFunc is null, column: ${columnData.column}`, columnData);
                Logger.break();
                continue;
            }
    
            let result = parseFunc(cell);
            if (result == null) {
                result = "_error_";
            }
            rowData[columnData.fieldName] = result;
        } catch (error) {
            Logger.error(`exportRow error, column: ${columnData.column}, error: ${error}`);
            Logger.break();
        }
    }

    return rowData;
} 
