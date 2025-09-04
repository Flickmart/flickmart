"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Database, Play } from "lucide-react";

export function PushNotificationMigration() {
  const [isRunning, setIsRunning] = useState(false);
  const migratePushSubscriptions = useMutation(
    api.notifications.migratePushSubscriptions
  );

  const handleMigration = async () => {
    setIsRunning(true);
    try {
      const result = await migratePushSubscriptions({});
      toast.success(
        `Migration completed! Updated ${result.migrated} subscriptions`
      );
    } catch (error) {
      toast.error("Migration failed");
      console.error("Migration error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Push Notification Migration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          This migration updates existing push subscriptions to support the new
          multi-device format. It adds missing endpoint, isActive, and lastUsed
          fields.
        </div>

        <Button
          onClick={handleMigration}
          disabled={isRunning}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? "Running Migration..." : "Run Migration"}
        </Button>

        <div className="text-xs text-muted-foreground">
          Note: This is a one-time migration and is safe to run multiple times.
        </div>
      </CardContent>
    </Card>
  );
}
