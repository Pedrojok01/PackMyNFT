import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import axios from "axios";
import { pushImagePromise } from "./utils.js";

const X_API_KEY = process.env.X_API_KEY;

let promises = [];
let ipfsArray = [];

pushImagePromise(promises, ipfsArray, 0);

Promise.all(promises).then(() => {
  axios
    .post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", ipfsArray, {
      headers: {
        "X-API-KEY": X_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      maxRedirects: Infinity,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
});
