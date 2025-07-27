import React from "react";
const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="overflow-hidden">{children}</div>;
};

export default ChatLayout;
