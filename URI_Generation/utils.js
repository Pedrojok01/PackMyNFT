import { readFile } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { metadata, IPFS_img } from "./data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const basePadHex =
  "0000000000000000000000000000000000000000000000000000000000000000";

export const getPaddedHex = (number) => {
  return (basePadHex + number.toString(16)).substr("-64");
};

/* Images Promises:
 *********************/
export const pushImagePromise = (promises, ipfsArray, number) => {
  let paddedHex = getPaddedHex(number);

  promises.push(
    new Promise((res, rej) => {
      readFile(`${__dirname}/image/${number}.png`, (err, data) => {
        if (err) rej();
        ipfsArray.push({
          path: `images/${paddedHex}.png`,
          content: data.toString("base64"),
        });
        res();
      });
    })
  );
};

/* Attributes Promises:
 ************************/

export const pushAttributesPromise = (ipfsArray, number) => {
  let paddedHex = getPaddedHex(number);

  ipfsArray.push({
    path: "metadata.json",
    content: {
      name: metadata.name,
      description: metadata.description,
      image: `ipfs://${IPFS_img}/images/${paddedHex}.png`,
      external_url: "https://packmynft.com/",
      attributes: [
        {
          display_type: "number",
          trait_type: "Generation",
          value: metadata.generation,
        },
      ],
    },
  });
};
