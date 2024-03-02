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

export const sendFeedbackAbi = {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "feedback",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "merkleTreeRoot",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "nullifierHash",
            "type": "uint256"
        },
        {
            "internalType": "uint256[8]",
            "name": "proof",
            "type": "uint256[8]"
        }
    ],
    "name": "sendFeedback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}  as AbiFunction