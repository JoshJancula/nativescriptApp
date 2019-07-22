const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const GameUser = sequelize.define("GameUser", {
        Username: {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Role: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Phone: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Avatar: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Active: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
        }
    });

    User.hook("beforeCreate", (user) => {
        user.Password = bcrypt.hashSync(user.Password, bcrypt.genSaltSync(2), null);
    });

    // User.associate = (models) => {
    //     User.belongsTo(models.Franchise, {
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     });
    // }

    return GameUser;
};


