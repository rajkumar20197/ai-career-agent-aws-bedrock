import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Brain,
  Clock,
  Target,
  Sparkles,
  MessageSquare,
  Award
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InterviewQuestion {
  id: number;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'entry' | 'mid' | 'senior';
}

interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  starAnalysis?: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
  communicationClarity: number;
  technicalAccuracy: number;
  confidence: number;
}

export function AIMockInterview() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [jobLevel, setJobLevel] = useState<'entry' | 'mid' | 'senior'>('entry');
  const [interviewType, setInterviewType] = useState<'behavioral' | 'technical' | 'mixed'>('mixed');
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions: InterviewQuestion[] = [
    {
      id: 1,
      question: "Tell me about a time when you faced a challenging problem at work. How did you approach it?",
      type: 'behavioral',
      difficulty: 'entry'
    },
    {
      id: 2,
      question: "Describe a situation where you had to work with a difficult team member. What was the outcome?",
      type: 'behavioral',
      difficulty: 'mid'
    },
    {
      id: 3,
      question: "How would you design a system to handle millions of concurrent users?",
      type: 'technical',
      difficulty: 'senior'
    },
    {
      id: 4,
      question: "Walk me through how you would debug a production issue that's causing intermittent failures.",
      type: 'technical',
      difficulty: 'mid'
    },
    {
      id: 5,
      question: "Tell me about a time when you had to make a decision with incomplete information.",
      type: 'situational',
      difficulty: 'mid'
    }
  ];

  const filteredQuestions = questions.filter(q => 
    q.difficulty === jobLevel && (interviewType === 'mixed' || q.type === interviewType)
  );

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeRemaining]);

  const startInterview = () => {
    if (filteredQuestions.length === 0) {
      toast.error('No questions available for selected criteria');
      return;
    }
    setIsInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setTimeRemaining(120);
    setIsTimerRunning(true);
    toast.success('Interview started! Good luck!');
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Recording started');
      // In production, integrate with Web Speech API
    } else {
      toast.success('Recording stopped');
    }
  };

  const handleAutoSubmit = () => {
    if (answer.trim()) {
      handleSubmitAnswer();
    } else {
      toast.error('Time is up! Moving to next question.');
      handleNextQuestion();
    }
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    setAnswers([...answers, { question: currentQuestion.question, answer }]);
    setAnswer('');
    setIsTimerRunning(false);
    toast.success('Answer submitted!');
    
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeRemaining(120);
        setIsTimerRunning(true);
      }, 1000);
    } else {
      generateFeedback();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setTimeRemaining(120);
      setIsTimerRunning(true);
    }
  };

  const generateFeedback = () => {
    // Simulate AI feedback generation using AWS Bedrock
    const mockFeedback: InterviewFeedback = {
      score: 78,
      strengths: [
        'Clear communication and structured responses',
        'Good use of specific examples',
        'Demonstrated problem-solving skills'
      ],
      improvements: [
        'Provide more quantifiable results',
        'Include more details about team collaboration',
        'Elaborate on lessons learned'
      ],
      starAnalysis: {
        situation: 85,
        task: 75,
        action: 80,
        result: 70
      },
      communicationClarity: 82,
      technicalAccuracy: 75,
      confidence: 76
    };

    setTimeout(() => {
      setFeedback(mockFeedback);
      setShowResults(true);
      setIsInterviewStarted(false);
      toast.success('Interview completed! View your feedback.');
    }, 1500);
  };

  const restartInterview = () => {
    setIsInterviewStarted(false);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setAnswers([]);
    setFeedback(null);
    setShowResults(false);
    setTimeRemaining(120);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl">AI Mock Interview Simulator</h1>
              <p className="text-slate-600">Practice with AI-powered feedback and analysis</p>
            </div>
          </div>
        </motion.div>

        {/* Setup Screen */}
        {!isInterviewStarted && !showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl mb-4">Configure Your Interview</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2">Job Level</label>
                      <Select value={jobLevel} onValueChange={(value: any) => setJobLevel(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-2">Interview Type</label>
                      <Select value={interviewType} onValueChange={(value: any) => setInterviewType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    What to Expect
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>5 interview questions tailored to your level</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>2 minutes per question with timer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Real-time STAR method analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Detailed feedback on communication, accuracy, and confidence</span>
                    </li>
                  </ul>
                </div>

                <Button onClick={startInterview} size="lg" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Interview
                </Button>
              </div>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6">
                <Brain className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-slate-600">
                  Get instant feedback using AWS Bedrock AI to improve your responses
                </p>
              </Card>
              <Card className="p-6">
                <Target className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="mb-2">STAR Framework</h3>
                <p className="text-sm text-slate-600">
                  Responses analyzed for Situation, Task, Action, and Result structure
                </p>
              </Card>
              <Card className="p-6">
                <Award className="w-10 h-10 text-green-600 mb-3" />
                <h3 className="mb-2">Progress Tracking</h3>
                <p className="text-sm text-slate-600">
                  Track your improvement over multiple practice sessions
                </p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Interview In Progress */}
        {isInterviewStarted && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Question {currentQuestionIndex + 1} of {filteredQuestions.length}</span>
                <Badge variant={timeRemaining > 60 ? 'default' : 'destructive'}>
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(timeRemaining)}
                </Badge>
              </div>
              <Progress 
                value={((currentQuestionIndex + 1) / filteredQuestions.length) * 100} 
                className="h-2"
              />
            </Card>

            {/* Question Card */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline">{currentQuestion.type}</Badge>
                      <Badge variant="secondary">{currentQuestion.difficulty} level</Badge>
                    </div>
                    <h2 className="text-2xl mb-4">{currentQuestion.question}</h2>
                  </div>
                </div>

                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here... Use the STAR method: Situation, Task, Action, Result"
                  className="min-h-[200px] text-base"
                />

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={isRecording ? 'destructive' : 'outline'}
                      onClick={handleRecording}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {isRecording ? 'Stop Recording' : 'Voice Answer'}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={restartInterview}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                    <Button onClick={handleSubmitAnswer} disabled={!answer.trim()}>
                      {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Submit Interview'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Results Screen */}
        {showResults && feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <Card className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <div className="text-center">
                <Award className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl mb-2">Interview Complete!</h2>
                <div className="text-6xl mb-2">{feedback.score}%</div>
                <p className="text-purple-100">Overall Performance Score</p>
              </div>
            </Card>

            {/* Detailed Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3>Communication Clarity</h3>
                  <span className="text-2xl">{feedback.communicationClarity}%</span>
                </div>
                <Progress value={feedback.communicationClarity} className="h-2" />
              </Card>
              <Card className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3>Technical Accuracy</h3>
                  <span className="text-2xl">{feedback.technicalAccuracy}%</span>
                </div>
                <Progress value={feedback.technicalAccuracy} className="h-2" />
              </Card>
              <Card className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3>Confidence Level</h3>
                  <span className="text-2xl">{feedback.confidence}%</span>
                </div>
                <Progress value={feedback.confidence} className="h-2" />
              </Card>
            </div>

            {/* STAR Analysis */}
            {feedback.starAnalysis && (
              <Card className="p-6">
                <h3 className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-purple-600" />
                  STAR Method Analysis
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {Object.entries(feedback.starAnalysis).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="capitalize">{key}</span>
                        <span>{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="flex items-center gap-2 mb-4 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="flex items-center gap-2 mb-4 text-orange-600">
                  <TrendingUp className="w-5 h-5" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={restartInterview} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button className="flex-1">
                Save & Download Report
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
