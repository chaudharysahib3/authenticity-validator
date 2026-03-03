const calculateBurstiness = (text = "") => {
  if (!text || typeof text !== "string") return 0;

  const sentences = text
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 0);

  if (!sentences.length) return 0;

  const lengths = sentences.map(s =>
    s.split(/\s+/).filter(Boolean).length
  );

  const mean =
    lengths.reduce((sum, val) => sum + val, 0) /
    lengths.length;

  const variance =
    lengths.reduce((sum, val) =>
      sum + Math.pow(val - mean, 2), 0) /
    lengths.length;

  return variance;
};

const vocabularyDiversity = (text = "") => {
  if (!text || typeof text !== "string") return 0;

  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  if (!words.length) return 0;

  const uniqueWords = new Set(words);
  return uniqueWords.size / words.length;
};

const repetitionScore = (text = "") => {
  if (!text || typeof text !== "string") return 0;

  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  if (!words.length) return 0;

  const uniqueWords = new Set(words);
  return 1 - uniqueWords.size / words.length;
};

const detectAIProbability = (text = "") => {
  if (!text || typeof text !== "string") return 0;

  const burstiness = calculateBurstiness(text);
  const diversity = vocabularyDiversity(text);
  const repetition = repetitionScore(text);

  const burstinessScore = burstiness < 20 ? 0.7 : 0.3;
  const diversityScore = diversity < 0.4 ? 0.7 : 0.3;
  const repetitionWeight = repetition > 0.3 ? 0.7 : 0.3;

  const aiProbability =
    (burstinessScore + diversityScore + repetitionWeight) / 3;

  return Number((aiProbability * 100).toFixed(2));
};

module.exports = { detectAIProbability };