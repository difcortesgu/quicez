module.exports = (sequelize, DataTypes) => {

    const Question = sequelize.define("question", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        multipleAnswer: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        quiz_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
    }, {
        timestamps: false
    })

    return Question

}