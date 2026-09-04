"use client";

import {
    useEffect,
    useRef,
    useState
} from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

import Sidebar from "@/components/chat/Sidebar.jsx";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import EmptyChat from "@/components/chat/EmptyChat";

export default function Home() {

    const router = useRouter();

    const {
        user,
        loading: authLoading,
        logout
    } = useAuth();

    const [
        conversations,
        setConversations
    ] = useState([]);

    const [
        selectedConversation,
        setSelectedConversation
    ] = useState(null);

    const [
        messages,
        setMessages
    ] = useState([]);

    const [
        messageInput,
        setMessageInput
    ] = useState("");

    const [
        loadingConversations,
        setLoadingConversations
    ] = useState(true);

    const [
        loadingMessages,
        setLoadingMessages
    ] = useState(false);

    const [
        sending,
        setSending
    ] = useState(false);

    const [
        showNewChatOptions,
        setShowNewChatOptions
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const messagesEndRef = useRef(null);

    // --------------------------------------------------
    // Protect Home Page
    // --------------------------------------------------

    useEffect(() => {

        if (!authLoading && !user) {
            router.replace("/login");
        }

    }, [
        user,
        authLoading,
        router
    ]);

    // --------------------------------------------------
    // Fetch Conversations
    // --------------------------------------------------

    useEffect(() => {

        if (!user) return;

        const fetchConversations = async () => {

            try {

                setLoadingConversations(true);
                setError("");

                const response =
                    await apiRequest(
                        "/conversations"
                    );

                setConversations(
                    response.data
                );

            } catch (error) {

                setError(error.message);

            } finally {

                setLoadingConversations(
                    false
                );

            }

        };

        fetchConversations();

    }, [user]);

    // --------------------------------------------------
    // Auto Scroll
    // --------------------------------------------------

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [
        messages,
        sending
    ]);

    // --------------------------------------------------
    // Select Conversation
    // --------------------------------------------------

    const handleConversationClick =
        async (conversation) => {

            try {

                setSelectedConversation(
                    conversation
                );

                setLoadingMessages(true);
                setError("");

                const response =
                    await apiRequest(
                        `/conversations/${conversation._id}/messages?page=1&limit=20`
                    );

                const fetchedMessages =
                    response.data.messages;

                setMessages(
                    [...fetchedMessages].reverse()
                );

                setMessageInput("");

            } catch (error) {

                setError(error.message);

            } finally {

                setLoadingMessages(false);

            }

        };

    // --------------------------------------------------
    // Create Conversation
    // --------------------------------------------------

    const handleNewChat =
        async (persona) => {

            try {

                setError("");

                const response =
                    await apiRequest(
                        "/conversations",
                        {
                            method: "POST",

                            body: JSON.stringify({
                                title:
                                    "New Conversation",
                                persona
                            })
                        }
                    );

                const newConversation =
                    response.data;

                setConversations(
                    (prev) => [
                        newConversation,
                        ...prev
                    ]
                );

                setSelectedConversation(
                    newConversation
                );

                setMessages([]);
                setMessageInput("");

                setShowNewChatOptions(
                    false
                );

            } catch (error) {

                setError(error.message);

            }

        };

    // --------------------------------------------------
    // Change Persona
    // --------------------------------------------------

    const handlePersonaChange =
        async (persona) => {

            if (!selectedConversation) {
                return;
            }

            try {

                setError("");

                const response =
                    await apiRequest(
                        `/conversations/${selectedConversation._id}`,
                        {
                            method: "PATCH",

                            body:
                                JSON.stringify({
                                    persona
                                })
                        }
                    );

                const updatedConversation =
                    response.data;

                setSelectedConversation(
                    updatedConversation
                );

                setConversations(
                    (prev) =>
                        prev.map(
                            (conversation) =>
                                conversation._id ===
                                updatedConversation._id
                                    ? updatedConversation
                                    : conversation
                        )
                );

            } catch (error) {

                setError(error.message);

            }

        };

    // --------------------------------------------------
    // Send Message
    // --------------------------------------------------

    const handleSendMessage =
        async (e) => {

            e.preventDefault();

            if (!selectedConversation) {

                setError(
                    "Please select or create a conversation first"
                );

                return;

            }

            const content =
                messageInput.trim();

            if (!content) {
                return;
            }

            const tempUserMessage = {
                _id: `temp-${Date.now()}`,
                role: "user",
                content
            };

            setMessages(
                (prev) => [
                    ...prev,
                    tempUserMessage
                ]
            );

            setMessageInput("");

            try {

                setSending(true);
                setError("");

                const response =
                    await apiRequest(
                        `/conversations/${selectedConversation._id}/messages`,
                        {
                            method: "POST",

                            body:
                                JSON.stringify({
                                    content
                                })
                        }
                    );

                const {
                    userMessage,
                    assistantMessage,
                    conversation:
                        updatedConversation
                } = response.data;

                setMessages((prev) => {

                    const withoutTemp =
                        prev.filter(
                            (message) =>
                                message._id !==
                                tempUserMessage._id
                        );

                    return [
                        ...withoutTemp,
                        userMessage,
                        assistantMessage
                    ];

                });

                setSelectedConversation(
                    updatedConversation
                );

                setConversations(
                    (prev) =>
                        prev.map(
                            (conversation) =>
                                conversation._id ===
                                updatedConversation._id
                                    ? updatedConversation
                                    : conversation
                        )
                );

            } catch (error) {

                setError(error.message);

            } finally {

                setSending(false);

            }

        };

    // --------------------------------------------------
    // Logout
    // --------------------------------------------------

    const handleLogout = async () => {

        try {

            await logout();

            router.replace("/login");

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (authLoading) {

        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </main>
        );

    }

    if (!user) {
        return null;
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <main className="flex h-screen overflow-hidden">

            <Sidebar
                user={user}
                conversations={
                    conversations
                }
                selectedConversation={
                    selectedConversation
                }
                loadingConversations={
                    loadingConversations
                }
                showNewChatOptions={
                    showNewChatOptions
                }
                setShowNewChatOptions={
                    setShowNewChatOptions
                }
                onNewChat={
                    handleNewChat
                }
                onConversationClick={
                    handleConversationClick
                }
                onLogout={
                    handleLogout
                }
            />

            <section className="flex flex-1 flex-col">

                {!selectedConversation ? (

                    <EmptyChat />

                ) : (

                    <>
                        <ChatHeader
                            conversation={
                                selectedConversation
                            }
                            onPersonaChange={
                                handlePersonaChange
                            }
                        />

                        <MessageList
                            messages={
                                messages
                            }
                            loadingMessages={
                                loadingMessages
                            }
                            sending={
                                sending
                            }
                            persona={
                                selectedConversation.persona
                            }
                            messagesEndRef={
                                messagesEndRef
                            }
                        />

                        <MessageInput
                            messageInput={
                                messageInput
                            }
                            setMessageInput={
                                setMessageInput
                            }
                            onSubmit={
                                handleSendMessage
                            }
                            sending={
                                sending
                            }
                            persona={
                                selectedConversation.persona
                            }
                            error={
                                error
                            }
                        />
                    </>

                )}

            </section>

        </main>
    );
}