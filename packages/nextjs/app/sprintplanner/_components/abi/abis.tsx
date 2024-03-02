import { AbiFunction } from "abitype";

export const joinGroupAbi = {
    inputs: [
      {
        internalType: "uint256",
        name: "identityCommitment",
        type: "uint256",
      },
    ],
    name: "joinGroup",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  } as AbiFunction