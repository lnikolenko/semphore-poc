
import { useSignMessage, useAccount } from 'wagmi'
import { recoverMessageAddress } from 'viem'
import { useEffect } from 'react'
import { Identity } from "@semaphore-protocol/identity"

export const SignMessage = () => {
    useEffect
    const { data: signMessageData, error, isLoading, signMessage, variables } = useSignMessage()
    const { address: connectedAddress } = useAccount();
    useEffect(() => {
        if (connectedAddress) {
            const message = "this is a test message"
        signMessage({ message }) 
        console.log("i am here")

        }
      }, [connectedAddress])

    return (
        <>
        <h1>hi</h1>
        {signMessageData? <p>{new Identity(signMessageData).commitment.toString()}</p> : null}
        </>
    )

}
