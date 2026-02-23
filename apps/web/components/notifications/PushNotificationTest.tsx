'use client';

import { useMutation } from 'convex/react';
import { Bell, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from 'backend/convex/_generated/api';

export function PushNotificationTest() {
  const [title, setTitle] = useState('Test Notification');
  const [content, setContent] = useState(
    'This is a test push notification from Flickmart!'
  );
  const [type, setType] = useState<'new_message' | 'new_sale' | 'reminder'>(
    'new_message'
  );
  const [link, setLink] = useState('/notifications');
  const [isLoading, setIsLoading] = useState(false);

  const createTestNotification = useMutation(
    api.notifications.createTestNotificationWithPush
  );

  const handleSendTest = async () => {
    if (!(title.trim() && content.trim())) {
      toast.error('Please fill in title and content');
      return;
    }

    setIsLoading(true);
    try {
      await createTestNotification({
        type,
        title: title.trim(),
        content: content.trim(),
        link: link.trim() || undefined,
        sendPush: true,
      });

      toast.success('Test notification sent to all your devices!');
    } catch (error) {
      toast.error('Failed to send test notification');
      console.error('Error sending test notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Test Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
            value={title}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Notification content"
            rows={3}
            value={content}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={(value: any) => setType(value)} value={type}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new_message">New Message</SelectItem>
              <SelectItem value="new_sale">New Sale</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link (optional)</Label>
          <Input
            id="link"
            onChange={(e) => setLink(e.target.value)}
            placeholder="/notifications"
            value={link}
          />
        </div>

        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleSendTest}
        >
          <Send className="mr-2 h-4 w-4" />
          {isLoading ? 'Sending...' : 'Send Test Notification'}
        </Button>

        <div className="text-muted-foreground text-sm">
          This will send a test notification to all devices where you have
          enabled notifications.
        </div>
      </CardContent>
    </Card>
  );
}
