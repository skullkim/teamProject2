const Sequelize = require('sequelize');

module.exports = class Posting extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            author:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            title:{
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            main_posting:{
                type: Sequelize.TEXT('medium'),
                allowNull: false,
            },
            main_category:{
                type: Sequelize.STRING(20),
                allowNULL: false,
            },
            created_at:{
                type: Sequelize.DATE,
                allowNULL: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Posting',
            tableName: 'postings',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        db.Posting.belongsTo(db.User, {foreignKey: 'author', targetKey: 'id'});
        db.Posting.belongsToMany(db.Tag, {through: 'PostTag'});
    }
}