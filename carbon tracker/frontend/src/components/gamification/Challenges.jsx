import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    Box,
    LinearProgress,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';
import api from '../../utils/api';

const Challenges = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await api.get('/api/quiz/questions');
            setQuestions(response.data.questions);
            setLoading(false);
        } catch (err) {
            setError('Failed to load questions');
            setLoading(false);
        }
    };

    const handleAnswer = (event) => {
        const newAnswers = {
            ...answers,
            [currentQuestion]: event.target.value
        };
        setAnswers(newAnswers);
        console.log(newAnswers);
    };

    const calculateScore = async () => {
        let totalScore = 0;
        Object.keys(answers).forEach((questionIndex) => {
            const question = questions[parseInt(questionIndex)];
            if (answers[questionIndex] === question.correct_answer) {
                totalScore += question.points;
            }
        });
        setScore(totalScore);

        try {
            await api.post('/api/quiz/submit', {
                score: totalScore,
                token: localStorage.getItem('token')
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }

        setShowResult(true);
        setIsDialogOpen(true);
    };

    const handleNext = () => {
        if (!answers[currentQuestion]) {
            alert('Please select an answer before proceeding.');
            return;
        }
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateScore();
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
                <Typography variant="h6">Loading Questions...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Button onClick={fetchQuestions} variant="contained" color="primary">
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container>
            {!showResult ? (
                <>
                    {/* Progress Bar */}
                    <Box sx={{ width: '100%', marginBottom: 2 }}>
                        <LinearProgress variant="determinate" value={(currentQuestion / questions.length) * 100} />
                    </Box>

                    {/* Current Question */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                Question {currentQuestion + 1} of {questions.length}
                            </Typography>
                            <Typography>{questions[currentQuestion].question}</Typography>

                            {/* Options */}
                            <RadioGroup value={answers[currentQuestion] || ''} onChange={handleAnswer}>
                                {Object.entries(questions[currentQuestion].options).map(([key, value]) => (
                                    <FormControlLabel key={key} value={key} control={<Radio />} label={value} />
                                ))}
                            </RadioGroup>

                            {/* Navigation Buttons */}
                            <Button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>
                                Previous
                            </Button>
                            <Button onClick={handleNext}>
                                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </CardContent>
                    </Card>
                </>
            ) : (
                // Results Section
                <>
                    <Box>
                        <Typography variant="h5">Quiz Results</Typography>
                        {questions.map((question, index) => (
                            <Box key={index} sx={{ marginBottom: 2 }}>
                                <Typography variant="subtitle1">{question.question}</Typography>
                                <Typography variant="body2" color={answers[index] === question.correct_answer ? 'green' : 'red'}>
                                    Your Answer: {question.options[answers[index]] || 'Not Answered'}
                                </Typography>
                                {answers[index] !== question.correct_answer && (
                                    <Typography variant="body2" color="blue">
                                        Correct Answer: {question.options[question.correct_answer]}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>

                    {/* Retry Button */}
                    <Button onClick={() => window.location.reload()} variant="contained" color="primary">
                        Try Again
                    </Button>

                    {/* Dialog for Final Message */}
                    <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                        <DialogTitle>Quiz Completed</DialogTitle>
                        <DialogContent>Your Score: {score}/{questions.reduce((acc, q) => acc + q.points, 0)}</DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    );
};

export default Challenges;
