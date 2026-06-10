/**
 * Article Routes — Public
 *
 * Các endpoint công khai cho module Bài viết.
 * Chỉ trả về bài viết có status = 'published'.
 * Truy cập bài viết theo ID hoặc slug đều tăng view_count.
 */

import express from 'express';
import * as articleController from '../controllers/articleController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles (Public)
 *   description: API công khai — Bài viết lịch sử
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ArticleSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         title:
 *           type: string
 *           example: Cuộc khởi nghĩa Hai Bà Trưng
 *         slug:
 *           type: string
 *           example: cuoc-khoi-nghia-hai-ba-trung
 *         image_url:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/thumb.jpg
 *         excerpt:
 *           type: string
 *           nullable: true
 *           example: Cuộc khởi nghĩa năm 40 SCN do Trưng Trắc và Trưng Nhị lãnh đạo...
 *         cover_url:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/cover.jpg
 *         published_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         view_count:
 *           type: integer
 *           example: 1024
 *         author:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TagRef'
 *         heroes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HeroRef'
 *
 *     ArticleDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/ArticleSummary'
 *         - type: object
 *           properties:
 *             content:
 *               type: string
 *               nullable: true
 *               description: Nội dung HTML đầy đủ của bài viết
 *
 *     TagRef:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *
 *     HeroRef:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         avatar_url:
 *           type: string
 *           nullable: true
 *
 *     ArticlePagination:
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
 *           example: 84
 *         total_pages:
 *           type: integer
 *           example: 9
 */

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     summary: Lấy danh sách bài viết đã published
 *     tags: [Articles (Public)]
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
 *         description: Số bài viết mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tiêu đề (LIKE)
 *       - in: query
 *         name: tag_id
 *         schema:
 *           type: integer
 *         description: Lọc theo tag
 *       - in: query
 *         name: hero_id
 *         schema:
 *           type: integer
 *         description: Lọc theo anh hùng liên quan
 *       - in: query
 *         name: era_id
 *         schema:
 *           type: integer
 *         description: Lọc theo thời kỳ (qua anh hùng)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, title_asc, title_desc, most_viewed]
 *           default: newest
 *         description: Sắp xếp kết quả
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
 *                   example: Lấy danh sách bài viết thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ArticleSummary'
 *                     pagination:
 *                       $ref: '#/components/schemas/ArticlePagination'
 */
router.get('/', articleController.getPublicArticles);

/**
 * @swagger
 * /api/v1/articles/{id}:
 *   get:
 *     summary: Lấy chi tiết bài viết theo ID (tăng view_count)
 *     tags: [Articles (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
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
 *                   $ref: '#/components/schemas/ArticleDetail'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id(\\d+)', articleController.getPublicArticleById);

/**
 * @swagger
 * /api/v1/articles/slug/{slug}:
 *   get:
 *     summary: Lấy chi tiết bài viết theo slug (tăng view_count)
 *     tags: [Articles (Public)]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của bài viết
 *         example: cuoc-khoi-nghia-hai-ba-trung
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
 *                   $ref: '#/components/schemas/ArticleDetail'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/slug/:slug', articleController.getPublicArticleBySlug);

export default router;
