require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const swaggerUi  = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// ── 라우터 imports ──────────────────────────────────────
const authRouter          = require('./domains/auth/auth.router');
const userRouter          = require('./domains/user/user.router');
const courseRouter        = require('./domains/course/course.router');
const adminRouter         = require('./domains/admin/admin.router');
const preferenceRouter    = require('./domains/preference/preference.router');
const noticeRouter        = require('./domains/notice/notice.router');
const adminNoticeRouter   = require('./domains/notice/admin-notice.router');
const adminStatsRouter    = require('./domains/stats/admin-stats.router');
const adminGrauationRouter = require('./domains/graduation/admin-graduation.router');
const graduationRouter    = require('./domains/graduation/graduation.router');
const adminCampusRouter   = require('./domains/campus/admin-campus.router');
const timetableRouter     = require('./modules/timetable/timetable.router');

const app = express();

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

// ── API 라우터 ─────────────────────────────────────────
app.use('/api/auth',                  authRouter);
app.use('/api/users',                 userRouter);
app.use('/api/courses',               courseRouter);
app.use('/api/users',                 courseRouter);          // cart: /api/users/me/cart
app.use('/api/admin/courses',         courseRouter);          // upload: /api/admin/courses/upload
app.use('/api/admin',                 adminRouter);
app.use('/api/users/me/preferences',  preferenceRouter);
app.use('/api/notices',               noticeRouter);
app.use('/api/admin/notices',         adminNoticeRouter);
app.use('/api/admin/stats',           adminStatsRouter);
app.use('/api/users/me/graduation',   graduationRouter);
app.use('/api/admin/graduation',      adminGrauationRouter);
app.use('/api/admin/campus',          adminCampusRouter);
app.use('/api/users/me/timetables',   timetableRouter);       // 시간표 CRUD

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

module.exports = app;
