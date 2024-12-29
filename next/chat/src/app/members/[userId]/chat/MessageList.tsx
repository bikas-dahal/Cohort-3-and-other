'use client'

import {MessageDto} from "@/types";
import {useCallback, useEffect, useRef, useState} from "react";
import useMessageStore from "@/hooks/useMessageStore";
import {formatShortDateTime} from "@/lib/util";
import {pusherClient} from "@/lib/pusher";
import MessageBox from "@/app/members/[userId]/chat/MessageBox";

type Props = {
    initialMessages: {
        messages: MessageDto[];
        readCount: number;
    };
    currentUserId: string;
    chatId: string;
};


export default function MessageList({ initialMessages, currentUserId, chatId }: Props) {
    const [messages, setMessages] = useState( initialMessages.messages );

    const setReadCount = useRef(false);

    const { updateUnreadCount } = useMessageStore(
        (state) => ({
            updateUnreadCount: state.updateUnreadCount,
        })
    );

    useEffect(() => {
        if (!setReadCount.current) {
            updateUnreadCount(
                -initialMessages.readCount
            );
            setReadCount.current = true;
        }
    }, [
        initialMessages.readCount,
        updateUnreadCount,
    ]);

    const handleNewMessage = useCallback(
        (message: MessageDto) => {
            setMessages((prevState) => {
                return [...prevState, message];
            });
        },
        []
    );

    const handleReadMessages = useCallback(
        (messageIds: string[]) => {
            setMessages((prevState) =>
                prevState.map((message) =>
                    messageIds.includes(message.id)
                        ? {
                            ...message,
                            dateRead: formatShortDateTime(
                                new Date()
                            ),
                        }
                        : message
                )
            );
        },
        []
    );

    useEffect(() => {
        const channel = pusherClient.subscribe(chatId);
        channel.bind("message:new", handleNewMessage);
        channel.bind(
            "message:read",
            handleReadMessages
        );

        return () => {
            channel.unsubscribe();
            channel.unbind(
                "message:new",
                handleNewMessage
            );
            channel.unbind(
                "message:read",
                handleReadMessages
            );
        };
    }, [ chatId]);

    return (
        <div>
            {messages.length === 0 ? (
                "No messages to display"
            ) : (
                <>
                    {messages.map((message) => (
                        <MessageBox
                            key={message.id}
                            message={message}
                            currentUserId={currentUserId}
                        />
                    ))}
                </>
            )}
        </div>
    );
}