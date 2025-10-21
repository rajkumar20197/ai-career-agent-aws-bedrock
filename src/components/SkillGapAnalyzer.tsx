import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import { 
  Target, 
  TrendingUp, 
  Book, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Skill {
  name: string;
  hasSkill: boolean;
  proficiency?: number;
}

interface LearningPath {
  skill: string;
  courses: {
    name: string;
    provider: string;
    duration: string;
    level: string;
    url: string;
  }[];
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
}

export function SkillGapAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [analysis, setAnalysis] = useState<{
    matchScore: number;
    hasSkills: Skill[];
    missingSkills: Skill[];
    learningPaths: LearningPath[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSkills = () => {
    if (!jobDescription.trim() || !resume.trim()) {
      toast.error('Please provide both job description and your resume/skills');
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        matchScore: 75,
        hasSkills: [
          { name: 'JavaScript', hasSkill: true, proficiency: 90 },
          { name: 'React', hasSkill: true, proficiency: 85 },
          { name: 'Python', hasSkill: true, proficiency: 70 },
          { name: 'Git', hasSkill: true, proficiency: 80 },
          { name: 'Agile', hasSkill: true, proficiency: 75 }
        ],
        missingSkills: [
          { name: 'AWS', hasSkill: false },
          { name: 'Docker', hasSkill: false },
          { name: 'Kubernetes', hasSkill: false },
          { name: 'System Design', hasSkill: false }
        ],
        learningPaths: [
          {
            skill: 'AWS',
            priority: 'high',
            estimatedTime: '8-12 weeks',
            courses: [
              {
                name: 'AWS Certified Solutions Architect',
                provider: 'AWS Training',
                duration: '40 hours',
                level: 'Intermediate',
                url: 'https://aws.amazon.com/training'
              },
              {
                name: 'AWS for Beginners',
                provider: 'Udemy',
                duration: '20 hours',
                level: 'Beginner',
                url: 'https://udemy.com'
              }
            ]
          },
          {
            skill: 'Docker',
            priority: 'high',
            estimatedTime: '4-6 weeks',
            courses: [
              {
                name: 'Docker Mastery',
                provider: 'Udemy',
                duration: '12 hours',
                level: 'Beginner',
                url: 'https://udemy.com'
              },
              {
                name: 'Docker Deep Dive',
                provider: 'Pluralsight',
                duration: '8 hours',
                level: 'Intermediate',
                url: 'https://pluralsight.com'
              }
            ]
          },
          {
            skill: 'Kubernetes',
            priority: 'medium',
            estimatedTime: '6-8 weeks',
            courses: [
              {
                name: 'Kubernetes for Developers',
                provider: 'Coursera',
                duration: '30 hours',
                level: 'Intermediate',
                url: 'https://coursera.org'
              }
            ]
          },
          {
            skill: 'System Design',
            priority: 'high',
            estimatedTime: '10-14 weeks',
            courses: [
              {
                name: 'System Design Interview Prep',
                provider: 'educative.io',
                duration: '50 hours',
                level: 'Advanced',
                url: 'https://educative.io'
              }
            ]
          }
        ]
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl">Skill Gap Analyzer</h1>
              <p className="text-slate-600">Identify missing skills and get personalized learning paths</p>
            </div>
          </div>
        </motion.div>

        {!analysis ? (
          /* Input Section */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-600" />
                Job Description
              </h2>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[300px] mb-4"
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Your Resume / Skills
              </h2>
              <Textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume or list your skills here..."
                className="min-h-[300px] mb-4"
              />
            </Card>

            <div className="lg:col-span-2">
              <Button 
                onClick={analyzeSkills} 
                disabled={isAnalyzing}
                size="lg"
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Skills...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Analyze Skill Match
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Results Section */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Match Score */}
            <Card className="p-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl mb-2">Overall Match Score</h2>
                  <p className="text-blue-100">Based on your current skills</p>
                </div>
                <div className="text-6xl">{analysis.matchScore}%</div>
              </div>
              <div className="mt-4">
                <Progress value={analysis.matchScore} className="h-3 bg-white/20" />
              </div>
            </Card>

            {/* Skills Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Has Skills */}
              <Card className="p-6">
                <h3 className="flex items-center gap-2 mb-4 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Skills You Have ({analysis.hasSkills.length})
                </h3>
                <div className="space-y-3">
                  {analysis.hasSkills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <span className="text-sm text-slate-600">{skill.proficiency}%</span>
                      </div>
                      <Progress value={skill.proficiency} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Missing Skills */}
              <Card className="p-6">
                <h3 className="flex items-center gap-2 mb-4 text-orange-600">
                  <AlertCircle className="w-5 h-5" />
                  Skills to Learn ({analysis.missingSkills.length})
                </h3>
                <div className="space-y-2">
                  {analysis.missingSkills.map((skill) => (
                    <div 
                      key={skill.name}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <span>{skill.name}</span>
                      <Badge variant="outline" className="bg-white">Required</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Learning Paths */}
            <Card className="p-6">
              <h3 className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-purple-600" />
                Personalized Learning Paths
              </h3>
              <div className="space-y-6">
                {analysis.learningPaths.map((path, index) => (
                  <motion.div
                    key={path.skill}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl">{path.skill}</h4>
                          <Badge className={`${getPriorityColor(path.priority)} border`}>
                            {path.priority} priority
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>Estimated time: {path.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-sm text-slate-600">Recommended Courses:</h5>
                      {path.courses.map((course, idx) => (
                        <div 
                          key={idx}
                          className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h6>{course.name}</h6>
                              <Badge variant="secondary" className="text-xs">
                                {course.level}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600">
                              {course.provider} • {course.duration}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <a href={course.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Time Estimate Summary */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <h3 className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Your Path to Job Ready
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-1">{analysis.hasSkills.length}</div>
                  <div className="text-sm text-slate-600">Skills Mastered</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-1">{analysis.missingSkills.length}</div>
                  <div className="text-sm text-slate-600">Skills to Learn</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-1">3-4 mo</div>
                  <div className="text-sm text-slate-600">Estimated Timeline</div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setAnalysis(null)}
                className="flex-1"
              >
                Analyze Another Job
              </Button>
              <Button className="flex-1">
                Save Learning Plan
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
