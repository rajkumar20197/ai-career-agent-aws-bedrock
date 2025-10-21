import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Brain, 
  Mail, 
  Calendar, 
  Search, 
  FileText, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  position: { x: number; y: number };
  connections: string[];
}

export function AIWorkflowGuide() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [animatedConnections, setAnimatedConnections] = useState<Set<string>>(new Set());

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'job-portals',
      title: 'Job Portals',
      description: 'LinkedIn, Indeed, Glassdoor',
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      position: { x: 0, y: 0 },
      connections: ['ai-brain']
    },
    {
      id: 'gmail',
      title: 'Gmail Scanner',
      description: 'Auto-detect interview emails',
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      position: { x: 0, y: 1 },
      connections: ['ai-brain']
    },
    {
      id: 'ai-brain',
      title: 'AWS Bedrock AI',
      description: 'Claude 3.5 Haiku Agent',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      position: { x: 1, y: 0.5 },
      connections: ['job-matching', 'resume-analysis', 'calendar']
    },
    {
      id: 'job-matching',
      title: 'Job Matching',
      description: '0-100 compatibility scores',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      position: { x: 2, y: 0 },
      connections: ['results']
    },
    {
      id: 'resume-analysis',
      title: 'Resume Optimizer',
      description: 'ATS analysis & tailoring',
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      position: { x: 2, y: 0.66 },
      connections: ['results']
    },
    {
      id: 'calendar',
      title: 'Calendar Sync',
      description: 'Auto-schedule interviews',
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      position: { x: 2, y: 1.33 },
      connections: ['results']
    },
    {
      id: 'results',
      title: 'Your Dashboard',
      description: 'Insights & recommendations',
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      position: { x: 3, y: 0.66 },
      connections: []
    }
  ];

  // Auto-animate through connections
  useEffect(() => {
    const interval = setInterval(() => {
      const allConnections = workflowSteps.flatMap(step => 
        step.connections.map(conn => `${step.id}-${conn}`)
      );
      const randomConnection = allConnections[Math.floor(Math.random() * allConnections.length)];
      
      setAnimatedConnections(prev => {
        const newSet = new Set(prev);
        newSet.add(randomConnection);
        setTimeout(() => {
          setAnimatedConnections(current => {
            const updated = new Set(current);
            updated.delete(randomConnection);
            return updated;
          });
        }, 1000);
        return newSet;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStepPosition = (step: WorkflowStep) => {
    const baseX = 100;
    const baseY = 80;
    const spacingX = 280;
    const spacingY = 180;
    
    return {
      left: `${baseX + step.position.x * spacingX}px`,
      top: `${baseY + step.position.y * spacingY}px`
    };
  };

  const getConnectionPath = (from: WorkflowStep, toId: string) => {
    const to = workflowSteps.find(s => s.id === toId);
    if (!to) return '';

    const fromPos = getStepPosition(from);
    const toPos = getStepPosition(to);
    
    const x1 = parseInt(fromPos.left) + 100;
    const y1 = parseInt(fromPos.top) + 60;
    const x2 = parseInt(toPos.left);
    const y2 = parseInt(toPos.top) + 60;
    
    const midX = (x1 + x2) / 2;
    
    return `M ${x1} ${y1} Q ${midX} ${y1}, ${midX} ${(y1 + y2) / 2} T ${x2} ${y2}`;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            <Sparkles className="w-3 h-3 mr-1" />
            How It Works
          </Badge>
          <h2 className="text-4xl mb-4">Your AI Career Agent in Action</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Watch how our AI autonomously connects job portals, analyzes your data, and delivers personalized career guidance
          </p>
        </div>

        {/* Workflow Visualization */}
        <div className="relative min-h-[600px] mb-16">
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {workflowSteps.map(step => 
              step.connections.map(connId => {
                const connectionKey = `${step.id}-${connId}`;
                const isActive = animatedConnections.has(connectionKey) || activeStep === step.id;
                
                return (
                  <g key={connectionKey}>
                    <motion.path
                      d={getConnectionPath(step, connId)}
                      fill="none"
                      stroke="url(#connectionGradient)"
                      strokeWidth={isActive ? "3" : "2"}
                      strokeDasharray={isActive ? "0" : "8 4"}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: isActive ? 1 : 0.3,
                      }}
                      transition={{ 
                        pathLength: { duration: 1.5, ease: "easeInOut" },
                        opacity: { duration: 0.3 }
                      }}
                    />
                    {isActive && (
                      <motion.circle
                        r="4"
                        fill="#8b5cf6"
                        filter="url(#glow)"
                      >
                        <animateMotion
                          dur="2s"
                          repeatCount="1"
                          path={getConnectionPath(step, connId)}
                        />
                      </motion.circle>
                    )}
                  </g>
                );
              })
            )}
          </svg>

          {/* Workflow Steps */}
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCentral = step.id === 'ai-brain';
            
            return (
              <motion.div
                key={step.id}
                className="absolute"
                style={getStepPosition(step)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className={`
                    w-[200px] p-4 cursor-pointer transition-all duration-300
                    ${isActive ? 'shadow-2xl scale-105 ring-2 ring-purple-400' : 'shadow-lg hover:shadow-xl hover:scale-102'}
                    ${isCentral ? 'ring-2 ring-purple-500 bg-gradient-to-br from-white to-purple-50' : 'bg-white'}
                  `}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Monitor Frame */}
                  <div className="relative">
                    {/* Screen */}
                    <div className={`
                      ${step.bgColor} rounded-lg p-3 mb-3 relative overflow-hidden
                      ${isActive ? 'animate-pulse' : ''}
                    `}>
                      {isCentral && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{ x: [-200, 200] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                      )}
                      <Icon className={`w-8 h-8 ${step.color} relative z-10`} />
                      
                      {/* Activity Indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Stand */}
                    <div className="h-2 w-16 bg-slate-200 rounded-full mx-auto mb-1" />
                    <div className="h-1 w-24 bg-slate-300 rounded-full mx-auto" />
                  </div>

                  {/* Content */}
                  <div className="text-center mt-3">
                    <h4 className="text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-slate-600">{step.description}</p>
                    
                    {isCentral && (
                      <Badge className="mt-2 bg-purple-600 text-white text-xs">
                        AI Core
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Step-by-Step Guide */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {[
            {
              step: '01',
              title: 'Data Collection',
              description: 'AI scans job portals and your Gmail for opportunities and interviews',
              icon: Search,
              color: 'blue'
            },
            {
              step: '02',
              title: 'AI Analysis',
              description: 'AWS Bedrock processes data using Claude 3.5 Haiku for intelligent insights',
              icon: Brain,
              color: 'purple'
            },
            {
              step: '03',
              title: 'Smart Matching',
              description: 'Autonomous job scoring, resume optimization, and calendar sync',
              icon: Zap,
              color: 'green'
            },
            {
              step: '04',
              title: 'Action',
              description: 'Get personalized recommendations and automated interview scheduling',
              icon: CheckCircle2,
              color: 'pink'
            }
          ].map((item, index) => {
            const StepIcon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${item.color}-100 mb-4`}>
                    <StepIcon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <div className={`text-2xl text-${item.color}-600 mb-2`}>{item.step}</div>
                  <h3 className="mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Real-time Activity Feed */}
        <motion.div
          className="mt-12 bg-white rounded-xl shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live AI Activity
            </h3>
            <Badge variant="outline">Real-time</Badge>
          </div>
          <div className="space-y-3">
            {[
              { text: 'Scanning LinkedIn for Software Engineer positions...', time: '2s ago', icon: Search },
              { text: 'Analyzing resume for ATS compatibility...', time: '5s ago', icon: FileText },
              { text: 'Detected interview email from Google...', time: '8s ago', icon: Mail },
              { text: 'Calculated compatibility score: 87/100', time: '12s ago', icon: Zap },
              { text: 'Synced interview to calendar for tomorrow 2 PM', time: '15s ago', icon: Calendar }
            ].map((activity, index) => {
              const ActivityIcon = activity.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ActivityIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
