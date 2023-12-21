import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import axios from "axios";
import { pushAttributesPromise } from "./utils.js";

const X_API_KEY = process.env.X_API_KEY;

let ipfsArray = [];

// Image 0
pushAttributesPromise(ipfsArray, 0);

axios
  .post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", ipfsArray, {
    headers: {
      "X-API-KEY": X_API_KEY,
      "Content-Type": "application/json",
      accept: "application/json",
    },
  })
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.log(error);
  });

// Image: https://ipfs.moralis.io:2053/ipfs/QmPnrvP1bWW3MH9YtJyUULq6N15KtYhRrvDuTcURUQJxSS/images/0000000000000000000000000000000000000000000000000000000000000000.png
// Attributes: https://ipfs.moralis.io:2053/ipfs/QmPdWmcbxqco4vBZf9cL6XsTHHNF54tVzu2JoMN357pwqw/metadata.json
