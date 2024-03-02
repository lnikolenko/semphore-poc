
import { useState } from "react";
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { Identity } from "@semaphore-protocol/identity"
import { BigNumber, utils, Contract, Wallet, providers } from "ethers";
import FeedbackJson from "../../../contracts/Feedback.json"
import { Feedback } from "./Feedback";
import { notification } from "~~/utils/scaffold-eth";
import useSemaphore from "~~/hooks/semaphore/useSemaphore";

type VoteProps = {
  identity: Identity,
  users: string[]
}

export const Vote = ({ identity, users }: VoteProps) => {
  const [vote, setVote] = useState('1');
  const [voted, setVoted] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const { _feedback, refreshFeedback, addFeedback } = useSemaphore()


  const handleVoteChange = (event: any) => {
    setVote(event.target.value);
  };


  const handleWrite = async () => {
    setLoading(true)

    
    const groupId = "42"
    const depth = 20
    const group = new Group(groupId, depth, users)
    
    const signal = BigNumber.from(utils.formatBytes32String(vote)).toString()
    
    const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
      identity,
      group,
      groupId,
      signal,
    )
    
    
    const resp = await fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({ signal: signal, proof: proof, merkleTreeRoot: merkleTreeRoot, nullifierHash: nullifierHash })
    });
    if (resp.status !== 200) {
      notification.error("You have already voted.")
    }
      setVoted(true)
      refreshFeedback()
      setLoading(false)
    }

    return (
      <>
        {!voted ? (
          <>
            <p>You are a member of the group and ready to vote!</p>
            <label>
              How would you estimate the task?
              <select value={vote} onChange={handleVoteChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="8">8</option>
                <option value="13">13</option>
              </select>
            </label>

            <button 
              className="btn btn-secondary btn-sm" 
              disabled={loading}
              onClick={handleWrite}>
                {loading ? "Loading..." : "Vote!"}
            </button>
          </>
          ): (
            <>
              <p>Thanks for your vote. Here are the results:</p>
              <Feedback feedback={_feedback}/>
            </>
          )
        }
      </>
    )
}
