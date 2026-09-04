export default function Sidebar({
    user,
    conversations,
    selectedConversation,
    loadingConversations,
    showNewChatOptions,
    setShowNewChatOptions,
    onNewChat,
    onConversationClick,
    onLogout
}) {
    return (
        <aside className="flex w-72 flex-col border-r p-4">

            <div className="mb-5">

                <h1 className="text-2xl font-bold">
                    AI Mentor
                </h1>

                <p className="text-sm text-gray-500">
                    Welcome, {user.fullName}
                </p>

            </div>

            <button
                onClick={() =>
                    setShowNewChatOptions(
                        (prev) => !prev
                    )
                }
                className="w-full rounded-lg bg-black px-4 py-3 text-white"
            >
                + New Chat
            </button>

            {showNewChatOptions && (
                <div className="mt-3 space-y-2 rounded-lg border p-3">

                    <p className="text-sm font-medium">
                        Choose your mentor
                    </p>

                    <button
                        onClick={() =>
                            onNewChat("technical")
                        }
                        className="w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-100 hover:text-black"
                    >
                        💻 Technical Mentor
                    </button>

                    <button
                        onClick={() =>
                            onNewChat("career")
                        }
                        className="w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-100 hover:text-black"
                    >
                        🎯 Career Mentor
                    </button>

                </div>
            )}

            <div className="mt-6 flex-1 overflow-y-auto">

                <h2 className="mb-3 text-sm font-semibold text-gray-500">
                    Conversations
                </h2>

                {loadingConversations && (
                    <p className="text-sm text-gray-500">
                        Loading conversations...
                    </p>
                )}

                {!loadingConversations &&
                    conversations.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No conversations yet.
                        </p>
                    )}

                <div className="space-y-2">

                    {conversations.map(
                        (conversation) => (
                            <button
                                key={conversation._id}
                                onClick={() =>
                                    onConversationClick(
                                        conversation
                                    )
                                }
                                className={`w-full rounded-lg border p-3 text-left ${
                                    selectedConversation?._id ===
                                    conversation._id
                                        ? "bg-gray-200 text-black"
                                        : "hover:bg-gray-100 hover:text-black"
                                }`}
                            >
                                <p className="truncate font-medium">
                                    {conversation.title}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {conversation.persona ===
                                    "technical"
                                        ? "Technical Mentor"
                                        : "Career Mentor"}
                                </p>

                            </button>
                        )
                    )}

                </div>

            </div>

            <button
                onClick={onLogout}
                className="mt-4 rounded-lg border px-4 py-2"
            >
                Logout
            </button>

        </aside>
    );
}