   import { spinAnimation } from './wheel.js';

   const spinBtn = document.getElementById('spinBtn');
   const resultEl = document.getElementById('result');

   const LIFF_ID = '2008872565-NCFpmn48'; // 記得替換
   const API_BASE = location.origin; // 後端與前端同源時可用

   async function initLiff() {
try {
    await liff.init({ liffId: LIFF_ID });

     if (!liff.isLoggedIn()) {
      // 只有在 LINE 環境內或開發者明確要求時才執行登入
      // 如果你在電腦測試一直進不去，可以先將下面這行註解掉
      liff.login();
} else {
      console.log("LIFF 已登入");
      // 登入後可以取得使用者資訊 (選用)
      // const profile = await liff.getProfile();
      // console.log(profile.displayName);
    }
  } catch (err) {
    console.error('LIFF 初始化失敗', err);
    // 即使失敗也顯示錯誤，方便除錯
    resultEl.textContent = "初始化失敗，請確保在 LINE 內開啟";
  }
}

   function angleForLabel(label, prizes) {
     const index = prizes.indexOf(label);
     const seg = (Math.PI * 2) / prizes.length;
     // 指針位於上方，需讓目標落在指針位置（0 或 -π/2）
     return (Math.PI * 1.5) - (index * seg + seg / 2); // 簡化處理
   }

   spinBtn.addEventListener('click', async () => {
     spinBtn.disabled = true;
     resultEl.textContent = '轉動中...';

     // 呼叫後端抽獎
     const resp = await fetch(`${API_BASE}/spin`, { method: 'POST' });
     const data = await resp.json();
     const label = data.result;

     // 對應到前端輪盤的段
     const frontPrizes = ['NT$2000','NT$2000','NT$2800','NT$3000','NT$3000','NT$3600','NT$3800'];
     const targetAngle = angleForLabel(label, frontPrizes);

     // 播放輪盤動畫
     spinAnimation(targetAngle);

     // 顯示結果並推送到聊天（可選）
     setTimeout(async () => {
       resultEl.textContent = `恭喜今年獲得：${label}馬上爆富🧧`;
  // 只有在 LINE App 內開啟時才傳送訊息
       if (liff.isInClient()) {
         await liff.sendMessages([
           { type: 'text', text: `紅包金額：${label}` }
         ]);

       }
       spinBtn.disabled = false;
     }, 3200);
   });

   initLiff();