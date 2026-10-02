import React, { useCallback, useEffect, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { Star } from "lucide-react";

import { useSupabase } from "../../../Context/SupabaseContext";
import { useProducts } from "../../../Context/ProductsContext";
import { useIsAdmin } from "../../../Context/useIsAdmin";
import { formatOrderDate } from "../../../utils/orders";

import "./ProductReviews.css";

const toReview = (row) => ({
  id: row.id,
  userId: row.user_id,
  author: row.author_name,
  rating: row.rating,
  title: row.title,
  body: row.body,
  date: formatOrderDate(row.created_at),
  edited: Boolean(row.updated_at),
});

function Stars({ value, size = 15 }) {
  return (
    <span className="rv-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star key={index} size={size} fill={index <= Math.round(value) ? "currentColor" : "none"} aria-hidden="true" />
      ))}
    </span>
  );
}

function ReviewForm({ initial, defaultAuthor, saving, error, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    rating: initial?.rating ?? 0,
    title: initial?.title ?? "",
    body: initial?.body ?? "",
    author: initial?.author ?? defaultAuthor,
  });

  const update = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  return (
    <form
      className="rv-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (form.rating > 0) onSubmit(form);
      }}
    >
      <fieldset className="rv-rating-input">
        <legend>Your rating</legend>
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value} className={value <= form.rating ? "is-on" : ""}>
            <input
              type="radio"
              name="rating"
              value={value}
              checked={form.rating === value}
              onChange={() => setForm((previous) => ({ ...previous, rating: value }))}
            />
            <Star size={24} fill={value <= form.rating ? "currentColor" : "none"} aria-hidden="true" />
            <span className="rv-visually-hidden">{value} stars</span>
          </label>
        ))}
      </fieldset>

      <label>
        Name shown
        <input value={form.author} onChange={update("author")} maxLength={80} required />
      </label>

      <label>
        Title <small>(optional)</small>
        <input value={form.title} onChange={update("title")} maxLength={120} />
      </label>

      <label>
        Review
        <textarea value={form.body} onChange={update("body")} rows={4} maxLength={2000} required />
      </label>

      {error && <p className="rv-error" role="alert">{error}</p>}

      <div className="rv-form-actions">
        <button type="submit" className="rv-primary" disabled={saving || form.rating === 0}>
          {saving ? "Saving…" : initial ? "Save changes" : "Post review"}
        </button>
        {onCancel && (
          <button type="button" className="rv-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function ProductReviews({ product }) {
  const supabase = useSupabase();
  const { isSignedIn, userId } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { reload } = useProducts();
  const { isAdmin } = useIsAdmin();

  const [reviews, setReviews] = useState({ productId: null, list: [] });
  const [eligibility, setEligibility] = useState({ key: null, allowed: false });
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    () =>
      supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => setReviews({ productId: product.id, list: (data ?? []).map(toReview) })),
    [supabase, product.id]
  );

  useEffect(() => {
    load();
  }, [load]);

  const eligibilityKey = isSignedIn ? `${userId}-${product.id}` : null;

  useEffect(() => {
    if (!eligibilityKey) return;

    supabase
      .rpc("has_received_product", { p_product_id: product.id })
      .then(({ data }) => setEligibility({ key: eligibilityKey, allowed: Boolean(data) }));
  }, [supabase, eligibilityKey, product.id]);

  const list = reviews.productId === product.id ? reviews.list : [];
  const canReview = eligibility.key === eligibilityKey && eligibility.allowed;
  const ownReview = isSignedIn ? list.find((review) => review.userId === userId) : null;
  const average = list.length
    ? list.reduce((sum, review) => sum + review.rating, 0) / list.length
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: list.filter((review) => review.rating === stars).length,
  }));

  const save = async (form) => {
    setSaving(true);
    setError(null);

    const fields = {
      rating: form.rating,
      title: form.title.trim() || null,
      body: form.body.trim(),
      author_name: form.author.trim(),
    };

    const { error: saveError } = ownReview
      ? await supabase
          .from("product_reviews")
          .update({ ...fields, updated_at: new Date().toISOString() })
          .eq("id", ownReview.id)
      : await supabase.from("product_reviews").insert({ ...fields, product_id: product.id });

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setEditing(false);
    load();
    reload();
  };

  const remove = async (review) => {
    const { error: deleteError } = await supabase.from("product_reviews").delete().eq("id", review.id);

    setConfirmDelete(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    load();
    reload();
  };

  const defaultAuthor = user?.fullName || user?.firstName || "";

  let prompt = null;

  if (!isSignedIn) {
    prompt = (
      <p className="rv-prompt">
        Bought this {product.type === "fertilizer" ? "fertilizer" : "plant"}?{" "}
        <button type="button" onClick={() => openSignIn()}>
          Sign in
        </button>{" "}
        to leave a review.
      </p>
    );
  } else if (ownReview && !editing) {
    prompt = null;
  } else if (ownReview || canReview) {
    prompt = (
      <ReviewForm
        key={ownReview?.id ?? "new"}
        initial={ownReview}
        defaultAuthor={defaultAuthor}
        saving={saving}
        error={error}
        onSubmit={save}
        onCancel={ownReview ? () => setEditing(false) : null}
      />
    );
  } else {
    prompt = (
      <p className="rv-prompt">
        Reviews open up once this item has been delivered to you.
      </p>
    );
  }

  return (
    <section className="rv-section" id="reviews">
      <div className="rv-container">
        <div className="rv-summary">
          <p className="rv-kicker">CUSTOMER REVIEWS</p>
          <h2>What growers say.</h2>

          {list.length > 0 ? (
            <>
              <div className="rv-average">
                <strong>{average.toFixed(1)}</strong>
                <div>
                  <Stars value={average} size={18} />
                  <span>
                    {list.length} {list.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>

              <ul className="rv-bars">
                {distribution.map((row) => (
                  <li key={row.stars}>
                    <span>{row.stars}★</span>
                    <span className="rv-bar">
                      <span style={{ width: `${(row.count / list.length) * 100}%` }} />
                    </span>
                    <span>{row.count}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="rv-empty">No reviews yet.</p>
          )}

          {prompt}
        </div>

        <ul className="rv-list">
          {list.map((review) => {
            const isOwn = review.userId === userId;

            return (
              <li key={review.id} className={`rv-card ${isOwn ? "is-own" : ""}`}>
                <div className="rv-card-head">
                  <Stars value={review.rating} />
                  <span className="rv-date">
                    {review.date}
                    {review.edited && " · edited"}
                  </span>
                </div>

                {review.title && <h3>{review.title}</h3>}
                <p className="rv-body">{review.body}</p>

                <div className="rv-card-foot">
                  <span className="rv-author">
                    {review.author}
                    {isOwn && " (you)"}
                  </span>

                  {(isOwn || isAdmin) && (
                    <div className="rv-card-actions">
                      {confirmDelete === review.id ? (
                        <>
                          <span>Delete?</span>
                          <button type="button" onClick={() => remove(review)}>Yes</button>
                          <button type="button" onClick={() => setConfirmDelete(null)}>No</button>
                        </>
                      ) : (
                        <>
                          {isOwn && !editing && (
                            <button type="button" onClick={() => setEditing(true)}>Edit</button>
                          )}
                          <button type="button" onClick={() => setConfirmDelete(review.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default ProductReviews;
