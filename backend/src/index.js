require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const swaggerUi  = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRouter   = require('./domains/auth/auth.router');
const userRouter   = require('./domains/user/user.router');
const courseRouter = require('./domains/course/course.router');
const adminRouter  = require('./domains/admin/admin.router');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── 공통 미들웨어 ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── 응답 헬퍼 주입 ─────────────────────────────────────
app.use((req, res, next) => {
  res.success = (success) =>
    res.json({ resultType: 'SUCCESS', error: null, success });

  res.error = ({ errorCode = 'UNKNOWN', reason = null, data = null }) =>
    res.json({ resultType: 'FAIL', error: { errorCode, reason, data }, success: null });

  next();
});

// ── Swagger UI ─────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Sometime API Docs',
  swaggerOptions: { persistAuthorization: true },
}));

// ── 라우터 ─────────────────────────────────────────────
app.use('/api/auth',          authRouter);
app.use('/api/users',         userRouter);
app.use('/api/courses',       courseRouter);
app.use('/api/users',         courseRouter);   // cart: /api/users/me/cart
app.use('/api/admin/courses', courseRouter);   // upload: /api/admin/courses/upload
app.use('/api/admin',         adminRouter);

// ── 헬스체크 ───────────────────────────────────────────
app.get('/', (req, res) => res.send('Sometime API Server is running! 🚀'));

// ── 글로벌 에러 미들웨어 ──────────────────────────────
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  console.error('에러 발생:', {
    errorCode: err.errorCode,
    error:     err.message,
    url:       req.url,
    method:    req.method,
    userId:    req.user?.user_id,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).error({
    errorCode: err.errorCode || 'UNKNOWN',
    reason:    err.reason    || err.message || '서버가 응답하지 못했습니다.',
    data:      err.data      || null,
  });
});

// ── 서버 실행 ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중 (http://localhost:${PORT})`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
});
