import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  useUser,
  useClerk,
} from "@clerk/clerk-react";

import "./UserMenu.css";

function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div className="user-menu">

      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open account menu"
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || "User"}
          className="user-menu-avatar"
        />

        <ChevronDown
          size={16}
          style={{color : "white"}}
          className={isOpen ? "rotate-icon" : ""}
        />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">

          <div className="user-menu-header">
            <img
              src={user.imageUrl}
              alt={user.fullName || "User"}
              className="user-menu-large-avatar"
            />

            <div>
              <h4>
                {user.fullName || "Plant Lover"}
              </h4>

              <p>
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <div className="user-menu-divider" />

          <Link
            to="/account"
            className="user-menu-item"
            onClick={() => setIsOpen(false)}
          >
            <User size={18} />
            <span>My Account</span>
          </Link>

          <Link
            to="/orders"
            className="user-menu-item"
            onClick={() => setIsOpen(false)}
          >
            <Package size={18} />
            <span>My Orders</span>
          </Link>

          <Link
            to="/wishlist"
            className="user-menu-item"
            onClick={() => setIsOpen(false)}
          >
            <Heart size={18} />
            <span>Wishlist</span>
          </Link>

          <div className="user-menu-divider" />

          <button
            className="user-menu-item logout-item"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>

        </div>
      )}
    </div>
  );
}

export default UserMenu;
