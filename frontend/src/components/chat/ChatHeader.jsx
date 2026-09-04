export default function ChatHeader({
    conversation,
    onPersonaChange
}) {
    return (
        <div className="border-b px-6 py-4">

            <h2 className="text-xl font-semibold">
                {conversation.title}
            </h2>

            <div className="mt-2 flex items-center gap-3">

                <span className="text-sm text-gray-500">
                    Mentor:
                </span>

                <select
                    value={conversation.persona}
                    onChange={(e) =>
                        onPersonaChange(e.target.value)
                    }
                    className="rounded-lg border px-3 py-2 text-sm"
                >
                    <option value="technical">
                        Technical Mentor
                    </option>

                    <option value="career">
                        Career Mentor
                    </option>
                </select>

            </div>
        </div>
    );
}