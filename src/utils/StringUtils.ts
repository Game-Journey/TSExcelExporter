
// 字符串转大驼峰命名，如：hello-world => HelloWorld；hello_world => HelloWorld, hello__world => HelloWorld
export function toUpperCamelCase(str: string): string {
    let camelStr = str.replace(/[\s\-_]+(\w)/g, (all, letter) => letter.toUpperCase());
    return camelStr.substring(0, 1).toUpperCase() + camelStr.substring(1);
}


export function pathToNormal(path: string): string {
    return path.replace(/\\/g, "/");
}