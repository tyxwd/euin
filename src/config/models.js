import {
    SITE1,
    SITE2,
    SITE3,
    SITE4,
    SITE5,
    SITE6,
    SITE7,
    SITE,
} from "@/config/settings";

// 语言配置
export const languageConfig = {
    en: {name: "English", locale: "en"},
    "zh-CN": {name: "中文（简体）", locale: "zh-CN"},
};

// SVM模型配置
export const SVM_MODEL_CONFIGS = (() => {
    switch (SITE) {
        case SITE1:
            return {
                default: {name: "默认模型"},
            };
        case SITE2:
            return {
                brca: {name: "BRCA模型"},
                brca_mix: {name: "BRCA混合模型"},
                p: {name: "P模型"},
                p_mix: {name: "P混合模型"},
                hpv: {name: "HPV模型"},
                gzb: {name: "GZB模型"},
            };
        case SITE3:
            return {
                gzb: {name: "GZB模型"},
            };
        case SITE4:
            return {
                han: {name: "HAN模型"},
                lei: {name: "LEI模型"},
                niao: {name: "NIAO模型"},
                shui: {name: "SHUI模型"},
                xueqing: {name: "XUEQING模型"},
            };
        case SITE5:
            return {
                pesticide: {name: "PESTICIDE模型"},
            };
        case SITE6:
            return {
                osteoporosis: {name: "Osteoporosis模型"},
            };
        case SITE7:
            return {
                quino: {name: "Quino模型"},
                ciplvfx: {name: "CIPLVFX模型"},
                cippef: {name: "CIPPEF模型"},
                cippeflvfx: {name: "CIPPEFLVFX模型"},
                peflvfx: {name: "PEFLVFX模型"},
            };
        default:
            return {default: {name: "未知模型"}};
    }
})();

// 定量计算模型配置
export const QUANTITATIVE_COMPOUND_CONFIGS = (() => {
    switch (SITE) {
        case SITE1:
            return {
                retinol: {name: "视黄醇"},
                vitamin_k: {name: "维生素K"},
                vitamin_d: {name: "维生素D"},
                carotene: {name: "胡萝卜素"},
            };
        case SITE2:
            return {
                brca1_mt: {name: "BRCA1突变型"},
                brca1_wt: {name: "BRCA1野生型"},
                p16: {name: "p16"},
                p21: {name: "p21"},
                p53: {name: "p53"},
            };
        case SITE3:
            return {};
        case SITE4:
            return {
                crp: {name: "C反应蛋白"},
                il: {name: "白细胞介素"},
                ua: {name: "尿酸"},
            };
        case SITE5:
            return {
                fms: {name: "福美双"},
                sjl: {name: "噻菌灵"},
            };
        case SITE6:
            return {};
        case SITE7:
            return {
                cip: {name: "CIP"},
                norf: {name: "NORF"},
                pef: {name: "PEF"},
                cip_rengonghu: {name: "CIP人工湖"},
            };
        default:
            return {};
    }
})();

