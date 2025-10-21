import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, DollarSign, Target, Briefcase, Award, Zap } from 'lucide-react';
import { mockMarketData } from '../services/mockData';

export function MarketIntelligence() {
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const formatSalary = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Market Intelligence Dashboard</h1>
        <p className="text-slate-600">
          Real-time insights powered by AI analysis of job market trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <Badge className="bg-green-100 text-green-700">+8.5%</Badge>
          </div>
          <p className="text-2xl">$120k</p>
          <p className="text-sm text-slate-600">Avg Salary (SF)</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-700">+15.2%</Badge>
          </div>
          <p className="text-2xl">React</p>
          <p className="text-sm text-slate-600">Top Skill Demand</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-8 h-8 text-purple-600" />
            <Badge className="bg-purple-100 text-purple-700">+14.5%</Badge>
          </div>
          <p className="text-2xl">15.4k</p>
          <p className="text-sm text-slate-600">Tech Jobs Posted</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-orange-600" />
            <Badge className="bg-orange-100 text-orange-700">Hot</Badge>
          </div>
          <p className="text-2xl">3-4 wks</p>
          <p className="text-sm text-slate-600">Avg Time to Hire</p>
        </Card>
      </div>

      <Tabs defaultValue="salary">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="salary">Salary Trends</TabsTrigger>
          <TabsTrigger value="skills">Skills Demand</TabsTrigger>
          <TabsTrigger value="industry">Industry Insights</TabsTrigger>
        </TabsList>

        {/* Salary Trends Tab */}
        <TabsContent value="salary" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl">Salary Trends by Role & Location</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockMarketData.salaryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" angle={-20} textAnchor="end" height={100} />
                <YAxis tickFormatter={formatSalary} />
                <Tooltip formatter={(value: number) => formatSalary(value)} />
                <Legend />
                <Bar dataKey="avgSalary" fill="#3b82f6" name="Average Salary" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="mb-4">Salary Growth by Location</h3>
              <div className="space-y-3">
                {mockMarketData.salaryTrends.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm">{item.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 bg-slate-200 rounded-full flex-1">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${item.trend * 8}%` }}
                          />
                        </div>
                        <span className="text-xs text-green-600">+{item.trend}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Market Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-900 mb-1">Remote roles increased by 45%</p>
                    <p className="text-blue-700">Salary premium of $15k on average</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Award className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-green-900 mb-1">Senior positions up 18%</p>
                    <p className="text-green-700">Strong demand for experienced talent</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-purple-900 mb-1">Tech hubs expanding</p>
                    <p className="text-purple-700">Austin and Denver seeing rapid growth</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Skills Demand Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl">Skills in High Demand</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mockMarketData.skillDemand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="demand"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Demand Score"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Growth %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="mb-4">Top Growing Skills</h3>
              <div className="space-y-3">
                {mockMarketData.skillDemand
                  .sort((a, b) => b.growth - a.growth)
                  .slice(0, 5)
                  .map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{skill.skill}</span>
                        <Badge className="bg-green-100 text-green-700">+{skill.growth}%</Badge>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full transition-all"
                          style={{ width: `${Math.min(skill.growth * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Skill Demand Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mockMarketData.skillDemand.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={entry => entry.skill}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="demand"
                  >
                    {mockMarketData.skillDemand.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Industry Insights Tab */}
        <TabsContent value="industry" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl">Industry Job Market Analysis</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockMarketData.industryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="industry" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" tickFormatter={formatSalary} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="jobCount" fill="#8b5cf6" name="Job Count" />
                <Bar yAxisId="right" dataKey="avgSalary" fill="#10b981" name="Avg Salary" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            {mockMarketData.industryTrends.map((industry, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3>{industry.industry}</h3>
                  <Badge
                    className={
                      industry.growth > 15
                        ? 'bg-green-100 text-green-700'
                        : industry.growth > 10
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }
                  >
                    +{industry.growth}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Job Openings</span>
                    <span>{industry.jobCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Avg Salary</span>
                    <span>{formatSalary(industry.avgSalary)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
