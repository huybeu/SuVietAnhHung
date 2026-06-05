const { sequelize } = require('../config/database');

const User         = require('./user');
const RefreshToken = require('./refreshToken');
const SiteConfig   = require('./siteConfig');
const Era          = require('./era');
const Hero         = require('./hero');
const Tag          = require('./tag');
const Article      = require('./article');
const ArticleHero  = require('./articleHero');
const ArticleTag   = require('./articleTag');
const Video        = require('./video');
const DonationTier = require('./donationTier');
const Donation     = require('./donation');
const SponsorTier  = require('./sponsorTier');
const Sponsor      = require('./sponsor');
const Media        = require('./media');
const PageView     = require('./pageView');

// ─── refresh_tokens ─────────────────────────────────────────
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ─── site_config ────────────────────────────────────────────
SiteConfig.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

// ─── eras ───────────────────────────────────────────────────
Era.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Era.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
Era.hasMany(Hero,   { foreignKey: 'era_id',     as: 'heroes'  });
Era.hasMany(Video,  { foreignKey: 'era_id',     as: 'videos'  });

// ─── heroes ─────────────────────────────────────────────────
Hero.belongsTo(Era,  { foreignKey: 'era_id',     as: 'era'     });
Hero.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Hero.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
Hero.hasMany(Video,  { foreignKey: 'hero_id',    as: 'videos'  });

// ─── tags ───────────────────────────────────────────────────
Tag.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Tag.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

// ─── articles ───────────────────────────────────────────────
Article.belongsTo(User, { foreignKey: 'author_id',  as: 'author'  });
Article.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

Article.belongsToMany(Hero, {
  through: ArticleHero,
  foreignKey: 'article_id',
  otherKey: 'hero_id',
  as: 'heroes',
});
Hero.belongsToMany(Article, {
  through: ArticleHero,
  foreignKey: 'hero_id',
  otherKey: 'article_id',
  as: 'articles',
});

Article.belongsToMany(Tag, {
  through: ArticleTag,
  foreignKey: 'article_id',
  otherKey: 'tag_id',
  as: 'tags',
});
Tag.belongsToMany(Article, {
  through: ArticleTag,
  foreignKey: 'tag_id',
  otherKey: 'article_id',
  as: 'articles',
});

// ─── videos ─────────────────────────────────────────────────
Video.belongsTo(Hero, { foreignKey: 'hero_id',    as: 'hero'    });
Video.belongsTo(Era,  { foreignKey: 'era_id',     as: 'era'     });
Video.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Video.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

// ─── donation_tiers ─────────────────────────────────────────
DonationTier.belongsTo(User,     { foreignKey: 'created_by', as: 'creator'   });
DonationTier.belongsTo(User,     { foreignKey: 'updated_by', as: 'updater'   });
DonationTier.hasMany(Donation,   { foreignKey: 'tier_id',    as: 'donations' });

// ─── donations ──────────────────────────────────────────────
Donation.belongsTo(DonationTier, { foreignKey: 'tier_id',      as: 'tier'      });
Donation.belongsTo(User,         { foreignKey: 'confirmed_by', as: 'confirmer' });

// ─── sponsor_tiers ──────────────────────────────────────────
SponsorTier.belongsTo(User,    { foreignKey: 'created_by', as: 'creator'  });
SponsorTier.belongsTo(User,    { foreignKey: 'updated_by', as: 'updater'  });
SponsorTier.hasMany(Sponsor,   { foreignKey: 'tier_id',    as: 'sponsors' });

// ─── sponsors ───────────────────────────────────────────────
Sponsor.belongsTo(SponsorTier, { foreignKey: 'tier_id',    as: 'tier'    });
Sponsor.belongsTo(User,        { foreignKey: 'created_by', as: 'creator' });
Sponsor.belongsTo(User,        { foreignKey: 'updated_by', as: 'updater' });

// ─── media ──────────────────────────────────────────────────
Media.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
Media.belongsTo(User, { foreignKey: 'updated_by',  as: 'updater'  });

module.exports = {
  sequelize,
  User,
  RefreshToken,
  SiteConfig,
  Era,
  Hero,
  Tag,
  Article,
  ArticleHero,
  ArticleTag,
  Video,
  DonationTier,
  Donation,
  SponsorTier,
  Sponsor,
  Media,
  PageView,
};
