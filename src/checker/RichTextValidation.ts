import { Worksheet } from "exceljs";
import { ExcelStruct } from "../parser/ExcelParser";
import { Logger } from "../logger/Logger";


function isRichTextValid(input: string): boolean {
    const tagRegex = /<\s*(\/?)(\w+)([^>]*)>/g;
    const stack: string[] = [];

    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(input)) !== null) {
        const [, closingSlash, tagName] = match;

        if (!closingSlash) {
            // 开始标签入栈
            stack.push(tagName);
        } else {
            // 结束标签，检查栈顶
            const last = stack.pop();
            if (last !== tagName) {
                // 标签不匹配
                return false;
            }
        }
    }

    // 检查栈是否清空（所有标签都闭合）
    return stack.length === 0;
}

isRichTextValid("<color>text</color>"); // true
isRichTextValid("<color>text</b>"); // false


export function richTextValidation(excel: ExcelStruct, column: number): boolean {
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
        const richText = rowData.getCell(column).text;

        if (richText && richText.length > 0) {
            // 检测是否包含富文本符号,<color> 或 <b> 等
            if (richText.includes("<color") || richText.includes("<b") ||
                richText.includes("<i") || richText.includes("<u") ||
                richText.includes("<strike") || richText.includes("<font") ||
                richText.includes("<size") || richText.includes("<align") ||
                richText.includes("<line") || richText.includes("<shadow") ||
                richText.includes("<outline") || richText.includes("<gradient") ||
                richText.includes("<glow") || richText.includes("<blur")){
                // 检测富文本符号是否闭合，是否可以成功解析
                
                if (!isRichTextValid(richText)) {
                    Logger.error(`${excel.configName}: 第${i}行，第${column}列的富文本格式不正确: ${richText}`);
                    return true; // 如果发现富文本格式不正确，返回true
                }
            }
        }
    }

    return false; // 如果没有发现富文本格式，返回false
}