// const Sequelize = require('sequelize');
//
// module.exports = class PostTag extends Sequelize.Model{
//     static init(sequelize){
//         return super.init({
//             post_id:{
//                 type: Sequelize.INTEGER,
//                 primaryKey: true,
//                 allowNull: false,
//             },
//             tag_id:{
//                 type: Sequelize.INTEGER,
//                 primaryKey: true,
//                 allowNull: false,
//             },
//         }, {
//             sequelize,
//             timestamps: false,
//             underscored: false,
//             modelName: 'PostTag',
//             tableName: 'post_tags',
//             paranoid: false,
//             charset: 'utf8',
//             collate: 'utf8_general_ci',
//         });
//     }
//     static associate(db){
//         db.PostTag.belongsTo(db.Posting, {foreignKey: 'post_id'});
//         db.PostTag.belongsTo(db.Tag, {foreignKey: 'tag_id'});
//     }
// }