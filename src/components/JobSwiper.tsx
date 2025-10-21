import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  Heart, 
  X, 
  MapPin, 
  Building2, 
  DollarSign, 
  Briefcase,
  Clock,
  Star,
  Undo,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  matchScore: number;
  description: string;
  tags: string[];
  logo?: string;
  postedDays: number;
}

export function JobSwiper() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      company: 'Amazon Web Services',
      position: 'Senior Software Engineer',
      location: 'Seattle, WA',
      salary: '$140k - $180k',
      type: 'Full-time',
      experience: '5+ years',
      matchScore: 95,
      description: 'Join our team building next-generation cloud infrastructure. Work with cutting-edge technologies and solve problems at scale.',
      tags: ['AWS', 'Python', 'Kubernetes', 'Distributed Systems'],
      postedDays: 2
    },
    {
      id: '2',
      company: 'Google',
      position: 'Frontend Engineer',
      location: 'Mountain View, CA',
      salary: '$130k - $170k',
      type: 'Full-time',
      experience: '3+ years',
      matchScore: 88,
      description: 'Build beautiful, fast, and accessible web applications used by millions. Collaborate with designers and product managers.',
      tags: ['React', 'TypeScript', 'CSS', 'Performance'],
      postedDays: 1
    },
    {
      id: '3',
      company: 'Microsoft',
      position: 'Cloud Solutions Architect',
      location: 'Redmond, WA',
      salary: '$150k - $190k',
      type: 'Full-time',
      experience: '7+ years',
      matchScore: 82,
      description: 'Design and implement enterprise cloud solutions for Fortune 500 clients. Lead technical discussions and architecture reviews.',
      tags: ['Azure', 'Architecture', 'DevOps', 'Leadership'],
      postedDays: 5
    },
    {
      id: '4',
      company: 'Meta',
      position: 'Full Stack Engineer',
      location: 'Menlo Park, CA',
      salary: '$135k - $175k',
      type: 'Full-time',
      experience: '4+ years',
      matchScore: 91,
      description: 'Build products that connect billions of people. Work on features from ideation to launch with high autonomy.',
      tags: ['React', 'Node.js', 'GraphQL', 'Mobile'],
      postedDays: 3
    },
    {
      id: '5',
      company: 'Apple',
      position: 'iOS Engineer',
      location: 'Cupertino, CA',
      salary: '$145k - $185k',
      type: 'Full-time',
      experience: '5+ years',
      matchScore: 79,
      description: 'Create amazing user experiences for millions of Apple users. Work with the latest iOS technologies and frameworks.',
      tags: ['Swift', 'iOS', 'UIKit', 'SwiftUI'],
      postedDays: 7
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const [passedJobs, setPassedJobs] = useState<Job[]>([]);
  const [lastAction, setLastAction] = useState<'like' | 'pass' | null>(null);

  const currentJob = jobs[currentIndex];

  const handleLike = () => {
    if (currentJob) {
      setLikedJobs([...likedJobs, currentJob]);
      setLastAction('like');
      toast.success(`❤️ Saved ${currentJob.position} at ${currentJob.company}`);
      nextCard();
    }
  };

  const handlePass = () => {
    if (currentJob) {
      setPassedJobs([...passedJobs, currentJob]);
      setLastAction('pass');
      nextCard();
    }
  };

  const handleUndo = () => {
    if (lastAction === 'like' && likedJobs.length > 0) {
      const lastLiked = likedJobs[likedJobs.length - 1];
      setLikedJobs(likedJobs.slice(0, -1));
      setCurrentIndex(Math.max(0, currentIndex - 1));
      setLastAction(null);
      toast.success('Undone!');
    } else if (lastAction === 'pass' && passedJobs.length > 0) {
      setPassedJobs(passedJobs.slice(0, -1));
      setCurrentIndex(Math.max(0, currentIndex - 1));
      setLastAction(null);
      toast.success('Undone!');
    }
  };

  const nextCard = () => {
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl">Job Swiper</h1>
          </div>
          <p className="text-slate-600">Swipe right on jobs you love ❤️</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl">{jobs.length - currentIndex}</div>
            <div className="text-sm text-slate-600">Remaining</div>
          </Card>
          <Card className="p-4 text-center bg-green-50 border-green-200">
            <div className="text-2xl text-green-600">{likedJobs.length}</div>
            <div className="text-sm text-green-600">Liked</div>
          </Card>
          <Card className="p-4 text-center bg-slate-50 border-slate-200">
            <div className="text-2xl text-slate-600">{passedJobs.length}</div>
            <div className="text-sm text-slate-600">Passed</div>
          </Card>
        </div>

        {/* Card Stack */}
        <div className="relative h-[600px] mb-8">
          <AnimatePresence>
            {currentIndex < jobs.length ? (
              <>
                {/* Show next card behind */}
                {jobs[currentIndex + 1] && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{ scale: 0.95, opacity: 0.5 }}
                  >
                    <Card className="w-full max-w-md h-[550px] p-8 opacity-50">
                      <div className="flex flex-col h-full">
                        <div className="text-center text-slate-400">
                          Next: {jobs[currentIndex + 1].company}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Current card */}
                <SwipeCard
                  job={currentJob}
                  onLike={handleLike}
                  onPass={handlePass}
                  getMatchScoreColor={getMatchScoreColor}
                />
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-full"
              >
                <Card className="w-full max-w-md p-12 text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  <h2 className="text-2xl mb-2">All Done! 🎉</h2>
                  <p className="text-slate-600 mb-6">
                    You've reviewed all available jobs. Check your liked jobs or come back later for more!
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full">
                      View {likedJobs.length} Liked Jobs
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setCurrentIndex(0)}>
                      Review Again
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        {currentIndex < jobs.length && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center gap-4"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleUndo}
              disabled={!lastAction}
              className="rounded-full w-16 h-16 p-0"
            >
              <Undo className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handlePass}
              className="rounded-full w-20 h-20 p-0 border-2 border-red-200 hover:bg-red-50"
            >
              <X className="w-8 h-8 text-red-500" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLike}
              className="rounded-full w-20 h-20 p-0 border-2 border-green-200 hover:bg-green-50"
            >
              <Heart className="w-8 h-8 text-green-500" />
            </Button>
          </motion.div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-slate-500"
        >
          Pro tip: Use ← (pass) and → (like) arrow keys
        </motion.div>
      </div>
    </div>
  );
}

