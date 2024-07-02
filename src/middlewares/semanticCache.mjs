import { SemanticCache } from "@upstash/semantic-cache";
import { Index } from "@upstash/vector";
import dotenv from "dotenv";
dotenv.config();

// 👇 your vector database
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// 👇 your semantic cache
const semanticCache = new SemanticCache({ index, minProximity: 0.85 });

export const getSemantic = async (question) => {
  const result = await semanticCache.get(question);
  return result;
};

export const setSemantic = async (question, answer) => {
  await semanticCache.set(question, answer);
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const runSemanticDemo = async () => {
  await semanticCache.set("Capital of Turkey", "Ankara");
  await delay(1000);

  // 👇 outputs: "Ankara"
  const result = await semanticCache.get("What is Turkey's capital?");
  console.log(result);
};
