import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { StreamId } from "@convex-dev/persistent-text-streaming";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { BeatLoader, SyncLoader } from "react-spinners";

export default function ChatAI({
    sellerId,
    prompt, 
    setAIStatus, 
    streamId, 
    messageId, 
    setShowAIStream}: 
{
    sellerId: Id<"users">
    prompt: string, 
    setAIStatus: (val: string)=> void; 
    streamId: string; messageId: Id<"message">; 
    setShowAIStream: () => void
} ) {
const updateAIMessageRecord = useMutation(api.chat.updateAIRecord)
const bottomRef = useRef<HTMLDivElement | null>(null);

// Before Streaming AI Response - Retrieve Store Details
const store = useQuery(api.store.getExternalUserStore, {
    userId: sellerId
}) as Doc<"store">

    
// Stream AI Response
const streamUrl = new URL(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/chat-stream`);
streamUrl.searchParams.set("prompt", prompt);
streamUrl.searchParams.set("streamId", streamId ?? "");
streamUrl.searchParams.set("storeName", store?.name ?? ""  )

const { text, status } = useStream(
    api.chat.getChatBody,
    streamUrl.href as unknown as URL,
    true,
    streamId as StreamId,
);


// When Streaming is complete, run update mutation to update message object for persistence
useEffect(()=>{
  if (status === "done" && !text){
    updateAIMessageRecord({
      messageId: messageId!,
      content: "NKEM is experiencing a high volume of requests. Please try again in a moment."
    }).then(data=> {
        data.status === 200 && setShowAIStream()
        setAIStatus("done")
    })
    return
  }
  if (status === "done"){
    // Run update mutation
    updateAIMessageRecord({
      messageId: messageId!,
      content: text
    }).then(data=> {
        data.status === 200 && setShowAIStream()
        setAIStatus("done")
    })
  }

  if (status === "pending" && !text){
    setAIStatus("thinking")
  } 
  if(text){
    setAIStatus("generating")
  }
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });

}, [status, text])



  return (
    <>
    {!text? 
        <div className=" h-12 pl-3 flex items-center"><BeatLoader color="#6b7280 "/></div> :
        <div className="max-w-[85%] xs:max-w-[80%] rounded-xl p-2 sm:max-w-[75%] sm:px-3 lg:max-w-[65%] bg-gray-300/80 rounded-bl-none  text-black text-foreground">
            <span className="break-words text-xs leading-relaxed sm:text-sm md:text-base">
                <ReactMarkdown>
                    {text}
                </ReactMarkdown>
                <div ref={bottomRef} />
            </span>
        </div>
    }
    </>
  )
}
