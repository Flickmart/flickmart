export interface Chat {
  userId: string;
  chatId: string;
  avatar: string;
  name: string;
  preview: string;
  timestamp: string;
  unread: number;
}
export interface Profile {
  userId: string;
  avatar: string;
  name: string;
  desc: string;
  products: undefined[];
}

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
