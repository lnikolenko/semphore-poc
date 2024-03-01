"use client"

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import useSemaphore from "~~/hooks/semaphore/useSemaphore";
import { Identity } from "@semaphore-protocol/identity"
import { BigNumberish } from "ethers";
import { useContractWrite } from "wagmi";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { getInitialFormState, getParsedContractFunctionArgs } from "../debug/_components/contract";
import { Abi, AbiFunction } from "abitype";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { Feedback, SignMessage } from "./_components";
import FeedbackJson from "../../contracts/Feedback.json"

const SprintPlanner: NextPage = () => {
  const seedStorageKey = "seedKey"
  const [seed, setSeed] = useLocalStorage<BigNumberish>(
    seedStorageKey,
    "",
    { initializeWithValue: false },
  );

  const {_users, refreshUsers, _feedback, refreshFeedback} = useSemaphore()
  const [identity, setIdentity] = useState<Identity>()
  useEffect(() => {
    if (seed.toString() === "") {
      let existingSeed = localStorage.getItem(seedStorageKey)
      if (existingSeed!== null && existingSeed !== "") {
        setSeed(JSON.parse(existingSeed))
        const id = new Identity("seed9")
        setForm({identityCommitment: id.commitment})
        setIdentity(id)
      } else {
        const id = new Identity("seed9")
        setSeed("seed9")
        console.log("commitment is" + id.commitment)
        setForm({identityCommitment: id.commitment})
        setIdentity(id)
      }
    }
    refreshUsers()
    refreshFeedback()
  }, [])
  const writeTxn = useTransactor();

  const abiFunction = {
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
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));


  const {
    data: result,
    isLoading,
    writeAsync,
  } = useContractWrite({
    address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    functionName: "joinGroup",
    abi: FeedbackJson.abi as Abi,
    args: getParsedContractFunctionArgs(form),
  });

  const handleWrite = async () => {
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
  };

    return (
      <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0`}>
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <button className="btn btn-secondary btn-sm" onClick={handleWrite}>
              {false && <span className="loading loading-spinner loading-xs"></span>}
                Join group
            </button>
            {_users.map((u, id) => (
              <div key={id}>{u}</div>))
            }
            {_users.length > 0 && identity && <Feedback identity={identity} users={_users}/>}
            {_feedback}
            <SignMessage/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )};

  
  export default SprintPlanner;