import {
  BellIcon,
  ChevronRightIcon,
  LeafIcon,
  MailIcon,
  MessageCircleIcon,
  MoonIcon,
  SaveIcon,
  ShoppingBagIcon,
  SparklesIcon
} from "lucide-react";
import React, { useState } from "react";
import "./AccountPreferences.css";

const defaultPreferences = {
  orderUpdates: true,
  deliveryUpdates: true,
  plantCareReminders: true,
  newPlantAlerts: false,
  offers: false,
  emailNotifications: true,
  browserNotifications: true,
  careFrequency: "Weekly",
  appearance: "System"
};

function PreferenceToggle({
  icon,
  title,
  description,
  checked,
  onChange
}) {
  return (
    <button
      type="button"
      className={`account-preference-toggle-row ${
        checked ? "is-active" : ""
      }`}
      onClick={() => onChange(!checked)}
    >
      <div className="account-preference-toggle-icon">
        {icon}
      </div>

      <div className="account-preference-toggle-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <span
        className={`account-preference-switch ${
          checked ? "is-on" : ""
        }`}
      >
        <span />
      </span>
    </button>
  );
}

function AccountPreferences({
  initialPreferences = defaultPreferences,
  onSave
}) {
  const [preferences, setPreferences] = useState(
    initialPreferences
  );

  const [saved, setSaved] = useState(false);

  const updatePreference = (key, value) => {
    setPreferences((current) => ({
      ...current,
      [key]: value
    }));

    setSaved(false);
  };

  const handleSave = () => {
    onSave?.(preferences);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <section className="account-preferences-section">
      <div className="account-preferences-container">

        <div className="account-preferences-heading">

          <div>
            <p className="account-preferences-kicker">
              YOUR PLANTIFY EXPERIENCE
            </p>

            <h2>
              Make it
              <span> yours.</span>
            </h2>

            <p className="account-preferences-description">
              Choose how Plantify keeps you updated, reminds you
              about your plants and stays connected with you.
            </p>
          </div>

          <button
            type="button"
            className={`account-preferences-save ${
              saved ? "is-saved" : ""
            }`}
            onClick={handleSave}
          >
            <SaveIcon size={15} />

            {saved ? "Preferences saved" : "Save preferences"}
          </button>

        </div>

        <div className="account-preferences-layout">

          <div className="account-preferences-main">

            <div className="account-preference-group">

              <div className="account-preference-group-heading">
                <BellIcon size={17} />

                <div>
                  <h3>
                    Notifications
                  </h3>

                  <p>
                    Stay informed without the noise.
                  </p>
                </div>
              </div>

              <div className="account-preference-list">

                <PreferenceToggle
                  icon={<ShoppingBagIcon size={17} />}
                  title="Order updates"
                  description="Get updates when your order changes."
                  checked={preferences.orderUpdates}
                  onChange={(value) =>
                    updatePreference(
                      "orderUpdates",
                      value
                    )
                  }
                />

                <PreferenceToggle
                  icon={<MessageCircleIcon size={17} />}
                  title="Delivery updates"
                  description="Know when your plants are on the way."
                  checked={preferences.deliveryUpdates}
                  onChange={(value) =>
                    updatePreference(
                      "deliveryUpdates",
                      value
                    )
                  }
                />

                <PreferenceToggle
                  icon={<LeafIcon size={17} />}
                  title="Plant-care reminders"
                  description="Receive gentle reminders to care for your plants."
                  checked={preferences.plantCareReminders}
                  onChange={(value) =>
                    updatePreference(
                      "plantCareReminders",
                      value
                    )
                  }
                />

                <PreferenceToggle
                  icon={<SparklesIcon size={17} />}
                  title="New plant alerts"
                  description="Be the first to know about new arrivals."
                  checked={preferences.newPlantAlerts}
                  onChange={(value) =>
                    updatePreference(
                      "newPlantAlerts",
                      value
                    )
                  }
                />

                <PreferenceToggle
                  icon={<MailIcon size={17} />}
                  title="Offers and inspiration"
                  description="Occasional Plantify offers and stories."
                  checked={preferences.offers}
                  onChange={(value) =>
                    updatePreference(
                      "offers",
                      value
                    )
                  }
                />

              </div>

            </div>

            <div className="account-preference-group">

              <div className="account-preference-group-heading">
                <LeafIcon size={17} />

                <div>
                  <h3>
                    Plant-care rhythm
                  </h3>

                  <p>
                    Choose how often you'd like your reminders.
                  </p>
                </div>
              </div>

              <div className="account-care-options">

                {["Weekly", "Every 2 weeks", "Monthly"].map(
                  (frequency) => (
                    <button
                      type="button"
                      key={frequency}
                      className={
                        preferences.careFrequency === frequency
                          ? "is-selected"
                          : ""
                      }
                      onClick={() =>
                        updatePreference(
                          "careFrequency",
                          frequency
                        )
                      }
                    >
                      {frequency}
                    </button>
                  )
                )}

              </div>

            </div>

          </div>

          <aside className="account-preferences-sidebar">

            <div className="account-preferences-card">

              <div className="account-preferences-card-icon">
                <MoonIcon size={18} />
              </div>

              <p>
                APPEARANCE
              </p>

              <h3>
                Your view,
                <br />
                your mood.
              </h3>

              <div className="account-appearance-options">

                {["System", "Light", "Dark"].map(
                  (appearance) => (
                    <button
                      type="button"
                      key={appearance}
                      className={
                        preferences.appearance === appearance
                          ? "is-selected"
                          : ""
                      }
                      onClick={() =>
                        updatePreference(
                          "appearance",
                          appearance
                        )
                      }
                    >
                      {appearance}
                    </button>
                  )
                )}

              </div>

            </div>

            <div className="account-preferences-note">

              <SparklesIcon size={17} />

              <div>
                <strong>
                  A calmer Plantify.
                </strong>

                <p>
                  We'll only send what you've chosen to
                  receive.
                </p>
              </div>

            </div>

          </aside>

        </div>

        <div className="account-preferences-footer">
          <p>
            You can change these preferences anytime.
          </p>

          <button
            type="button"
            onClick={() => {
              setPreferences(defaultPreferences);
              setSaved(false);
            }}
          >
            Reset preferences
            <ChevronRightIcon size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}

export default AccountPreferences;

