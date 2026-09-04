export default function MessageInput({
    messageInput,
    setMessageInput,
    onSubmit,
    sending,
    persona,
    error
}) {
    return (
        <>
            {error && (
                <div className="px-6 pb-2">

                    <p className="text-sm text-red-500">
                        {error}
                    </p>

                </div>
            )}

            <div className="border-t p-4">

                <form
                    onSubmit={onSubmit}
                    className="mx-auto flex max-w-4xl gap-3"
                >

                    <input
                        type="text"
                        placeholder={
                            persona === "technical"
                                ? "Ask your Technical Mentor..."
                                : "Ask your Career Mentor..."
                        }
                        value={messageInput}
                        onChange={(e) =>
                            setMessageInput(
                                e.target.value
                            )
                        }
                        disabled={sending}
                        className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />

                    <button
                        type="submit"
                        disabled={
                            sending ||
                            !messageInput.trim()
                        }
                        className="rounded-xl bg-black px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {sending
                            ? "Sending..."
                            : "Send"}
                    </button>

                </form>

            </div>
        </>
    );
}