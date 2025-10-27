import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import ChatLoader from "../components/ChatLoader";
import { connectUserOnce, getClient } from "../lib/streamClient";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Messages-style page: left column lists conversations, right column shows a preview and quick action (Open Chat)
const FriendsPage = () => {
  const { authUser } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const [chatClient, setChatClient] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    let client = null;

    const init = async () => {
      if (!authUser || !tokenData?.token) return;

      setLoading(true);
      try {
        // use singleton helper to connect (no-op if already connected to same user)
        client = await connectUserOnce(
          STREAM_API_KEY,
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const c = getClient(STREAM_API_KEY);

        const filter = { type: "messaging", members: { $in: [authUser._id] } };
        const sort = [{ last_message_at: -1 }];

        const res = await c.queryChannels(filter, sort, { limit: 50 });

        setChannels(res);
        if (res.length > 0) setSelectedChannel(res[0]);
        setChatClient(c);
      } catch (error) {
        console.error("Failed to initialize messages page:", error);
      } finally {
        setLoading(false);
      }
    };

    init();

    // keep singleton connection alive; do not disconnect on unmount to avoid breaking other chat pages
    return () => {
      setChatClient(null);
    };
  }, [authUser, tokenData]);

  if (!authUser) return null;
  if (loading) return <ChatLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: conversations list */}
          <div className="col-span-1 bg-base-200 rounded-md overflow-hidden border border-base-300">
            <div className="p-4 border-b border-base-300 flex items-center justify-between">
              <h3 className="font-semibold">Messages</h3>
            </div>

            <div className="divide-y">
              {channels.length === 0 && (
                <div className="p-4 text-center opacity-70">
                  No conversations yet
                </div>
              )}

              {channels.map((ch) => {
                const lastMsg =
                  ch.state.messages && ch.state.messages.length > 0
                    ? ch.state.messages[ch.state.messages.length - 1]
                    : null;

                // other member id
                const members = Object.keys(ch.state.members || {}).filter(
                  (m) => m !== authUser._id
                );
                const otherId = members[0];
                const otherUser = ch.state.members?.[otherId]?.user || {};

                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch)}
                    className={`w-full text-left p-3 flex items-center gap-3 hover:bg-base-300 ${
                      selectedChannel?.id === ch.id ? "bg-base-300" : ""
                    }`}
                  >
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={
                            otherUser.image || "https://via.placeholder.com/40"
                          }
                          alt={otherUser.name || otherId}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate">
                          {otherUser.name || otherId}
                        </div>
                        <div className="text-xs opacity-60">
                          {lastMsg
                            ? new Date(lastMsg.created_at).toLocaleTimeString()
                            : ""}
                        </div>
                      </div>
                      <div className="text-sm opacity-80 truncate">
                        {lastMsg ? lastMsg.text : "Say hi!"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: preview / quick actions */}
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-base-200 rounded-md border border-base-300 h-full">
              {selectedChannel ? (
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-14 rounded-full">
                        <img
                          src={
                            (selectedChannel.state.members &&
                              Object.values(selectedChannel.state.members).find(
                                (m) => m.user && m.user.id !== authUser._id
                              )?.user?.image) ||
                            "https://via.placeholder.com/56"
                          }
                          alt="user"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {Object.values(selectedChannel.state.members).find(
                          (m) => m.user && m.user.id !== authUser._id
                        )?.user?.name || selectedChannel.id}
                      </h4>
                      <p className="text-sm opacity-70">
                        {selectedChannel.data?.members?.length > 0
                          ? "Conversation"
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-base-100 rounded-md mb-4">
                    <p className="text-sm opacity-80">
                      {selectedChannel.state.messages &&
                      selectedChannel.state.messages.length > 0
                        ? selectedChannel.state.messages[
                            selectedChannel.state.messages.length - 1
                          ].text
                        : "No messages yet. Start the conversation!"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/chat/${selectedChannel.id
                        .split("-")
                        .find((p) => p !== authUser._id)}`}
                      className="btn btn-primary"
                    >
                      Open Chat
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center opacity-70">
                  Select a conversation to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
