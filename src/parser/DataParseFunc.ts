import { Cell } from "exceljs";
import { DataType } from "./ParserEnum";
import { cellToFloat, cellToInt, stringToFloat, stringToInt, stringToVector2, stringToVector2Int, stringToVector3, stringToVector3Int, stringToVector4, stringToVector4Int } from "../utils/Utils";
import { Logger } from "../logger/Logger";

type ParseFunction = (cell: Cell) => object | number | string | boolean;

const DataParseFunc: Map<DataType, ParseFunction> = new Map<DataType, ParseFunction>();

DataParseFunc.set(DataType.Int, (cell: Cell) => {
    const value = cellToInt(cell);
    return value;
});

DataParseFunc.set(DataType.Float, (cell: Cell) => {
    const value = cellToFloat(cell);
    return value;
});

DataParseFunc.set(DataType.String, (cell: Cell) => {
    return cell.text || "";
});

DataParseFunc.set(DataType.Bool, (cell: Cell) => {
    return cell.text === "true" || cell.text === "1";
});

DataParseFunc.set(DataType.Vector2, (cell: Cell) => {
    const value = stringToVector2(cell.text);
    return value;
});

DataParseFunc.set(DataType.Vector2Int, (cell: Cell) => {
    const value = stringToVector2Int(cell.text);
    return value;
});

DataParseFunc.set(DataType.Vector3, (cell: Cell) => {
    const value = stringToVector3(cell.text);
    return value;
});

DataParseFunc.set(DataType.Vector3Int, (cell: Cell) => {
    const value = stringToVector3Int(cell.text);
    return value;
});

DataParseFunc.set(DataType.Vector4, (cell: Cell) => {
    const value = stringToVector4(cell.text);
    return value;
});

DataParseFunc.set(DataType.Vector4Int, (cell: Cell) => {
    const value = stringToVector4Int(cell.text);
    return value;
});

// ------------------------------ 数组类型
DataParseFunc.set(DataType.ArrayInt, (cell: Cell) => {
    const result: number[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(stringToInt(segments[i]));
        }
    }
    else {
        //Logger.error(`ArrayInt parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayFloat, (cell: Cell) => {
    const result: number[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(stringToFloat(segments[i]));
        }
    }
    else {
        //Logger.error(`ArrayFloat parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayString, (cell: Cell) => {
    const result: string[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(segments[i]);
        }
    }
    else {
        //Logger.error(`ArrayString parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayBool, (cell: Cell) => {
    const result: boolean[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(segments[i] === "true" || segments[i] === "1");
        }
    }
    else {
        //Logger.error(`ArrayBool parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayVector2, (cell: Cell) => {
    const result: { x: number, y: number }[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(stringToVector2(segments[i]));
        }
    }
    else {
        //Logger.error(`ArrayVector2 parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayVector2Int, (cell: Cell) => {
    const result: { x: number, y: number }[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(stringToVector2Int(segments[i]));
        }
    }
    else {
        //Logger.error(`ArrayVector2Int parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayVector3, (cell: Cell) => {
    const result: { x: number, y: number, z: number }[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(stringToVector3(segments[i]));
        }
    }
    else {
        //Logger.error(`ArrayVector3 parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayVector3Int, (cell: Cell) => {
    const result: { x: number, y: number, z: number }[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(stringToVector3Int(segments[i]));
        }
    }
    else {
        //Logger.error(`ArrayVector3Int parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayVector4, (cell: Cell) => {
    const result: { x: number, y: number, z: number, w: number }[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(stringToVector4(segments[i]));
        }
    }
    else {
        //Logger.error(`ArrayVector4 parse error: ${cell.text}`);
    }
    return result;
});

DataParseFunc.set(DataType.ArrayVector4Int, (cell: Cell) => {
    const result: { x: number, y: number, z: number, w: number }[] = [];
    if (cell.text) {
        const segments = cell.text.split("|");  // 竖线分隔
        for(let i = 0; i < segments.length; i++) {
            result.push(stringToVector4Int(segments[i]));
        }
    }
    else {
        //Logger.error(`ArrayVector4Int parse error: ${cell.text}`);
    }
    return result;
});

// ------------------------------ 其他
DataParseFunc.set(DataType.Any, (cell: Cell) => {
    return cell.text || "";
});

DataParseFunc.set(DataType.Json, (cell: Cell) => {
    return JSON.parse(cell.text || "{}");
});

export default DataParseFunc;
