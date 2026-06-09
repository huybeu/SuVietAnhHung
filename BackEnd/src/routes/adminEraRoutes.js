/**
 * Era Routes — Admin
 *
 * Các endpoint quản trị cho module Thời kỳ lịch sử.
 * Tất cả route yêu cầu xác thực và quyền Editor trở lên,
 * trừ DELETE chỉ Super Admin mới được thực hiện.
 */

import express from 'express';
import * as eraController from '../controllers/eraController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Eras (Admin)
 *   description: API quản trị — Thời kỳ lịch sử (yêu cầu đăng nhập)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EraAdmin:
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
 *         cover_image:
 *           type: string
 *           nullable: true
 *         order:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: [published, draft]
 *           example: published
 *         heroes_count:
 *           type: integer
 *           example: 12
 *         articles_count:
 *           type: integer
 *           example: 8
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
 *     EraCreateBody:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - start_year
 *         - end_year
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 255
 *           example: Thời kỳ dựng nước
 *         slug:
 *           type: string
 *           example: thoi-ky-dung-nuoc
 *           description: Chỉ chứa chữ thường, chữ số và dấu gạch ngang
 *         start_year:
 *           type: integer
 *           example: -2879
 *         end_year:
 *           type: integer
 *           example: -179
 *           description: Phải lớn hơn start_year
 *         description:
 *           type: string
 *           nullable: true
 *           example: Nội dung mô tả...
 *         cover_image:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *         order:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: [published, draft]
 *           example: draft
 */

/**
 * @swagger
 * /api/v1/admin/eras:
 *   get:
 *     summary: Lấy danh sách thời kỳ (bao gồm draft)
 *     tags: [Eras (Admin)]
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
 *                         $ref: '#/components/schemas/EraAdmin'
 *                     pagination:
 *                       $ref: '#/components/schemas/EraPagination'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Không có quyền
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticate, authorize('editor', 'superadmin'), eraController.getAdminEras);

/**
 * @swagger
 * /api/v1/admin/eras/{id}:
 *   get:
 *     summary: Lấy chi tiết một thời kỳ (admin)
 *     tags: [Eras (Admin)]
 *     security:
 *       - bearerAuth: []
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
 *                   $ref: '#/components/schemas/EraAdmin'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Không tìm thấy thời kỳ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authenticate, authorize('editor', 'superadmin'), eraController.getAdminEraById);

/**
 * @swagger
 * /api/v1/admin/eras:
 *   post:
 *     summary: Tạo mới một thời kỳ lịch sử
 *     tags: [Eras (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EraCreateBody'
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
 *                   example: Tạo thời kỳ thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 6
 *                     slug:
 *                       type: string
 *                       example: thoi-ky-dung-nuoc
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *                     end_year: end_year phải lớn hơn start_year
 */
router.post('/', authenticate, authorize('editor', 'superadmin'), eraController.createEra);

/**
 * @swagger
 * /api/v1/admin/eras/reorder:
 *   patch:
 *     summary: Sắp xếp lại thứ tự hiển thị các thời kỳ
 *     tags: [Eras (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orders
 *             properties:
 *               orders:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - order
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     order:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                 example:
 *                   - id: 1
 *                     order: 2
 *                   - id: 2
 *                     order: 1
 *     responses:
 *       200:
 *         description: Sắp xếp thành công
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
 *                   example: Sắp xếp thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     updated:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Chưa xác thực
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
 */
// QUAN TRỌNG: /reorder phải khai báo TRƯỚC /:id
router.patch('/reorder', authenticate, authorize('editor', 'superadmin'), eraController.reorderEras);

/**
 * @swagger
 * /api/v1/admin/eras/{id}:
 *   put:
 *     summary: Cập nhật toàn bộ thông tin thời kỳ
 *     tags: [Eras (Admin)]
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
 *             $ref: '#/components/schemas/EraCreateBody'
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
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy thời kỳ
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
 *     summary: Cập nhật một phần thông tin thời kỳ
 *     tags: [Eras (Admin)]
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
 *               start_year:
 *                 type: integer
 *               end_year:
 *                 type: integer
 *               description:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               order:
 *                 type: integer
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
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy thời kỳ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Xóa một thời kỳ lịch sử
 *     tags: [Eras (Admin)]
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
 *                   example: Xóa thời kỳ thành công
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Không có quyền (chỉ Super Admin mới xóa được)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy thời kỳ
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
 *                   example: Không thể xóa — thời kỳ này đang có 12 anh hùng và 8 bài viết liên kết
 */
router.put('/:id', authenticate, authorize('editor', 'superadmin'), eraController.updateEra);
router.patch('/:id', authenticate, authorize('editor', 'superadmin'), eraController.patchEra);
router.delete('/:id', authenticate, authorize('superadmin'), eraController.deleteEra);

export default router;
