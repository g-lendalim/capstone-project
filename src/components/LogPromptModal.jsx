import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { resetLogs, saveLog, setExtendedLogs } from "../features/logs/logsSlice";
import MorningLogForm from "./MorningLogForm";
import BedtimeLogForm from "./BedtimeLogForm";
import MedicationLogForm from "./MedicationLogForm";
import VisitLogForm from "./VisitLogForm";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default function LogPromptModal({ show, onHide, alarm, userId, dismissAlarm }) {
  const [step, setStep] = useState(1);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { coreLogs, extendedLogs } = useSelector((state) => state.logs);

  if (!alarm) return null;

  const resetForm = () => {
    setStep(1);
    dispatch(resetLogs()); 
  };

  const handleSubmit = async () => {
    const payload = {
      user_id: userId,
      alarm_type: alarm.type,
      ...coreLogs,
      ...extendedLogs,
    };

    try {
      console.log("🚀 Sending payload to backend:", payload); // Add detailed logging
      await dispatch(saveLog({ userId, logData: payload })).unwrap();
      return true;
    } catch (err) {
      console.error("Log error", err.response?.data || err.message); // Log backend error details
      return false;
    }
  };

  const onSubmitLog = async () => {
    const success = await handleSubmit();
    if (success) {
      dismissAlarm(alarm.id);
      resetForm();
      setShowSkipConfirm(false);
      onHide();
      navigate("/profile");
    }
  };

  const onSkipLog = () => {
    dismissAlarm(alarm.id);
    resetForm();
    setShowSkipConfirm(false);
    onHide();
    navigate("/alarm");
  };

  const handleImageUpload = async (file, dispatch, extendedLogs) => {
    const imageRef = ref(storage, `logs/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    dispatch(setExtendedLogs({ ...extendedLogs, image_url: url }));
  };

  const renderLogs = () => (
    <>
      {alarm.type === "Morning" && (
        <MorningLogForm
          handleImageUpload={(file) => handleImageUpload(file, dispatch, extendedLogs)}
        />
      )}
      {alarm.type === "Bedtime" && (
        <BedtimeLogForm
          handleImageUpload={(file) => handleImageUpload(file, dispatch, extendedLogs)}
        />
      )}
      {alarm.type === "Medication" && (
        <MedicationLogForm
          handleImageUpload={(file) => handleImageUpload(file, dispatch, extendedLogs)}
        />
      )}
      {alarm.type === "Visit" && (
        <VisitLogForm
          handleImageUpload={(file) => handleImageUpload(file, dispatch, extendedLogs)}
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
            <p className="text-muted">Let's take a moment to check in with yourself.</p>
            <Button onClick={() => setStep(2)}>📝 Start Check-In</Button>
          </>
        );
      case 2:
        return (
          <>
            <Form>{renderLogs()}</Form>
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
          <Button variant="secondary" onClick={() => setShowSkipConfirm(false)}>
            Cancel
          </Button>
          <Button variant="outline-danger" onClick={onSkipLog}>
            Yes, skip
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
