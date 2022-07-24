import { getAddress } from "ethers/lib/utils";

export const isContract = async (
  provider: any,
  address: string
): Promise<boolean> => {
  const code = await provider.getCode(address);
  return code && code !== "0x";
};

export const shortHash = (hash: string, maxLength: number = 20) => {
  const half = Math.floor(maxLength / 2);
  const remaining = half - maxLength;
  return hash.length <= maxLength
    ? hash
    : `${hash.slice(0, half)}...${hash.slice(remaining)}`;
};

export const convertDateToTimestampStr = (date: Date): string => {
  return Math.floor(date.getTime() / 1000).toString();
};
