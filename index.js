// 1. 先引入工具 (Require)
const express = require('express');
const path = require('path');

// 2. 初始化 app (這行一定要在最前面！)
const app = express();

// 3. 設定中間件 (Middleware)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4. 設定路由 (Routes)
app.post('/spin', (req, res) => {
    // 【修改重點】：定義獎項與權重 (weight 越大，抽中機率越高)
    const prizeOptions = [
        { label: 'NT$2000', weight: 35 }, // 機率最高
        { label: 'NT$2800', weight: 25 },
        { label: 'NT$3000', weight: 20 },
        { label: 'NT$3600', weight: 10 },
        { label: 'NT$3800', weight: 10 }   // 機率最低
    ];

    // 計算總權重
    const totalWeight = prizeOptions.reduce((sum, p) => sum + p.weight, 0);
    
    // 產生 0 到總權重之間的隨機數
    let randomNum = Math.random() * totalWeight;
    
    // 根據區間選出獎項
    let result = prizeOptions[0].label;
    for (const prize of prizeOptions) {
        if (randomNum < prize.weight) {
            result = prize.label;
            break;
        }
        randomNum -= prize.weight;
    }

    console.log(`[抽獎結果]：${result}`);
    res.json({ result });
});
// 5. 啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 伺服器啟動成功！`);
    console.log(`🔗 請打開瀏覽器輸入：http://localhost:${PORT}`);

});
