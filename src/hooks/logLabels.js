export const getMoodEmoji = (value) => {
  if (value >= 8) return "😄";
  if (value >= 6) return "🙂";
  if (value >= 4) return "😐";
  if (value >= 2) return "😔";
  return "😣";
};

export const getMoodLabel = (value) => {
  if (value == 0) return "Overwhelmed";
  if (value == 1) return "Very low";
  if (value == 2) return "Low";
  if (value == 3) return "Sad";
  if (value == 4) return "A bit off";
  if (value == 5) return "Neutral";
  if (value == 6) return "Not bad";
  if (value == 7) return "Good";
  if (value == 8) return "Very good";
  if (value == 9) return "Great";
  if (value == 10) return "Excellent";
};

export const getMoodColor = (value) => {
  if (value >= 8) return "#d4edda";
  if (value >= 6) return "#d1ecf1";
  if (value >= 4) return "#fff3cd";
  if (value >= 2) return "#cfe2ff";
  return "#f8d7da";
};
export const getMoodDescription = (value) => {
  if (value == 0) return "In emotional distress. Might need immediate support.";
  if (value == 1) return "Very down, depressed, or numb";
  if (value == 2) return "Struggling with low mood or energy."
  if (value == 3) return "Feeling persistently sad, anxious, or drained.";
  if (value == 4) return "Emotionally off, unmotivated, or discouraged."
  if (value == 5) return "Emotionally flat, just getting by.";
  if (value == 6) return "Feeling stable, neither good nor bad.";
  if (value == 7) return "Generally okay with moments of ease.";
  if (value == 8) return "Feeling upbeat, clear, and engaged.";
  if (value == 9) return "In a good flow, confident and uplifted.";
  if (value == 10) return "Energized, joyful, and fully aligned.";
};

export const getEnergyEmoji = (value) => {
  if (value >= 8) return "⚡⚡";
  if (value >= 6) return "⚡";
  if (value >= 4) return "🚶";
  if (value >= 2) return "💤";
  return "🔋";
};

export const getEnergyLabel = (value) => {
  if (value == 0) return "Depleted";
  if (value == 1) return "Very low";
  if (value == 2) return "Low energy";
  if (value == 3) return "Below average";
  if (value == 4) return "Moderate";
  if (value == 5) return "Average";
  if (value == 6) return "Above average";
  if (value == 7) return "Good energy";
  if (value == 8) return "Energetic";
  if (value == 9) return "Very energetic";
  if (value == 10) return "Fully charged";
};

export const getAnxietyEmoji = (value) => {
  if (value >= 8) return "😱";
  if (value >= 6) return "😰";
  if (value >= 4) return "😟";
  if (value >= 2) return "😕";
  return "😌";
};

export const getAnxietyLabel = (value) => {
  if (value == 0) return "Calm";
  if (value == 1) return "Very relaxed";
  if (value == 2) return "Mild concern";
  if (value == 3) return "Slightly uneasy";
  if (value == 4) return "Tense";
  if (value == 5) return "Worried";
  if (value == 6) return "Anxious";
  if (value == 7) return "Nervous";
  if (value == 8) return "Highly anxious";
  if (value == 9) return "Panicky";
  if (value == 10) return "Overwhelmed";
};

export const getStressEmoji = (value) => {
  if (value >= 8) return "💥";
  if (value >= 6) return "😣";
  if (value >= 4) return "😬";
  if (value >= 2) return "😐";
  return "😌";
};

export const getStressLabel = (value) => {
  if (value == 0) return "At ease";
  if (value == 1) return "Very relaxed";
  if (value == 2) return "Mildly stressed";
  if (value == 3) return "Notable tension";
  if (value == 4) return "Stressed";
  if (value == 5) return "Pressured";
  if (value == 6) return "High tension";
  if (value == 7) return "Struggling";
  if (value == 8) return "Stretched thin";
  if (value == 9) return "Very stressed";
  if (value == 10) return "Maxed out";
};

export const getIrritabilityEmoji = (value) => {
  if (value >= 8) return "😡";
  if (value >= 6) return "😠";
  if (value >= 4) return "😒";
  if (value >= 2) return "😕";
  return "😊";
};

export const getIrritabilityLabel = (value) => {
  if (value == 0) return "Peaceful";
  if (value == 1) return "Very calm";
  if (value == 2) return "Slightly annoyed";
  if (value == 3) return "Mildly irritable";
  if (value == 4) return "Irritable";
  if (value == 5) return "On edge";
  if (value == 6) return "Frustrated";
  if (value == 7) return "Easily triggered";
  if (value == 8) return "Angry";
  if (value == 9) return "Very irritable";
  if (value == 10) return "Ready to snap";
};

export const getSleepQualityEmoji = (value) => {
  if (value >= 8) return "😴💯";
  if (value >= 6) return "😴";
  if (value >= 4) return "😐💤";
  if (value >= 2) return "😫";
  return "😩";
};

export const getSleepQualityLabel = (value) => {
  if (value == 0) return "Sleepless night";
  if (value == 1) return "Very poor";
  if (value == 2) return "Poor";
  if (value == 3) return "Restless";
  if (value == 4) return "Below average";
  if (value == 5) return "Average";
  if (value == 6) return "Above average";
  if (value == 7) return "Good";
  if (value == 8) return "Very good";
  if (value == 9) return "Excellent";
  if (value == 10) return "Perfect";
};

export const getPhysicalActivityLabel = (value) => {
  switch (value) {
    case "none":
      return "🛌 Rest day";
    case "light":
      return "🚶 Light movement";
    case "moderate":
      return "🏃 Moderate activity";
    case "intense":
      return "💪 Very active";
    default:
      return "";
  }
};

export const getSocialInteractionLabel = (value) => {
  switch (value) {
    case "none":
      return "🧘 Solo day";
    case "low":
      return "🤝 Brief connections";
    case "medium":
      return "💬 Meaningful interactions";
    case "high":
      return "🎈 Socially energized";
    default:
      return "";
  }
};
