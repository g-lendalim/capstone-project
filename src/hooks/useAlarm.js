import { useEffect, useRef } from 'react';

export default function useAlarm(alarmTime, callback, reminderTime = null, disabled = false) {
  const isRinging = useRef(false);

  useEffect(() => {
    if (disabled || isRinging.current) return;
    
    const now = new Date();
    const targetTime = new Date(reminderTime || alarmTime);
    
    console.log('Alarm Time:', alarmTime);
    console.log('Reminder Time:', reminderTime);
    console.log('Target Time:', targetTime);

    if (isNaN(targetTime)) {
      console.warn('Invalid alarm/reminder time:', reminderTime || alarmTime);
      return;
    }

    const delay = targetTime.getTime() - now.getTime();

    if (delay <= 0) {
      // If it's already time or past due, trigger immediately
      callback();
      isRinging.current = true;
      return;
    }

    const timer = setTimeout(() => {
      if (!isRinging.current && !disabled) {
        callback();
        isRinging.current = true;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [alarmTime, callback, reminderTime, disabled]);
};



