import { useGetConversationsQuery } from "../api/user/query";
import { useActiveConversationId, useChatHistory } from "../recoil/chatStates";
import { PlusIcon } from "../icons/commonIcons";
import { groupLabel, pill, rowBase, rowOn, rowOff } from "./sideBar";

interface ChatHistoryPanelProps {
    /** fired after starting a new chat or picking one from the list, so a
        mobile overlay wrapping this panel can close itself */
    onNavigate?: () => void;
}

const ChatHistoryPanel = ({ onNavigate }: ChatHistoryPanelProps) => {
    const [activeConversationId, setActiveConversationId] = useActiveConversationId();
    const [, setChatHistory] = useChatHistory();
    const { data } = useGetConversationsQuery();

    const conversations: { id: number; title: string }[] = data?.payload?.conversations ?? [];

    const startNewChat = () => {
        setActiveConversationId(null);
        setChatHistory(null);
        onNavigate?.();
    };

    const selectConversation = (id: number) => {
        if (id !== activeConversationId) setActiveConversationId(id);
        onNavigate?.();
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="shrink-0 px-2.5 pt-3 pb-1.5">
                <button onClick={startNewChat} className={pill}>
                    <span className="grid size-4 shrink-0 place-items-center"><PlusIcon dim="13" /></span>
                    New chat
                </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pb-4 scrollbar-hidden">
                <div className="px-2.5 pb-2">
                    <p className={groupLabel}>history</p>

                    {conversations.length === 0
                        ? <p className="px-2.5 py-1.5 text-[0.78rem] text-[#A1A1AA]">No conversations yet</p>
                        : conversations.map(c => (
                            <button
                                key={c.id}
                                onClick={() => selectConversation(c.id)}
                                aria-current={activeConversationId === c.id || undefined}
                                className={`${rowBase} ${activeConversationId === c.id ? rowOn : rowOff}`}>
                                <span className="truncate">{c.title || "New Chat"}</span>
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default ChatHistoryPanel;
