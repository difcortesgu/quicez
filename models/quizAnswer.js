module.exports = (sequelize, DataTypes) => {

    const QuizAnswer = sequelize.define("quiz_answer", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        quiz_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    })

    return QuizAnswer

}