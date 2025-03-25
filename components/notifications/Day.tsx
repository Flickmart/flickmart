import { Notification } from "@/app/notifications/page";
import SingleNotification from "./SingleNotification";

const Day = ({
  day,
  notifications,
}: {
  day: string;
  notifications: Notification[];
}) => {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-flickmart pl-4 sm:text-3xl sm:px-6">{day}</h2>
      <ul>
        {notifications.map((notification, index) => (
          <SingleNotification key={index} notification={notification} />
        ))}
      </ul>
    </section>
  );
};
export default Day;
