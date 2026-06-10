/**
 * Article Routes — Admin
 *
 * Các endpoint quản trị cho module Bài viết.
 * Tất cả route yêu cầu xác thực và quyền Editor trở lên.
 * DELETE chỉ Super Admin mới được thực hiện.
 */

import express from 'express';
import * as articleController from '../controllers/articleController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles (Admin)
 *   description: API quản trị — Bài viết lịch sử (yêu cầu đăng nhập)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ArticleAdmin:
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
 *         excerpt:
 *           type: string
 *           nullable: true
 *         content:
 *           type: string
 *           nullable: true
 *           description: Nội dung HTML đầy đủ
 *         cover_url:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           example: draft
 *         view_count:
 *           type: integer
 *           example: 1024
 *         published_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         author:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *         updater:
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
 *     ArticleCreateBody:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - status
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 300
 *           example: Cuộc khởi nghĩa Hai Bà Trưng
 *         slug:
 *           type: string
 *           maxLength: 300
 *           example: cuoc-khoi-nghia-hai-ba-trung
 *           description: Chỉ chứa chữ thường, chữ số và dấu gạch ngang
 *         image_url:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/thumb.jpg
 *           description: Ảnh thumbnail hiển thị trên danh sách
 *         cover_url:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/cover.jpg
 *           description: Ảnh bìa hiển thị đầu bài viết
 *         excerpt:
 *           type: string
 *           nullable: true
 *           example: Cuộc khởi nghĩa năm 40 SCN do Trưng Trắc và Trưng Nhị lãnh đạo...
 *         content:
 *           type: string
 *           nullable: true
 *           description: Nội dung HTML đầy đủ của bài viết
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           example: draft
 *         hero_ids:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2]
 *           description: Danh sách ID anh hùng liên quan
 *         tag_ids:
 *           type: array
 *           items:
 *             type: integer
 *           example: [3, 5]
 *           description: Danh sách ID tag
 *
 *     ArticlePatchBody:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 300
 *         slug:
 *           type: string
 *           maxLength: 300
 *         image_url:
 *           type: string
 *           nullable: true
 *         cover_url:
 *           type: string
 *           nullable: true
 *         excerpt:
 *           type: string
 *           nullable: true
 *         content:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *         hero_ids:
 *           type: array
 *           items:
 *             type: integer
 *         tag_ids:
 *           type: array
 *           items:
 *             type: integer
 *       example:
 *         status: published
 */

/**
 * @swagger
 * /api/v1/admin/articles:
 *   get:
 *     summary: Lấy danh sách bài viết (bao gồm cả draft và archived)
 *     tags: [Articles (Admin)]
 *     security:
 *       - bearerAuth: []
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
 *         description: Tìm theo tiêu đề
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived, all]
 *           default: all
 *         description: Lọc theo trạng thái
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
 *                         $ref: '#/components/schemas/ArticleAdmin'
 *                     pagination:
 *                       $ref: '#/components/schemas/ArticlePagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Không có quyền
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticate, authorize('editor', 'superadmin'), articleController.getAdminArticles);

/**
 * @swagger
 * /api/v1/admin/articles/{id}:
 *   get:
 *     summary: Lấy chi tiết bài viết (admin — kể cả draft/archived)
 *     tags: [Articles (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bài viết
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
 *                   $ref: '#/components/schemas/ArticleAdmin'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authenticate, authorize('editor', 'superadmin'), articleController.getAdminArticleById);

/**
 * @swagger
 * /api/v1/admin/articles:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Articles (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleCreateBody'
 *     responses:
 *       201:
 *         description: Tạo thành công
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
 *                   example: Tạo bài viết thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     slug:
 *                       type: string
 *                       example: cuoc-khoi-nghia-hai-ba-trung
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Dữ liệu không hợp lệ
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                   example:
 *                     slug: Slug đã tồn tại
 *                     title: title không được để trống
 *                     hero_ids: Một hoặc nhiều anh hùng không tồn tại
 */
router.post('/', authenticate, authorize('editor', 'superadmin'), articleController.createArticle);

/**
 * @swagger
 * /api/v1/admin/articles/{id}:
 *   put:
 *     summary: Cập nhật toàn bộ bài viết (thay thế hoàn toàn hero_ids và tag_ids)
 *     tags: [Articles (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleCreateBody'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *                   example: Cập nhật bài viết thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     summary: Cập nhật một phần bài viết (chỉ gửi field cần thay đổi)
 *     description: |
 *       Dùng để thay đổi nhanh một hoặc vài field mà không cần gửi toàn bộ.
 *       Ví dụ phổ biến: chuyển status từ draft sang published, hay cập nhật tag_ids.
 *       - Nếu **không gửi** `hero_ids` / `tag_ids` → quan hệ giữ nguyên.
 *       - Nếu **gửi** `hero_ids` / `tag_ids` (kể cả mảng rỗng `[]`) → quan hệ bị thay thế hoàn toàn.
 *       - Khi `status` chuyển sang `published` lần đầu → `published_at` tự động được ghi nhận.
 *     tags: [Articles (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticlePatchBody'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *                   example: Cập nhật bài viết thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Xóa bài viết (chỉ Super Admin)
 *     description: |
 *       Xóa hoàn toàn bài viết, bao gồm xóa liên kết với anh hùng (article_heroes)
 *       và tag (article_tags) nhờ CASCADE trong database.
 *     tags: [Articles (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
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
 *                   example: Xóa bài viết thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Không có quyền (chỉ Super Admin mới xóa được)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id',    authenticate, authorize('editor', 'superadmin'), articleController.updateArticle);
router.patch('/:id',  authenticate, authorize('editor', 'superadmin'), articleController.patchArticle);
router.delete('/:id', authenticate, authorize('superadmin'),           articleController.deleteArticle);

export default router;
