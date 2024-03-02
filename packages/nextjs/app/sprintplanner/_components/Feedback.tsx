
import { _fetchData } from "ethers/lib/utils";

type FeedbackProps = {
  feedback: string[],
}
export const Feedback = ({ feedback }: FeedbackProps) => {
  return (
    <>
      {feedback.map((f, i) => (
        <span key={i}>{f}</span>
      ))}
    </>
  )
  };
