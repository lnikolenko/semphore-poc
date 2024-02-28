
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import useSemaphore from "~~/hooks/semaphore/useSemaphore";
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { Identity } from "@semaphore-protocol/identity"
import { SemaphoreSubgraph } from "@semaphore-protocol/data"
import { BigNumberish } from "ethers";
import { useContractWrite } from "wagmi";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { getInitialFormState, getParsedContractFunctionArgs } from "../../debug/_components/contract";
import { Abi, AbiFunction } from "abitype";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { BigNumber, utils, Contract, Wallet, providers } from "ethers";
import { verifyProof } from "@semaphore-protocol/proof"
import FeedbackJson from "../../../contracts/Feedback.json"
import { formatBytes32String } from "ethers/lib/utils"

type FeedbackProps = {
  identity: Identity,
  users:string[]
}

export const Feedback = ({ identity, users }: FeedbackProps) => {

  const abiFunction = {
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
  
const provider = new providers.JsonRpcProvider()

    const signer = new Wallet("0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", provider)
    const contract = new Contract("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", FeedbackJson.abi, signer)

  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
  const writeTxn = useTransactor();

  const {
    data: result,
    isLoading,
    writeAsync,
  } = useContractWrite({
    address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    functionName: "sendFeedback",
    abi: FeedbackJson.abi as Abi,
    args: getParsedContractFunctionArgs(form),
  });


  const handleParams = async () => {
    console.log("here")
        
        const feedback = "This is a test message"
        const group = new Group("42", 20, users)
        
    
        const signal = BigNumber.from(utils.formatBytes32String(feedback)).toString()
        console.log(users)
        
        console.log(new Identity("seed6").commitment.toString())
      
        
        const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
          identity,
          group,
          "42",
          signal,
        )
        console.log(signal)
        console.log(merkleTreeRoot)
        console.log(nullifierHash)
        console.log(proof)
        
        setForm({
          feedback: signal,
          merkleTreeRoot: merkleTreeRoot,
          nullifierHash: nullifierHash,
          proof: proof,
        })

  }

  const handleWrite = async () => {
    /*
    console.log(form)
    
    if (writeAsync) {
      try {
        console.log("here")
        const makeWriteWithParams = () => writeAsync({ value: BigInt(0) });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
    */
    
   
    const feedback = "This is a test message number 2"
    const group = new Group("42", 20, users)
    

    //const signal = BigNumber.from(utils.formatBytes32String(feedback)).toString()
    //const signal = formatBytes32String("This is a test message")
    const signal = BigNumber.from(utils.formatBytes32String(feedback)).toString()
    console.log("signal is" + signal)
    console.log(users)
    
    console.log(new Identity("seed6").commitment.toString())
  
    
    const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
      identity,
      group,
      "42",
      signal,
    )
    const transaction = await contract.sendFeedback(signal, merkleTreeRoot, nullifierHash, proof)
    await transaction.wait()

  };


    return (
      <>
        <button className="btn btn-secondary btn-sm" onClick={handleWrite}>
        {false && <span className="loading loading-spinner loading-xs"></span>}
          Submit Feedback
      </button>
      <button className="btn btn-secondary btn-sm" onClick={handleParams}>
        {false && <span className="loading loading-spinner loading-xs"></span>}
          Set params
      </button>
      </>
    )
}
