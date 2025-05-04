const socket = new WebSocket('ws://localhost:8000/binance/ws/mini-ticker'); // "wss" para HTTPS, "ws" para HTTP

// ws://localhost:8000/binance/ws/klines/BTCUSDT/30m?market=spot

// Eventos do WebSocket
socket.onopen = () => {
  console.log('Conexão estabelecida!');
  socket.send('Olá, servidor!'); // Envia uma mensagem
};

socket.onmessage = (event) => {
  console.log('Mensagem recebida:', event.data); // Resposta do servidor
};

socket.onerror = (error) => {
  console.error('Erro:', error);
  console.log(error.reason);
};

socket.onclose = (event) => {
  console.log('Conexão fechada.');
};