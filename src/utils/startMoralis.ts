import Moralis from "moralis";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

export const startMoralis = async () => {
  if (!MORALIS_API_KEY) {
    throw new Error("MORALIS_API_KEY is not defined");
  }

  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: MORALIS_API_KEY });
  }
};
