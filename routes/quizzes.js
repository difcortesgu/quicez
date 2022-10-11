const quizController = require('../controllers/quiz')
const questionController = require('../controllers/question')
const answerController = require('../controllers/quizAnswer')
const auth = require('../middlewares/auth')

const router = require('express').Router()
router.use(auth)

//Quizzes
router.post('/', quizController.addQuiz)
router.get('/:id', quizController.getQuiz)
router.put('/:id', quizController.updateQuiz)
router.delete('/:id', quizController.deleteQuiz)

//Questions
router.post('/questions', questionController.addQuestion)
router.get('/questions/:id', questionController.getQuestion)
router.put('/questions/:id', questionController.updateQuestion)
router.delete('/questions/:id', questionController.deleteQuestion)

//Answers
router.post('/answers', answerController.addQuizAnswer)
router.get('/answers/my-answers', answerController.getMyQuizAnswers)
router.get('/answers/:id', answerController.getQuizAnswer)
router.get('/answers/quiz-answers/:id', answerController.getAnswersByQuiz)


module.exports = router