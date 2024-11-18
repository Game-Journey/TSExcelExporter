"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonExporter_1 = require("./exporter/JsonExporter");
const TsClassExporter_1 = require("./exporter/TsClassExporter");
const Logger_1 = require("./logger/Logger");
const ExcelParser_1 = require("./parser/ExcelParser");
console.error("parseExcelStruct");
(0, ExcelParser_1.parseExcelStruct)("D:/ProjectBag/SVN/config/trunk/3xlsx/common/queue_list.xlsx").then((value) => {
    if (!value) {
        Logger_1.Logger.error("解析失败");
        return;
    }
    (0, JsonExporter_1.excelToJson)(value, "D:/ProjectBag/SVN/config/trunk/3xlsx/common/queue_list.json");
    (0, TsClassExporter_1.exportTsClass)(value, "D:/ProjectBag/SVN/config/trunk/3xlsx/common/queue_list.d.ts");
});
const errorData = Logger_1.Logger.errorLogDataList;
if (errorData.length > 0) {
    console.error("error: 导出失败, 请查看日志");
}
//# sourceMappingURL=index.js.map