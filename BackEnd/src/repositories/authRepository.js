import crypto from 'crypto';
import { Op } from 'sequelize';
import { RefreshToken, User } from '../models/index.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const authRepository = {
  async saveRefreshToken({ userId, token, expiresAt, ipAddress, userAgent }) {
    return RefreshToken.create({
      user_id: userId,
      token_hash: hashToken(token),
      expires_at: expiresAt,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  },

  async findRefreshToken(token) {
    return RefreshToken.findOne({
      where: {
        token_hash: hashToken(token),
        is_revoked: false,
        expires_at: { [Op.gt]: new Date() },
      },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
    });
  },

  async revokeRefreshToken(token) {
    return RefreshToken.update(
      { is_revoked: true },
      { where: { token_hash: hashToken(token) } }
    );
  },

  async revokeAllUserTokens(userId) {
    return RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: userId, is_revoked: false } }
    );
  },

  async deleteExpiredTokens() {
    return RefreshToken.destroy({
      where: { expires_at: { [Op.lt]: new Date() } },
    });
  },
};

export default authRepository;
