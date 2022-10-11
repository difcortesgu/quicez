const { Sequelize, DataTypes } = require('sequelize');
const users = require('./user')
const quizzes = require('./quiz')
const questions = require('./question')
const options = require('./option')
const quizAnswers = require('./quizAnswer')
const questionAnswers = require('./questionAnswer')
const selectedOptions = require('./selectedOption')

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
)

try {

    sequelize.authenticate()
        .then(() => {
            console.log('Database connected succesfully!')
        })
        .catch(err => {
            console.log('Database error: ' + err)
        })

    const db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        users: users(sequelize, DataTypes),
        quizzes: quizzes(sequelize, DataTypes),
        questions: questions(sequelize, DataTypes),
        options: options(sequelize, DataTypes),
        quizAnswers: quizAnswers(sequelize, DataTypes),
        questionAnswers: questionAnswers(sequelize, DataTypes),
        selectedOptions: selectedOptions(sequelize, DataTypes),
    }

    // User relationships
    db.users.hasMany(db.quizzes, {
        foreignKey: 'user_id',
        as: 'quizzes'
    })
    db.users.hasMany(db.quizAnswers, {
        foreignKey: 'user_id',
        as: 'quiz_answers'
    })
    db.quizzes.belongsTo(db.users, {
        foreignKey: 'user_id',
        as: 'user'
    })
    db.quizAnswers.belongsTo(db.users, {
        foreignKey: 'user_id',
        as: 'user'
    })


    // Quizzes relationships
    db.quizzes.hasMany(db.questions, {
        foreignKey: 'quiz_id',
        as: 'questions'
    })
    db.quizzes.hasMany(db.quizAnswers, {
        foreignKey: 'quiz_id',
        as: 'quiz_answers'
    })
    db.questions.belongsTo(db.quizzes, {
        foreignKey: 'quiz_id',
        as: 'quiz'
    })
    db.quizAnswers.belongsTo(db.quizzes, {
        foreignKey: 'quiz_id',
        as: 'quiz'
    })

    // Questions relationships
    db.questions.hasMany(db.options, {
        foreignKey: 'question_id',
        as: 'options'
    })
    db.questions.hasMany(db.questionAnswers, {
        foreignKey: 'question_id',
        as: 'question_answers'
    })
    db.questionAnswers.belongsTo(db.questions, {
        foreignKey: 'question_id',
        as: 'question'
    })
    db.options.belongsTo(db.questions, {
        foreignKey: 'question_id',
        as: 'question'
    })


    db.quizAnswers.hasMany(db.questionAnswers, {
        foreignKey: 'quiz_answer_id',
        as: 'question_answers'
    })
    db.questionAnswers.belongsTo(db.quizAnswers, {
        foreignKey: 'quiz_answer_id',
        as: 'quiz_answer'
    })


    db.questionAnswers.hasMany(db.selectedOptions, {
        foreignKey: 'question_answer_id',
        as: 'selected_options'
    })
    db.selectedOptions.belongsTo(db.questionAnswers, {
        foreignKey: 'question_answer_id',
        as: 'question_answer'
    })

    db.options.hasMany(db.selectedOptions, {
        foreignKey: 'option_id',
        as: 'selected_options'
    })
    db.selectedOptions.belongsTo(db.options, {
        foreignKey: 'option_id',
        as: 'option'
    })

    db.sequelize.sync({ force: false })
        .then(() => {
            console.log('Database synced correctly!')
        })
    module.exports = db

} catch (error) {
    console.log(error)
}
