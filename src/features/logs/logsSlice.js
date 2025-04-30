import { storage } from "../../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchLogsByUser = createAsyncThunk(
  "logs/fetchLogsByUser",
  async (userId) => {
    try {
      const res = await api.get(`/logs/user/${userId}`);
      return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
);

export const saveLog = createAsyncThunk(
  "logs/saveLog",
  async ({ userId, logData, file }) => {
    try {
      let imageUrl = "";

      if (file) {
        const imageRef = ref(storage, `logs/${file.name}`);
        const response = await uploadBytes(imageRef, file);
        imageUrl = await getDownloadURL(response.ref);
      }

      const flattenedLogData = {
        user_id: userId,
        image_url: imageUrl || logData.image_url || "", 
        sleep_hours: logData.sleep_log?.sleep_hours || 0,
        sleep_quality: logData.sleep_log?.sleep_quality || 0,
        night_awakenings: logData.sleep_log?.night_awakenings || 0,
        anxiety_level: logData.emotional_state?.anxiety_level || 0,
        irritability_level: logData.emotional_state?.irritability_level || 0,
        stress_level: logData.emotional_state?.stress_level || 0,
        cognitive_clarity: logData.cognitive_state?.cognitive_clarity || false,
        negative_thoughts: logData.cognitive_state?.negative_thoughts || false,
        intrusive_thoughts: logData.cognitive_state?.intrusive_thoughts || false,
        intrusive_thoughts_description: logData.cognitive_state?.intrusive_thoughts_description || "",
        social_interaction_level: logData.lifestyle_factors?.social_interaction_level || "none",
        physical_activity_level: logData.lifestyle_factors?.physical_activity_level || "none",
        screen_time_minutes: logData.lifestyle_factors?.screen_time_minutes || 0,
        substance_use: logData.lifestyle_factors?.substance_use || false,
        mood: logData.mood || 0,
        energy_level: logData.energy_level || 0,
        journal: logData.journal || "",
        medication_taken: logData.medication_taken || false,
        medication_details: logData?.medication_details || "",
        gratitude_entry: logData.gratitude_entry || "",
        psychotic_symptoms: logData.psychotic_symptoms || false,
      };

      console.log("🚀 Sending flattenedLogData to backend:", flattenedLogData); 

      const res = await api.post("/logs", flattenedLogData);
      return res.data;
    } catch (error) {
      console.error("Error saving log:", error.message);
      throw error;
    }
  }
);

export const updateLog = createAsyncThunk(
    "logs/updateLog",
    async ({ logId, newLogContent, newFile }) => {
      try {
        let newImageUrl = newLogContent.image_url || "";
  
        if (newFile) {
          const imageRef = ref(storage, `logs/${newFile.name}`);
          const response = await uploadBytes(imageRef, newFile);
          newImageUrl = await getDownloadURL(response.ref);
        }
  
        const updatedFields = {
          ...newLogContent,
          image_url: newImageUrl,
        };
        console.log("📤 Sending to backend:", updatedFields);
        const res = await api.put(`/logs/${logId}`, updatedFields);
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  );
  

export const deleteLog = createAsyncThunk(
  "logs/deleteLog",
  async (logId) => {
    try {
      await api.delete(`/logs/${logId}`);
      return logId;
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
);

const logsSlice = createSlice({
  name: "logs",
  initialState: {
    logs: [],
    loading: false,
    error: null,
    coreLogs: {
      mood: 0,
      energy_level: 0,
      sleep_log: {
        sleep_hours: 0,
        sleep_quality: 0,
        night_awakenings: 0,
      },
      medication_taken: false,
      journal: "",
    },
    extendedLogs: {
      emotional_state: {
        anxiety_level: 0,
        irritability_level: 0,
        stress_level: 0,
      },
      cognitive_state: {
        cognitive_clarity: false,
        negative_thoughts: false,
        intrusive_thoughts: false,
        intrusive_thoughts_description: "",
      },
      lifestyle_factors: {
        social_interaction_level: "",
        physical_activity_level: "",
        screen_time_minutes: 0,
        substance_use: false,
      },
      medication_details: "",
      gratitude_entry: "",
      psychotic_symptoms: false,
      image_url: "",
    },
  },
  reducers: {
    resetLogs: (state) => {
      state.coreLogs = {
        mood: 0,
        energy_level: 0,
        sleep_log: {
          sleep_hours: 0,
          sleep_quality: 0,
          night_awakenings: 0,
        },
        medication_taken: false,
        journal: "",
      };
      state.extendedLogs = {
        emotional_state: {
          anxiety_level: 0,
          irritability_level: 0,
          stress_level: 0,
        },
        cognitive_state: {
          cognitive_clarity: false,
          negative_thoughts: false,
          intrusive_thoughts: false,
          intrusive_thoughts_description: "",
        },
        lifestyle_factors: {
          social_interaction_level: "",
          physical_activity_level: "",
          screen_time_minutes: 0,
          substance_use: false,
        },
        medication_details: "",
        gratitude_entry: "",
        psychotic_symptoms: false,
        image_url: "",
      };
    },
    setCoreLogs: (state, action) => {
      state.coreLogs = action.payload;
    },
    setExtendedLogs: (state, action) => {
      state.extendedLogs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchLogsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveLog.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = [action.payload, ...state.logs];
      })
      .addCase(updateLog.fulfilled, (state, action) => {
        const updatedLog = action.payload;
        const index = state.logs.findIndex((log) => log.id === updatedLog.id);
        if (index !== -1) {
          state.logs[index] = updatedLog;
        }
      })
      .addCase(deleteLog.fulfilled, (state, action) => {
        state.logs = state.logs.filter((log) => log.id !== action.payload);
      })
  },
});

export const { resetLogs, setCoreLogs, setExtendedLogs } = logsSlice.actions;
export default logsSlice.reducer;
