const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authRepository = require('../repositories/authRepository');
const AppError = require('../utils/AppError');

const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, role: user.role, username: user.username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');

const getRefreshTokenExpiry = () => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const days = parseInt(expiresIn.replace('d', ''), 10) || 7;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  path: '/api/v1/auth',
};

const authService = {
  async register({ username, email, password, role }) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw new AppError('Email đã được sử dụng.', 409);

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) throw new AppError('Username đã được sử dụng.', 409);

    if (!password || password.length < 8) {
      throw new AppError('Mật khẩu phải có ít nhất 8 ký tự.', 400);
    }

    const allowedRoles = ['editor', 'viewer' , 'superadmin'];
    const userRole = allowedRoles.includes(role) ? role : 'editor';

    const user = await User.create({ username, email, password, role: userRole });
    return user.toSafeObject();
  },

  async login({ email, password, ipAddress, userAgent }) {
    if (!email || !password) {
      throw new AppError('Vui lòng cung cấp email và mật khẩu.', 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Email hoặc mật khẩu không đúng.', 401);
    }

    if (!user.is_active) {
      throw new AppError('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.', 403);
    }

    await user.update({ last_login: new Date() });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    await authRepository.saveRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return { accessToken, refreshToken, user: user.toSafeObject() };
  },

  async refresh(refreshToken, ipAddress, userAgent) {
    if (!refreshToken) {
      throw new AppError('Refresh token không tồn tại.', 401);
    }

    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored) {
      throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn.', 401);
    }

    if (!stored.user.is_active) {
      throw new AppError('Tài khoản đã bị vô hiệu hóa.', 403);
    }

    // Rotation: thu hồi token cũ, cấp token mới
    await authRepository.revokeRefreshToken(refreshToken);

    const newRefreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    await authRepository.saveRefreshToken({
      userId: stored.user.id,
      token: newRefreshToken,
      expiresAt,
      ipAddress,
      userAgent,
    });

    const accessToken = generateAccessToken(stored.user);
    return { accessToken, refreshToken: newRefreshToken };
  },

  async logout(refreshToken) {
    if (refreshToken) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  },

  async logoutAll(userId) {
    await authRepository.revokeAllUserTokens(userId);
  },

  async changePassword({ userId, oldPassword, newPassword }) {
    if (!oldPassword || !newPassword) {
      throw new AppError('Vui lòng cung cấp mật khẩu cũ và mới.', 400);
    }
    if (newPassword.length < 8) {
      throw new AppError('Mật khẩu mới phải có ít nhất 8 ký tự.', 400);
    }
    if (oldPassword === newPassword) {
      throw new AppError('Mật khẩu mới không được trùng mật khẩu cũ.', 400);
    }

    const user = await User.findByPk(userId);
    if (!user) throw new AppError('Người dùng không tồn tại.', 404);

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new AppError('Mật khẩu cũ không đúng.', 401);

    await user.update({ password: newPassword });
    await authRepository.revokeAllUserTokens(userId);
  },

  async updateProfile({ userId, username, avatar_url }) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('Người dùng không tồn tại.', 404);

    if (username && username !== user.username) {
      const existing = await User.findOne({ where: { username } });
      if (existing) throw new AppError('Username đã được sử dụng.', 409);
    }

    const updates = {};
    if (username) updates.username = username;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    await user.update(updates);
    return user.toSafeObject();
  },

  REFRESH_COOKIE_OPTIONS,
};

module.exports = authService;
