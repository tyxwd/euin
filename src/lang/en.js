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
    failure: 'Failure'
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
    title: 'Health Status Detection',
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
    betaCarotene: 'β-Carotene'
  },

  fileInfo: {
    title: 'File Information',
    usedFile: 'Used File',
    fileType: 'File Type',
    customFile: 'User Uploaded',
    defaultFile: 'Default File',
    unknownFile: 'Unknown File',
    fileName: 'File Name',
    fileFormat: 'File Format'
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

  // Team Introduction Related Keywords
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
        { avatar: '👨‍💻', name: 'Dr. A', role: 'Chief Scientist' },
        { avatar: '👩‍🔬', name: 'Researcher B', role: 'Data Analysis Expert' },
        { avatar: '👨‍💼', name: 'Engineer C', role: 'Full Stack Developer' },
        { avatar: '👩‍🎨', name: 'Designer D', role: 'UX Designer' }
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

  // Status Related Keywords
  status: {
    healthy: 'Healthy',
    subHealthy: 'Sub-Healthy',
    ill: 'Ill',
    analyzing: 'Analyzing',
    completed: 'Completed',
    pending: 'Pending'
  },

  // Analysis Related Keywords
  analysis: {
    title: 'Data Analysis',
    startAnalysis: 'Start Analysis',
    analysisResults: 'Analysis Results',
    dataProcessing: 'Data Processing',
    modelPrediction: 'Model Prediction',
    confidenceLevel: 'Confidence Level',
    accuracy: 'Accuracy'
  },

  // File Operation Related Keywords
  fileOperation: {
    selectFile: 'Select File',
    dragAndDrop: 'Drag and drop file here',
    supportedFormats: 'Supported Formats',
    maxFileSize: 'Maximum File Size',
    fileRequirements: 'File Requirements',
    processingFile: 'Processing File'
  }
}