const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const prizes = ['NT$2000','NT$2000','NT$2800','NT$3000','NT$3000','NT$3600','NT$3800'];
const colors = ['#ffcc00','#ff9966','#ffcc99','#ffd966','#ffa64d','#ffdf80','#ffc04d'];

// 全域變數，紀錄目前輪盤轉到哪了
export let currentAngle = 0; 

export function drawWheel(renderAngle) {
    // 更新全域角度
    currentAngle = renderAngle;
    
    const r = canvas.width / 2;
    const cx = r, cy = r;
    const seg = (Math.PI * 2) / prizes.length;
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    // 1. 畫輪盤扇區
    for (let i=0; i<prizes.length; i++) {
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        // 使用傳入的 renderAngle 繪圖
        ctx.arc(cx,cy,r - 10, renderAngle + i*seg, renderAngle + (i+1)*seg);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // 寫字
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(renderAngle + i*seg + seg/2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(prizes[i], r - 35, 8);
        ctx.restore();
    }

    // 2. 畫圓心指針 (把指針移到圓心，指向 12 點鐘方向)
    // 畫中心軸圓形
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 畫指針箭頭 (從中心往上指)
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy); 
    ctx.lineTo(cx, cy - 60); // 箭頭長度，指向正上方
    ctx.lineTo(cx + 10, cy);
    ctx.closePath();
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
}

// 初始畫面
drawWheel(0);

export function spinAnimation(targetAngle, duration = 4000, callback) {
    const start = performance.now();
    // 每次都從「目前角度」開始轉
    const startAngle = currentAngle; 
    const extraTurns = Math.PI * 10; // 固定轉 5 圈
    const endAngle = startAngle + extraTurns + (targetAngle - (startAngle % (Math.PI * 2)));

    function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 4); // 讓結尾更緩慢優雅
        const nowAngle = startAngle + (endAngle - startAngle) * ease;
        drawWheel(nowAngle);
        if (t < 1) {
            requestAnimationFrame(step);
        } else if (callback) {
            callback();
        }
    }
    requestAnimationFrame(step);
}