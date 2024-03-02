"use client"

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Identity } from "@semaphore-protocol/identity"
import { notification } from "~~/utils/scaffold-eth";
import { GroupDisplay } from "./_components";
import { useSignMessage, useAccount } from 'wagmi'

const SprintPlanner: NextPage = () => {
  const message = "Sign this message to sign into the anonymous survey tool3"
  const { data: signMessageData, error, isLoading, signMessage, variables } = useSignMessage()
  const { address: connectedAddress } = useAccount()
  const [identity, setIdentity] = useState<Identity>()

  useEffect(() => {
    if (signMessageData) {
      setIdentity(new Identity(signMessageData))
    }
  }, [signMessageData])

  const handleClick = () => {
    if (!connectedAddress){
      notification.error("Please connect your wallet first")
    } else {
      signMessage({ message }) 
    }
  }


  return (
    <>
    {identity ? (
      <>
        <p>Your identity is {identity.commitment.toString()}</p>
        <GroupDisplay identity={identity} />
      </>
      ) : 
      (<button  disabled={!connectedAddress} className="btn btn-secondary btn-sm" onClick={handleClick}>Please sign a message to sign in! (it's free!)</button>)
    }
    </>
  )}

  
  export default SprintPlanner;