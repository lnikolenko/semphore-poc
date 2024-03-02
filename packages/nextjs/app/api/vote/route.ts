import { Contract, Wallet, providers } from "ethers";
import FeedbackJson from "../../../contracts/Feedback.json"
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
 
export async function POST(request: Request) {
    const postData = await request.json()

    const provider = new providers.JsonRpcProvider({fetchOptions: {
        referrer: "https://localhost:300",
      },
      url: 'http://localhost:8545'
    })

    const signer = new Wallet("0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", provider)
    const contract = new Contract("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", FeedbackJson.abi, signer)
    try {
        const transaction = await contract.sendFeedback(postData.signal, postData.merkleTreeRoot, postData.nullifierHash, postData.proof)
        await transaction.wait()
        return Response.json({}, { status: 200 });
    } catch (error: any) {
        console.error(error)
        return Response.json({}, { status: 500 });
    }
}