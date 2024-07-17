import { VIDEO_CONTEXT } from "../lib/constants/prompts.mjs";

const createContext = () => {
  return `Basandote en la transcripción de video que te voy a proporcionar a continuación responde a la pregunta que te haré después de finalizar la transcripción. La respuesta debe incluir el timestamp del video donde se explica eso entre corchetes, ejemplo: [02:36]. No menciones la palabra transcripción  ni timestamp en tu respuesta. Very important don't mention the word "transcripción" in your answer.
  {BEGIN OF VIDEO TRANSCRIPTION} ${VIDEO_CONTEXT} {END OF VIDEO TRANSCRIPTION}
  No comiences la respuesta con frases como "Según la transcripción" o "En la transcripción se menciona que". Simplemente responde a la pregunta que te haré después de finalizar la transcripción.
  Pregunta: `;
};

export const injectContext = (question) => {
  return createContext().concat(question);
};
