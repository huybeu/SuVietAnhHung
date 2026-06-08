/**
 * Hero Routes — Public
 *
 * Các endpoint công khai cho module Anh hùng dân tộc.
 * Chỉ trả về các anh hùng có is_active = true (published).
 */

const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

/**
 * @swagger
 * tags:
 *   name: Heroes (Public)
 *   description: API công khai — Anh hùng dân tộc
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HeroPublicItem:
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
 *         era:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *     HeroPublicDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/HeroPublicItem'
 *         - type: object
 *           properties:
 *             cover_url:
 *               type: string
 *               nullable: true
 *             biography:
 *               type: string
 *               nullable: true
 *             articles_count:
 *               type: integer
 *               example: 5
 *             videos_count:
 *               type: integer
 *               example: 3
 *     HeroPagination:
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
 *           example: 48
 *         total_pages:
 *           type: integer
 *           example: 5
 */

/**
 * @swagger
 * /api/v1/heroes:
 *   get:
 *     summary: Lấy danh sách anh hùng dân tộc đã published
 *     tags: [Heroes (Public)]
 *     parameters:
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên
 *       - in: query
 *         name: era_id
 *         schema:
 *           type: integer
 *         description: Lọc theo thời kỳ
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name_asc, name_desc, birth_year_asc, birth_year_desc]
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/HeroPublicItem'
 *                     pagination:
 *                       $ref: '#/components/schemas/HeroPagination'
 */
router.get('/', heroController.getPublicHeroes);

/**
 * @swagger
 * /api/v1/heroes/{id}:
 *   get:
 *     summary: Lấy chi tiết một anh hùng dân tộc
 *     tags: [Heroes (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của anh hùng
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
 *                   $ref: '#/components/schemas/HeroPublicDetail'
 *       404:
 *         description: Không tìm thấy anh hùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', heroController.getPublicHeroById);

/**
 * @swagger
 * /api/v1/heroes/{id}/articles:
 *   get:
 *     summary: Lấy danh sách bài viết liên quan đến một anh hùng
 *     tags: [Heroes (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *                     hero_id:
 *                       type: integer
 *                       example: 1
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ArticleSummary'
 *                     pagination:
 *                       $ref: '#/components/schemas/HeroPagination'
 *       404:
 *         description: Không tìm thấy anh hùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/articles', heroController.getHeroArticles);

/**
 * @swagger
 * /api/v1/heroes/{id}/videos:
 *   get:
 *     summary: Lấy danh sách video liên quan đến một anh hùng
 *     tags: [Heroes (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *                     hero_id:
 *                       type: integer
 *                       example: 1
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           thumbnail_url:
 *                             type: string
 *                             nullable: true
 *                           url:
 *                             type: string
 *                             nullable: true
 *                           platform:
 *                             type: string
 *                             enum: [youtube, tiktok, facebook, other]
 *                     pagination:
 *                       $ref: '#/components/schemas/HeroPagination'
 *       404:
 *         description: Không tìm thấy anh hùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/videos', heroController.getHeroVideos);

module.exports = router;
