import React, { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { useSupabase } from "../../../Context/SupabaseContext";
import { describePromo, toPromo } from "../../../utils/cart";
import { formatOrderDate } from "../../../utils/orders";

import "./AdminPromos.css";

const EMPTY_FORM = {
  code: "",
  kind: "percent",
  amount: "",
  minSubtotal: "",
  maxUses: "",
  expiresAt: "",
};

const toRow = (row) => ({
  ...toPromo(row),
  maxUses: row.max_uses,
  uses: row.uses,
  expiresAt: row.expires_at,
  active: row.active,
});

const promoState = (promo) => {
  if (!promo.active) return { label: "Paused", tone: "is-paused" };
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return { label: "Expired", tone: "is-ended" };
  if (promo.maxUses && promo.uses >= promo.maxUses) return { label: "Used up", tone: "is-ended" };
  return { label: "Live", tone: "is-live" };
};

function AdminPromos() {
  const supabase = useSupabase();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(
    () =>
      supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error: fetchError }) => {
          if (fetchError) setError(fetchError.message);
          else setPromos(data.map(toRow));
          setLoading(false);
        }),
    [supabase]
  );

  useEffect(() => {
    load();
  }, [load]);

  const update = (field) => (event) =>
    setForm((previous) => ({
      ...previous,
      [field]: field === "code" ? event.target.value.toUpperCase().replace(/\s/g, "") : event.target.value,
    }));

  const create = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("promo_codes").insert({
      code: form.code,
      kind: form.kind,
      amount: Number(form.amount),
      min_subtotal: form.minSubtotal === "" ? 0 : Number(form.minSubtotal),
      max_uses: form.maxUses === "" ? null : Number(form.maxUses),
      expires_at: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`).toISOString() : null,
    });

    setSaving(false);

    if (insertError) {
      setError(
        insertError.code === "23505" ? `The code ${form.code} already exists.` : insertError.message
      );
      return;
    }

    setForm(null);
    load();
  };

  const toggleActive = async (promo) => {
    setPromos((previous) =>
      previous.map((item) => (item.code === promo.code ? { ...item, active: !promo.active } : item))
    );

    const { error: updateError } = await supabase
      .from("promo_codes")
      .update({ active: !promo.active })
      .eq("code", promo.code);

    if (updateError) {
      setError(updateError.message);
      load();
    }
  };

  const remove = async (promo) => {
    setConfirmDelete(null);
    const { error: deleteError } = await supabase.from("promo_codes").delete().eq("code", promo.code);

    if (deleteError) setError(deleteError.message);
    load();
  };

  if (loading) {
    return <p className="admin-muted">Loading promo codes…</p>;
  }

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <p className="admin-muted">
          {promos.length} {promos.length === 1 ? "code" : "codes"} · stacks with the automatic $9 discount
        </p>
        {!form && (
          <button type="button" className="admin-button" onClick={() => setForm(EMPTY_FORM)}>
            <Plus size={16} />
            New code
          </button>
        )}
      </div>

      {error && <p className="admin-error">{error}</p>}

      {form && (
        <form className="admin-promo-form" onSubmit={create}>
          <div className="admin-form-grid">
            <label>
              Code
              <input
                required
                value={form.code}
                onChange={update("code")}
                pattern="[A-Z0-9_\-]{3,20}"
                title="3–20 letters, numbers, dashes or underscores"
                placeholder="SPRING15"
              />
            </label>

            <label>
              Type
              <select value={form.kind} onChange={update("kind")}>
                <option value="percent">Percent off</option>
                <option value="fixed">Fixed amount off</option>
              </select>
            </label>

            <label>
              {form.kind === "percent" ? "Percent (1–100)" : "Amount ($)"}
              <input
                required
                type="number"
                min="0.01"
                max={form.kind === "percent" ? 100 : undefined}
                step="0.01"
                value={form.amount}
                onChange={update("amount")}
              />
            </label>

            <label>
              Minimum subtotal ($)
              <input type="number" min="0" step="0.01" value={form.minSubtotal} onChange={update("minSubtotal")} placeholder="0" />
            </label>

            <label>
              Usage limit
              <input type="number" min="1" step="1" value={form.maxUses} onChange={update("maxUses")} placeholder="Unlimited" />
            </label>

            <label>
              Expires
              <input type="date" value={form.expiresAt} onChange={update("expiresAt")} />
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-button" disabled={saving}>
              {saving ? "Creating…" : "Create code"}
            </button>
            <button type="button" className="admin-button secondary" onClick={() => setForm(null)} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {promos.length === 0 ? (
        !form && <p className="admin-muted">No promo codes yet. Create one to offer customers a discount at checkout.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. subtotal</th>
                <th>Used</th>
                <th>Expires</th>
                <th>State</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => {
                const state = promoState(promo);

                return (
                  <tr key={promo.code} className={promo.active ? "" : "is-hidden"}>
                    <td>
                      <code className="admin-promo-code">{promo.code}</code>
                    </td>
                    <td>{describePromo(promo)}</td>
                    <td>{promo.minSubtotal > 0 ? `$${promo.minSubtotal.toFixed(2)}` : "—"}</td>
                    <td>
                      {promo.uses}
                      {promo.maxUses ? ` / ${promo.maxUses}` : ""}
                    </td>
                    <td>{promo.expiresAt ? formatOrderDate(promo.expiresAt) : "Never"}</td>
                    <td>
                      <span className={`admin-promo-state ${state.tone}`}>{state.label}</span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <label className="admin-inline-check">
                          <input type="checkbox" checked={promo.active} onChange={() => toggleActive(promo)} />
                          Active
                        </label>
                        {confirmDelete === promo.code ? (
                          <>
                            <button type="button" className="admin-delete-confirm" onClick={() => remove(promo)}>
                              Yes
                            </button>
                            <button type="button" className="admin-link-button" onClick={() => setConfirmDelete(null)}>
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="admin-icon-button"
                            onClick={() => setConfirmDelete(promo.code)}
                            aria-label={`Delete ${promo.code}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminPromos;
