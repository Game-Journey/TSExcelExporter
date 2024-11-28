import { Cell } from "exceljs";
import { Logger } from "../logger/Logger";

// 检测是否是数字, 只能包含数字和小数点 和 - 号
export function checkIsNumber(value: string): boolean {
    return /^-?\d+(\.\d+)?$/.test(value);
}

export function stringToInt(value: string): number {
    if (value && value.length > 0) {
        value = value.trim();
        if (checkIsNumber(value)) {
            return parseInt(value);
        }
        else {
            Logger.error(`string to int error, not number: ${value}`);
            return 0;
        }
    }
    else {
        return 0;
    }
}

export function stringToFloat(value: string): number {
    if (value && value.length > 0) {
        value = value.trim();
        if(checkIsNumber(value)) {
            return parseFloat(value);
        }
        else {
            Logger.error(`string to float error, not number: ${value}`);
            return 0;
        }
    }
    else {
        return 0;
    }
}

export function stringToVector2(value: string): { x: number, y: number } {
    const result = { x: 0, y: 0 };
    if (value) {
        const segments = value.split(/[,;]/);  // 逗号或分号分隔
        if (segments.length === 2) {
            result.x = stringToFloat(segments[0]);
            result.y = stringToFloat(segments[1]);
        }
    }
    return result;
}

export function stringToVector2Int(value: string): { x: number, y: number } {
    const result = { x: 0, y: 0 };
    if (value) {
        const segments = value.split(/[,;]/);  // 逗号或分号分隔
        if (segments.length === 2) {
            result.x = stringToInt(segments[0]);
            result.y = stringToInt(segments[1]);
        }
    }
    return result;
}


export function stringToVector3(value: string): { x: number, y: number, z: number } {
    const result = { x: 0, y: 0, z: 0 };
    if (value) {
        const segments = value.split(/[,;]/);  // 逗号或分号分隔
        if (segments.length === 3) {
            result.x = stringToFloat(segments[0]);
            result.y = stringToFloat(segments[1]);
            result.z = stringToFloat(segments[2]);
        }
    }
    return result;
}

export function stringToVector3Int(value: string): { x: number, y: number, z: number } {
    const result = { x: 0, y: 0, z: 0 };
    if (value) {
        const segments = value.split(/[,;]/);  // 逗号或分号分隔
        if (segments.length === 3) {
            result.x = stringToInt(segments[0]);
            result.y = stringToInt(segments[1]);
            result.z = stringToInt(segments[2]);
        }
    }
    return result;
}

export function stringToVector4(value: string): { x: number, y: number, z: number, w: number } {
    const result = { x: 0, y: 0, z: 0, w: 0 };
    if (value) {
        const segments = value.split(/[,;]/);  // 逗号或分号分隔
        if (segments.length === 4) {
            result.x = stringToFloat(segments[0]);
            result.y = stringToFloat(segments[1]);
            result.z = stringToFloat(segments[2]);
            result.w = stringToFloat(segments[3]);
        }
    }
    return result;
}

export function stringToVector4Int(value: string): { x: number, y: number, z: number, w: number } {
    const result = { x: 0, y: 0, z: 0, w: 0 };
    if (value) {
        const segments = value.split(/[,;]/);  // 逗号或分号分隔
        if (segments.length === 4) {
            result.x = stringToInt(segments[0]);
            result.y = stringToInt(segments[1]);
            result.z = stringToInt(segments[2]);
            result.w = stringToInt(segments[3]);
        }
    }
    return result;
}

export function cellToInt(cell: Cell): number {
    if (cell == null) {
        return 0;
    }

    if (cell.formula) {
        const result = cell.result;
        if (result != null) {
            if (typeof result === "string") {
                return stringToInt(result);
            }
            else if (typeof result === "number") {
                return Math.floor(result);
            }
            else if(result instanceof Date) {
                return result.getTime();
            }
            else if(typeof result === "boolean") {
                return result ? 1 : 0;
            }
            else {
                throw new Error(`cell formula error: ${cell.formula}`);
            }
        }
        else {
            Logger.error(`公式解析失败, 找不到公式结果, 请尝试重新新建Excel, 如果还是失败, 请将公式替换为直接的数值: ${cell.formula}`);
            Logger.break();
            return 0;
            //throw new Error(`cell formula error: ${cell.formula}`);
        }
    }
    else {
        const textValue = cell.text;
        return stringToInt(textValue);
    }
}

export function cellToFloat(cell: Cell): number {
    if (cell == null) {
        return 0;
    }

    if (cell.formula) {
        const result = cell.result;
        if (result != null) {
            if (typeof result === "string") {
                return stringToFloat(result);
            }
            else if (typeof result === "number") {
                return result;
            }
            else {
                throw new Error(`cell formula error: ${cell.formula}`);
            }
        }
        else {
            Logger.error(`公式解析失败, 找不到公式结果, 请尝试重新新建Excel, 如果还是失败, 请将公式替换为直接的数值: ${cell.formula}`);
            Logger.break();
            return 0;
        }
    }
    else {
        const textValue = cell.text;
        return stringToFloat(textValue);
    }
}
