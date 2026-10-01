import { UserButton, useUser } from "@clerk/clerk-react";
import "./AccountPage.css";
import { SignedIn, RedirectToSignIn } from "@clerk/clerk-react";

function AccountPage() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <main className="account-page">
      <section className="account-container">

        <div className="account-header">
          <div>
            <p className="account-eyebrow">MY ACCOUNT</p>
            <h1>Welcome, {user.firstName || "Plant Lover"}</h1>
            <p>
              Manage your Plantify account and personal information.
            </p>
          </div>

          <UserButton />
        </div>

        <div className="account-card">
          <div className="account-avatar">
            <img
              src={user.imageUrl}
              alt={user.fullName || "Profile"}
            />
          </div>

          <div className="account-info">
            <div className="account-field">
              <span>Name</span>
              <strong>
                {user.fullName || "Not provided"}
              </strong>
            </div>

            <div className="account-field">
              <span>Email</span>
              <strong>
                {user.primaryEmailAddress?.emailAddress}
              </strong>
            </div>

            <div className="account-field">
              <span>Account ID</span>
              <strong>{user.id}</strong>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}

export default AccountPage;
