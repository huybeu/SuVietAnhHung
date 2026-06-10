/**
 * Era Routes — Public
 *
 * Các endpoint công khai cho module Thời kỳ lịch sử.
 * Chỉ trả về các thời kỳ có status = published.
 */

import express from 'express';
import * as eraController from '../controllers/eraController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Eras (Public)
 *   description: API công khai — Thời kỳ lịch sử
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EraPublic:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         name:
 *           type: string
 *           example: Thời kỳ dựng nước
 *         slug:
 *           type: string
 *           example: thoi-ky-dung-nuoc
 *         start_year:
 *           type: integer
 *           example: -2879
 *         end_year:
 *           type: integer
 *           example: -179
 *         description:
 *           type: string
 *           nullable: true
 *           example: Mô tả thời kỳ...
 *         cover_image:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *         order:
 *           type: integer
 *           example: 1
 *     EraDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/EraPublic'
 *         - type: object
 *           properties:
 *             heroes_count:
 *               type: integer
 *               example: 12
 *             articles_count:
 *               type: integer
 *               example: 8
 *     EraPagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 5
 *         total_pages:
 *           type: integer
 *           example: 1
 *     HeroSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         name:
 *           type: string
 *           example: Hai Bà Trưng
 *         slug:
 *           type: string
 *           example: hai-ba-trung
 *         avatar_url:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/avatar.jpg
 *         birth_year:
 *           type: integer
 *           nullable: true
 *           example: 14
 *         death_year:
 *           type: integer
 *           nullable: true
 *           example: 43
 *     ArticleSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         title:
 *           type: string
 *           example: Khởi nghĩa Hai Bà Trưng
 *         slug:
 *           type: string
 *           example: khoi-nghia-hai-ba-trung
 *         cover_url:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/thumbnail.jpg
 *         published_at:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T07:00:00.000Z
 */

/**
 * @swagger
 * /api/v1/eras:
 *   get:
 *     summary: Lấy danh sách thời kỳ lịch sử đã published
 *     tags: [Eras (Public)]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số bản ghi mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên thời kỳ
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [order_asc, order_desc]
 *           default: order_asc
 *         description: Sắp xếp theo order
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách thời kỳ thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/EraPublic'
 *                     pagination:
 *                       $ref: '#/components/schemas/EraPagination'
 */
router.get('/', eraController.getPublicEras);

/**
 * @swagger
 * /api/v1/eras/{id}:
 *   get:
 *     summary: Lấy chi tiết một thời kỳ lịch sử
 *     tags: [Eras (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thời kỳ
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EraDetail'
 *       404:
 *         description: Không tìm thấy thời kỳ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', eraController.getPublicEraById);

/**
 * @swagger
 * /api/v1/eras/{id}/heroes:
 *   get:
 *     summary: Lấy danh sách anh hùng thuộc một thời kỳ
 *     tags: [Eras (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thời kỳ
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     era_id:
 *                       type: integer
 *                       example: 1
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/HeroSummary'
 *                     pagination:
 *                       $ref: '#/components/schemas/EraPagination'
 *       404:
 *         description: Không tìm thấy thời kỳ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/heroes', eraController.getEraHeroes);

/**
 * @swagger
 * /api/v1/eras/{id}/articles:
 *   get:
 *     summary: Lấy danh sách bài viết thuộc một thời kỳ
 *     tags: [Eras (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thời kỳ
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     era_id:
 *                       type: integer
 *                       example: 1
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ArticleSummary'
 *                     pagination:
 *                       $ref: '#/components/schemas/EraPagination'
 *       404:
 *         description: Không tìm thấy thời kỳ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/articles', eraController.getEraArticles);

export default router;
