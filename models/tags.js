const Sequelize = require('sequelize');

module.exports = class Tag extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            tag:{
                type: Sequelize.STRING(45),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Tag',
            tableName: 'tags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.PostTag.belongsToMany(db.Tag, {through: 'post_tag', foreignKey: 'id'});
    }
}