self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', function(event) {
  // Podés cachear si querés, por ahora lo dejamos simple
});
