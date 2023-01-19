import { useEffect } from "react";
import { useState } from "react";

export function useStatusMessage() {
    const [statusMessageQueue, setMessageQueue] = useState([])

    // automatically remove the oldest message every 2seconds provided that the message queue is not empty
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (statusMessageQueue.length > 0) {
                removeOldestMessage()
            }
        }, 2000)

        return () => {
            clearInterval(intervalId)
        } 
    }, [statusMessageQueue])

    function addStatusMessage(newMessage) {
        setMessageQueue((prevQueue) => [...prevQueue, newMessage])
    }

    function removeOldestMessage() {
        // removes first message since it's the oldest
        setMessageQueue(prevQueue => {
            prevQueue.shift()
            return [...prevQueue]
        })
    }

    return { statusMessageQueue, addStatusMessage }
}