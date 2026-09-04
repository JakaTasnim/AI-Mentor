export default function MessageList({
    messages,
    loadingMessages,
    sending,
    persona,
    messagesEndRef
}) {
    return (
        <div className="flex-1 overflow-y-auto p-6">

            {loadingMessages && (
                <p className="text-gray-500">
                    Loading messages...
                </p>
            )}

            {!loadingMessages &&
                messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">

                        <div className="text-center">

                            <h3 className="text-xl font-semibold">
                                Start a conversation
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Ask your{" "}
                                {persona === "technical"
                                    ? "Technical Mentor"
                                    : "Career Mentor"}{" "}
                                anything.
                            </p>

                        </div>

                    </div>
                )}

            <div className="space-y-4">

                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex ${
                            message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                message.role === "user"
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-black"
                            }`}
                        >
                            <p className="whitespace-pre-wrap">
                                {message.content}
                            </p>
                        </div>
                    </div>
                ))}

                {sending && (
                    <div className="flex justify-start">

                        <div className="rounded-2xl bg-gray-100 px-4 py-3 text-black">
                            AI is thinking...
                        </div>

                    </div>
                )}

                <div ref={messagesEndRef} />

            </div>

        </div>
    );
}