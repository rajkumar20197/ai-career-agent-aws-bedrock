import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Zap,
  Target,
} from 'lucide-react';
import { BedrockService } from '../services/bedrockService';
import type { ResumeAnalysis } from '../types';

export function ResumeOptimizer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsAnalyzing(true);

    // Simulate reading file content
    const mockResumeText = `
      John Doe
      Software Engineer
      Experience: 3 years in web development
      Skills: JavaScript, React, Node.js, AWS
    `;

    try {
      const analysisResult = await BedrockService.analyzeResume(mockResumeText);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">AI Resume Optimizer</h1>
        <p className="text-slate-600">
          Get AI-powered resume analysis and optimization using AWS Bedrock
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl mb-4">Upload Resume</h2>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="mb-1">Click to upload resume</p>
                <p className="text-sm text-slate-500">PDF, DOC, or DOCX (max 5MB)</p>
              </label>
            </div>

            {uploadedFileName && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm">{uploadedFileName}</span>
              </div>
            )}

            {isAnalyzing && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-sm">Analyzing with AWS Bedrock...</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>
            )}

            <div className="mt-6 space-y-3">
              <h3 className="text-sm">Quick Actions</h3>
              <Button variant="outline" className="w-full justify-start" disabled={!analysis}>
                <Download className="w-4 h-4 mr-2" />
                Download Optimized Resume
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!analysis}>
                <Target className="w-4 h-4 mr-2" />
                Tailor for Job
              </Button>
            </div>
          </Card>
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-2">
          {!analysis ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl mb-2">No Resume Uploaded</h3>
              <p className="text-slate-600 mb-6">
                Upload your resume to get AI-powered analysis and optimization suggestions
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="bg-blue-50 rounded-lg p-4">
                  <Zap className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="text-sm mb-1">ATS Scoring</h4>
                  <p className="text-xs text-slate-600">
                    Check compatibility with Applicant Tracking Systems
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <Sparkles className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="text-sm mb-1">AI Optimization</h4>
                  <p className="text-xs text-slate-600">
                    Get intelligent suggestions using AWS Bedrock
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <Target className="w-6 h-6 text-green-600 mb-2" />
                  <h4 className="text-sm mb-1">Job Tailoring</h4>
                  <p className="text-xs text-slate-600">
                    Customize resume for specific job postings
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Overall Scores */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl">AI Analysis Results</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className={`text-4xl mb-1 ${getScoreColor(analysis.atsScore)}`}>
                      {analysis.atsScore}
                    </div>
                    <div className="text-sm text-slate-600">ATS Score</div>
                    <Progress value={analysis.atsScore} className="mt-2 h-2" />
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className={`text-4xl mb-1 ${getScoreColor(analysis.formatScore)}`}>
                      {analysis.formatScore}
                    </div>
                    <div className="text-sm text-slate-600">Format Score</div>
                    <Progress value={analysis.formatScore} className="mt-2 h-2" />
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className={`text-4xl mb-1 ${getScoreColor(analysis.contentScore)}`}>
                      {analysis.contentScore}
                    </div>
                    <div className="text-sm text-slate-600">Content Score</div>
                    <Progress value={analysis.contentScore} className="mt-2 h-2" />
                  </div>
                </div>

                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    Your resume has a good foundation. Focus on the suggestions below to improve ATS compatibility and content impact.
                  </AlertDescription>
                </Alert>
              </Card>

              {/* Detailed Analysis */}
              <Card className="p-6">
                <Tabs defaultValue="strengths">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="strengths" className="space-y-3 mt-4">
                    {analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{strength}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="weaknesses" className="space-y-3 mt-4">
                    {analysis.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{weakness}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="suggestions" className="space-y-3 mt-4">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Keyword Analysis */}
              <Card className="p-6">
                <h3 className="mb-4">Keyword Optimization</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Keyword Match Rate</span>
                      <span>{analysis.keywordMatch}%</span>
                    </div>
                    <Progress value={analysis.keywordMatch} />
                  </div>
                  <p className="text-sm text-slate-600">
                    Your resume contains {analysis.keywordMatch}% of the common keywords for your target role.
                    Consider adding more industry-specific terms to improve ATS compatibility.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['JavaScript', 'AWS', 'React', 'Leadership', 'Agile', 'System Design'].map(keyword => (
                      <Badge key={keyword} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
