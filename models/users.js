const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Users extends Model {
    
    static async findUser(email, password) {
        try {
            const user = await Users.findOne({ where: { email: email, password: password } });
            return user;
        }
        catch (error) {
            console.log(error);
        }
    }

    static async findUsers() {
        try {
            const users = await Users.findAll();
            return users;
        }
        catch (error) {
            console.log(error);
        }
    }

    static async removeUser(id) {
        try {
            const user = await Users.destroy({ where: { id: id } });
            return user;
        }
        catch (error) {
            console.log(error);
        }
    }
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    alpaca_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Users'
});

console.log(Users === sequelize.models.Users);

module.exports = Users;