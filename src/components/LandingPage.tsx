import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AIWorkflowGuide } from './AIWorkflowGuide';
import { Logo } from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" animated={false} />
            <div className="flex items-center gap-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">How It Works</Button>
              <Button onClick={onGetStarted}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by AWS Bedrock AI
              </Badge>
              <h1 className="text-5xl lg:text-6xl tracking-tight">
                Your AI Career Agent
                <span className="block text-blue-600 mt-2">Find. Optimize. Succeed.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-xl">
                Leverage AWS Bedrock AI to discover perfect job matches, optimize your resume,
                and accelerate your career journey with intelligent automation.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl text-blue-600">10K+</div>
                  <div className="text-sm text-slate-600">Jobs Matched</div>
                </div>
                <div>
                  <div className="text-3xl text-blue-600">94%</div>
                  <div className="text-sm text-slate-600">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl text-blue-600">2.5x</div>
                  <div className="text-sm text-slate-600">Faster Hiring</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1722149493669-30098ef78f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYXJlZXIlMjBidXNpbmVzc3xlbnwxfHx8fDE3NjEwMjg2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional career success"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Workflow Guide - Interactive Visualization */}
      <AIWorkflowGuide />

      {/* Technology Stack */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Technology Stack</Badge>
            <h2 className="text-4xl mb-4">Built on AWS Serverless Architecture</h2>
            <p className="text-xl text-slate-600">
              Enterprise-grade infrastructure for reliability and scalability
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              'AWS Bedrock',
              'AWS Lambda',
              'DynamoDB',
              'Amazon S3',
              'API Gateway',
              'Amazon Cognito',
              'OpenSearch',
              'Step Functions',
              'CloudWatch',
              'CloudFormation',
            ].map(tech => (
              <div
                key={tech}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-sm">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl mb-4">Ready to Accelerate Your Career?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who found their dream jobs with AI assistance
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-slate-100"
          >
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
}
