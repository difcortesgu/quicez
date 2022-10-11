module.exports = (sequelize, DataTypes) => {

    const Quiz = sequelize.define("quiz", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    })

    return Quiz

}