const db = require('../models')

module.exports = {

    addQuestion: async (req, res, next) => {
        try {

            let quiz = await db.quizzes.findOne({ where: { id: req.body.quiz_id, user_id: req.user.id } })

            if (quiz == null) {
                res.status(404).json({ message: "Quiz not found" })
            }

            if (quiz.published) {
                return res.status(400).json({ message: "This quiz has been already published" })
            }

            let newQuestion = { ...req.body }

            if (newQuestion.options.length > 5 || newQuestion.options.length < 1) {
                return res.status(400).json({ message: "The number of options must be between 1-5" })
            }

            n_correct_options = 0
            for (let i = 0; i < newQuestion.options.length; i++) {
                const option = newQuestion.options[i];
                if (option.correct) n_correct_options++
            }

            if (n_correct_options == 0) {
                return res.status(400).json({ message: "A question must have at least 1 correct answer" })
            }

            if (!newQuestion.multipleAnswer && n_correct_options > 1) {
                return res.status(400).json({ message: "There cannot be more than 1 correct answer on a single answer question, question number " + (i + 1) + " has " + n_correct_options + " correct options" })
            }

            let question = await db.questions.create(newQuestion, {
                include: 'options'
            })
            res.json({ message: 'Question has been created correctly', question })
        } catch (error) {
            next(error)
        }
    },

    getQuestion: async (req, res, next) => {
        try {
            let id = req.params.id
            let question = await db.questions.findOne({
                where: { id: id },
                include: {
                    association: 'options',
                    attributes: { exclude: ['correct', 'question_id'] },
                }
            })

            if (question == null) {
                res.status(404).json({ message: "Question not found" })
            }

            res.json(question)
        } catch (error) {
            next(error)
        }
    },

    updateQuestion: async (req, res, next) => {
        try {
            let id = req.params.id
            let question = await db.questions.findOne({ where: { id: id }, include: 'quiz' })

            if (question == null || question.quiz.user_id != req.user.id) {
                return res.status(404).json({ message: "Question not found" })
            }

            if (question.quiz.published) {
                return res.status(400).json({ message: "This quiz has been already published" })
            }

            let updateQuestion = { ...req.body }
            await db.questions.update(updateQuestion, { where: { id: id } })

            if (updateQuestion.options) {
                if (!updateQuestion.options || updateQuestion.options.length > 5 || updateQuestion.options.length < 1) {
                    return res.status(400).json({ message: "The number of options must be between 1-5, question has " + updateQuestion.options ? updateQuestion.options.length : 0 + " options" })
                }

                n_correct_options = 0
                for (let i = 0; i < updateQuestion.options.length; i++) {
                    const option = updateQuestion.options[i];
                    if (option.correct) n_correct_options++
                }

                if (n_correct_options == 0) {
                    return res.status(400).json({ message: "A question must have at least 1 correct answer" })
                }

                if (!updateQuestion.multipleAnswer && n_correct_options > 1) {
                    return res.status(400).json({ message: "There cannot be more than 1 correct answer on a single answer question, question number " + (i + 1) + " has " + n_correct_options + " correct options" })
                }

                const newOptions = updateQuestion.options.map(o => ({ ...o, question_id: id }))

                await db.options.destroy({ where: { question_id: id } })
                await db.options.bulkCreate(newOptions)
            }

            res.json({ message: 'Question has been updated correctly' })
        } catch (error) {
            next(error)
        }
    },

    deleteQuestion: async (req, res, next) => {
        try {
            let id = req.params.id
            let question = await db.questions.findOne({ where: { id: id }, include: 'quiz' })

            if (question == null || question.quiz.user_id != req.user.id) {
                res.status(404).json({ message: "Question not found" })
            }

            if (question.quiz.published) {
                return res.status(400).json({ message: "This quiz has been already published" })
            }

            let n_quiz_questions = await db.questions.count({ where: { quiz_id: question.quiz_id } });
            if (n_quiz_questions == 1) {
                return res.status(400).json({ message: "Cannot have a quiz without questions, this is the last question of this quiz" })
            }

            await db.questions.destroy({ where: { id: id } })
            res.json({ message: 'Question has been deleted correctly' })
        } catch (error) {
            next(error)
        }
    },
}