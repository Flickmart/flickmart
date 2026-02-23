import type { Notification } from '@/app/(main-pages)/notifications/page';
import SingleNotification from './SingleNotification';

const Day = ({
  day,
  notifications,
}: {
  day: string;
  notifications: Notification[];
}) => {
  return (
    <section className="mt-8">
      <h2 className="pl-4 font-semibold text-flickmart text-lg sm:px-6 sm:text-3xl">
        {day}
      </h2>
      <ul>
        {notifications.map((notification, index) => (
          <SingleNotification key={index} notification={notification} />
        ))}
      </ul>
    </section>
  );
};
export default Day;
