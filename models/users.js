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

    static async toggleBan(id) {
        try {
            const user = await Users.findOne({ where: { id: id } });
        
            user.banned = !user.banned;
            await user.save();
            return user;
        } catch (error) {
            console.error(error);
        }
    }

    static async toggleAdmin(id) {
        try {
            const user = await Users.findOne({ where: { id: id } });
        
            user.admin = !user.admin;
            await user.save();
            return user;
        } catch (error) {
            console.error(error);
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
    ach_relationship_id: {
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
    },
    banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Users'
});

console.log(Users === sequelize.models.Users);

module.exports = Users;