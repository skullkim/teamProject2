const Sequelize = require('sequelize');

module.exports = class PostingImage extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            post_id:{
                type: Sequelize.INTEGER,
                allowNULL: false,
            },
            img_key:{
                type: Sequelize.STRING(500),
                allowNULL: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: "PostingImage",
            tableName: 'posting_images',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.PostingImage.belongsTo(db.Posting, {foreignKey: 'post_id', targetKey: 'id'});
    }
}