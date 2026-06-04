const authService = require('../services/authService');
const { sendSuccess, sendCreated } = require('../utils/response');

const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress;

const authController = {
  /**
   * POST /auth/register
   * Body: { username, email, password, role? }
   */
  async register(req, res, next) {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp username, email và mật khẩu.',
        });
      }

      const user = await authService.register({ username, email, password, role });
      sendCreated(res, user, 'Đăng ký tài khoản thành công.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /auth/login
   * Body: { email, password }
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ipAddress = getClientIp(req);
      const userAgent = req.headers['user-agent'];

      const { accessToken, refreshToken, user } = await authService.login({
        email,
        password,
        ipAddress,
        userAgent,
      });

      res.cookie('refreshToken', refreshToken, authService.REFRESH_COOKIE_OPTIONS);

      sendSuccess(res, { accessToken, user }, 'Đăng nhập thành công.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /auth/logout
   * Cookie: refreshToken
   */
  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await authService.logout(refreshToken);

      res.clearCookie('refreshToken', { path: authService.REFRESH_COOKIE_OPTIONS.path });
      sendSuccess(res, null, 'Đăng xuất thành công.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /auth/logout-all
   * Đăng xuất tất cả thiết bị (yêu cầu đăng nhập)
   */
  async logoutAll(req, res, next) {
    try {
      await authService.logoutAll(req.user.id);
      res.clearCookie('refreshToken', { path: authService.REFRESH_COOKIE_OPTIONS.path });
      sendSuccess(res, null, 'Đã đăng xuất khỏi tất cả thiết bị.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /auth/refresh
   * Cookie: refreshToken
   */
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const ipAddress = getClientIp(req);
      const userAgent = req.headers['user-agent'];

      const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(
        refreshToken,
        ipAddress,
        userAgent
      );

      res.cookie('refreshToken', newRefreshToken, authService.REFRESH_COOKIE_OPTIONS);
      sendSuccess(res, { accessToken }, 'Làm mới token thành công.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /auth/me
   * Lấy thông tin người dùng hiện tại
   */
  async me(req, res, next) {
    try {
      sendSuccess(res, req.user.toJSON(), 'Lấy thông tin thành công.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /auth/me
   * Body: { username?, avatar_url? }
   */
  async updateProfile(req, res, next) {
    try {
      const { username, avatar_url } = req.body;
      const user = await authService.updateProfile({ userId: req.user.id, username, avatar_url });
      sendSuccess(res, user, 'Cập nhật thông tin thành công.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /auth/change-password
   * Body: { oldPassword, newPassword }
   */
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword({ userId: req.user.id, oldPassword, newPassword });

      res.clearCookie('refreshToken', { path: authService.REFRESH_COOKIE_OPTIONS.path });
      sendSuccess(res, null, 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
