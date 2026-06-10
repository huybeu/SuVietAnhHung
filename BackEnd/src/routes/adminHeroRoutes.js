/**
 * Hero Routes — Admin
 *
 * Các endpoint quản trị cho module Anh hùng dân tộc.
 * Tất cả route yêu cầu xác thực và quyền Editor trở lên,
 * trừ DELETE chỉ Super Admin mới được thực hiện.
 */

import express from 'express';
import * as heroController from '../controllers/heroController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Heroes (Admin)
 *   description: API quản trị — Anh hùng dân tộc (yêu cầu đăng nhập)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HeroAdmin:
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
 *         cover_url:
 *           type: string
 *           nullable: true
 *         birth_year:
 *           type: integer
 *           nullable: true
 *           example: 14
 *         death_year:
 *           type: integer
 *           nullable: true
 *           example: 43
 *         biography:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [published, draft]
 *           example: published
 *         era:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         articles_count:
 *           type: integer
 *           example: 5
 *         videos_count:
 *           type: integer
 *           example: 3
 *         created_by:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *         updated_by:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     HeroCreateBody:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - era_id
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 255
 *           example: Hai Bà Trưng
 *         slug:
 *           type: string
 *           example: hai-ba-trung
 *           description: Chỉ chứa chữ thường, chữ số và dấu gạch ngang
 *         era_id:
 *           type: integer
 *           example: 2
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/avatar.jpg
 *         cover_image:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/cover.jpg
 *         birth_year:
 *           type: integer
 *           nullable: true
 *           example: 14
 *         death_year:
 *           type: integer
 *           nullable: true
 *           example: 43
 *           description: Nếu có phải lớn hơn birth_year
 *         biography:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [published, draft]
 *           example: draft
 */

/**
 * @swagger
 * /api/v1/admin/heroes:
 *   get:
 *     summary: Lấy danh sách anh hùng (bao gồm cả draft)
 *     tags: [Heroes (Admin)]
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
 *         description: Tìm theo tên
 *       - in: query
 *         name: era_id
 *         schema:
 *           type: integer
 *         description: Lọc theo thời kỳ
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [published, draft, all]
 *           default: all
 *         description: Lọc theo trạng thái
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
 *                         $ref: '#/components/schemas/HeroAdmin'
 *                     pagination:
 *                       $ref: '#/components/schemas/HeroPagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Không có quyền
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticate, authorize('editor', 'superadmin'), heroController.getAdminHeroes);

/**
 * @swagger
 * /api/v1/admin/heroes/{id}:
 *   get:
 *     summary: Lấy chi tiết một anh hùng (admin)
 *     tags: [Heroes (Admin)]
 *     security:
 *       - bearerAuth: []
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
 *                   $ref: '#/components/schemas/HeroAdmin'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Không tìm thấy anh hùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authenticate, authorize('editor', 'superadmin'), heroController.getAdminHeroById);

/**
 * @swagger
 * /api/v1/admin/heroes:
 *   post:
 *     summary: Tạo mới một anh hùng dân tộc
 *     tags: [Heroes (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HeroCreateBody'
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
 *                   example: Tạo anh hùng thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     slug:
 *                       type: string
 *                       example: hai-ba-trung
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
 *                     era_id: Thời kỳ không tồn tại
 *                     death_year: death_year phải lớn hơn birth_year
 */
router.post('/', authenticate, authorize('editor', 'superadmin'), heroController.createHero);

/**
 * @swagger
 * /api/v1/admin/heroes/{id}:
 *   put:
 *     summary: Cập nhật toàn bộ thông tin anh hùng
 *     tags: [Heroes (Admin)]
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
 *             $ref: '#/components/schemas/HeroCreateBody'
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
 *                   example: Cập nhật thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Không tìm thấy anh hùng
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
 *     summary: Cập nhật một phần thông tin anh hùng
 *     tags: [Heroes (Admin)]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               era_id:
 *                 type: integer
 *               avatar:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               birth_year:
 *                 type: integer
 *               death_year:
 *                 type: integer
 *               biography:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [published, draft]
 *             example:
 *               status: published
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
 *                   example: Cập nhật thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Không tìm thấy anh hùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Xóa một anh hùng dân tộc
 *     tags: [Heroes (Admin)]
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
 *                   example: Xóa anh hùng thành công
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Không có quyền (chỉ Super Admin mới xóa được)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy anh hùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Không thể xóa vì còn dữ liệu liên kết
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
 *                   example: Không thể xóa — anh hùng này đang liên kết với 5 bài viết và 3 video
 */
router.put('/:id', authenticate, authorize('editor', 'superadmin'), heroController.updateHero);
router.patch('/:id', authenticate, authorize('editor', 'superadmin'), heroController.patchHero);
router.delete('/:id', authenticate, authorize('superadmin'), heroController.deleteHero);

export default router;
