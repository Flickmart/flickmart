"use client";

import { useEffect, useState } from "react";
import { getCurrentSession, getAllSessions } from "@/utils/session";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export function SessionInfo() {
  const [session, setSession] = useState<Session | null>(null);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [browserInfo, setBrowserInfo] = useState({
    browser: '',
    os: '',
    location: 'Unknown'
  });
  const supabase = createClient();

  useEffect(() => {
    const loadSessions = async () => {
      const currentSession = await getCurrentSession();
      const sessions = await getAllSessions();
      setSession(currentSession);
      setAllSessions(sessions.filter(s => s.access_token !== currentSession?.access_token));
    };

    const detectBrowser = () => {
      const userAgent = window.navigator.userAgent;
      let browser = 'Unknown';
      let os = 'Unknown';

      // Detect browser
      if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
      else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
      else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
      else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
      else if (userAgent.indexOf('Arc') > -1) browser = 'Arc';

      // Detect OS
      if (userAgent.indexOf('Windows') > -1) os = 'Windows';
      else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
      else if (userAgent.indexOf('Linux') > -1) os = 'Linux';

      setBrowserInfo(prev => ({ ...prev, browser, os }));
    };

    loadSessions();
    detectBrowser();
  }, []);

  if (!session) {
    return null;
  }

  const getBrowserInitials = (browser: string) => {
    if (browser === 'Chrome') return 'CH';
    if (browser === 'Firefox') return 'FF';
    if (browser === 'Safari') return 'SF';
    if (browser === 'Edge') return 'ED';
    if (browser === 'Arc') return 'Arc';
    return browser.substring(0, 2).toUpperCase();
  };

  const getBrowserColor = (browser: string) => {
    switch (browser) {
      case 'Chrome': return 'bg-gray-100 text-gray-800';
      case 'Firefox': return 'bg-orange-100 text-orange-800';
      case 'Safari': return 'bg-blue-100 text-blue-800';
      case 'Edge': return 'bg-blue-100 text-blue-800';
      case 'Arc': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSignOut = async (sessionId?: string) => {
    if (sessionId) {
      // Sign out specific session
      await supabase.auth.admin.signOut(sessionId);
      setAllSessions(prev => prev.filter(s => s.access_token !== sessionId));
    } else {
      // Sign out current session
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-md flex items-center justify-center ${getBrowserColor(browserInfo.browser)}`}>
              <span className="text-xs font-bold">{getBrowserInitials(browserInfo.browser)}</span>
            </div>
            <div>
              <p className="font-medium">{browserInfo.browser} on {browserInfo.os}</p>
              <p className="text-xs text-muted-foreground">Current session • {browserInfo.location}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleSignOut()}>Sign out</Button>
        </div>
        <div className="space-y-2 mt-4 text-sm text-muted-foreground">
          <p>Last sign in: {new Date(session.user.last_sign_in_at || "").toLocaleString()}</p>
          <p>Session expires: {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Not available'}</p>
        </div>
      </div>

      {allSessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Other active sessions</h3>
          {allSessions.map((otherSession: Session) => (
            <div key={otherSession.access_token} className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center ${getBrowserColor(browserInfo.browser)}`}>
                    <span className="text-xs font-bold">{getBrowserInitials(browserInfo.browser)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{browserInfo.browser} on {browserInfo.os}</p>
                    <p className="text-xs text-muted-foreground">Active session • {browserInfo.location}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSignOut(otherSession.access_token)}
                >
                  Sign out
                </Button>
              </div>
              <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                <p>Last sign in: {new Date(otherSession.user.last_sign_in_at || "").toLocaleString()}</p>
                <p>Session expires: {otherSession.expires_at ? new Date(otherSession.expires_at * 1000).toLocaleString() : 'Not available'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}