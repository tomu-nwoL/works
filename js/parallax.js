document.addEventListener('mousemove', (e) => {
  const circles = document.querySelectorAll('.circle');
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  circles.forEach((circle, index) => {
    const speed = (index + 1) / 100; // 異なる速さを設定
    const x = (window.innerWidth / 2 - mouseX) * speed;
    const y = (window.innerHeight / 4 - mouseY) * speed;

    circle.style.transform = `translate(${x}px, ${y}px)`;
  });
});
