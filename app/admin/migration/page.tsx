"use client";

import { PushNotificationMigration } from "@/components/admin/PushNotificationMigration";

export default function MigrationPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Database Migrations</h1>
      <PushNotificationMigration />
    </div>
  );
}
