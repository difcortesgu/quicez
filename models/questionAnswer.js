module.exports = (sequelize, DataTypes) => {

    const QuestionAnswer = sequelize.define("question_answer", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quiz_answer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    }, {
        timestamps: false
    })

    return QuestionAnswer

}