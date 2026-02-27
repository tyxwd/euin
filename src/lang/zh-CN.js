import {SITE} from "@/config/settings";

// 中文（简体）- Chinese (Simplified)
export default {
    language: {
        selectLanguage: '选择语言'
    },
    teamLogo: {
        title: '团队标识',
        subtitle: '我们的团队与合作伙伴',
        items: [
            {
                name: '科学实验室',
                desc: '开放科学研究与技术创新支持',
                src: '/static/logo/openlab.webp',
            },
            {
                name: '分析团队',
                desc: '数据可视化与智能分析',
                src: '/static/logo/datavis.webp',
            },
        ],
    },
    action: {
        upload: '上传',
        switchLang: '切换语言',
        submit: '提交',
        cancel: '取消',
        confirm: '确认',
        delete: '删除',
        edit: '编辑',
        save: '保存',
        reset: '重置',
        search: '搜索',
        back: '返回',
        next: '下一步',
        finish: '完成',
        reanalyze: '重新分析'
    },

    result: {
        title: '结果',
        healthy: '健康',
        subHealthy: '亚健康',
        ill: '疾病',
        predictedType: '预测类型',
        confidence: '置信度',
        noData: '暂无数据',
        success: '成功',
        failure: '失败',
        // 新增定量计算相关
        compoundName: '化合物名称',
        concentration: '浓度',
        calculationDetails: '计算详情',
        intensity1: '强度1',
        intensity2: '强度2',
        rowNumPrefix: '第',
        rowNumSuffix: '行',
        intensityRatio: '强度比值',
        formula: '计算公式',
        formulaParams: '公式参数',
        qualityInfo: '质量控制信息',
        dataValidation: '数据验证',
        totalRows: '文件总行数',
        minRequiredRows: '最小要求行数',
        passed: '通过',
        failed: '失败',
        unit: '单位',
        // 新增predicted_type映射
        predictedTypes: {
            'BRCA1-MT': '水中含有BRCA1-MT',
            'BRCA1-MT-S': '血清中含有BRCA1-MT',
            'BRCA1-WT': '水中含有BRCA1-WT',
            'BRCA1-WT-S': '血清中含有BRCA1-WT',
            // BRCA混合模型比例映射
            '10:01': 'BRCA1-WT：BRCA1-MT=10:1',
            '5:01': 'BRCA1-WT：BRCA1-MT=5:1',
            '1:01': 'BRCA1-WT：BRCA1-MT=1:1',
            '1:05': 'BRCA1-WT：BRCA1-MT=1:5',
            '1:10': 'BRCA1-WT：BRCA1-MT=1:10',
            // P模型映射
            'p16': '水中含有p16',
            'p16-S': '血清中含有p16',
            'p21': '水中含有p21',
            'p21-S': '血清中含有p21',
            'p53': '水中含有p53',
            'p53-S': '血清中含有p53',
            // P混合模型比例映射
            '1:01:01': 'p16：p21：p53=1:1:1',
            '1:01:02': 'p16：p21：p53=1:1:2',
            '1:02:01': 'p16：p21：p53=1:2:1',
            '2:01:01': 'p16：p21：p53=2:1:1'
        }
    },

    tip: {
        uploadTip: '已上传文件',
        loading: '加载中',
        processing: '计算中',
        uploading: '上传中...',
        predicting: '预测中...',
        pleaseWait: '请稍候...',
        operationSuccess: '操作成功',
        operationFailed: '操作失败'
    },

    error: {
        fileTypeError: '不支持的文件类型：',
        readFileError: '读取文件失败',
        apiError: '调用后台接口失败',
        chooseFileError: '选择文件失败',
        uploadFailed: '文件上传失败',
        uploadParseError: '上传响应解析失败',
        predictFailed: '预测失败',
        networkError: '网络错误',
        serverError: '服务器错误',
        timeoutError: '请求超时'
    },

    page: {
        title: SITE,
        home: '首页',
        about: '关于',
        settings: '设置'
    },

    dataInfo: {
        title: '数据信息',
        originalLength: '原始数据长度',
        processedLength: '处理后长度',
        dataPoints: '个数据点',
        fileSize: '文件大小',
        uploadTime: '上传时间'
    },

    probability: {
        title: '各类别概率分布',
        vitaminD3: '维生素D3',
        vitaminK3: '维生素K3',
        retinol: '视黄醇',
        betaCarotene: 'β-胡萝卜素',
        // BRCA相关映射
        'BRCA1-MT': '水中含有BRCA1-MT',
        'BRCA1-MT-S': '血清中含有BRCA1-MT',
        'BRCA1-WT': '水中含有BRCA1-WT',
        'BRCA1-WT-S': '血清中含有BRCA1-WT',
        // BRCA混合模型比例映射
        '10:01': 'BRCA1-WT：BRCA1-MT=10:1',
        '5:01': 'BRCA1-WT：BRCA1-MT=5:1',
        '1:01': 'BRCA1-WT：BRCA1-MT=1:1',
        '1:05': 'BRCA1-WT：BRCA1-MT=1:5',
        '1:10': 'BRCA1-WT：BRCA1-MT=1:10',
        // P模型映射
        'p16': '水中含有p16',
        'p16-S': '血清中含有p16',
        'p21': '水中含有p21',
        'p21-S': '血清中含有p21',
        'p53': '水中含有p53',
        'p53-S': '血清中含有p53',
        // P混合模型比例映射
        '1:01:01': 'p16：p21：p53=1:1:1',
        '1:01:02': 'p16：p21：p53=1:1:2',
        '1:02:01': 'p16：p21：p53=1:2:1',
        '2:01:01': 'p16：p21：p53=2:1:1',
        // 宫颈样本
        'HPV18 Clinical Sample': 'HPV18 临床样本',
        'HPV16 Clinical Sample': 'HPV16 临床样本',
        'Acetone': '丙酮',
        'Formaldehyde': '甲醛',
        'Styrene': '苯乙烯',
        'Xylene': '二甲苯'
    },

    fileInfo: {
        title: '文件信息',
        usedFile: '使用文件',
        fileType: '文件类型',
        customFile: '用户上传',
        defaultFile: '默认文件',
        unknownFile: '未知文件',
        fileName: '文件名',
        fileFormat: '文件格式',
        calcMethod: '计算方法',
        calcModel: '使用模型',
        // 新增定量计算相关
        compoundType: '化合物类型',
        totalRows: '文件总行数'
    },

    common: {
        yes: '是',
        no: '否',
        ok: '确定',
        close: '关闭',
        retry: '重试',
        more: '更多',
        less: '更少'
    },

    teamIntro: {
        title: '团队介绍',
        subtitle: '专业的数据分析团队，致力于为您提供准确的数据预测服务',
        mission: {
            title: '我们的使命',
            description: '通过先进的人工智能技术，为用户提供精准、可靠的数据分析和预测服务'
        },
        technology: {
            title: '技术优势',
            features: [
                '基于深度学习的预测模型',
                '高精度的数据分析算法',
                '实时数据处理能力',
                '多语言国际化支持'
            ]
        },
        team: {
            title: '核心团队',
            members: [
                {avatar: '👨‍💻', name: 'A博士', role: '首席科学家'},
                {avatar: '👩‍🔬', name: 'B研究员', role: '数据分析专家'},
                {avatar: '👨‍💼', name: 'C工程师', role: '全栈开发'},
                {avatar: '👩‍🎨', name: 'D设计师', role: '用户体验设计'}
            ]
        },
        guide: {
            title: '使用指引',
            steps: [
                '点击上传按钮选择您的数据文件',
                '系统将自动分析文件内容',
                '查看详细的预测结果和概率分布',
                '基于分析结果做出决策'
            ]
        },
        startButton: '开始使用'
    },

    status: {
        healthy: '健康',
        subHealthy: '亚健康',
        ill: '疾病',
        analyzing: '分析中',
        completed: '已完成',
        pending: '待处理'
    },

    analysis: {
        title: '数据分析',
        startAnalysis: '开始分析',
        analysisResults: '分析结果',
        dataProcessing: '数据处理',
        modelPrediction: '模型预测',
        confidenceLevel: '置信水平',
        accuracy: '准确率'
    },

    fileOperation: {
        selectFile: '选择文件',
        dragAndDrop: '拖拽文件到这里',
        supportedFormats: '支持的文件格式',
        maxFileSize: '最大文件大小',
        fileRequirements: '文件要求',
        processingFile: '正在处理文件'
    },

    // 计算方法相关翻译
    method: {
        type: {
            title: '计算方法',
            svm: 'SVM算法',
            quantitative: '定量计算',
            tree: '决策树模型'
        },
        model: {
            title: '模型选择',
            default: '默认模型',
            retinol: '视黄醇 (Retinol)',
            vitamin_k: '维生素K (Vitamin K)',
            vitamin_d: '维生素D (Vitamin D)',
            carotene: '胡萝卜素 (Carotene)',
            "brca": "BRCA模型",
            "brca_mix": "BRCA混合模型",
            "p": "P模型",
            "p_mix": "P混合模型",
            "hpv": "HPV模型",
            "gzb": "GZB模型",
            "brca1_mt": "BRCA1突变型",
            "brca1_wt": "BRCA1野生型",
            "p16": "p16",
            "p21": "p21",
            "p53": "p53",
            "hu_r": "胡萝卜素和视黄醇混合",
            "hu_vd": "胡萝卜素和VD混合",
            "hu_vd_vk": "胡萝卜素和VD、VK混合",
            "hu_vk": "胡萝卜素和VK混合",
            "vk_r_vd": "视黄醇和VK、VD混合"
        }
    }
}