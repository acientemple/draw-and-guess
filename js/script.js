/**
 * AI 猜画 - 核心逻辑
 * 玩家绘画，AI 大模型识别并猜测画的是什么
 * 支持多模型: OpenAI, Gemini, Claude, OpenRouter, DeepSeek, 智谱, 阿里云, 讯飞, 百度, 腾讯, ModelScope
 */

// 模型配置说明：
// ✅ 可用 - 已测试或确认支持视觉
// ⚠️ 需测试 - 理论支持但需验证
// ❌ 不可用 - 不支持视觉或需特殊配置

// 精简提示词（节省 tokens）
const SHORT_PROMPT = '直接回答画的是什么，不超过三个词，只给名词，比如苹果、汽车、故宫。答：';

const MODEL_CONFIG = {
    // ===== 国际模型 =====
    openai: {
        name: 'OpenAI GPT-4o',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o',
        keyPrefix: 'sk-',
        keyPlaceholder: '输入 OpenAI API Key (sk-...)',
        status: '✅ 可用',
        supportsVision: true,
        visionModel: true,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    gemini: {
        name: 'Google Gemini 1.5 Flash',
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        model: 'gemini-1.5-flash',
        keyPrefix: 'AIza',
        keyPlaceholder: '输入 Google API Key (AIza...)',
        status: '✅ 可用',
        supportsVision: true,
        visionModel: true,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    anthropic: {
        name: 'Anthropic Claude 3.5',
        apiUrl: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-5-sonnet-20241022',
        keyPrefix: 'sk-ant-',
        keyPlaceholder: '输入 Anthropic API Key (sk-ant-...)',
        status: '✅ 可用',
        supportsVision: true,
        visionModel: true,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },

    // ===== 聚合平台 =====
    openrouter: {
        name: 'OpenRouter (GPT-4o)',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'openai/gpt-4o',
        keyPrefix: 'sk-or-',
        keyPlaceholder: '输入 OpenRouter API Key (sk-or-...)',
        status: '✅ 可用',
        supportsVision: true,
        visionModel: true,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    opendoor: {
        name: 'OpenDoor',
        apiUrl: 'https://api.opendoor.sh/v1/chat/completions',
        model: 'gpt-4o',
        keyPrefix: '',
        keyPlaceholder: '输入 OpenDoor API Key',
        status: '⚠️ 需测试',
        supportsVision: true,
        visionModel: true,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },

    // ===== 国内模型 =====
    deepseek: {
        name: 'DeepSeek VL',
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        keyPrefix: 'sk-',
        keyPlaceholder: '输入 DeepSeek API Key (sk-...)',
        status: '⚠️ 需测试',
        supportsVision: false,
        visionModel: false,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    minimax: {
        name: 'MiniMax',
        apiUrl: 'https://api.minimax.chat/v1/text/chatcompletion_pro',
        model: 'abab6.5s-chat',
        keyPrefix: '',
        keyPlaceholder: '输入 MiniMax API Key',
        status: '❌ 不可用',
        supportsVision: false,
        visionModel: false,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    zhipu: {
        name: '智谱 GLM-4V Plus',
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        model: 'glm-4v-plus',
        keyPrefix: '',
        keyPlaceholder: '输入智谱 API Key',
        status: '✅ 可用',
        supportsVision: true,
        visionModel: true,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    qwen: {
        name: '阿里云 Qwen-VL Plus',
        apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: 'qwen-vl-plus',
        keyPrefix: 'sk-',
        keyPlaceholder: '输入阿里云百炼 API Key (sk-...)',
        status: '✅ 可用',
        supportsVision: true,
        visionModel: true,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    spark: {
        name: '讯飞星火 Spark',
        apiUrl: 'https://spark-api.xf-yun.com/v3.5/chat',
        model: 'spark-v3.5',
        keyPrefix: '',
        keyPlaceholder: '输入讯飞星火 APPID/APISecret',
        status: '❌ 不可用',
        supportsVision: false,
        visionModel: false,
        note: '需复杂鉴权，暂不支持',
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    baidu: {
        name: '百度 ERNIE-ViLG 4.0',
        apiUrl: 'https://qianfan.baidubce.com/v2/chat/completions',
        model: 'ernie-vilg-8k',
        keyPrefix: '',
        keyPlaceholder: '输入百度 API Key (Access Key ID)',
        status: '✅ 可用',
        supportsVision: true,
        visionModel: true,
        note: '需同时提供 APISecret',
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    tencent: {
        name: '腾讯混元',
        apiUrl: 'https://hunyuan.tencentcloudapi.com/v2/chat/completions',
        model: 'hunyuan-vision',
        keyPrefix: '',
        keyPlaceholder: '输入腾讯云 SecretId',
        status: '⚠️ 需测试',
        supportsVision: true,
        visionModel: true,
        note: '需同时提供 SecretKey 获取 token',
        prompt: SHORT_PROMPT,
        maxTokens: 50
    },
    modelscope: {
        name: 'ModelScope Qwen-VL',
        apiUrl: 'https://api.modelscope.cn/v1/chat/completions',
        model: 'qwen-vl-plus',
        keyPrefix: '',
        keyPlaceholder: '输入 ModelScope API Token',
        status: '✅ 可用',
        supportsVision: true,
        visionModel: true,
        prompt: SHORT_PROMPT,
        maxTokens: 50
    }
};

class AIDrawAndGuess {
    constructor() {
        // Canvas 配置
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        // 画笔配置
        this.currentColor = '#1a1a2e';
        this.currentBrushSize = 5;

        // 撤销栈
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 20;

        // 自动识别定时器
        this.autoGuessTimer = null;
        this.autoGuessDelay = 2000;
        this.lastDrawTime = 0;

        // 当前模型
        this.currentModel = 'openai';

        // API 配置
        this.apiKey = '';
        this.apiUrl = '';

        // 额外配置（用于百度、腾讯等需要两个 Key 的服务）
        this.apiSecret = '';

        // 猜测历史
        this.guessHistory = [];
        this.maxHistory = 100; // 不限制历史记录数量

        // 状态
        this.isProcessing = false;
        this.hasDrawn = false;

        this.init();
    }

    init() {
        this.loadSettings();
        this.loadHistory(); // 加载历史记录
        this.setupCanvas();
        this.setupEventListeners();
        this.updateCanvasState();
        this.updateConnectionStatus();
        this.updateModelUI();
    }

    // 加载历史记录
    loadHistory() {
        const saved = localStorage.getItem('guess_history');
        if (saved) {
            try {
                this.guessHistory = JSON.parse(saved);
                this.renderHistory();
            } catch (e) {
                this.guessHistory = [];
            }
        }
    }

    // 保存历史记录
    saveHistory() {
        localStorage.setItem('guess_history', JSON.stringify(this.guessHistory));
    }

    // 清除历史记录
    clearHistory() {
        this.guessHistory = [];
        this.saveHistory();
        this.renderHistory();
        this.showToast('历史记录已清除');
    }

    // 加载保存的设置
    loadSettings() {
        const savedModel = localStorage.getItem('selected_model');
        if (savedModel && MODEL_CONFIG[savedModel]) {
            this.currentModel = savedModel;
            document.getElementById('modelSelect').value = savedModel;
        }

        const savedKey = localStorage.getItem(`api_key_${this.currentModel}`);
        if (savedKey) {
            this.apiKey = savedKey;
            document.getElementById('apiKeyInput').value = savedKey;
        }

        // 加载第二个 Key（如果有）
        const savedSecret = localStorage.getItem(`api_secret_${this.currentModel}`);
        if (savedSecret) {
            this.apiSecret = savedSecret;
        }
    }

    // 保存 API Key
    saveApiKey() {
        const input = document.getElementById('apiKeyInput');
        const key = input.value.trim();
        const model = this.currentModel;
        const config = MODEL_CONFIG[model];

        if (!key) {
            this.showToast('请输入 API Key', true);
            return;
        }

        // 验证 Key 前缀（如果需要）
        if (config.keyPrefix && config.keyPrefix !== '' && !key.startsWith(config.keyPrefix)) {
            this.showToast(`${config.name} API Key 应以 "${config.keyPrefix}" 开头`, true);
            return;
        }

        // 检查是否支持视觉
        if (!config.supportsVision) {
            this.showToast(`⚠️ ${config.name} 不支持视觉识别，已自动切换到可用模型`, true);
            // 切换到第一个可用的视觉模型
            for (const [key, cfg] of Object.entries(MODEL_CONFIG)) {
                if (cfg.supportsVision && cfg.visionModel) {
                    this.currentModel = key;
                    document.getElementById('modelSelect').value = key;
                    break;
                }
            }
        }

        this.apiKey = key;
        localStorage.setItem(`api_key_${model}`, key);
        this.updateConnectionStatus();
        this.showToast(`${config.name} API Key 已保存 ${config.status}`);
    }

    // 更新连接状态
    updateConnectionStatus() {
        const status = document.getElementById('connectionStatus');
        const statusText = status.querySelector('.status-text');
        const config = MODEL_CONFIG[this.currentModel];

        if (this.apiKey) {
            status.classList.add('connected');
            status.classList.remove('connecting');
            statusText.textContent = `${config.name} ${config.status}`;
        } else {
            status.classList.remove('connected', 'connecting');
            statusText.textContent = '未设置';
        }
    }

    // 更新模型 UI
    updateModelUI() {
        const config = MODEL_CONFIG[this.currentModel];
        const input = document.getElementById('apiKeyInput');
        input.placeholder = config.keyPlaceholder;

        // 根据模型调整输入框宽度
        if (config.keyPrefix && config.keyPrefix.length > 5) {
            input.style.width = '200px';
        } else if (config.keyPrefix) {
            input.style.width = '280px';
        } else {
            input.style.width = '180px';
        }
    }

    // 设置画布
    setupCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.saveCanvasState();
        this.updateCanvasOverlay();
    }

    // 设置事件监听
    setupEventListeners() {
        // Canvas 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Canvas 触摸事件
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.stopDrawing());

        // 颜色选择
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectColor(e));
        });

        // 自定义颜色
        document.getElementById('customColor').addEventListener('input', (e) => {
            this.currentColor = e.target.value;
            document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        });

        // 笔刷大小
        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.currentBrushSize = e.target.value;
            document.getElementById('brushSizeValue').textContent = `${e.target.value}px`;
        });

        // 功能按钮
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('guessBtn').addEventListener('click', () => this.guessWithAI());

        // 模型选择
        document.getElementById('modelSelect').addEventListener('change', (e) => {
            this.currentModel = e.target.value;
            localStorage.setItem('selected_model', this.currentModel);

            // 加载新模型的 API Key
            const savedKey = localStorage.getItem(`api_key_${this.currentModel}`);
            this.apiKey = savedKey || '';
            document.getElementById('apiKeyInput').value = this.apiKey || '';

            this.updateModelUI();
            this.updateConnectionStatus();
        });

        // API Key
        document.getElementById('saveApiKey').addEventListener('click', () => this.saveApiKey());
        document.getElementById('toggleApiVisibility').addEventListener('click', () => this.toggleApiVisibility());

        // 回车保存 API Key
        document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveApiKey();
        });

        // 清除历史记录
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
    }

    // 处理触摸事件
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];

        if (e.type === 'touchstart') {
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        } else if (e.type === 'touchmove') {
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        }
    }

    // 获取鼠标/触摸位置
    getPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    // 开始绘画
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getPosition(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    // 绘画
    draw(e) {
        if (!this.isDrawing) return;

        const pos = this.getPosition(e);

        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentBrushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        this.lastX = pos.x;
        this.lastY = pos.y;

        this.hasDrawn = true;
        this.lastDrawTime = Date.now();
        this.updateCanvasOverlay();

        if (document.getElementById('autoGuess').checked) {
            this.triggerAutoGuess();
        }
    }

    // 停止绘画
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.saveCanvasState();
        }
    }

    // 选择颜色
    selectColor(e) {
        const btn = e.target;
        this.currentColor = btn.dataset.color;

        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    // 清空画布
    clearCanvas() {
        this.saveCanvasState();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasDrawn = false;
        this.updateCanvasOverlay();

        document.getElementById('guessContent').innerHTML = '<p class="placeholder">开始绘画，让我猜猜你画的是什么~</p>';
        document.getElementById('guessConfidence').textContent = '';
    }

    // 保存画布状态
    saveCanvasState() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.undoStack.push(imageData);

        if (this.undoStack.length > this.maxUndoSteps) {
            this.undoStack.shift();
        }

        this.redoStack = [];
    }

    // 撤销
    undo() {
        if (this.undoStack.length > 1) {
            const current = this.undoStack.pop();
            this.redoStack.push(current);

            const previous = this.undoStack[this.undoStack.length - 1];
            this.ctx.putImageData(previous, 0, 0);
        }
    }

    // 更新画布覆盖层
    updateCanvasOverlay() {
        const container = document.querySelector('.canvas-container');
        if (this.hasDrawn) {
            container.classList.remove('empty');
        } else {
            container.classList.add('empty');
        }
    }

    // 压缩图像以节省 tokens
    compressImage() {
        return new Promise((resolve) => {
            // 创建临时 canvas 进行压缩
            const tempCanvas = document.createElement('canvas');
            const maxWidth = 512;  // 最大宽度
            const maxHeight = 320; // 最大高度

            let width = this.canvas.width;
            let height = this.canvas.height;

            // 等比缩放
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            tempCanvas.width = width;
            tempCanvas.height = height;

            const ctx = tempCanvas.getContext('2d');
            ctx.drawImage(this.canvas, 0, 0, width, height);

            // 压缩为 JPEG 质量 0.7（比 PNG 小很多）
            const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl.split(',')[1]);
        });
    }

    // 触发自动识别
    triggerAutoGuess() {
        if (this.autoGuessTimer) {
            clearTimeout(this.autoGuessTimer);
        }

        this.autoGuessTimer = setTimeout(() => {
            if (Date.now() - this.lastDrawTime >= this.autoGuessDelay - 100) {
                this.guessWithAI();
            }
        }, this.autoGuessDelay);
    }

    // 使用 AI 猜测
    async guessWithAI() {
        if (!this.apiKey) {
            this.showToast('请先设置 API Key', true);
            return;
        }

        if (!this.hasDrawn) {
            this.showToast('请先画点什么', true);
            return;
        }

        const config = MODEL_CONFIG[this.currentModel];
        if (!config.supportsVision || !config.visionModel) {
            this.showToast(`⚠️ ${config.name} 不支持视觉识别，请选择其他模型`, true);
            return;
        }

        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;
        this.updateAIStatus('分析中...', true);

        try {
            // 压缩图像以节省 tokens
            const imageBase64 = await this.compressImage();
            const result = await this.callModelAPI(imageBase64);
            this.displayGuess(result);
            this.updateAIStatus('等待中');
        } catch (error) {
            console.error('API 错误:', error);
            this.showToast(error.message || '识别失败，请重试', true);
            this.updateAIStatus('出错重试');
        } finally {
            this.isProcessing = false;
        }
    }

    // 调用模型 API
    async callModelAPI(imageBase64) {
        const config = MODEL_CONFIG[this.currentModel];
        switch (this.currentModel) {
            case 'openai':
                return await this.callOpenAI(imageBase64, config);
            case 'gemini':
                return await this.callGemini(imageBase64, config);
            case 'anthropic':
                return await this.callAnthropic(imageBase64, config);
            case 'openrouter':
                return await this.callOpenRouter(imageBase64, config);
            case 'opendoor':
                return await this.callOpenDoor(imageBase64, config);
            case 'deepseek':
                return await this.callDeepSeek(imageBase64, config);
            case 'zhipu':
                return await this.callZhipu(imageBase64, config);
            case 'qwen':
                return await this.callQwen(imageBase64, config);
            case 'baidu':
                return await this.callBaidu(imageBase64, config);
            case 'tencent':
                return await this.callTencent(imageBase64, config);
            case 'modelscope':
                return await this.callModelScope(imageBase64, config);
            default:
                throw new Error('不支持的模型');
        }
    }

    // OpenAI API
    async callOpenAI(imageBase64, config) {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } }
                        ]
                    }
                ],
                max_tokens: config.maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Google Gemini API
    async callGemini(imageBase64, config) {
        const url = `${config.apiUrl}?key=${this.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: config.prompt },
                            { inlineData: { mimeType: 'image/png', data: imageBase64 } }
                        ]
                    }
                ],
                generationConfig: { maxOutputTokens: 100 }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Anthropic Claude API
    async callAnthropic(imageBase64, config) {

        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: config.maxTokens,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image', source: { type: 'base64', media_type: 'image/png', data: imageBase64 } }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    // OpenRouter API
    async callOpenRouter(imageBase64, config) {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'AI Draw and Guess'
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } }
                        ]
                    }
                ],
                max_tokens: config.maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // OpenDoor API
    async callOpenDoor(imageBase64, config) {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } }
                        ]
                    }
                ],
                max_tokens: config.maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // DeepSeek API
    async callDeepSeek(imageBase64, config) {
        // 使用 DeepSeek-VL 模型
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // 需要确认是否开通了 VL
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } }
                        ]
                    }
                ],
                max_tokens: config.maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // 智谱 GLM API
    async callZhipu(imageBase64, config) {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } }
                        ]
                    }
                ],
                max_tokens: config.maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // 阿里云 Qwen API
    async callQwen(imageBase64, config) {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } }
                        ]
                    }
                ],
                max_tokens: config.maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // 百度 ERNIE API
    async callBaidu(imageBase64, config) {

        // 百度需要先获取 access_token
        const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.apiSecret || this.apiKey}`;

        let accessToken;
        try {
            const tokenResp = await fetch(tokenUrl, { method: 'POST' });
            const tokenData = await tokenResp.json();
            if (tokenData.error) {
                throw new Error(tokenData.error_description || '百度 API Key 验证失败');
            }
            accessToken = tokenData.access_token;
        } catch (e) {
            throw new Error('百度 API Key 格式不正确，请同时提供 AccessKeyId 和 SecretAccessKey');
        }

        const response = await fetch(`${config.apiUrl}?access_token=${accessToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } }
                        ]
                    }
                ],
                max_output_tokens: 100
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.result;
    }

    // 腾讯混元 API
    async callTencent(imageBase64, config) {
        // 腾讯云需要更复杂的鉴权，这里简化处理
        throw new Error('腾讯混元需额外配置 SecretKey，请使用其他模型');
    }

    // ModelScope 魔搭 API
    async callModelScope(imageBase64, config) {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: config.prompt },
                            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } }
                        ]
                    }
                ],
                max_tokens: config.maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API 错误: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // 显示猜测结果
    displayGuess(guessText) {
        const contentEl = document.getElementById('guessContent');

        contentEl.classList.remove('typing');

        // 提取纯答案，去除所有描述
        let guess = this.extractAnswer(guessText);

        contentEl.innerHTML = '';
        contentEl.classList.add('typing');

        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < guess.length) {
                contentEl.textContent += guess[index];
                index++;
            } else {
                clearInterval(typeInterval);
                contentEl.classList.remove('typing');
            }
        }, 50);

        this.addToHistory(guess);
    }

    // 提取纯答案
    extractAnswer(text) {
        let answer = text.trim();

        // 去除常见前缀
        const prefixes = [
            '我猜测这是：', '我猜是：', '答案：', '答：', '可能是：',
            '我认为是：', '看起来像：', '应该是：', '猜测：', '我猜：',
            'I think it is ', 'It looks like ', 'The answer is ', '可能是',
            '直接回答画的是什么，不超过三个词，只给名词，比如苹果、汽车、故宫。答：'
        ];

        for (const prefix of prefixes) {
            if (answer.toLowerCase().startsWith(prefix.toLowerCase())) {
                answer = answer.substring(prefix.length).trim();
                break;
            }
        }

        // 去除引号和括号内容
        answer = answer.replace(/^["'"]|["'"]$/g, '').trim();
        answer = answer.replace(/[（(][^）)]*[）)]/g, '').trim();

        // 去除句号、逗号、换行后的内容
        answer = answer.split(/[。,\n，]/)[0].trim();

        // 去除形容词和描述性词汇，只保留名词
        // 去除常见描述词
        const descWords = ['一个', '一只', '一幅', '一个红色的', '一只可爱的',
            '漂亮的', '美丽的', '可爱的', '简单的', '抽象的', '写实的',
            'blue', 'red', 'green', 'big', 'small', 'beautiful', 'cute'];

        let words = answer.split(/[,，、\s]+/).filter(w => w);

        // 限制最多3个词
        if (words.length > 3) {
            words = words.slice(0, 3);
        }

        answer = words.join(' ');

        return answer || '无法识别';
    }

    // 添加到历史记录
    addToHistory(guess) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const modelName = MODEL_CONFIG[this.currentModel].name;

        // 保存画布图像作为缩略图
        const thumbnail = this.canvas.toDataURL('image/png');

        this.guessHistory.unshift({
            guess,
            time: timeStr,
            model: modelName,
            thumbnail: thumbnail
        });

        if (this.guessHistory.length > this.maxHistory) {
            this.guessHistory.pop();
        }

        this.saveHistory(); // 保存到 localStorage
        this.renderHistory();
    }

    // 渲染历史记录
    renderHistory() {
        const list = document.getElementById('historyList');
        list.innerHTML = '';

        this.guessHistory.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${item.thumbnail}" class="history-thumbnail" title="点击查看大图" onclick="window.app.showFullImage('${item.thumbnail}')">
                <div class="history-content">
                    <div class="history-guess">${item.guess}</div>
                    <div class="history-meta">${item.time} · ${item.model}</div>
                </div>
            `;
            list.appendChild(li);
        });
    }

    // 显示大图
    showFullImage(thumbnailUrl) {
        // 创建模态框显示大图
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <img src="${thumbnailUrl}" class="modal-image">
        `;
        document.body.appendChild(modal);
    }

    // 更新 AI 状态
    updateAIStatus(text, isLoading = false) {
        const statusEl = document.getElementById('aiStatus');
        const guessBtn = document.getElementById('guessBtn');

        statusEl.textContent = text;

        if (isLoading) {
            guessBtn.disabled = true;
            guessBtn.innerHTML = '<span class="loading-icon">⏳</span> 分析中...';
        } else {
            guessBtn.disabled = false;
            guessBtn.innerHTML = '<span>🤔</span> 让AI猜猜';
        }
    }

    // 切换 API Key 显示
    toggleApiVisibility() {
        const input = document.getElementById('apiKeyInput');
        const btn = document.getElementById('toggleApiVisibility');

        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🔒';
        } else {
            input.type = 'password';
            btn.textContent = '👁️';
        }
    }

    // 显示提示消息
    showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        const messageEl = toast.querySelector('.toast-message');

        messageEl.textContent = message;
        toast.classList.toggle('error', isError);
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 显示/隐藏加载动画
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    // 更新画布状态
    updateCanvasState() {
        this.updateCanvasOverlay();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AIDrawAndGuess();
});
