const db = require('../models')


module.exports = {

    getQuiz: async (req, res, next) => {
        try {
            let id = req.params.id
            let quiz = await db.quizzes.findOne({
                where: { id: id },
                include: {
                    association: 'questions',
                    include: {
                        association: 'options',
                        attributes: { exclude: ['correct', 'question_id'] },
                    },
                    attributes: { exclude: ['quiz_id'] },
                }
            })

            if (quiz == null) {
                res.status(404).json({ message: "Quiz not found" })
            }

            res.json(quiz)
        } catch (error) {
            next(error)
        }
    },

    addQuiz: async (req, res, next) => {
        try {
            if (req.body.questions.length < 1 || req.body.questions.length > 10)
                return res.status(400).json({ message: "The number of questions must be between 1-10" })

            for (let i = 0; i < req.body.questions.length; i++) {
                const question = req.body.questions[i];

                if (question.options.length > 5 || question.options.length < 1) {
                    return res.status(400).json({ message: "The number of options must be between 1-5, question number " + (i + 1) + " has " + question.options.length + " options" })
                }

                n_correct_options = 0
                for (let i = 0; i < question.options.length; i++) {
                    const option = question.options[i];
                    if (option.correct) n_correct_options++
                }
    
                if (n_correct_options == 0) {
                    return res.status(400).json({ message: "A question must have at least 1 correct answer, question number " + (i + 1) + " has no correct options" })
                }
    
                if (!question.multipleAnswer && n_correct_options > 1) {
                    return res.status(400).json({ message: "There cannot be more than 1 correct answer on a single answer question, question number " + (i + 1) + " has " + n_correct_options + " correct options" })
                }

            }

            let newQuiz = { ...req.body, user_id: req.user.id }
            let quiz = await db.quizzes.create(newQuiz, {
                include: {
                    association: 'questions',
                    include: 'options'
                }
            })
            res.json({ message: 'Quiz has been created correctly', quiz })
        } catch (error) {
            next(error)
        }
    },

    updateQuiz: async (req, res, next) => {
        try {
            let id = req.params.id

            let quiz = await db.quizzes.findOne({ where: { id: id, user_id: req.user.id } })

            if (quiz == null) {
                res.status(404).json({ message: "Quiz not found" })
            }

            if (quiz.published) {
                return res.status(400).json({ message: "This quiz has been already published" })
            }

            let updateQuiz = { ...req.body }
            await db.quizzes.update(updateQuiz, { where: { id: id } })

            if (req.body.questions) {

                if (!req.body.questions || req.body.questions.length < 1 || req.body.questions.length > 10)
                    return res.status(400).json({ message: "The number of questions must be between 1-10" })

                for (let i = 0; i < req.body.questions.length; i++) {
                    const question = req.body.questions[i];

                    if (!question.options || question.options.length > 5 || question.options.length < 1) {
                        return res.status(400).json({ message: "The number of options must be between 1-5, question number " + (i + 1) + " has " + question.options ? question.options.length : 0 + " options" })
                    }

                    n_correct_options = 0
                    for (let i = 0; i < question.options.length; i++) {
                        const option = question.options[i];
                        if (option.correct) n_correct_options++
                    }
        
                    if (n_correct_options == 0) {
                        return res.status(400).json({ message: "A question must have at least 1 correct answer, question number " + (i + 1) + " has no correct options" })
                    }
        
                    if (!question.multipleAnswer && n_correct_options > 1) {
                        return res.status(400).json({ message: "There cannot be more than 1 correct answer on a single answer question, question number " + (i + 1) + " has " + n_correct_options + " correct options" })
                    }
        
                }

                const newQuestions = req.body.questions.map(q => ({ ...q, quiz_id: quiz.id }))

                await db.questions.destroy({ where: { quiz_id: quiz.id } })
                await db.questions.bulkCreate(newQuestions, { include: { association: 'options' } })
            }

            res.json({ message: 'Quiz has been updated correctly' })
        } catch (error) {
            next(error)
        }
    },

    deleteQuiz: async (req, res) => {
        try {
            let id = req.params.id
            const quiz = await db.quizzes.destroy({ where: { id: id, user_id: req.user.id } })

            if (quiz == null) {
                res.status(404).json({ message: "Quiz not found" })
            }

            res.json({ message: 'Quiz has been deleted correctly' })
        } catch (error) {
            next(error)
        }
    },
}