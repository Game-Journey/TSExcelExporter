
export const xorEncryptData: {
    [key: string]: { [key: string]: any } | any;
} = {
    encrypt : 1,
    excels : {
    }
};

export function xorObfuscateStringUtf8(str: string, encryptCode: number): string {
    const base64 = Buffer.from(str, "utf8").toString("base64"); // 转成 Base64
    const buffer = Buffer.from(base64, "utf8");
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= encryptCode;
    }
    return buffer.toString("base64"); // 再转成 Base64 以避免二进制乱码
}

export function xorDeobfuscateStringUtf8(str: string, encryptCode: number): string {
    const buffer = Buffer.from(str, "base64"); // 先解 Base64
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= encryptCode;
    }
    return Buffer.from(buffer.toString("utf8"), "base64").toString("utf8"); // 还原原始字符串
}
