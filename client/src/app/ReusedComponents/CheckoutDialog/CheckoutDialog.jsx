import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Loader2, Tag, X } from "lucide-react";

import { useOrders } from "../../Context/OrdersContext";
import { describePromo, getCartTotals } from "../../utils/cart";
import "./CheckoutDialog.css";

const money = (value) => `$${Number(value).toFixed(2)}`;

const FIELDS = [
  { name: "name", label: "Full name", autoComplete: "name", wide: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Street address", autoComplete: "street-address", wide: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postalCode", label: "Postal code", autoComplete: "postal-code", optional: true },
];

function initialShipping(lastShipping, user) {
  if (lastShipping?.address) {
    return { ...lastShipping, postalCode: lastShipping.postalCode ?? "" };
  }

  return {
    name: user?.fullName ?? "",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    phone: user?.primaryPhoneNumber?.phoneNumber ?? "",
    address: "",
    city: "",
    postalCode: "",
  };
}

function CheckoutDialog({ title = "Checkout", lines, note, initialPromo = null, onClose, onPlace, onPlaced }) {
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const { orders, checkPromo } = useOrders();

  const [shipping, setShipping] = useState(() => initialShipping(orders[0]?.shipping, user));
  const [promo, setPromo] = useState(initialPromo);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  const totals = getCartTotals(lines, promo);
  const promoInactive = promo && totals.promoDiscount === 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = () => {
    if (!placing) onClose();
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setShipping((previous) => ({ ...previous, [name]: value }));
  };

  const applyPromo = async () => {
    if (!promoInput.trim()) return;

    setCheckingPromo(true);
    setPromoError(null);

    try {
      setPromo(await checkPromo(promoInput.trim(), totals.subtotal));
      setPromoInput("");
    } catch (promoFailure) {
      setPromoError(promoFailure.message);
    } finally {
      setCheckingPromo(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setPlacing(true);
    setError(null);

    try {
      const order = await onPlace({
        shipping,
        promoCode: promoInactive ? null : promo?.code ?? null,
      });
      dialogRef.current?.close();
      onPlaced?.(order);
      navigate(`/orders/${order.order_number}`, { state: { placed: true } });
    } catch (placeError) {
      setError(placeError.message || "We couldn't place your order. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="co-dialog"
      aria-labelledby="co-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <form className="co-panel" onSubmit={submit}>
        <div className="co-head">
          <h2 id="co-title">{title}</h2>
          <button type="button" className="co-close" onClick={close} aria-label="Close" disabled={placing}>
            <X size={18} />
          </button>
        </div>

        <ul className="co-lines">
          {lines.map((line) => (
            <li key={line.key} className="co-line">
              {line.image && <img src={line.image} alt="" />}
              <div className="co-line-info">
                <p className="co-line-name">{line.name}</p>
                {line.options && <p className="co-line-meta">{line.options}</p>}
                <p className="co-line-meta">
                  {line.quantity} × {money(line.price)}
                </p>
              </div>
              <p className="co-line-total">{money(line.price * line.quantity)}</p>
            </li>
          ))}
        </ul>

        <fieldset className="co-fieldset">
          <legend>Delivery details</legend>

          <div className="co-fields">
            {FIELDS.map((field) => (
              <label key={field.name} className={field.wide ? "is-wide" : ""}>
                <span>
                  {field.label}
                  {field.optional && <small> (optional)</small>}
                </span>
                <input
                  name={field.name}
                  type={field.type ?? "text"}
                  autoComplete={field.autoComplete}
                  value={shipping[field.name] ?? ""}
                  onChange={updateField}
                  required={!field.optional}
                  disabled={placing}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="co-promo">
          {promo ? (
            <p className={`co-promo-applied ${promoInactive ? "is-inactive" : ""}`}>
              <Tag size={15} />
              <span>
                <strong>{promo.code}</strong> · {describePromo(promo)}
                {promoInactive && ` · needs a ${money(promo.minSubtotal)} subtotal`}
              </span>
              <button type="button" onClick={() => setPromo(null)} disabled={placing}>
                Remove
              </button>
            </p>
          ) : (
            <div className="co-promo-form">
              <input
                type="text"
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyPromo();
                  }
                }}
                placeholder="Promo code"
                aria-label="Promo code"
                disabled={placing}
              />
              <button type="button" onClick={applyPromo} disabled={checkingPromo || placing || !promoInput.trim()}>
                {checkingPromo ? "Checking…" : "Apply"}
              </button>
            </div>
          )}
          {promoError && <p className="co-promo-error">{promoError}</p>}
        </div>

        <dl className="co-totals">
          <div>
            <dt>Subtotal</dt>
            <dd>{money(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div className="co-discount">
              <dt>Discount{totals.promoDiscount > 0 ? ` (incl. ${promo.code})` : ""}</dt>
              <dd>−{money(totals.discount)}</dd>
            </div>
          )}
          <div>
            <dt>Delivery</dt>
            <dd>{totals.delivery > 0 ? money(totals.delivery) : "Free"}</dd>
          </div>
          <div className="co-grand">
            <dt>Total</dt>
            <dd>{money(totals.total)}</dd>
          </div>
        </dl>

        {totals.remainingForFreeDelivery > 0 && (
          <p className="co-note">Add {money(totals.remainingForFreeDelivery)} more to get free delivery.</p>
        )}

        {note && <p className="co-note">{note}</p>}

        <p className="co-note">Payment is collected on delivery.</p>

        {error && (
          <p className="co-error" role="alert">
            {error}
          </p>
        )}

        <div className="co-actions">
          <button type="button" className="co-secondary" onClick={close} disabled={placing}>
            Cancel
          </button>
          <button type="submit" className="co-primary" disabled={placing}>
            {placing ? (
              <>
                <Loader2 size={17} className="co-spin" />
                Placing order…
              </>
            ) : (
              `Place order · ${money(totals.total)}`
            )}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default CheckoutDialog;
