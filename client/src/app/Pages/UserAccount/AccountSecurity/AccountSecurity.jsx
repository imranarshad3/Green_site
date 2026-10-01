import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  KeyRoundIcon,
  LogOutIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  Trash2Icon
} from "lucide-react";
import React, { useState } from "react";
import "./AccountSecurity.css";

function AccountSecurity({
  onPasswordChange,
  onSignOut,
  onDeleteAccount,
  activeSessions = []
}) {
  const [showDelete, setShowDelete] = useState(false);

  const sessions = activeSessions.length
    ? activeSessions
    : [
        {
          id: 1,
          device: "Current browser",
          location: "Lahore, Pakistan",
          lastActive: "Active now",
          current: true
        }
      ];

  return (
    <section className="account-security-section">
      <div className="account-security-container">

        <div className="account-security-heading">
          <div>
            <p className="account-security-kicker">
              ACCOUNT & PRIVACY
            </p>

            <h2>
              Stay
              <span> protected.</span>
            </h2>

            <p className="account-security-description">
              Manage your account security and keep your
              Plantify account protected.
            </p>
          </div>

          <div className="account-security-status">
            <CheckCircle2Icon size={15} />
            <span>Account protected</span>
          </div>
        </div>

        <div className="account-security-grid">

          <div className="account-security-main">

            <div className="account-security-card">

              <div className="account-security-card-heading">
                <div className="account-security-card-icon">
                  <KeyRoundIcon size={18} />
                </div>

                <div>
                  <h3>
                    Password & sign-in
                  </h3>

                  <p>
                    Manage how you access your account.
                  </p>
                </div>
              </div>

              <div className="account-security-action">

                <div>
                  <strong>
                    Password
                  </strong>

                  <span>
                    Your password is managed securely.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onPasswordChange}
                >
                  Change password
                  <ArrowUpRightIcon size={14} />
                </button>

              </div>

            </div>

            <div className="account-security-card">

              <div className="account-security-card-heading">
                <div className="account-security-card-icon">
                  <SmartphoneIcon size={18} />
                </div>

                <div>
                  <h3>
                    Active sessions
                  </h3>

                  <p>
                    Devices currently signed in to your account.
                  </p>
                </div>
              </div>

              <div className="account-security-sessions">

                {sessions.map((session) => (
                  <div
                    className="account-security-session"
                    key={session.id}
                  >

                    <div className="account-security-session-device">
                      <div className="account-security-device-icon">
                        <SmartphoneIcon size={16} />
                      </div>

                      <div>
                        <strong>
                          {session.device}
                        </strong>

                        <span>
                          {session.location}
                        </span>
                      </div>
                    </div>

                    <div className="account-security-session-meta">
                      <span>
                        {session.lastActive}
                      </span>

                      {session.current && (
                        <small>
                          Current
                        </small>
                      )}
                    </div>

                  </div>
                ))}

              </div>

              <button
                type="button"
                className="account-security-signout"
                onClick={onSignOut}
              >
                <LogOutIcon size={14} />
                Sign out of other sessions
              </button>

            </div>

          </div>

          <aside className="account-security-sidebar">

            <div className="account-security-protection-card">

              <div className="account-security-protection-icon">
                <ShieldCheckIcon size={20} />
              </div>

              <p>
                SECURITY
              </p>

              <h3>
                Your account,
                <br />
                your control.
              </h3>

              <span>
                Plantify uses secure authentication to help
                protect your account and personal information.
              </span>

              <div className="account-security-check">
                <CheckCircle2Icon size={14} />
                <span>Secure authentication</span>
              </div>

              <div className="account-security-check">
                <CheckCircle2Icon size={14} />
                <span>Protected account access</span>
              </div>

            </div>

          </aside>

        </div>

        <div className="account-security-danger">

          <div className="account-security-danger-icon">
            <AlertTriangleIcon size={18} />
          </div>

          <div className="account-security-danger-content">

            <p>
              DANGER ZONE
            </p>

            <h3>
              Delete your account
            </h3>

            <span>
              Permanently remove your Plantify account and
              associated account data.
            </span>

          </div>

          {!showDelete ? (
            <button
              type="button"
              onClick={() => setShowDelete(true)}
            >
              Delete account
              <Trash2Icon size={14} />
            </button>
          ) : (
            <div className="account-security-delete-confirm">

              <span>
                Are you sure?
              </span>

              <button
                type="button"
                className="account-security-cancel-delete"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="account-security-confirm-delete"
                onClick={onDeleteAccount}
              >
                Yes, delete
              </button>

            </div>
          )}

        </div>

        <div className="account-security-footer">
          <p>
            Security settings are managed through your
            authenticated Plantify account.
          </p>

          <button type="button">
            Security help
            <ChevronRightIcon size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}

export default AccountSecurity;

