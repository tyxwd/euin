import {SITE} from "@/config/settings";

// 英文 - English
export default {
    language: {
        selectLanguage: 'Select Language'
    },
    teamLogo: {
        title: 'Team Logos',
        subtitle: 'Our Team and Partners',
        items: [
            {
                name: 'Open Science Lab',
                desc: 'Supporting open science and technological innovation',
                src: '/static/logo/openlab.webp',
            },
            {
                name: 'DataVis Group',
                desc: 'Data visualization and intelligent analytics',
                src: '/static/logo/datavis.webp',
            },
        ],
    },
    action: {
        upload: 'Upload',
        switchLang: 'Switch Language',
        submit: 'Submit',
        cancel: 'Cancel',
        confirm: 'Confirm',
        delete: 'Delete',
        edit: 'Edit',
        save: 'Save',
        reset: 'Reset',
        search: 'Search',
        back: 'Back',
        next: 'Next',
        finish: 'Finish',
        reanalyze: 'Reanalyze'
    },

    result: {
        title: 'Result',
        healthy: 'Healthy',
        subHealthy: 'Sub-Healthy',
        ill: 'Ill',
        predictedType: 'Predicted Type',
        confidence: 'Confidence',
        noData: 'No Data',
        success: 'Success',
        failure: 'Failure',
        // 新增定量计算相关
        compoundName: 'Compound Name',
        concentration: 'Concentration',
        calculationDetails: 'Calculation Details',
        intensity1: 'Intensity 1',
        intensity2: 'Intensity 2',
        rowNumPrefix: 'Row',
        rowNumSuffix: '',
        intensityRatio: 'Intensity Ratio',
        formula: 'Calculation Formula',
        formulaParams: 'Formula Parameters',
        qualityInfo: 'Quality Control Information',
        dataValidation: 'Data Validation',
        totalRows: 'Total Rows',
        minRequiredRows: 'Minimum Required Rows',
        passed: 'Passed',
        failed: 'Failed',
        unit: 'Unit',
        // 新增predicted_type映射
        predictedTypes: {
            'BRCA1-MT': 'BRCA1-MT in Water',
            'BRCA1-MT-S': 'BRCA1-MT in Serum',
            'BRCA1-WT': 'BRCA1-WT in Water',
            'BRCA1-WT-S': 'BRCA1-WT in Serum',
            // BRCA mix model ratio mappings
            '10:01': 'BRCA1-WT:BRCA1-MT=10:1',
            '5:01': 'BRCA1-WT:BRCA1-MT=5:1',
            '1:01': 'BRCA1-WT:BRCA1-MT=1:1',
            '1:05': 'BRCA1-WT:BRCA1-MT=1:5',
            '1:10': 'BRCA1-WT:BRCA1-MT=1:10',
            // P model mappings
            'p16': 'p16 in Water',
            'p16-S': 'p16 in Serum',
            'p21': 'p21 in Water',
            'p21-S': 'p21 in Serum',
            'p53': 'p53 in Water',
            'p53-S': 'p53 in Serum',
            // P mix model ratio mappings
            '1:01:01': 'p16:p21:p53=1:1:1',
            '1:01:02': 'p16:p21:p53=1:1:2',
            '1:02:01': 'p16:p21:p53=1:2:1',
            '2:01:01': 'p16:p21:p53=2:1:1'
        }
    },

    tip: {
        uploadTip: 'Uploaded File',
        loading: 'Loading',
        processing: 'Processing',
        uploading: 'Uploading...',
        predicting: 'Predicting...',
        pleaseWait: 'Please Wait...',
        operationSuccess: 'Operation Successful',
        operationFailed: 'Operation Failed'
    },

    error: {
        fileTypeError: 'Unsupported file type: ',
        readFileError: 'Failed to read file',
        apiError: 'Failed to call backend API',
        chooseFileError: 'Failed to select file',
        uploadFailed: 'File upload failed',
        uploadParseError: 'Upload response parsing failed',
        predictFailed: 'Prediction failed',
        networkError: 'Network error',
        serverError: 'Server error',
        timeoutError: 'Request timeout'
    },

    page: {
        title: SITE,
        home: 'Home',
        about: 'About',
        settings: 'Settings'
    },

    dataInfo: {
        title: 'Data Information',
        originalLength: 'Original Data Length',
        processedLength: 'Processed Length',
        dataPoints: 'data points',
        fileSize: 'File Size',
        uploadTime: 'Upload Time'
    },

    probability: {
        title: 'Probability Distribution by Category',
        vitaminD3: 'Vitamin D3',
        vitaminK3: 'Vitamin K3',
        retinol: 'Retinol',
        betaCarotene: 'β-Carotene',
        // BRCA related mappings
        'BRCA1-MT': 'BRCA1-MT in Water',
        'BRCA1-MT-S': 'BRCA1-MT in Serum',
        'BRCA1-WT': 'BRCA1-WT in Water',
        'BRCA1-WT-S': 'BRCA1-WT in Serum',
        // BRCA mix model ratio mappings
        '10:01': 'BRCA1-WT:BRCA1-MT=10:1',
        '5:01': 'BRCA1-WT:BRCA1-MT=5:1',
        '1:01': 'BRCA1-WT:BRCA1-MT=1:1',
        '1:05': 'BRCA1-WT:BRCA1-MT=1:5',
        '1:10': 'BRCA1-WT:BRCA1-MT=1:10',
        // P model mappings
        'p16': 'p16 in Water',
        'p16-S': 'p16 in Serum',
        'p21': 'p21 in Water',
        'p21-S': 'p21 in Serum',
        'p53': 'p53 in Water',
        'p53-S': 'p53 in Serum',
        // P mix model ratio mappings
        '1:01:01': 'p16:p21:p53=1:1:1',
        '1:01:02': 'p16:p21:p53=1:1:2',
        '1:02:01': 'p16:p21:p53=1:2:1',
        '2:01:01': 'p16:p21:p53=2:1:1',
        'HPV18 Clinical Sample': 'HPV18 Clinical Sample',
        'HPV16 Clinical Sample': 'HPV16 Clinical Sample',
        'Acetone': 'Acetone',
        'Formaldehyde': 'Formaldehyde',
        'Styrene': 'Styrene',
        'Xylene': 'Xylene'
    },

    fileInfo: {
        title: 'File Information',
        usedFile: 'Used File',
        fileType: 'File Type',
        customFile: 'User Uploaded',
        defaultFile: 'Default File',
        unknownFile: 'Unknown File',
        fileName: 'File Name',
        fileFormat: 'File Format',
        calcMethod: 'Calculation Method',
        calcModel: 'Used Model',
        // 新增定量计算相关
        compoundType: 'Compound Type',
        totalRows: 'Total Rows'
    },

    common: {
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        close: 'Close',
        retry: 'Retry',
        more: 'More',
        less: 'Less'
    },

    teamIntro: {
        title: 'Team Introduction',
        subtitle: 'Professional data analysis team dedicated to providing accurate data prediction services',
        mission: {
            title: 'Our Mission',
            description: 'Providing precise and reliable data analysis and prediction services through advanced AI technology'
        },
        technology: {
            title: 'Technical Advantages',
            features: [
                'Deep learning-based prediction models',
                'High-precision data analysis algorithms',
                'Real-time data processing capabilities',
                'Multi-language internationalization support'
            ]
        },
        team: {
            title: 'Core Team',
            members: [
                {avatar: '👨‍💻', name: 'Dr. A', role: 'Chief Scientist'},
                {avatar: '👩‍🔬', name: 'Researcher B', role: 'Data Analysis Expert'},
                {avatar: '👨‍💼', name: 'Engineer C', role: 'Full Stack Developer'},
                {avatar: '👩‍🎨', name: 'Designer D', role: 'UX Designer'}
            ]
        },
        guide: {
            title: 'User Guide',
            steps: [
                'Click the upload button to select your data file',
                'System will automatically analyze the file content',
                'View detailed prediction results and probability distribution',
                'Make decisions based on analysis results'
            ]
        },
        startButton: 'Get Started'
    },

    status: {
        healthy: 'Healthy',
        subHealthy: 'Sub-Healthy',
        ill: 'Ill',
        analyzing: 'Analyzing',
        completed: 'Completed',
        pending: 'Pending'
    },

    analysis: {
        title: 'Data Analysis',
        startAnalysis: 'Start Analysis',
        analysisResults: 'Analysis Results',
        dataProcessing: 'Data Processing',
        modelPrediction: 'Model Prediction',
        confidenceLevel: 'Confidence Level',
        accuracy: 'Accuracy'
    },

    fileOperation: {
        selectFile: 'Select File',
        dragAndDrop: 'Drag and drop file here',
        supportedFormats: 'Supported Formats',
        maxFileSize: 'Maximum File Size',
        fileRequirements: 'File Requirements',
        processingFile: 'Processing File'
    },

    // 计算方法相关翻译
    method: {
        type: {
            title: 'Method',
            svm: 'SVM Algorithm',
            quantitative: 'Quantitative Calculation',
            tree: 'Decision Tree Model'
        },
        model: {
            title: 'Model',
            "default": "Default Model",
            "brca": "BRCA Model",
            "brca_mix": "BRCA Mix Model",
            "p": "P Model",
            "p_mix": "P Mix Model",
            "hpv": "HPV Model",
            "gzb": "GZB Model",
            "retinol": "Retinol",
            "vitamin_k": "Vitamin K",
            "vitamin_d": "Vitamin D",
            "carotene": "Carotene",
            "brca1_mt": "BRCA1 MT",
            "brca1_wt": "BRCA1 WT",
            "p16": "p16",
            "p21": "p21",
            "p53": "p53",
            "hu_r": "Carotene and Retinol Mix",
            "hu_vd": "Carotene and VD Mix",
            "hu_vd_vk": "Carotene, VD and VK Mix",
            "hu_vk": "Carotene and VK Mix",
            "vk_r_vd": "Retinol, VK and VD Mix"
        }
    }
}