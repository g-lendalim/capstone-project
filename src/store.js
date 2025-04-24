import { configureStore } from '@reduxjs/toolkit';
import logsReducer from './features/logs/logsSlice';

export default configureStore({
  reducer: {
    logs: logsReducer,
  },
});
