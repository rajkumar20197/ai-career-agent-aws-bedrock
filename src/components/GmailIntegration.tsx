import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  Mail,
  Calendar,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  Video,
  AlertCircle,
} from 'lucide-react';
import { mockEmails, mockCalendarEvents } from '../services/mockData';
import type { EmailNotification, CalendarEvent } from '../types';

export function GmailIntegration() {
  const [emails] = useState<EmailNotification[]>(mockEmails);
  const [events] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [isConnected, setIsConnected] = useState(true);

  const getEmailIcon = (type: EmailNotification['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-5 h-5 text-purple-600" />;
      case 'application-update':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'job-alert':
        return <Sparkles className="w-5 h-5 text-yellow-600" />;
      default:
        return <Mail className="w-5 h-5 text-slate-600" />;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'interview':
        return 'bg-purple-100 text-purple-700';
      case 'networking':
        return 'bg-blue-100 text-blue-700';
      case 'deadline':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Gmail & Calendar Integration</h1>
        <p className="text-slate-600">
          Automated interview detection and smart scheduling powered by AI
        </p>
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-900">
            <div className="flex items-center justify-between">
              <span>Connect your Gmail account to enable automated interview detection</span>
              <Button onClick={() => setIsConnected(true)}>Connect Gmail</Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            Gmail connected successfully • Last synced: Just now
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-8 h-8 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-700">{emails.length} new</Badge>
          </div>
          <p className="text-2xl">{emails.length}</p>
          <p className="text-sm text-slate-600">Emails Scanned</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            <Badge className="bg-purple-100 text-purple-700">
              {emails.filter(e => e.type === 'interview').length}
            </Badge>
          </div>
          <p className="text-2xl">{events.filter(e => e.type === 'interview').length}</p>
          <p className="text-sm text-slate-600">Interview Invites</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8 text-orange-600" />
            <Badge className="bg-orange-100 text-orange-700">
              {emails.filter(e => e.actionRequired).length}
            </Badge>
          </div>
          <p className="text-2xl">{emails.filter(e => e.actionRequired).length}</p>
          <p className="text-sm text-slate-600">Action Required</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-8 h-8 text-green-600" />
            <Badge className="bg-green-100 text-green-700">AI</Badge>
          </div>
          <p className="text-2xl">92%</p>
          <p className="text-sm text-slate-600">Detection Accuracy</p>
        </Card>
      </div>

      <Tabs defaultValue="emails">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="emails">Email Inbox</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Events</TabsTrigger>
        </TabsList>

        {/* Emails Tab */}
        <TabsContent value="emails" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Recent Career-Related Emails</h2>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Sync Now
            </Button>
          </div>

          <div className="space-y-3">
            {emails.map(email => (
              <Card
                key={email.id}
                className={`p-4 ${email.actionRequired ? 'border-l-4 border-l-purple-500' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getEmailIcon(email.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="mb-1">{email.subject}</h3>
                        <p className="text-sm text-slate-600">From: {email.sender}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {email.type.replace('-', ' ')}
                        </Badge>
                        {email.actionRequired && (
                          <Badge className="bg-purple-100 text-purple-700">Action Required</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{email.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(email.receivedDate).toLocaleString()}
                      </div>
                      {email.calendarEvent && (
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          View in Calendar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {email.calendarEvent && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-purple-900 mb-2">
                          AI detected an interview invitation and created a calendar event
                        </p>
                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-purple-700">
                            <Calendar className="w-4 h-4" />
                            {email.calendarEvent.date} at {email.calendarEvent.time}
                          </div>
                          <div className="flex items-center gap-2 text-purple-700">
                            <MapPin className="w-4 h-4" />
                            {email.calendarEvent.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Upcoming Career Events</h2>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Google Calendar
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {events.map(event => (
              <Card key={event.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="mb-2">{event.title}</h3>
                    <p className="text-sm text-slate-600">{event.company}</p>
                  </div>
                  <Badge className={getEventTypeColor(event.type)} variant="secondary">
                    {event.type}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{event.location}</span>
                  </div>
                  {event.meetingLink && (
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4 text-slate-500" />
                      <a
                        href={event.meetingLink}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>

                {event.type === 'interview' && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="mb-1">AI Preparation Tips:</p>
                        <ul className="text-xs space-y-1 text-blue-700">
                          <li>• Review common interview questions</li>
                          <li>• Research {event.company}'s recent news</li>
                          <li>• Prepare questions for the interviewer</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" size="sm">
                    Reschedule
                  </Button>
                  <Button className="flex-1" size="sm">
                    Confirm
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Features */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="mb-2">AI-Powered Email Intelligence</h3>
            <p className="text-sm text-slate-600 mb-4">
              Our AWS Bedrock AI automatically scans your Gmail for interview invitations, application updates,
              and job alerts. When detected, it creates calendar events and sends you smart notifications.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-sm">Auto-detect interviews with 92% accuracy</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <Calendar className="w-5 h-5 text-purple-600 mb-2" />
                <p className="text-sm">Smart calendar event creation</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <Bell className="w-5 h-5 text-orange-600 mb-2" />
                <p className="text-sm">Real-time notification alerts</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
