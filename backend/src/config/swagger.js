const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sometime API',
      version: '1.0.0',
      description: '시간표 추천 서비스 Sometime 백엔드 API 문서',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: '로컬 개발 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '로그인 후 발급된 JWT 토큰을 입력하세요.',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            resultType: { type: 'string', example: 'SUCCESS' },
            error:      { type: 'object', nullable: true, example: null },
            success:    { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            resultType: { type: 'string', example: 'FAIL' },
            error: {
              type: 'object',
              properties: {
                errorCode: { type: 'string', example: 'P001' },
                reason:    { type: 'string', example: '필수 파라미터가 누락되었습니다.' },
                data:      { type: 'object', nullable: true, example: null },
              },
            },
            success: { type: 'object', nullable: true, example: null },
          },
        },
      },
      responses: {
        BadRequest: {
          description: '잘못된 요청 (P001)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        Unauthorized: {
          description: '인증 실패 (T001, T002, U003)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        Forbidden: {
          description: '권한 없음 (T003)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        NotFound: {
          description: '리소스 없음 (U001, C001, C003)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        Conflict: {
          description: '중복 (U002, C002)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  apis: [
    './src/domains/**/*.router.js',
    './src/modules/**/*.router.js',
  ],
};

module.exports = swaggerJsdoc(options);
