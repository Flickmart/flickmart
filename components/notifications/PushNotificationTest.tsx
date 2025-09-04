"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, Send } from "lucide-react";

export function PushNotificationTest() {
  const [title, setTitle] = useState("Test Notification");
  const [content, setContent] = useState(
    "This is a test push notification from Flickmart!"
  );
  const [type, setType] = useState<"new_message" | "new_sale" | "reminder">(
    "new_message"
  );
  const [link, setLink] = useState("/notifications");
  const [isLoading, setIsLoading] = useState(false);

  const createTestNotification = useMutation(
    api.notifications.createTestNotificationWithPush
  );

  const handleSendTest = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in title and content");
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

      toast.success("Test notification sent to all your devices!");
    } catch (error) {
      toast.error("Failed to send test notification");
      console.error("Error sending test notification:", error);
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Notification content"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={(value: any) => setType(value)}>
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
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="/notifications"
          />
        </div>

        <Button
          onClick={handleSendTest}
          disabled={isLoading}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? "Sending..." : "Send Test Notification"}
        </Button>

        <div className="text-sm text-muted-foreground">
          This will send a test notification to all devices where you have
          enabled notifications.
        </div>
      </CardContent>
    </Card>
  );
}
