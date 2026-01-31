import { Logger } from "../logger/Logger";

export function ParseJsonFunc(text: string): { [key: string]: unknown }
{
    let rawText = text;
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
    let finalText = protectedText.replace(/__STR_(\d+)__/g, (match, index) => {
        return strings[index];
    });

    try {
        //let result = JSON.parse(finalText || "{}");
        if (finalText == "" || !finalText) {
            finalText = "{}";
        }
        let result =new Function("return " + finalText)();
        return result;
    } catch (error) {
        Logger.error(`Json parse error: ${finalText}`);
        return {};
    }
}
