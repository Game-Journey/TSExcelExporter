import { Cell } from "exceljs";
import { DataType } from "./ParserEnum";
import { cellToFloat, cellToInt, stringToFloat, stringToInt, stringToVector2, stringToVector2Int, stringToVector3, stringToVector3Int, stringToVector4, stringToVector4Int } from "../utils/Utils";
import { Logger } from "../logger/Logger";

type ParseFunction = (cell: Cell) => object | number | string | boolean | undefined;

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
            const value = stringToVector2(segments[i]);
            if (value) {
                result.push(value);
            }
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
            const value = stringToVector2Int(segments[i]);
            if (value) {
                result.push(value);
            }
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
            const value = stringToVector3(segments[i]);
            if (value) {
                result.push(value);
            }
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
            const value = stringToVector3Int(segments[i]);
            if (value) {
                result.push(value);
            }
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
            const value = stringToVector4(segments[i]);
            if (value) {
                result.push(value);
            }
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
            const value = stringToVector4Int(segments[i]);
            if (value) {
                result.push(value);
            }
        }
    }
    else {
        //Logger.error(`ArrayVector4Int parse error: ${cell.text}`);
    }
    return result;
});

// ------------------------------ 其他
DataParseFunc.set(DataType.Any, (cell: Cell) => {
    return cell.text;
});

DataParseFunc.set(DataType.Json, (cell: Cell) => {
    let rawText = cell.text;
   // 1. 【核心步骤】提取并保护所有引号内的字符串
    // 这个正则可以匹配带转义符的字符串，例如 "hello \"world\""
    const strings : string[] = [];
    const stringRegex = /"(?:\\.|[^\\"])*"/g;
    
    // 把所有字符串内容替换成 __STR_0__, __STR_1__ 这样的占位符
    let protectedText = rawText.replace(stringRegex, (match) => {
        strings.push(match);
        return `__STR_${strings.length - 1}__`;
    });

    // 2. 【安全清洗】现在剩下的都是结构符号，可以大胆替换了
    protectedText = protectedText.replace(/[\r\n\t]+/g, ""); // 去掉换行和制表符
    protectedText = protectedText.replace(/：/g, ":");       // 中文冒号 -> 英文
    protectedText = protectedText.replace(/，/g, ",");       // 中文逗号 -> 英文
    protectedText = protectedText.replace(/“|”/g, "\"");     // 中文引号 -> 英文（防止漏网之鱼）
    
    // 去掉对象/数组末尾多余的逗号 (例如 {a:1,} -> {a:1})
    protectedText = protectedText.replace(/,(\s*[}\]])/g, '$1'); 

    // 3. 【还原】把保护起来的字符串放回去
    const finalText = protectedText.replace(/__STR_(\d+)__/g, (match, index) => {
        return strings[index];
    });

    try {
        let result = JSON.parse(finalText || "{}");
        return result;
    } catch (error) {
        Logger.error(`Json parse error: ${finalText}`);
        return {};
    }
});

export default DataParseFunc;
