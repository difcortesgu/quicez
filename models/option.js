module.exports = (sequelize, DataTypes) => {

    const Option = sequelize.define("option", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },        
    }, {
        timestamps: false
    })

    return Option

}