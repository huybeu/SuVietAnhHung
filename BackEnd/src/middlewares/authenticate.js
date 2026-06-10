const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.', 401));
    }

    const token = authHeader.split(' ')[1];

    // Dev bypass: cho phép dev-bypass-token khi chạy ở môi trường development
    if (process.env.NODE_ENV === 'development' && token === 'dev-bypass-token') {
      req.user = { id: null, username: 'dev', role: 'admin', is_active: true };
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401));
      }
      return next(new AppError('Token không hợp lệ.', 401));
    }

    const user = await User.findOne({
      where: { id: decoded.sub, is_active: true },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return next(new AppError('Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
