import React, { useCallback, useEffect, useState } from "react";
import { Mail } from "lucide-react";

import { useSupabase } from "../../../Context/SupabaseContext";

const formatDate = (value) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function AdminMessages() {
  const supabase = useSupabase();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHandled, setShowHandled] = useState(false);

  const load = useCallback(
    () =>
      supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error: fetchError }) => {
          if (fetchError) {
            setError(fetchError.message);
          } else {
            setMessages(data);
          }

          setLoading(false);
        }),
    [supabase]
  );

  useEffect(() => {
    load();
  }, [load]);

  const setHandled = async (message, handled) => {
    setMessages((previous) =>
      previous.map((item) => (item.id === message.id ? { ...item, handled } : item))
    );

    const { error: updateError } = await supabase
      .from("contact_messages")
      .update({ handled })
      .eq("id", message.id);

    if (updateError) {
      setError(updateError.message);
      load();
    }
  };

  if (loading) {
    return <p className="admin-muted">Loading messages…</p>;
  }

  const open = messages.filter((message) => !message.handled);
  const visible = showHandled ? messages : open;

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <p>
          {open.length} open · {messages.length - open.length} handled
        </p>

        <label className="admin-inline-check">
          <input
            type="checkbox"
            checked={showHandled}
            onChange={(event) => setShowHandled(event.target.checked)}
          />
          Show handled
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {visible.length === 0 ? (
        <p className="admin-muted">
          {messages.length === 0 ? "No messages yet." : "All caught up."}
        </p>
      ) : (
        <ul className="admin-messages">
          {visible.map((message) => (
            <li
              key={message.id}
              className={`admin-message ${message.handled ? "is-handled" : ""}`}
            >
              <div className="admin-message-head">
                <div>
                  <p className="admin-message-from">
                    {message.name}{" "}
                    <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}>
                      <Mail size={13} /> {message.email}
                    </a>
                  </p>
                  <p className="admin-muted">
                    {message.subject} · {formatDate(message.created_at)}
                    {message.user_id && " · signed-in customer"}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-button secondary"
                  onClick={() => setHandled(message, !message.handled)}
                >
                  {message.handled ? "Reopen" : "Mark handled"}
                </button>
              </div>

              <p className="admin-message-body">{message.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AdminMessages;
