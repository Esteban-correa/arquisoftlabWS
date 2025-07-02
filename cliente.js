const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

let drawing = false;
let currentColor = colorPicker.value;
let lastX = 0, lastY = 0;

// Eventos de dibujo
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;

  const x = e.offsetX;
  const y = e.offsetY;

  drawLine(lastX, lastY, x, y, currentColor);
  socket.emit('draw', { lastX, lastY, x, y, color: currentColor });

  [lastX, lastY] = [x, y];
});

// Cambiar color
colorPicker.addEventListener('input', () => {
  currentColor = colorPicker.value;
});

// Dibujar línea
function drawLine(x1, y1, x2, y2, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Recibir trazos de otros usuarios
socket.on('draw', ({ lastX, lastY, x, y, color }) => {
  drawLine(lastX, lastY, x, y, color);
});

// Limpiar pizarra local y remota
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit('clear');
});

socket.on('clear', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Descargar imagen
downloadBtn.addEventListener('click', () => {
  const image = canvas.toDataURL('image/png'); // base64
  const link = document.createElement('a');
  link.href = image;
  link.download = 'pizarra.png';
  link.click();
});
