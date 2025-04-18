import { useEffect } from 'react';

const useAlarm = (alarmTime, callback) => {
  useEffect(() => {
    const now = new Date();
    const alarmDate = new Date(alarmTime);

    const delay = alarmDate.getTime() - now.getTime();

    if (delay > 0) {
      const timer = setTimeout(callback, delay);
      return () => clearTimeout(timer);
    }
  }, [alarmTime, callback]);
};

export default useAlarm;
