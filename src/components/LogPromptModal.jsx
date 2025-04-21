import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import MorningLogForm from "./MorningLogForm";
import BedtimeLogForm from "./BedtimeLogForm";
import MedicationLogForm from "./MedicationLogForm";
import VisitLogForm from "./VisitLogForm";
import api from "../api";
import { storage } from "../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function LogPromptModal({ show, onHide, alarm, userId }) {
  const [step, setStep] = useState(1);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const imageRef = ref(storage, `logs/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    setExtendedLogs((prev) => ({ ...prev, image_url: url }));
  };

  const [coreLogs, setCoreLogs] = useState({
    mood: 0,
    energy_level: 0,
    sleep_log: {
      sleep_hours: 0,
      sleep_quality: 0,
      night_awakenings: 0
    },
    medication_taken: false,
    journal: "",
  });

  const [extendedLogs, setExtendedLogs] = useState({
    emotional_state: {
      anxiety_level: 0,
      irritability_level: 0,
      stress_level: 0
    },
    cognitive_state: {
      cognitive_clarity: false,
      negative_thoughts: false,
      intrusive_thoughts: false,
      intrusive_thoughts_description: ""
    },
    lifestyle_factors: {
      social_interaction_level: "", //'none', 'low', 'medium', 'high'
      physical_activity_level: "", //'none', 'light', 'moderate', 'intense'
      screen_time_minutes: 0,
      substance_use: false
    },
    medication_details: "",
    gratitude_entry: "",
    psychotic_symptoms: false,
    image_url: ""
  });

  if (!alarm) return null;

  const isMorning = alarm.type === "Morning";
  const isBedtime = alarm.type === "Bedtime";
  const isMedication = alarm.type === "Medication";
  const isVisit = alarm.type === "Visit";

  const resetForm = () => {
    setStep(1);
    setCoreLogs({
      mood: 0,
      energy_level: 0,
      sleep_log: {
        sleep_hours: 0,
        sleep_quality: 0,
        night_awakenings: 0
      },
      medication_taken: false,
      journal: "",
    });
  
    setExtendedLogs({
      emotional_state: {
        anxiety_level: 0,
        irritability_level: 0,
        stress_level: 0
      },
      cognitive_state: {
        cognitive_clarity: false,
        negative_thoughts: false,
        intrusive_thoughts: false,
        intrusive_thoughts_description: ""
      },
      lifestyle_factors: {
        social_interaction_level: "",
        physical_activity_level: "",
        screen_time_minutes: 0,
        substance_use: false
      },
      medication_details: "",
      gratitude_entry: "",
      psychotic_symptoms: false,
      image_url: ""
    });
  };  

  const handleSubmit = async () => {
    const {
      sleep_log: { sleep_hours, sleep_quality, night_awakenings },
      ...coreData
    } = coreLogs;
  
    const {
      emotional_state = {},
      cognitive_state = {},
      lifestyle_factors = {},
      medication_details,
      gratitude_entry,
      psychotic_symptoms,
      image_url
    } = extendedLogs || {};

    const payload = {
      user_id: userId,
      alarm_type: alarm.type,
      created_at: new Date().toISOString(),
      mood: coreData.mood,
      energy_level: coreData.energy_level,
      sleep_hours,
      sleep_quality,
      night_awakenings,
      medication_taken: coreData.medication_taken,
      journal: coreData.journal,
      anxiety_level: emotional_state.anxiety_level,
      irritability_level: emotional_state.irritability_level,
      stress_level: emotional_state.stress_level,
      cognitive_clarity: cognitive_state.cognitive_clarity,
      negative_thoughts: cognitive_state.negative_thoughts,
      intrusive_thoughts: cognitive_state.intrusive_thoughts,
      intrusive_thoughts_description: cognitive_state.intrusive_thoughts_description,
      social_interaction_level: lifestyle_factors.social_interaction_level,
      physical_activity_level: lifestyle_factors.physical_activity_level,
      screen_time_minutes: lifestyle_factors.screen_time_minutes,
      substance_use: lifestyle_factors.substance_use,
      medication_details,
      gratitude_entry,
      psychotic_symptoms,
      image_url
    };

    try {
      await api.post("/logs", payload);
      return true;
    } catch (err) {
      console.error("Log error", err);
      return false;
    }
  };

  const onSubmitLog = async () => {
    const success = await handleSubmit();
    if (success) {
      resetForm();
      setShowSkipConfirm(false);
      onHide();
      navigate("/profile");
    }
  };

  const onSkipLog = () => {
    resetForm();
    setShowSkipConfirm(false);
    onHide();
    navigate("/alarm");
  };

  const renderCoreLogs = () => (
    <>
      {isMorning && (
        <MorningLogForm
          coreLogs={coreLogs}
          setCoreLogs={setCoreLogs}
          setExtendedLogs={setExtendedLogs}
          handleImageUpload={handleImageUpload}
        />
      )}

      {isBedtime && (
        <BedtimeLogForm 
          coreLogs={coreLogs}
          setCoreLogs={setCoreLogs}
          extendedLogs={extendedLogs}
          setExtendedLogs={setExtendedLogs}
          handleImageUpload={handleImageUpload}
        />
      )}

      {isMedication && (
        <MedicationLogForm 
          coreLogs={coreLogs}
          setCoreLogs={setCoreLogs}
          extendedLogs={extendedLogs}
          setExtendedLogs={setExtendedLogs}
          handleImageUpload={handleImageUpload}
        />
      )}

      {isVisit && (
        <VisitLogForm 
          coreLogs={coreLogs}
          setCoreLogs={setCoreLogs}
          extendedLogs={extendedLogs}
          setExtendedLogs={setExtendedLogs}
          handleImageUpload={handleImageUpload}
        />
      )}
    </>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
          <h4 className="mb-3">⏰ {alarm.label} Alarm</h4>

          {alarm.type === "Visit" ? (
            <div className="mb-2">
              <strong>Date:</strong>{" "}
              {new Date(alarm.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}<br />
              <strong>Time:</strong> {alarm.time}
            </div>
          ) : (
            <div className="mb-2">
              <strong>Time:</strong> {alarm.time}
            </div>
          )}

          <p className="text-muted">
            Let's take a moment to check in with yourself.
          </p>

          <Button onClick={() => setStep(2)}>
            📝 Start Check-In
          </Button>
        </>
        );
      case 2:
        return (
          <>
            <Form>{renderCoreLogs()}</Form>
            
            {extendedLogs.image_url && (
              <div className="mt-2">
                <img
                  src={extendedLogs.image_url}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </div>
            )}
            <div className="mt-3 d-flex justify-content-end">
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h5>You're all set!</h5>
            <p>Thanks for taking the time to check in 💚</p>
            <Button variant="primary" onClick={onSubmitLog}>
              Submit Log
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal show={show} onHide={() => { onHide(); setStep(1); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Check-In</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderStep()}</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => setShowSkipConfirm(true)}>
            Skip for now
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSkipConfirm} onHide={() => setShowSkipConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Skip Check-In?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>No worries! You can always check in later.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSkipConfirm(false)}>Cancel</Button>
          <Button variant="outline-danger" onClick={onSkipLog}>
            Yes, skip
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
