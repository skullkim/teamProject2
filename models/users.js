const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name:{
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            password:{
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            email:{
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            age:{
                tyep: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at:{
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        })
    }
}