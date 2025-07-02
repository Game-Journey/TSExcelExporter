
import { Column, Row, Workbook, Worksheet } from "exceljs";
import { BothScopeName, ClientScopeName, ColumnScope, ColumnType, DataType, DataTypeVariant, DataTypeVariantMap, MainKeyName, SeverScopeName, SubKeyName } from "./ParserEnum";
import { Logger } from "../logger/Logger";


// 单列数据类型
export class ColumnData {
    // 列索引
    public column: number = -1;
    // 字段名称, eg: name\age
    public fieldName: string = "";
    // 备注名
    public commentName: string = "";
    // 列作用域
    public scope: ColumnScope = ColumnScope.Both;
    // 列类型
    public columnType: ColumnType = ColumnType.Normal;
    // 数据类型
    public dataType: DataType = DataType.String;
    // 数据检测
    public dataCheck: string = "";
}

export class ExcelStruct {
    // 配置名
    public configName: string = "";
    // 表名
    public sheetName: string = "";
    // 列数据
    public columnDataList: ColumnData[] = [];
    // workbook
    public workbook: Workbook | null = null;
    // sheet
    public sheet: Worksheet | null = null;
    // 行数
    public rowCount: number = 0;
    // mainKey列, columnDataList的索引
    public mainKeyColumn: number = -1;
    // subKey列, columnDataList的索引
    public subKeyColumn: number = -1;
}

/**
 * 解析Excel结构
 * @param path 绝对路径
 * @returns Excel结构
 */
export async function parseExcelStruct(path: string): Promise<ExcelStruct | null> {
    if (path == null || path == "" || path.lastIndexOf(".") == -1 || path.lastIndexOf("/") == -1) {
        Logger.error(`parseExcelStruct error, path is error: ${path}`);
        return null;
    }

    const excelStruct = new ExcelStruct();
    excelStruct.workbook = new Workbook();
    excelStruct.configName = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));

    await excelStruct.workbook.xlsx.readFile(path);

    let worksheet = null;
    let firstSheet = null;
    for (let i = 0; i < excelStruct.workbook.worksheets.length; i++) {
        if (excelStruct.workbook.worksheets[i]) {
            if (firstSheet == null) {
                firstSheet = excelStruct.workbook.worksheets[i];
            }

            if (excelStruct.workbook.worksheets[i].name == "MainSheet") {
                worksheet = excelStruct.workbook.worksheets[i];
                break;
            }
        }
    }

    if (worksheet == null) {
        // 没找到MainSheet表, 则使用第一个表
        Logger.log(`没有找到MainSheet表, 使用第一个表: `+ firstSheet?.name);
        worksheet = firstSheet;
    }

    if (worksheet == null) {
        Logger.error(`parseExcelStruct error, worksheet is null`);
        return null;
    }

    excelStruct.sheetName = worksheet.name;
    excelStruct.sheet = worksheet;

    Logger.currentSheetName = worksheet.name;

    const fieldNameRow = worksheet.getRow(1);
    const columnTypeRow = worksheet.getRow(2);
    const scopeRow = worksheet.getRow(3);
    const commentRow = worksheet.getRow(5);

    // 获取列数
    const columnCount = fieldNameRow.cellCount;
    let mainKeyColumn = 0;
    for (let i = 1; i <= columnCount; i++) {
        let fieldName = fieldNameRow.getCell(i).text || "";
        fieldName = fieldName.trim();
        if (fieldName == "") {
            // 空字段名为策划的注释列 或者 空列
            continue;
        }

        const columnData = new ColumnData();
        columnData.column = i;
        columnData.fieldName = fieldName;

        Logger.currentColumnName = fieldName;
        Logger.currentRow = 2;
        let typeName = columnTypeRow.getCell(i).text || "";
        typeName = typeName.toLowerCase().trim();
        let dataType = DataTypeVariantMap.get(typeName as DataTypeVariant);
        if (dataType != null) {
            columnData.dataType = dataType;
        }
        else {
            columnData.dataType = typeName as DataType;
        }

        columnData.commentName = commentRow.getCell(i).text || "";
        columnData.commentName = columnData.commentName.trim();

        // 列作用域
        Logger.currentRow = 3;
        let scope = scopeRow.getCell(i).text || "";
        scope = scope.toLowerCase().trim();
        setScope(scope, columnData);

        excelStruct.columnDataList.push(columnData);
        if (columnData.columnType == ColumnType.MainKey) {
            mainKeyColumn = i;
            excelStruct.mainKeyColumn = excelStruct.columnDataList.length - 1;
        }
        else if (columnData.columnType == ColumnType.SubKey) {
            excelStruct.subKeyColumn = excelStruct.columnDataList.length - 1;
        }
    }

    const mainColumn = worksheet.getColumn(mainKeyColumn);
    if (mainColumn == null) {
        Logger.error(`解析Excel结构失败, 没有主键列.....`);
        Logger.break();
        return null;   
    }
    excelStruct.rowCount = getRowCount(mainColumn);

    // 检测是否有重复字段名
    let fieldNameMap = new Map<string, number>();
    for (let i = 0; i < excelStruct.columnDataList.length; i++) {
        let fieldName = excelStruct.columnDataList[i].fieldName;
        if (fieldNameMap.has(fieldName)) {
            Logger.error(`解析Excel结构失败, 字段名重复: ${fieldName}`);
            Logger.break();
            return null;
        }
        fieldNameMap.set(fieldName, 1);
    }

    return excelStruct;
}

function setScope(scope: string, columnData: ColumnData) {
    if (MainKeyName.includes(scope)) {
        columnData.scope = ColumnScope.Both;
        columnData.columnType = ColumnType.MainKey;
    }
    else if (SubKeyName.includes(scope)) {
        columnData.scope = ColumnScope.Both;
        columnData.columnType = ColumnType.SubKey;
    }
    else if (BothScopeName.includes(scope)) {
        columnData.scope = ColumnScope.Both;
        columnData.columnType = ColumnType.Normal;
    }
    else if (SeverScopeName.includes(scope)) {
        columnData.scope = ColumnScope.Server;
        columnData.columnType = ColumnType.Normal;
    }
    else if (ClientScopeName.includes(scope)) {
        columnData.scope = ColumnScope.Client;
        columnData.columnType = ColumnType.Normal;
    }
    else {
        Logger.error(`parseExcelStruct error, key设置或作用域设置错误 error: ${scope}`, columnData.fieldName);
        Logger.break();
    }
}

// 根据主键列获取行数，主键列不能为空
function getRowCount(column: Column): number {
    let rowCount = 0;
    let headRowCount = 5;

    let columnRow: { rowNumber: number, hasValue: boolean }[] = [];
    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber > headRowCount) {
            if (cell && cell.text && cell.text.trim() != "") {
                columnRow.push({ rowNumber: rowNumber, hasValue: true });
            }
            else {
                columnRow.push({ rowNumber: rowNumber, hasValue: false });
            }
        }
    });

    // 按照rowNumber排序
    columnRow.sort((a, b) => a.rowNumber - b.rowNumber);
    for (let i = 0; i < columnRow.length; i++) {
        if (columnRow[i].hasValue) {
            rowCount++;
        }
        else {
            break;
        }
    }
    rowCount += headRowCount;
    return rowCount;
}