// 计算方法类型配置
export const CALCULATION_TYPES = (() => {
    switch (SITE) {
        case SITE1:
            return [
                {value: "svm", label: "method.type.svm"},
                {value: "quantitative", label: "method.type.quantitative"},
                {value: "tree", label: "method.type.tree"},
            ];
        case SITE2:
            return [
                {value: "svm", label: "method.type.svm"},
                {value: "quantitative", label: "method.type.quantitative"},
            ];
        case SITE3:
            return [{value: "svm", label: "method.type.svm"}];
        case SITE4:
            return [
                {value: "svm", label: "method.type.svm"},
                {value: "quantitative", label: "method.type.quantitative"},
            ];
        case SITE5:
            return [
                {value: "svm", label: "method.type.svm"},
                {value: "quantitative", label: "method.type.quantitative"},
            ];
        case SITE6:
            return [{value: "svm", label: "method.type.svm"}];
        case SITE7:
            return [
                {value: "svm", label: "method.type.svm"},
                {value: "quantitative", label: "method.type.quantitative"},
            ];
    }
})();
// 类别名称映射配置
export const CLASS_NAME_MAPPINGS = {
    VitaminD3: "probability.vitaminD3",
    VitaminK3: "probability.vitaminK3",
    retinol: "probability.retinol",
    "β-carotene": "probability.betaCarotene",
    "BRCA1-MT": "probability.BRCA1-MT",
    "BRCA1-MT-S": "probability.BRCA1-MT-S",
    "BRCA1-WT": "probability.BRCA1-WT",
    "BRCA1-WT-S": "probability.BRCA1-WT-S",
    "10:01": "probability.10:01",
    "5:01": "probability.5:01",
    "1:01": "probability.1:01",
    "1:05": "probability.1:05",
    "1:10": "probability.1:10",
    "HPV16 Clinical Sample": "probability.HPV16 Clinical Sample",
    "HPV18 Clinical Sample": "probability.HPV18 Clinical Sample",
    Acetone: "probability.Acetone",
    Formaldehyde: "probability.Formaldehyde",
    Styrene: "probability.Styrene",
    Xylene: "probability.Xylene",
    CR: "probability.CR",
    CRP: "probability.CRP",
    "IL-6": "probability.IL-6",
    LA: "probability.LA",
    PCT: "probability.PCT",
    UA: "probability.UA",
    ACE: "probability.ACE",
    DM: "probability.DM",
    DQ: "probability.DQ",
    TBZ: "probability.TBZ",
    Thiram: "probability.Thiram",
    Normal: "probability.Normal",
    Osteopenia: "probability.Osteopenia",
    Osteoporosis: "probability.Osteoporosis",
    CIP: "probability.CIP",
    ENRO: "probability.ENRO",
    NORF: "probability.NORF",
    PEF: "probability.PEF",
    LVFX: "probability.LVFX",
    "2_8": "probability.2_8",
    "4_6": "probability.4_6",
    "5_5": "probability.5_5",
    "6_4": "probability.6_4",
    "8_2": "probability.8_2",
    "2_4_4": "probability.2_4_4",
    "2_6_2": "probability.2_6_2",
    "4_2_4": "probability.4_2_4",
    "4_4_2": "probability.4_4_2",
    "6_2_2": "probability.6_2_2",
};

// 决策树模型配置
export const TREE_MODEL_CONFIGS = {
    hu_r: {name: "胡萝卜素和视黄醇混合"},
    hu_vd: {name: "胡萝卜素和VD混合"},
    hu_vd_vk: {name: "胡萝卜素和VD、VK混合"},
    hu_vk: {name: "胡萝卜素和VK混合"},
    vk_r_vd: {name: "视黄醇和VK、VD混合"},
};

// 四分类颜色配置
export const FOUR_CATEGORY_COLORS = {
    "β-carotene": "#FF6B6B", // 红色
    retinol: "#4e63cd", // 青色
    VitaminD3: "#FFD166", // 黄色
    VitaminK3: "#06D6A0", // 绿色
    // BRCA相关颜色配置
    "BRCA1-MT": "#FF6B6B", // 红色
    "BRCA1-MT-S": "#4e63cd", // 青色
    "BRCA1-WT": "#FFD166", // 黄色
    "BRCA1-WT-S": "#06D6A0", // 绿色
    // BRCA混合模型比例颜色配置
    "10:01": "#06D6A0", // 绿色 (高WT比例)
    "5:01": "#FFD166", // 黄色 (中等WT比例)
    "1:01": "#9C88FF", // 橙色 (平衡比例)
    "1:05": "#FF8C00", // 深橙色 (中等MT比例)
    "1:10": "#FF6B6B", // 红色 (高MT比例)
    // HPV相关颜色配置
    "HPV16 Clinical Sample": "#FF6B6B", // 红色
    "HPV18 Clinical Sample": "#4e63cd", // 青色
};

// 扩展颜色配置，用于更多类别
export const EXTENDED_COLORS = [
    "#FF6B6B",
    "#4e63cd",
    "#FFD166",
    "#06D6A0",
    "#FF8E53",
    "#9C88FF",
    "#FFC75F",
    "#FF6B9D",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
];

// 结果类别映射
export const RESULT_CLASSES = {
    healthy: [
        "β-carotene",
        "VitaminD3",
        "健康类型1",
        "BRCA1-WT",
        "BRCA1-WT-S",
        "10:01",
        "5:01",
    ],
    subHealthy: ["retinol", "亚健康类型1", "1:01"],
    ill: [
        "BRCA1-MT",
        "BRCA1-MT-S",
        "1:05",
        "1:10",
        "Acetone",
        "Formaldehyde",
        "Styrene",
        "Xylene",
    ],
};
