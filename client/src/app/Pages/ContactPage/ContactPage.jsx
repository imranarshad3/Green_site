import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import HomeFooter from "../HomePage/Components/HomeFooter/HomeFooter";
import { useSupabase } from "../../Context/SupabaseContext";
import { DIRECTIONS_URL, MAP_EMBED_URL, STORE } from "../../utils/storeInfo";
import "./ContactPage.css";

const SUBJECTS = ["General question", "Help with an order", "Plant care", "Wholesale & events"];

const emptyForm = (user) => ({
  name: user?.fullName ?? "",
  email: user?.primaryEmailAddress?.emailAddress ?? "",
  subject: SUBJECTS[0],
  message: "",
});

function ContactForm() {
  const supabase = useSupabase();
  const { user } = useUser();
  // Prefilled once from the signed-in user, if any.
  const [form, setForm] = useState(() => emptyForm(user));
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const update = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const { error: insertError } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject,
      message: form.message.trim(),
    });

    if (insertError) {
      setStatus("error");
      setError("Sorry, your message couldn't be sent. Please try again or email us directly.");
      return;
    }

    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="ct-form ct-sent" role="status">
        <CheckCircle2 size={40} strokeWidth={1.4} />
        <h2>Thank you, {form.name.split(" ")[0] || "friend"}!</h2>
        <p>
          Your message is on its way. We'll reply to <strong>{form.email}</strong> as
          soon as we can.
        </p>
        <button
          type="button"
          className="hm-text-link ct-reset"
          onClick={() => {
            setForm(emptyForm(user));
            setStatus("idle");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="ct-form" onSubmit={handleSubmit}>
      <div className="ct-row">
        <label>
          Your name
          <input required maxLength={120} autoComplete="name" value={form.name} onChange={update("name")} />
        </label>
        <label>
          Email
          <input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={update("email")} />
        </label>
      </div>

      <label>
        Topic
        <select value={form.subject} onChange={update("subject")}>
          {SUBJECTS.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </label>

      <label>
        Message
        <textarea
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          value={form.message}
          onChange={update("message")}
          placeholder="How can we help?"
        />
      </label>

      {error && (
        <p className="ct-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="hm-button hm-button--dark ct-submit" disabled={status === "sending"}>
        <Send size={16} />
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function ContactPage() {
  return (
    <div className="ct-page">
      <Navbar />

      <header className="ct-header">
        <div className="hm-container">
          <span className="hm-eyebrow">Contact</span>
          <h1 className="hm-title ct-title">
            We'd love to <em>hear from you.</em>
          </h1>
          <p className="hm-lead">
            Questions about an order, a plant that needs help, or something else
            entirely? Send us a note. You can also find quick answers in our{" "}
            <Link to="/faq">FAQ</Link>.
          </p>
        </div>
      </header>

      <section className="hm-container ct-body">
        <ContactForm />

        <aside className="ct-info">
          <a className="ct-card" href={STORE.phoneHref}>
            <Phone size={20} strokeWidth={1.6} />
            <span>
              <strong>Call us</strong>
              {STORE.phone}
            </span>
          </a>
          <a className="ct-card" href={`mailto:${STORE.email}`}>
            <Mail size={20} strokeWidth={1.6} />
            <span>
              <strong>Email</strong>
              {STORE.email}
            </span>
          </a>
          <a className="ct-card" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
            <MapPin size={20} strokeWidth={1.6} />
            <span>
              <strong>Visit</strong>
              {STORE.addressLines[0]}, {STORE.addressLines[1]}
            </span>
          </a>
          <div className="ct-card">
            <Clock size={20} strokeWidth={1.6} />
            <span>
              <strong>Hours</strong>
              {STORE.hours}
            </span>
          </div>
          <div className="ct-map">
            <iframe title="Map showing the Plantify studio" src={MAP_EMBED_URL} loading="lazy" />
          </div>
        </aside>
      </section>

      <HomeFooter />
    </div>
  );
}

export default ContactPage;
