const Sequelize = require('sequelize');
const User = require('./users');
const Token = require('./token');
const Posting = require('./postings');
const Tag = require('./tags');
const Comment = require('./comments');
const PostingImage = require('./posting_images');

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
db.Comment = Comment;
db.PostingImage = PostingImage;

User.init(sequelize);
Token.init(sequelize);
Posting.init(sequelize);
Tag.init(sequelize);
Comment.init(sequelize);
PostingImage.init(sequelize);

User.associate(db);
Token.associate(db);
Posting.associate(db);
Tag.associate(db);
Comment.associate(db);
PostingImage.associate(db);

module.exports = db;