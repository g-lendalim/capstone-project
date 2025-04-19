import { useEffect } from 'react';

const useAlarm = (alarmTime, callback, reminderTime = null) => {
  useEffect(() => {
    const now = new Date();

    const targetTime = new Date(reminderTime || alarmTime);
    if (isNaN(targetTime)) {
      console.warn('Invalid alarm/reminder time:', reminderTime || alarmTime);
      return;
    }

    const delay = targetTime.getTime() - now.getTime();

    if (delay <= 0) {
      // If it's already time or past due, trigger immediately
      callback();
      return;
    }

    const timer = setTimeout(callback, delay);

    return () => clearTimeout(timer);
  }, [alarmTime, callback, reminderTime]);
};

export default useAlarm;

