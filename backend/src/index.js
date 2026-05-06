const app  = require('./app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중 (http://localhost:${PORT})`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
});
