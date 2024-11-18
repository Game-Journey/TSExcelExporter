// 列作用域：服务器、客户端、共用
export enum ColumnScope {
    Server = "Server",
    Client = "Client",
    Both = "Both",
}

export const SeverScopeName: string[] = ["server", "servermainkey"];
export const ClientScopeName: string[] = ["client"];
export const BothScopeName: string[] = ["all", "both", "data"];

// 列类型：主key、子key、普通列、注释列
export enum ColumnType {
    MainKey = "MainKey",
    SubKey = "SubKey",
    Normal = "Normal",
    Comment = "Comment",
}

export const MainKeyName: string[] = ["mainkey", "allmainkey", "allkey", "clientkey"];
export const SubKeyName: string[] = ["subkey", "allsubkey", "allchildkey"];

// 数据结构类型
export enum DataType {
    Int = "int",                // 整型
    Float = "float",            // 浮点型
    String = "string",          // 字符串
    Bool = "bool",              // 布尔

    // 复合类型
    //Map = "map",                // 字典
    Vector2 = "vector2",        // 二维浮点型向量
    Vector2Int = "vector2_int",  // 二维整型向量
    Vector3 = "vector3",        // 三维浮点型向量
    Vector3Int = "vector3_int",  // 三维整型向量
    Vector4 = "vector4",        // 四维浮点型向量
    Vector4Int = "vector4_int",  // 四维整型向量

    // 数组类型
    ArrayInt = "array_int",     // 整型数组
    ArrayFloat = "array_float", // 浮点型数组
    ArrayString = "array_string",// 字符串数组
    ArrayBool = "array_bool",   // 布尔数组

    ArrayVector2 = "vector2_array",// 二维浮点型向量数组
    ArrayVector2Int = "vector2_array_int",// 二维整型向量数组
    ArrayVector3 = "vector3_array",// 三维浮点型向量数组
    ArrayVector3Int = "vector3_array_int",// 三维整型向量数组
    ArrayVector4 = "vector4_array",// 四维浮点型向量数组
    ArrayVector4Int = "vector4_array_int",// 四维整型向量数组

    // 其它
    Any = "any",                // 任意类型
    Json = "json",              // Json字符串
}

// 变体数据类型, 在解析时会被替换为对应的基础类型
export enum DataTypeVariant {
    Int_Variant = "Int",
    Integer_Variant = "integer",

    Float_Variant = "Float",

    String_Variant = "String",
    
    Bool_Variant = "Bool",
    Boolean_Variant = "Boolean",
    Boolean_Variant2 = "boolean",

    ArrayVector2_Variant = "array_vector2",
    ArrayVector2Int_Variant = "array_vector2_int",
    ArrayVector3_Variant = "array_vector3",
    ArrayVector3Int_Variant = "array_vector3_int",
    ArrayVector4_Variant = "array_vector4",
    ArrayVector4Int_Variant = "array_vector4_int",
}



export const DataTypeVariantMap = new Map<DataTypeVariant, DataType>([

    [DataTypeVariant.Int_Variant, DataType.Int],
    [DataTypeVariant.Integer_Variant, DataType.Int],

    [DataTypeVariant.Float_Variant, DataType.Float],

    [DataTypeVariant.String_Variant, DataType.String],

    [DataTypeVariant.Bool_Variant, DataType.Bool],
    [DataTypeVariant.Boolean_Variant, DataType.Bool],
    [DataTypeVariant.Boolean_Variant2, DataType.Bool],

    [DataTypeVariant.ArrayVector2_Variant, DataType.ArrayVector2],
    [DataTypeVariant.ArrayVector2Int_Variant, DataType.ArrayVector2Int],
    [DataTypeVariant.ArrayVector3_Variant, DataType.ArrayVector3],
    [DataTypeVariant.ArrayVector3Int_Variant, DataType.ArrayVector3Int],
    [DataTypeVariant.ArrayVector4_Variant, DataType.ArrayVector4],
    [DataTypeVariant.ArrayVector4Int_Variant, DataType.ArrayVector4Int],
]);
