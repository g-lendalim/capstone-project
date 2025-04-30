import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCoreLogs } from "../features/logs/logsSlice";
import { getMoodEmoji, getMoodLabel, getEnergyEmoji, getEnergyLabel, getSleepQualityEmoji, getSleepQualityLabel } from "../hooks/logLabels";

export default function MorningLogForm({ handleImageUpload }) {
  const dispatch = useDispatch();
  const { coreLogs, extendedLogs } = useSelector((state) => state.logs);

  return (
    <>
      <Form.Group className="mb-4">
        <Form.Label className="fw-medium" style={{ color: "#f06595" }}>
          <span style={{ fontSize: "18px", marginRight: "8px" }}>🧠</span>
          How would you rate your mood this morning?
        </Form.Label>
        <div className="position-relative mb-2">
          <Form.Range
            min={0}
            max={10}
            value={coreLogs.mood || 0}
            onChange={(e) => {
              dispatch(setCoreLogs({ ...coreLogs, mood: parseInt(e.target.value) }));
            }}
            className="mb-1"
          />
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">0</small>
            <small className="text-muted">10</small>
          </div>
          <div className="text-center mt-3 mb-2">
            <div style={{ fontSize: "1.8rem" }}>{getMoodEmoji(coreLogs.mood)} {getMoodLabel(coreLogs.mood)}</div>
            <div className="text-muted small">
              {coreLogs.mood}/10
            </div>
          </div>
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-medium" style={{ color: "#4dabf7" }}>
          <span style={{ fontSize: "20px", marginRight: "4px" }}>⚡</span>
          How energized do you feel today?
        </Form.Label>
        <div className="position-relative mb-2">
          <Form.Range
            min={0}
            max={10}
            value={coreLogs.energy_level || 0}
            onChange={(e) =>
              dispatch(setCoreLogs({ ...coreLogs, energy_level: parseInt(e.target.value) }))
            }
            className="mb-1"
          />
          <div className="d-flex justify-content-between">
            <small className="text-muted">0</small>
            <small className="text-muted">10</small>
          </div>
        </div>

        <div className="text-center mt-3 mb-2">
          <div style={{ fontSize: "2.2rem" }}>{getEnergyEmoji(coreLogs.energy_level)}</div>
          <div className="mt-1 fw-medium">{getEnergyLabel(coreLogs.energy_level)}</div>
          <div className="text-muted small">
            {coreLogs.energy_level}/10
          </div>
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#6f42c1" }}>
          <span style={{ fontSize: "20px", marginRight: "8px" }}>💤</span>
          <span>Rate your sleep quality</span>
        </Form.Label>
        <div className="position-relative mb-2">
          <Form.Range
            min={0}
            max={10}
            value={coreLogs.sleep_log.sleep_quality || 0}
            onChange={(e) =>
              dispatch(setCoreLogs({
                ...coreLogs,
                sleep_log: {
                  ...coreLogs.sleep_log,
                  sleep_quality: parseInt(e.target.value),
                },
              }))
            }
            className="mb-1"
          />
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">0</small>
            <small className="text-muted">10</small>
          </div>
        </div>

        <div className="text-center mt-4 mb-2">
          <div style={{ fontSize: "2rem" }}>{getSleepQualityEmoji(coreLogs.sleep_log.sleep_quality)}</div>
          <div className="mt-2 fw-medium" style={{ fontSize: "1.1rem" }}>{getSleepQualityLabel(coreLogs.sleep_log.sleep_quality)}</div>
          <div className="text-muted small mt-1">
            {coreLogs.sleep_log.sleep_quality}/10
          </div>
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#f0ad4e" }}>
          <span style={{ fontSize: "20px", marginRight: "8px" }}>😴</span>
          <span>How many hours did you sleep last night?</span>
        </Form.Label>
        <Form.Control
          type="number"
          value={coreLogs.sleep_log.sleep_hours}
          onChange={(e) =>
            dispatch(setCoreLogs({
              ...coreLogs,
              sleep_log: {
                ...coreLogs.sleep_log,
                sleep_hours: parseInt(e.target.value),
              },
            }))
          }
          className="py-2"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#20c997" }}>
          <span style={{ fontSize: "20px", marginRight: "8px" }}>⏰</span>
          <span>Sleep Disruptions</span>
        </Form.Label>
        <Form.Text muted className="d-block mb-2">
          Number of times you woke up during the night
        </Form.Text>
        <Form.Control
          type="number"
          value={coreLogs.sleep_log.night_awakenings}
          onChange={(e) =>
            dispatch(setCoreLogs({
              ...coreLogs,
              sleep_log: {
                ...coreLogs.sleep_log,
                night_awakenings: parseInt(e.target.value),
              },
            }))
          }
          className="py-2"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>📸 Upload a photo that represents your morning</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              await handleImageUpload(file);
            }
          }}
        />
        {extendedLogs.image_url && (
          <div className="mt-3">
            <img
              src={extendedLogs.image_url}
              alt="Uploaded"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          </div>
        )}
      </Form.Group>

    </>
  );
}