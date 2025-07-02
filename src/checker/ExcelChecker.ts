import { chineseNotAllowed } from "./ChineseNotAllowed";


const checkerMap: Map<string, (value: any) => boolean> = new Map([
    ["ChineseNotAllowed", chineseNotAllowed],
    ["禁止中文字符", chineseNotAllowed]
]);
