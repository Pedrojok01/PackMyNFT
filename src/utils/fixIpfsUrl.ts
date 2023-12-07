export const fixIpfsUrl = (url: string, gateway: string): string => {
  const hasHttpAndIpfs = url.includes("https://") && url.includes("/ipfs/");
  if (hasHttpAndIpfs) {
    const startIndex = url.indexOf("https://") + "https://".length;
    const endIndex = url.indexOf("/ipfs/");
    const ipfsHash = url.substring(startIndex, endIndex);
    return url.replace(`https://${ipfsHash}/ipfs/`, gateway);
  }
  return url;
};
