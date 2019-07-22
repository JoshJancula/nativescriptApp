module.exports = (sequelize, DataTypes) => {
    const GameLobby = sequelize.define("GameLobby", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Player1: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Player1Id: {
            type: DataTypes.Integer,
            unique: false,
            allowNull: false,
        },
        Player2: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: false,
        },
        Player2Id: {
            type: DataTypes.Integer,
            unique: false,
            allowNull: false,
        },
        GameType: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },     
        WhosTurn: {
            type: DataTypes.String,
            unique: false,
            allowNull: false,
        }, 
        GameInfo: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: false,
        },
        Player1TotalWins: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        Player2TotalWins: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    GameLobby.associate = (models) => {
        // Associating the franchise with the following
        GameLobby.hasMany(models.Message, {
            onDelete: "cascade"
        });
    };

    return Message;
};