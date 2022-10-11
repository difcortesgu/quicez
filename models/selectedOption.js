module.exports = (sequelize, DataTypes) => {

    const SelectedOption = sequelize.define("selected_option", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        question_answer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        option_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    })

    return SelectedOption

}