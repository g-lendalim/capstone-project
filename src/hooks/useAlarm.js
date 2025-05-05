import { useRef, useEffect } from 'react';

export default function useAlarm(alarmTime, callback, reminderTime, isDisabled) {
  const isRinging = useRef(false);

  useEffect(() => {
    if (!isDisabled) {
      isRinging.current = false;
    }
  }, [alarmTime, reminderTime, isDisabled]);

  useEffect(() => {
    if (isDisabled || isRinging.current) return;

    const now = new Date();

    let targetTime;
    try {
      targetTime = reminderTime 
      ? (reminderTime instanceof Date ? reminderTime : new Date(reminderTime))
      : (alarmTime instanceof Date ? alarmTime : new Date(alarmTime));
    } catch (error) {
      console.warn('Error parsing date:', error);
      return;
    }

    console.log('Alarm Time:', alarmTime);
    console.log('Reminder Time:', reminderTime);
    console.log('Target Time:', targetTime);

    if (isNaN(targetTime.getTime())) {
      console.warn('Invalid alarm/reminder time:', reminderTime || alarmTime);
      return;
    }

    const delay = targetTime.getTime() - now.getTime();

    if (delay <= 0) {
      callback();
      isRinging.current = true;
      return;
    }

    const timer = setTimeout(() => {
      if (!isRinging.current && !isDisabled) {
        callback();
        isRinging.current = true;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [alarmTime, callback, reminderTime, isDisabled]);
}