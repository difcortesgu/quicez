const db = require('../models')

const getPagingData = (data, page, limit) => {
    console.log(data)
    const { count, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(count / limit);
    return { count, rows, totalPages, currentPage };
};

const getPagination = (page, size) => {
    const limit = size ? +size : 200;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

module.exports = {

    getAnswersByQuiz: async (req, res, next) => {
        try {
            const { page, size } = req.query;
            const { limit, offset } = getPagination(page, size);

            let quiz = await db.quizzes.findOne({ where: { id: req.params.id } })

            if (quiz == null) {
                res.status(404).json({ message: "Quiz not found" })
            }

            if (quiz.user_id != req.user.id) {
                return res.status(400).json({ message: "This is not your quiz, you can't access the answers" })
            }

            let quizAnswers = await db.quizAnswers.findAndCountAll({
                limit,
                offset,
                distinct: true,
                where: { quiz_id: quiz.id },
                include: {
                    association: 'question_answers',
                    include: {
                        association: 'selected_options',
                        attributes: { exclude: ['question_answer_id'] },
                    },
                    attributes: { exclude: ['quiz_answer_id'] },
                }
            })
            res.json(getPagingData(quizAnswers, page, limit))
        } catch (error) {
            next(error)
        }
    },

    getMyQuizAnswers: async (req, res, next) => {
        try {
            let quizAnswers = await db.quizAnswers.findAll({
                where: { user_id: req.user.id },
                include: {
                    association: 'question_answers',
                    include: {
                        association: 'selected_options',
                        attributes: { exclude: ['question_answer_id'] },
                    },
                    attributes: { exclude: ['quiz_answer_id'] },
                }
            })
            res.json(quizAnswers)
        } catch (error) {
            next(error)
        }
    },

    getQuizAnswer: async (req, res, next) => {
        try {
            let id = req.params.id
            let quizAnswer = await db.quizAnswers.findOne({
                where: { id: id },
                include: {
                    association: 'question_answers',
                    include: {
                        association: 'selected_options',
                        attributes: { exclude: ['question_answer_id'] },
                    },
                    attributes: { exclude: ['quiz_answer_id'] },
                }
            })

            if (quizAnswer == null) {
                res.status(404).json({ message: "Answer not found" })
            }


            res.json(quizAnswer)
        } catch (error) {
            next(error)
        }
    },

    addQuizAnswer: async (req, res, next) => {
        try {
            let quiz = await db.quizzes.findOne({
                where: { id: req.body.quiz_id },
                include: {
                    association: 'questions',
                    include: 'options'
                }
            })

            if (quiz == null) {
                res.status(404).json({ message: "Quiz not found" })
            }

            if (!quiz.published) {
                return res.status(400).json({ message: "This quiz is not published" })
            }

            if (quiz.user_id == req.user.id) {
                return res.status(400).json({ message: "This quiz is yours, you cannot answer it" })
            }

            if (await db.quizAnswers.findOne({ where: { user_id: req.user.id, quiz_id: quiz.id } }) != null) {
                return res.status(400).json({ message: "You have already answered this quiz" })
            }

            for (let i = 0; i < req.body.question_answers.length; i++) {
                const questionAnswer = req.body.question_answers[i];
                let question = await db.questions.findOne({ where: { id: questionAnswer.question_id } })

                if (question == null) {
                    res.status(404).json({ message: "Question not found" })
                }

                if (!question.multipleAnswer && questionAnswer.selected_options.length > 1) {
                    return res.status(400).json({ message: "This is a single answer question, you can't provide multiple correct answers" })
                }
            }

            let newQuizAnswer = { ...req.body, user_id: req.user.id }

            newQuizAnswer.score = 0
            for (let i = 0; i < newQuizAnswer.question_answers.length; i++) {
                const question = quiz.questions[i];
                const answer = newQuizAnswer.question_answers[i];

                const correctOptions = question.options.filter(o => o.correct).map(o => o.id)

                w1 = question.multipleAnswer ? correctOptions.length : 1
                w2 = question.multipleAnswer ? question.options.length - correctOptions.length : 1

                var r = 0
                var w = 0
                for (let j = 0; j < answer.selected_options.length; j++) {
                    const selectedOption = answer.selected_options[j];
                    if (correctOptions.includes(selectedOption.option_id)) {
                        r++
                    } else {
                        w++
                    }
                }
                newQuizAnswer.question_answers[i].score = (r / w1) - (w / w2)
                newQuizAnswer.score += newQuizAnswer.question_answers[i].score
            }
            newQuizAnswer.score /= newQuizAnswer.question_answers.length


            let quizAnswer = await db.quizAnswers.create(newQuizAnswer, {
                include: {
                    association: 'question_answers',
                    include: 'selected_options'
                }
            })
            res.json({ message: 'Answer saved succesfully', quizAnswer })
        } catch (error) {
            next(error)
        }
    },
}