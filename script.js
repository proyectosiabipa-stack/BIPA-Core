document.addEventListener('DOMContentLoaded', () => {
  const clock = document.querySelector('#system-time');
  const updateClock = () => {
    const value = new Intl.DateTimeFormat('es-VE', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
    clock.textContent = value;
    clock.dateTime = value;
  };

  updateClock();
  window.setInterval(updateClock, 1000);

  document.querySelectorAll('.reveal').forEach((element) => {
    element.style.setProperty('--delay', `${element.dataset.delay || 0}ms`);
    requestAnimationFrame(() => element.classList.add('visible'));
  });

  document.querySelectorAll('.ripple-target').forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      Object.assign(ripple.style, {
        width: `${size}px`, height: `${size}px`,
        left: `${event.clientX - rect.left - size / 2}px`,
        top: `${event.clientY - rect.top - size / 2}px`
      });
      button.append(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
});
