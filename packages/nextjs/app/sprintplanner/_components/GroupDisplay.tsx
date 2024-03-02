import { useEffect, useState } from "react";
import useSemaphore from "~~/hooks/semaphore/useSemaphore";
import { Identity } from "@semaphore-protocol/identity"
import { useContractWrite } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { getInitialFormState, getParsedContractFunctionArgs } from "../../debug/_components/contract";
import { Abi } from "abitype";
import { joinGroupAbi } from "./abi/abis";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import FeedbackJson from "../../../contracts/Feedback.json"
import { Vote } from "./Vote";

type GroupProps = {
  identity: Identity,
}

export const GroupDisplay = ({ identity }: GroupProps) => {
    const { _users, refreshUsers } = useSemaphore()
    const [isMember, setIsMember] = useState<boolean>()
    const writeTxn = useTransactor();
    useEffect(() => {
      refreshUsers()
      setForm({identityCommitment: identity.commitment})
    }, [])

    useEffect(() => {
        if (_users.length > 0) {
            setIsMember(_users.includes(identity.commitment.toString())) 
        }
      }, [_users])

    const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(joinGroupAbi));
    
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
    
    const joinGroup = async () => {
      if (writeAsync) {
        try {
          const makeWriteWithParams = () => writeAsync({ value: BigInt(0) });
          await writeTxn(makeWriteWithParams);
          refreshUsers()
        } catch (e: any) {
          const message = getParsedError(e);
          notification.error(message);
        }
      }
    }



    return (
      <>
       {isMember ? (
        <>
          <Vote identity={identity} users={_users} />
        </>
       ) : (
        <>
        <p>Please join the group in order to vote</p>
        <button className="btn btn-secondary btn-sm" onClick={joinGroup}>Join group</button>
        </>
       )
       }
      </>
    )
}
