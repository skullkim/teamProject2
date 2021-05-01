const Sequelize = require('sequelize');
const User = require('./users');
const Token = require('./token');
const Posting = require('./postings');
const Tag = require('./tags');
const PostTag = require('./post_tag');

const env = process.env.NODE_DEV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.User = User;
db.Token = Token;
db.Posting = Posting;
db.Tag = Tag;
db.PostTag = PostTag;

User.init(sequelize);
Token.init(sequelize);
Posting.init(sequelize);
Tag.init(sequelize);
PostTag.init(sequelize);

module.exports = db;