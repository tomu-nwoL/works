// ===== 尻尾アニメーション用 canvas =====
const canvas = document.getElementById("tailCanvas");
const ctx = canvas.getContext("2d");

function getTailCanvasSize() {
  // モバイル判定: 720px以下
  if (window.innerWidth <= 720) {
    return {
      width: window.innerWidth,
      height: window.innerHeight *  1.3, // 高さを小さく
      lineWidth: 14, // 太さも小さく
      segmentLength: 34,
      waveAmp: 28
    };
  } else {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      lineWidth: 60,
      segmentLength: 50,
      waveAmp: 55
    };
  }
}

let { width, height, lineWidth, segmentLength, waveAmp } = getTailCanvasSize();
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  const size = getTailCanvasSize();
  width = canvas.width = size.width;
  height = canvas.height = size.height;
  lineWidth = size.lineWidth;
  segmentLength = size.segmentLength;
  waveAmp = size.waveAmp;
  // 再初期化
  for (let i = 0; i < segments; i++) {
    tail[i].x = width - 10 - i * segmentLength;
    tail[i].y = height / 2;
  }
});

const segments = 10;
let tail = Array.from({ length: segments }, (_, i) => ({
  x: width - 10 - i * segmentLength,
  y: height / 2
}));

let time = 0;
let speed = 0.03;

function animate() {
  // モバイル時にリサイズがあった場合も反映
  const size = getTailCanvasSize();
  if (canvas.width !== size.width || canvas.height !== size.height) {
    width = canvas.width = size.width;
    height = canvas.height = size.height;
    lineWidth = size.lineWidth;
    segmentLength = size.segmentLength;
    waveAmp = size.waveAmp;
    // tail座標も更新
    for (let i = 0; i < segments; i++) {
      tail[i].x = width - 10 - i * segmentLength;
      tail[i].y = height / 2;
    }
  }

  time += speed;

  for (let i = 0; i < segments; i++) {
    const offset = i * 0.4;
    const wave = Math.sin(time - offset) * waveAmp * (i / segments);
    tail[i].y = height / 2 + wave;
    tail[i].x = width - 10 - i * segmentLength;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.moveTo(tail[0].x, tail[0].y);
  for (let i = 1; i < segments - 1; i++) {
    const cx = (tail[i].x + tail[i + 1].x) / 2;
    const cy = (tail[i].y + tail[i + 1].y) / 2;
    ctx.quadraticCurveTo(tail[i].x, tail[i].y, cx, cy);
  }
  ctx.lineTo(tail[segments - 1].x, tail[segments - 1].y);

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 60;
  ctx.lineCap = "round";
  ctx.stroke();

  requestAnimationFrame(animate);
}

animate();


// ===== headline 表示アニメーション（hidden-text削除） =====
const headlineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");

        const spans = entry.target.querySelectorAll("span.hidden-text");
        setTimeout(() => {
          spans.forEach((span) => {
            span.classList.remove("hidden-text");
          });
        }, 520);

        headlineObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

document
  .querySelectorAll(".headline")
  .forEach((el) => headlineObserver.observe(el));


// ===== worksセクションで canvas を非表示にする監視 =====
const homeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // #homeが見えている → 表示
        canvas.style.opacity = "1";
        canvas.style.pointerEvents = "auto";
      } else {
        // #homeが見えなくなった → フェードアウトで非表示
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
      }
    });
  },
  { threshold: 0.3 } // 30%以上見えたら表示と判断
);

const homeSection = document.getElementById("home");
homeObserver.observe(homeSection);

document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".nav");
  const worksSection = document.querySelector("#works");
  const aboutSection = document.querySelector("#about");

  // モバイル判定
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // 初期状態
  nav.classList.add("nav--hidden");

  // 表示状態の更新関数
  function updateNavVisibility() {
    if (!isMobile()) {
      nav.classList.remove("nav--hidden", "nav--visible");
      return;
    }

    const worksTop = worksSection.getBoundingClientRect().top;
    const aboutBottom = aboutSection.getBoundingClientRect().bottom;

    if (worksTop <= window.innerHeight * 0.1 && aboutBottom > window.innerHeight * 0.1) {
      nav.classList.remove("nav--hidden");
      nav.classList.add("nav--visible");
    } else {
      nav.classList.remove("nav--visible");
      nav.classList.add("nav--hidden");
    }
  }

  // スクロール＆リサイズ時にチェック
  window.addEventListener("scroll", updateNavVisibility);
  window.addEventListener("resize", updateNavVisibility);

  // 初期チェック
  updateNavVisibility();
});
