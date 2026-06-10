import AppError from '../utils/AppError.js';

const ROLE_HIERARCHY = {
  superadmin: 3,
  editor: 2,
  viewer: 1,
};

/**
 * Kiểm tra user có đủ quyền truy cập không.
 * @param {...string} roles - Danh sách role được phép
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Bạn chưa đăng nhập.', 401));
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const hasPermission = roles.some((role) => {
      const requiredLevel = ROLE_HIERARCHY[role] || 0;
      return userLevel >= requiredLevel;
    });

    if (!hasPermission) {
      return next(
        new AppError(
          `Bạn không có quyền thực hiện hành động này. Yêu cầu quyền: ${roles.join(' hoặc ')}.`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Chỉ cho phép chính chủ hoặc superadmin.
 * @param {Function} getResourceUserId - Hàm lấy user_id từ req
 */
const authorizeOwnerOrAdmin = (getResourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Bạn chưa đăng nhập.', 401));
    }

    const resourceUserId = getResourceUserId(req);
    const isSuperAdmin = req.user.role === 'superadmin';
    const isOwner = String(req.user.id) === String(resourceUserId);

    if (!isSuperAdmin && !isOwner) {
      return next(new AppError('Bạn không có quyền truy cập tài nguyên này.', 403));
    }

    next();
  };
};

export { authorize, authorizeOwnerOrAdmin };
