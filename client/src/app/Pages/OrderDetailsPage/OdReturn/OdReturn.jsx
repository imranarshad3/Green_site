import React, { useState } from "react";
import { RotateCcw } from "lucide-react";

import { useOrders } from "../../../Context/OrdersContext";
import {
  RETURN_REASONS,
  RETURN_STATUS_LABELS,
  formatOrderDate,
  getReturnDeadline,
  isReturnable,
} from "../../../utils/orders";

import "./OdReturn.css";

function OdReturn({ order, onUpdated }) {
  const { requestReturn } = useOrders();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const request = order.returnRequest;

  if (request) {
    return (
      <section className={`od-return is-${request.status}`}>
        <RotateCcw size={20} />
        <div>
          <strong>{RETURN_STATUS_LABELS[request.status]}</strong>
          <p>
            Requested on {formatOrderDate(request.createdAt)} · {request.reason}
          </p>
          {request.status === "requested" && (
            <p>We'll review it and get back to you within 2 business days.</p>
          )}
          {request.adminNote && <p className="od-return-note">“{request.adminNote}”</p>}
        </div>
      </section>
    );
  }

  if (!isReturnable(order)) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      onUpdated(await requestReturn(order.id, reason, details.trim() || null));
    } catch (requestError) {
      setError(requestError.message);
      setSending(false);
    }
  };

  return (
    <section className="od-return">
      <RotateCcw size={20} />
      <div>
        <strong>Not happy with something?</strong>
        <p>You can request a return until {formatOrderDate(getReturnDeadline(order))}.</p>

        {open ? (
          <form className="od-return-form" onSubmit={submit}>
            <label>
              Reason
              <select value={reason} onChange={(event) => setReason(event.target.value)}>
                {RETURN_REASONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label>
              Tell us more <small>(optional)</small>
              <textarea
                rows={3}
                maxLength={2000}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
              />
            </label>

            {error && <p className="od-return-error" role="alert">{error}</p>}

            <div className="od-actions-row">
              <button type="submit" className="od-action od-action-primary" disabled={sending}>
                {sending ? "Sending…" : "Send return request"}
              </button>
              <button type="button" className="od-action" onClick={() => setOpen(false)} disabled={sending}>
                Never mind
              </button>
            </div>
          </form>
        ) : (
          <button type="button" className="od-action od-return-open" onClick={() => setOpen(true)}>
            Request a return
          </button>
        )}
      </div>
    </section>
  );
}

export default OdReturn;
