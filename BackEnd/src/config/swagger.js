import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sử Việt Anh Hùng API',
      version: '1.0.0',
      description: 'API documentation cho hệ thống Sử Việt Anh Hùng',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập Access Token nhận được sau khi đăng nhập',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description: 'Refresh Token lưu trong httpOnly cookie',
        },
      },
      schemas: {
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64', example: 1 },
            username: { type: 'string', example: 'nguyen_van_a' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            role: { type: 'string', enum: ['superadmin', 'editor', 'viewer'], example: 'editor' },
            avatar_url: { type: 'string', nullable: true, example: null },
            is_active: { type: 'boolean', example: true },
            last_login: { type: 'string', format: 'date-time', nullable: true, example: null },
            created_at: { type: 'string', format: 'date-time', example: '2026-01-01T00:00:00.000Z' },
            updated_at: { type: 'string', format: 'date-time', example: '2026-01-01T00:00:00.000Z' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Thành công.' },
            data: { nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Đã có lỗi xảy ra.' },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 100 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 10 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