interface SwipeCardProps {
  job: Job;
  onLike: () => void;
  onPass: () => void;
  getMatchScoreColor: (score: number) => string;
}

function SwipeCard({ job, onLike, onPass, getMatchScoreColor }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onLike();
    } else if (info.offset.x < -100) {
      onPass();
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="w-full max-w-md h-[550px] p-8 bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg text-slate-600">{job.company}</h3>
              </div>
              <h2 className="text-2xl mb-2">{job.position}</h2>
            </div>
            <Badge className={`${getMatchScoreColor(job.matchScore)} border-0 px-3 py-1`}>
              <Star className="w-3 h-3 mr-1" />
              {job.matchScore}%
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{job.postedDays}d ago</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>{job.experience} experience</span>
          </div>

          {/* Description */}
          <div className="flex-1 mb-4">
            <h4 className="text-sm mb-2 text-slate-600">Description</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-sm mb-2 text-slate-600">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Swipe Hint */}
          <div className="mt-4 pt-4 border-t text-center text-xs text-slate-400">
            ← Swipe left to pass • Swipe right to like →
          </div>
        </div>
      </Card>

      {/* Like/Pass Overlays */}
      <motion.div
        style={{ x }}
        className="absolute top-16 right-16 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: useTransform(x, [0, 100], [0, 1]),
            scale: useTransform(x, [0, 100], [0.5, 1])
          }}
          className="bg-green-500 text-white px-6 py-3 rounded-xl rotate-12 border-4 border-white shadow-lg"
        >
          <span className="text-2xl">LIKE</span>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x }}
        className="absolute top-16 left-16 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: useTransform(x, [-100, 0], [1, 0]),
            scale: useTransform(x, [-100, 0], [1, 0.5])
          }}
          className="bg-red-500 text-white px-6 py-3 rounded-xl -rotate-12 border-4 border-white shadow-lg"
        >
          <span className="text-2xl">PASS</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
