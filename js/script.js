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
        this.strokeColor = '#000000';  // 前景色/描边色
        this.fillColor = null;         // 填充色 (null = 无填充)
        this.currentBrushSize = 5;
        this.currentTool = 'brush';    // brush, eraser, fill, eyedropper, spray, crayon, highlighter, line, rect, circle, arrow
        this.shapeStyle = 'outline';   // outline, filled

        // 形状绘制状态
        this.shapeStartX = 0;
        this.shapeStartY = 0;
        this.tempImageData = null;     // 用于预览形状

        // 撤销/重做
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 50;

        // 画布背景色
        this.canvasBgColor = '#ffffff';

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

        // 笔刷大小
        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.currentBrushSize = parseInt(e.target.value);
            document.getElementById('brushSizeValue').textContent = e.target.value;
        });

        // 功能按钮
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('guessBtn').addEventListener('click', () => this.guessWithAI());
        document.getElementById('newCanvasBtn').addEventListener('click', () => this.newCanvas());
        document.getElementById('canvasBgBtn').addEventListener('click', () => {
            document.getElementById('canvasBgColor').click();
        });

        // 工具选择
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTool(e));
        });

        // 前景色选择
        document.getElementById('strokeColor').addEventListener('input', (e) => {
            this.strokeColor = e.target.value;
            document.getElementById('currentStrokeColor').style.background = e.target.value;
        });

        // 填充色选择
        document.getElementById('fillColor').addEventListener('input', (e) => {
            this.fillColor = e.target.value;
        });

        // 无填充按钮
        document.getElementById('noFillBtn').addEventListener('click', () => {
            this.fillColor = null;
        });

        // 画布背景色
        document.getElementById('canvasBgColor').addEventListener('input', (e) => {
            this.setCanvasBackground(e.target.value);
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                } else if (e.key === 'y') {
                    e.preventDefault();
                    this.redo();
                }
            } else {
                // 工具快捷键
                switch(e.key.toLowerCase()) {
                    case 'b': this.selectToolByName('brush'); break;
                    case 'e': this.selectToolByName('eraser'); break;
                    case 'g': this.selectToolByName('fill'); break;
                    case 'i': this.selectToolByName('eyedropper'); break;
                    case 'l': this.selectToolByName('line'); break;
                    case 'r': this.selectToolByName('rect'); break;
                    case 'o': this.selectToolByName('circle'); break;
                }
            }
        });

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
        // 隐藏开始绘画提示
        document.querySelector('.canvas-container').classList.remove('empty');

        const pos = this.getPosition(e);

        // 吸管工具 - 立即取色
        if (this.currentTool === 'eyedropper') {
            this.eyedropper(pos.x, pos.y);
            return;
        }

        // 油漆桶填充
        if (this.currentTool === 'fill') {
            this.saveCanvasState();
            this.floodFill(pos.x, pos.y, this.fillColor || this.strokeColor);
            this.hasDrawn = true;
            this.updateCanvasOverlay();
            return;
        }

        this.isDrawing = true;
        this.lastX = pos.x;
        this.lastY = pos.y;

        // 形状工具需要记录起点并保存当前画布状态用于预览
        if (['line', 'rect', 'circle', 'arrow', 'star', 'heart', 'smile', 'sad', 'sun', 'moon', 'cloud', 'rainbow', 'flower', 'tree', 'house', 'balloon', 'butterfly', 'fish', 'bird'].includes(this.currentTool)) {
            this.shapeStartX = pos.x;
            this.shapeStartY = pos.y;
            this.tempImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }

        // 喷枪效果持续绘制
        if (this.currentTool === 'spray') {
            this.drawSpray(pos.x, pos.y);
            this.hasDrawn = true;
        }
    }

    // 绘画
    draw(e) {
        if (!this.isDrawing) return;

        const pos = this.getPosition(e);

        // 橡皮擦
        if (this.currentTool === 'eraser') {
            this.drawEraser(pos);
            this.lastX = pos.x;
            this.lastY = pos.y;
            this.hasDrawn = true;
            this.lastDrawTime = Date.now();
            this.updateCanvasOverlay();
            return;
        }

        // 形状工具预览
        if (['line', 'rect', 'circle', 'arrow', 'star', 'heart', 'smile', 'sad', 'sun', 'moon', 'cloud', 'rainbow', 'flower', 'tree', 'house', 'balloon', 'butterfly', 'fish', 'bird'].includes(this.currentTool)) {
            this.ctx.putImageData(this.tempImageData, 0, 0);
            this.drawShape(this.shapeStartX, this.shapeStartY, pos.x, pos.y);
            this.lastX = pos.x;
            this.lastY = pos.y;
            return;
        }

        // 根据工具类型绘制
        switch (this.currentTool) {
            case 'brush':
                this.drawBrush(pos);
                break;
            case 'spray':
                this.drawSpray(pos.x, pos.y);
                break;
            case 'crayon':
                this.drawCrayon(pos);
                break;
            case 'highlighter':
                this.drawHighlighter(pos);
                break;
        }

        this.lastX = pos.x;
        this.lastY = pos.y;

        this.hasDrawn = true;
        this.lastDrawTime = Date.now();
        this.updateCanvasOverlay();

        if (document.getElementById('autoGuess').checked) {
            this.triggerAutoGuess();
        }
    }

    // 画笔
    drawBrush(pos) {
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = this.currentBrushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
    }

    // 橡皮擦
    drawEraser(pos) {
        this.ctx.strokeStyle = this.canvasBgColor;
        this.ctx.lineWidth = this.currentBrushSize * 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
    }

    // 喷枪
    drawSpray(x, y) {
        const density = this.currentBrushSize * 4;
        this.ctx.fillStyle = this.strokeColor;

        for (let i = 0; i < density; i++) {
            const offsetX = (Math.random() - 0.5) * this.currentBrushSize * 3;
            const offsetY = (Math.random() - 0.5) * this.currentBrushSize * 3;
            const alpha = Math.random() * 0.4 + 0.1;

            this.ctx.globalAlpha = alpha;
            this.ctx.beginPath();
            this.ctx.arc(x + offsetX, y + offsetY, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }

    // 蜡笔
    drawCrayon(pos) {
        const roughness = this.currentBrushSize / 2;
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = this.currentBrushSize;
        this.ctx.lineCap = 'round';
        this.ctx.globalAlpha = 0.5;

        for (let i = 0; i < 4; i++) {
            const offsetX = (Math.random() - 0.5) * roughness;
            const offsetY = (Math.random() - 0.5) * roughness;

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX + offsetX, this.lastY + offsetY);
            this.ctx.lineTo(pos.x + offsetX, pos.y + offsetY);
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;
    }

    // 荧光笔
    drawHighlighter(pos) {
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = this.currentBrushSize * 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalAlpha = 0.35;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        this.ctx.globalAlpha = 1;
    }

    // 计算拖拽角度，返回8个方向之一（0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°）
    getRotationAngle(startX, startY, endX, endY) {
        const angle = Math.atan2(endY - startY, endX - startX);
        // 转换为度数并四舍五入到45度的倍数
        let degrees = Math.round(angle * 180 / Math.PI);
        // 调整为8个方向
        degrees = Math.round(degrees / 45) * 45;
        return degrees * Math.PI / 180;
    }

    // 旋转形状
    rotateAndDraw(drawFn, startX, startY, endX, endY) {
        const cx = (startX + endX) / 2;
        const cy = (startY + endY) / 2;
        const angle = this.getRotationAngle(startX, startY, endX, endY);

        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(angle);
        this.ctx.translate(-cx, -cy);
        drawFn();
        this.ctx.restore();
    }

    // 绘制形状
    drawShape(startX, startY, endX, endY) {
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.fillStyle = this.fillColor || this.strokeColor;
        this.ctx.lineWidth = this.currentBrushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        const useFill = this.fillColor !== null || this.shapeStyle === 'filled';

        // 需要支持旋转的形状列表
        const rotatableShapes = ['star', 'heart', 'smile', 'sad', 'sun', 'moon', 'cloud', 'flower', 'tree', 'house', 'balloon', 'butterfly', 'fish', 'bird'];

        switch (this.currentTool) {
            case 'line':
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
                break;

            case 'rect':
                const x = Math.min(startX, endX);
                const y = Math.min(startY, endY);
                const w = Math.abs(endX - startX);
                const h = Math.abs(endY - startY);
                if (useFill) {
                    this.ctx.fillRect(x, y, w, h);
                }
                this.ctx.strokeRect(x, y, w, h);
                break;

            case 'circle':
                const rx = Math.abs(endX - startX) / 2;
                const ry = Math.abs(endY - startY) / 2;
                const cx = startX + (endX - startX) / 2;
                const cy = startY + (endY - startY) / 2;
                this.ctx.beginPath();
                this.ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                if (useFill) this.ctx.fill();
                this.ctx.stroke();
                break;

            case 'arrow':
                this.drawArrow(startX, startY, endX, endY);
                break;

            case 'star':
                this.rotateAndDraw(() => this.drawStar(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'heart':
                this.rotateAndDraw(() => this.drawHeart(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'smile':
                this.rotateAndDraw(() => this.drawSmile(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'sad':
                this.rotateAndDraw(() => this.drawSad(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'sun':
                this.rotateAndDraw(() => this.drawSun(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'moon':
                this.rotateAndDraw(() => this.drawMoon(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'cloud':
                this.rotateAndDraw(() => this.drawCloud(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'rainbow':
                this.drawRainbow(startX, startY, endX, endY);
                break;

            case 'flower':
                this.rotateAndDraw(() => this.drawFlower(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'tree':
                this.rotateAndDraw(() => this.drawTree(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'house':
                this.rotateAndDraw(() => this.drawHouse(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'balloon':
                this.rotateAndDraw(() => this.drawBalloon(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'butterfly':
                this.rotateAndDraw(() => this.drawButterfly(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'fish':
                this.rotateAndDraw(() => this.drawFish(startX, startY, endX, endY), startX, startY, endX, endY);
                break;

            case 'bird':
                this.rotateAndDraw(() => this.drawBird(startX, startY, endX, endY), startX, startY, endX, endY);
                break;
                break;

            case 'flower':
                this.drawFlower(startX, startY, endX, endY);
                break;

            case 'tree':
                this.drawTree(startX, startY, endX, endY);
                break;

            case 'house':
                this.drawHouse(startX, startY, endX, endY);
                break;

            case 'balloon':
                this.drawBalloon(startX, startY, endX, endY);
                break;

            case 'butterfly':
                this.drawButterfly(startX, startY, endX, endY);
                break;

            case 'fish':
                this.drawFish(startX, startY, endX, endY);
                break;

            case 'bird':
                this.drawBird(startX, startY, endX, endY);
                break;
        }
    }

    // 绘制太阳
    drawSun(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;

        // 太阳主体
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 太阳光芒
        const rayLength = radius * 0.6;
        const rayCount = 8;
        for (let i = 0; i < rayCount; i++) {
            const angle = (i * Math.PI * 2) / rayCount;
            const x3 = cx + (radius + rayLength * 0.3) * Math.cos(angle);
            const y3 = cy + (radius + rayLength * 0.3) * Math.sin(angle);
            const x4 = cx + (radius + rayLength) * Math.cos(angle);
            const y4 = cy + (radius + rayLength) * Math.sin(angle);

            this.ctx.beginPath();
            this.ctx.moveTo(x3, y3);
            this.ctx.lineTo(x4, y4);
            this.ctx.stroke();
        }
    }

    // 绘制月亮
    drawMoon(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0.2 * Math.PI, 1.8 * Math.PI);
        this.ctx.arc(cx + radius * 0.5, cy - radius * 0.1, radius * 0.8, 1.3 * Math.PI, 0.5 * Math.PI, true);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    // 绘制云朵
    drawCloud(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const w = Math.abs(x2 - x1) / 2;
        const h = Math.abs(y2 - y1) / 2;

        this.ctx.beginPath();
        this.ctx.arc(cx - w * 0.4, cy, h * 0.6, 0, Math.PI * 2);
        this.ctx.arc(cx, cy - h * 0.3, h * 0.7, 0, Math.PI * 2);
        this.ctx.arc(cx + w * 0.4, cy, h * 0.5, 0, Math.PI * 2);
        this.ctx.arc(cx + w * 0.15, cy + h * 0.2, h * 0.4, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    // 绘制彩虹
    drawRainbow(x1, y1, x2, y2) {
        const cx = x1;
        const cy = y2;
        const maxRadius = Math.abs(y2 - y1);
        const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];

        for (let i = 0; i < 7; i++) {
            const radius = maxRadius * (1 - i * 0.12);
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius, Math.PI, 0);
            this.ctx.strokeStyle = colors[i];
            this.ctx.lineWidth = maxRadius * 0.1;
            this.ctx.stroke();
        }
        this.ctx.lineWidth = this.currentBrushSize;
        this.ctx.strokeStyle = this.strokeColor;
    }

    // 绘制花朵
    drawFlower(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;
        const petalCount = 5;

        // 花瓣
        for (let i = 0; i < petalCount; i++) {
            const angle = (i * Math.PI * 2) / petalCount;
            const px = cx + radius * 0.6 * Math.cos(angle);
            const py = cy + radius * 0.6 * Math.sin(angle);

            this.ctx.beginPath();
            this.ctx.ellipse(px, py, radius * 0.5, radius * 0.3, angle, 0, Math.PI * 2);
            if (this.fillColor) {
                this.ctx.fill();
            }
            this.ctx.stroke();
        }

        // 花心
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fill();
        this.ctx.stroke();
    }

    // 绘制树
    drawTree(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const bottom = Math.max(y1, y2);
        const top = Math.min(y1, y2);
        const height = bottom - top;
        const width = Math.abs(x2 - x1);

        // 树干
        const trunkWidth = width * 0.3;
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(cx - trunkWidth / 2, bottom - height * 0.3, trunkWidth, height * 0.3);
        this.ctx.strokeRect(cx - trunkWidth / 2, bottom - height * 0.3, trunkWidth, height * 0.3);

        // 树冠 (三角形)
        this.ctx.beginPath();
        this.ctx.moveTo(cx, top);
        this.ctx.lineTo(cx + width * 0.5, bottom - height * 0.25);
        this.ctx.lineTo(cx - width * 0.5, bottom - height * 0.25);
        this.ctx.closePath();
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    // 绘制房子
    drawHouse(x1, y1, x2, y2) {
        const left = Math.min(x1, x2);
        const right = Math.max(x1, x2);
        const top = Math.min(y1, y2);
        const bottom = Math.max(y1, y2);
        const cx = (x1 + x2) / 2;
        const width = right - left;
        const height = bottom - top;

        // 墙体
        this.ctx.beginPath();
        this.ctx.rect(left, top + height * 0.4, width, height * 0.6);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 屋顶 (三角形)
        this.ctx.beginPath();
        this.ctx.moveTo(left - width * 0.1, top + height * 0.4);
        this.ctx.lineTo(cx, top - height * 0.15);
        this.ctx.lineTo(right + width * 0.1, top + height * 0.4);
        this.ctx.closePath();
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 门
        const doorWidth = width * 0.25;
        const doorHeight = height * 0.35;
        this.ctx.beginPath();
        this.ctx.rect(left + width / 2 - doorWidth / 2, bottom - doorHeight, doorWidth, doorHeight);
        this.ctx.stroke();

        // 窗户
        const windowSize = width * 0.2;
        this.ctx.beginPath();
        this.ctx.rect(left + width * 0.15, top + height * 0.5, windowSize, windowSize);
        this.ctx.rect(right - width * 0.15 - windowSize, top + height * 0.5, windowSize, windowSize);
        this.ctx.stroke();
    }

    // 绘制气球
    drawBalloon(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const top = Math.min(y1, y2);
        const bottom = Math.max(y1, y2);
        const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;

        // 气球主体 (椭圆)
        this.ctx.beginPath();
        this.ctx.ellipse(cx, top + radius * 0.6, radius * 0.7, radius, 0, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 气球绳子
        this.ctx.beginPath();
        this.ctx.moveTo(cx, top + radius * 1.5);
        this.ctx.quadraticCurveTo(cx - 10, bottom - 10, cx, bottom);
        this.ctx.stroke();

        // 气球高光
        this.ctx.beginPath();
        this.ctx.ellipse(cx - radius * 0.25, top + radius * 0.3, radius * 0.15, radius * 0.2, -0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.fill();
    }

    // 绘制蝴蝶
    drawButterfly(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const w = Math.abs(x2 - x1) / 2;
        const h = Math.abs(y2 - y1) / 2;

        // 左翅膀
        this.ctx.beginPath();
        this.ctx.ellipse(cx - w * 0.4, cy - h * 0.3, w * 0.5, h * 0.4, -0.3, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.ellipse(cx - w * 0.35, cy + h * 0.3, w * 0.45, h * 0.35, 0.3, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 右翅膀
        this.ctx.beginPath();
        this.ctx.ellipse(cx + w * 0.4, cy - h * 0.3, w * 0.5, h * 0.4, 0.3, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.ellipse(cx + w * 0.35, cy + h * 0.3, w * 0.45, h * 0.35, -0.3, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 身体
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, w * 0.1, h * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();

        // 触角
        this.ctx.beginPath();
        this.ctx.moveTo(cx - w * 0.05, cy - h * 0.5);
        this.ctx.quadraticCurveTo(cx - w * 0.2, cy - h * 0.8, cx - w * 0.15, cy - h * 0.9);
        this.ctx.moveTo(cx + w * 0.05, cy - h * 0.5);
        this.ctx.quadraticCurveTo(cx + w * 0.2, cy - h * 0.8, cx + w * 0.15, cy - h * 0.9);
        this.ctx.stroke();
    }

    // 绘制鱼
    drawFish(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const w = Math.abs(x2 - x1) / 2;
        const h = Math.abs(y2 - y1) / 2;

        // 身体 (椭圆)
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, w * 0.7, h * 0.6, 0, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 尾巴
        this.ctx.beginPath();
        this.ctx.moveTo(cx - w * 0.6, cy);
        this.ctx.lineTo(cx - w, cy - h * 0.5);
        this.ctx.lineTo(cx - w, cy + h * 0.5);
        this.ctx.closePath();
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 眼睛
        const eyeRadius = w * 0.1;
        this.ctx.beginPath();
        this.ctx.arc(cx + w * 0.35, cy - h * 0.15, eyeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(cx + w * 0.4, cy - h * 0.15, eyeRadius * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#000';
        this.ctx.fill();

        // 鱼鳍
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - h * 0.5);
        this.ctx.lineTo(cx - w * 0.2, cy - h);
        this.ctx.lineTo(cx + w * 0.2, cy - h * 0.5);
        this.ctx.closePath();
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    // 绘制小鸟
    drawBird(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const w = Math.abs(x2 - x1) / 2;
        const h = Math.abs(y2 - y1) / 2;

        // 身体
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, w * 0.5, h * 0.4, 0, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 翅膀
        this.ctx.beginPath();
        this.ctx.ellipse(cx - w * 0.1, cy - h * 0.2, w * 0.4, h * 0.3, -0.3, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 头
        this.ctx.beginPath();
        this.ctx.arc(cx + w * 0.45, cy - h * 0.2, w * 0.25, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 眼睛
        this.ctx.beginPath();
        this.ctx.arc(cx + w * 0.55, cy - h * 0.25, w * 0.06, 0, Math.PI * 2);
        this.ctx.fillStyle = '#000';
        this.ctx.fill();

        // 嘴巴
        this.ctx.beginPath();
        this.ctx.moveTo(cx + w * 0.65, cy - h * 0.2);
        this.ctx.lineTo(cx + w * 0.8, cy - h * 0.15);
        this.ctx.lineTo(cx + w * 0.65, cy - h * 0.1);
        this.ctx.closePath();
        this.ctx.fillStyle = '#ffa500';
        this.ctx.fill();

        // 腿
        this.ctx.beginPath();
        this.ctx.moveTo(cx + w * 0.1, cy + h * 0.35);
        this.ctx.lineTo(cx + w * 0.1, cy + h * 0.6);
        this.ctx.moveTo(cx - w * 0.1, cy + h * 0.35);
        this.ctx.lineTo(cx - w * 0.1, cy + h * 0.6);
        this.ctx.stroke();
    }

    // 绘制星星
    drawStar(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const outerRadius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;
        const innerRadius = outerRadius * 0.4;
        const points = 5;

        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI / points) - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    // 绘制心形
    drawHeart(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const size = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;

        this.ctx.beginPath();
        // 贝塞尔曲线绘制心形
        this.ctx.moveTo(cx, cy + size);
        this.ctx.bezierCurveTo(cx - size * 2, cy - size * 0.5, cx - size * 2, cy - size * 1.5, cx, cy - size * 0.8);
        this.ctx.bezierCurveTo(cx + size * 2, cy - size * 1.5, cx + size * 2, cy - size * 0.5, cx, cy + size);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    // 绘制叶子
    drawLeaf(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const w = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);

        this.ctx.beginPath();
        // 叶子形状 - 左边半圆 + 右边半圆 + 底部尖
        this.ctx.moveTo(cx - w * 0.4, cy);
        this.ctx.quadraticCurveTo(cx - w * 0.5, cy - h * 0.5, cx, cy - h * 0.5);
        this.ctx.quadraticCurveTo(cx + w * 0.5, cy - h * 0.5, cx + w * 0.4, cy);
        this.ctx.quadraticCurveTo(cx + w * 0.3, cy + h * 0.3, cx, cy + h * 0.5);
        this.ctx.quadraticCurveTo(cx - w * 0.3, cy + h * 0.3, cx - w * 0.4, cy);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 叶脉
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - h * 0.4);
        this.ctx.lineTo(cx, cy + h * 0.4);
        this.ctx.stroke();
    }

    // 绘制笑脸
    drawSmile(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;

        // 脸
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 眼睛
        const eyeRadius = radius * 0.15;
        const eyeOffsetX = radius * 0.35;
        const eyeOffsetY = radius * 0.25;
        this.ctx.beginPath();
        this.ctx.arc(cx - eyeOffsetX, cy - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        this.ctx.arc(cx + eyeOffsetX, cy - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // 嘴巴 (笑脸)
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius * 0.5, 0.2 * Math.PI, 0.8 * Math.PI);
        this.ctx.stroke();
    }

    // 绘制哭脸
    drawSad(x1, y1, x2, y2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;

        // 脸
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        if (this.fillColor) {
            this.ctx.fill();
        }
        this.ctx.stroke();

        // 眼睛
        const eyeRadius = radius * 0.15;
        const eyeOffsetX = radius * 0.35;
        const eyeOffsetY = radius * 0.25;
        this.ctx.beginPath();
        this.ctx.arc(cx - eyeOffsetX, cy - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        this.ctx.arc(cx + eyeOffsetX, cy - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // 眼泪
        const tearY = cy - eyeOffsetY + eyeRadius;
        this.ctx.beginPath();
        this.ctx.moveTo(cx - eyeOffsetX - eyeRadius, tearY);
        this.ctx.lineTo(cx - eyeOffsetX - eyeRadius * 0.5, tearY + radius * 0.3);
        this.ctx.lineTo(cx - eyeOffsetX + eyeRadius * 0.5, tearY);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(cx + eyeOffsetX - eyeRadius, tearY);
        this.ctx.lineTo(cx + eyeOffsetX - eyeRadius * 0.5, tearY + radius * 0.3);
        this.ctx.lineTo(cx + eyeOffsetX + eyeRadius * 0.5, tearY);
        this.ctx.fill();

        // 嘴巴 (哭脸)
        this.ctx.beginPath();
        this.ctx.arc(cx, cy + radius * 0.6, radius * 0.4, 1.2 * Math.PI, 1.8 * Math.PI);
        this.ctx.stroke();
    }

    // 绘制箭头
    drawArrow(startX, startY, endX, endY) {
        const headLen = Math.max(10, this.currentBrushSize * 3);
        const angle = Math.atan2(endY - startY, endX - startX);

        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - headLen * Math.cos(angle - Math.PI / 6),
            endY - headLen * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - headLen * Math.cos(angle + Math.PI / 6),
            endY - headLen * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
    }

    // 油漆桶填充 (Flood Fill)
    floodFill(startX, startY, fillColor) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // 获取起始位置的颜色
        const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
        const startR = data[startPos];
        const startG = data[startPos + 1];
        const startB = data[startPos + 2];

        // 转换填充颜色
        const fillR = parseInt(fillColor.slice(1, 3), 16);
        const fillG = parseInt(fillColor.slice(3, 5), 16);
        const fillB = parseInt(fillColor.slice(5, 7), 16);

        // 如果颜色相同，不填充
        if (startR === fillR && startG === fillG && startB === fillB) return;

        const tolerance = 32; // 颜色容差
        const stack = [[Math.floor(startX), Math.floor(startY)]];
        const visited = new Set();

        const colorMatch = (x, y) => {
            const pos = (y * width + x) * 4;
            return Math.abs(data[pos] - startR) <= tolerance &&
                   Math.abs(data[pos + 1] - startG) <= tolerance &&
                   Math.abs(data[pos + 2] - startB) <= tolerance;
        };

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;

            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            if (visited.has(key)) continue;
            if (!colorMatch(x, y)) continue;

            visited.add(key);

            const pos = (y * width + x) * 4;
            data[pos] = fillR;
            data[pos + 1] = fillG;
            data[pos + 2] = fillB;
            data[pos + 3] = 255;

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    // 吸管取色
    eyedropper(x, y) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const pos = (Math.floor(y) * this.canvas.width + Math.floor(x)) * 4;

        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];

        const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

        this.strokeColor = hex;
        document.getElementById('strokeColor').value = hex;
        document.getElementById('currentStrokeColor').style.background = hex;

        // 更新颜色按钮选中状态
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === hex);
        });

        // 切换回画笔工具
        this.selectToolByName('brush');
    }

    // 选择工具
    selectTool(e) {
        const btn = e.target.closest('.tool-btn');
        if (!btn) return;

        this.currentTool = btn.dataset.tool;

        // 改变光标
        if (this.currentTool === 'fill') {
            this.canvas.style.cursor = 'crosshair';
        } else if (this.currentTool === 'eyedropper') {
            this.canvas.style.cursor = 'copy';
        } else if (this.currentTool === 'eraser') {
            this.canvas.style.cursor = 'cell';
        } else {
            this.canvas.style.cursor = 'crosshair';
        }

        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    // 设置画布背景
    setCanvasBackground(color) {
        this.canvasBgColor = color;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasDrawn = true;
        this.saveCanvasState();
    }

    // 新建画布
    newCanvas() {
        if (confirm('新建画布将清除当前内容，确定继续吗？')) {
            this.ctx.fillStyle = this.canvasBgColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.hasDrawn = false;
            this.undoStack = [];
            this.redoStack = [];
            this.saveCanvasState();
            this.updateCanvasOverlay();
            document.getElementById('guessContent').innerHTML = '<p class="placeholder">开始绘画，让我猜猜你画的是什么~</p>';
        }
    }

    // 停止绘画
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;

            // 形状工具在停止时保存最终状态
            if (['line', 'rect', 'circle', 'arrow', 'star', 'heart', 'smile', 'sad', 'sun', 'moon', 'cloud', 'rainbow', 'flower', 'tree', 'house', 'balloon', 'butterfly', 'fish', 'bird'].includes(this.currentTool)) {
                this.saveCanvasState();
                this.tempCanvas = null;
            } else {
                this.saveCanvasState();
            }
        }
    }

    // 选择颜色
    selectColor(e) {
        const btn = e.target;
        this.strokeColor = btn.dataset.color;

        document.getElementById('strokeColor').value = btn.dataset.color;
        document.getElementById('currentStrokeColor').style.background = btn.dataset.color;

        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    // 通过名称选择工具
    selectToolByName(toolName) {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            if (btn.dataset.tool === toolName) {
                btn.click();
            }
        });
    }

    // 清空画布
    clearCanvas() {
        this.saveCanvasState();
        this.ctx.fillStyle = this.canvasBgColor;
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
            this.showToast('已撤销');
        } else {
            this.showToast('没有可撤销的操作');
        }
    }

    // 重做
    redo() {
        if (this.redoStack.length > 0) {
            const next = this.redoStack.pop();
            this.undoStack.push(next);
            this.ctx.putImageData(next, 0, 0);
            this.showToast('已重做');
        } else {
            this.showToast('没有可重做的操作');
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
