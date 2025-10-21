import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  RefreshCw,
  CheckCircle,
  Zap,
  Target
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function CoverLetterGenerator() {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [tone, setTone] = useState<'professional' | 'creative' | 'conversational'>('professional');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);

  const generateCoverLetter = async () => {
    if (!jobDescription.trim() || !companyName.trim() || !position.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with AWS Bedrock
    setTimeout(() => {
      const skills = ['Python', 'React', 'AWS', 'Leadership'];
      setHighlightedSkills(skills);

      const letters = {
        professional: `Dear Hiring Manager,

I am writing to express my strong interest in the ${position} position at ${companyName}. With a proven track record in software development and a passion for innovation, I am excited about the opportunity to contribute to your team's success.

Throughout my career, I have developed expertise in ${skills.join(', ')}, which directly aligns with the requirements outlined in your job description. My experience includes:

• Leading cross-functional teams to deliver high-impact projects on time and within budget
• Architecting scalable solutions that have served millions of users
• Implementing best practices in code quality, testing, and deployment

What particularly excites me about ${companyName} is your commitment to innovation and excellence in the technology sector. I am impressed by your recent achievements and would be thrilled to contribute to your continued growth.

I am confident that my technical skills, combined with my ability to collaborate effectively with diverse teams, make me an ideal candidate for this role. I look forward to the opportunity to discuss how my background and skills can contribute to ${companyName}'s success.

Thank you for considering my application. I am eager to discuss this opportunity further.

Sincerely,
[Your Name]`,
        creative: `Hello ${companyName} Team!

I couldn't contain my excitement when I discovered the ${position} opening at ${companyName}. This isn't just another job application – it's the perfect intersection of my skills, passion, and career aspirations.

Here's why we're a perfect match:

🚀 Technical Prowess: I bring hands-on expertise in ${skills.join(', ')}, with a track record of turning complex challenges into elegant solutions.

💡 Innovation Mindset: I don't just write code; I craft experiences that users love and teammates appreciate.

🤝 Team Player Extraordinaire: Whether it's mentoring junior developers or collaborating with cross-functional teams, I thrive in collaborative environments.

What draws me to ${companyName}? Your bold approach to solving real-world problems and your reputation for fostering innovation. I'm not looking for just any job – I'm looking for a place where I can make a meaningful impact, and ${companyName} is exactly that.

Let's create something amazing together!

Looking forward to connecting,
[Your Name]`,
        conversational: `Hi there,

I'm reaching out about the ${position} role at ${companyName}, and I have to say – it sounds like exactly what I've been looking for!

A bit about me: I've spent the last few years diving deep into ${skills.join(', ')}, and I genuinely love what I do. Whether it's architecting scalable systems or mentoring team members, I bring enthusiasm and expertise to every project.

What caught my eye about ${companyName} is how you're tackling [industry challenges] in innovative ways. I've been following your work, and I'm impressed by your approach to [specific aspect from job description]. It aligns perfectly with my own philosophy of building solutions that actually matter.

I'd love to chat more about how my experience could contribute to your team's goals. I think we could do some really interesting work together.

Thanks for taking the time to read this – I hope we can connect soon!

Best,
[Your Name]`
      };

      setGeneratedLetter(letters[tone]);
      setIsGenerating(false);
      toast.success('Cover letter generated!');
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success('Copied to clipboard!');
  };

  const downloadLetter = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${companyName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const regenerate = () => {
    generateCoverLetter();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl">AI Cover Letter Generator</h1>
              <p className="text-slate-600">Create personalized cover letters in seconds</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm">AI-Powered</h3>
                  <p className="text-xs text-slate-600">Uses AWS Bedrock</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm">Tailored</h3>
                  <p className="text-xs text-slate-600">Matches job description</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm">Instant</h3>
                  <p className="text-xs text-slate-600">Generated in seconds</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl mb-4">Job Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Amazon"
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here..."
                    className="min-h-[200px]"
                  />
                </div>

                <Button 
                  onClick={generateCoverLetter} 
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Generated Letter</h2>
                {generatedLetter && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadLetter}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={regenerate}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {generatedLetter ? (
                <div className="space-y-4">
                  {highlightedSkills.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Highlighted Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {highlightedSkills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white border rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedLetter}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                    <Button className="flex-1" onClick={downloadLetter}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <h3 className="text-lg mb-2 text-slate-600">No letter generated yet</h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    Fill in the job details on the left and click "Generate Cover Letter" to create your personalized cover letter
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <h3 className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Pro Tips for Better Results
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Include the complete job description for better matching</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Choose a tone that matches the company culture</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Review and personalize the generated letter before sending</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Update the placeholder [Your Name] with your actual name</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
