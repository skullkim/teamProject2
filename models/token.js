const Sequelize = require('sequelize');

module.exports = class Token extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            user:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            kakao_oauth:{
                type: Sequelize.TEXT,
            },
            kakao_refresh:{
                type: Sequelize.TEXT,
            },
            git_oauth:{
                type: Sequelize.TEXT,
            },
            git_refresh:{
                type: Sequelize.TEXT,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Token',
            tableName: 'token',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        db.Token.belongsTo(db.User, {foreignKey: 'id', targetKey: 'id'});
    }
}