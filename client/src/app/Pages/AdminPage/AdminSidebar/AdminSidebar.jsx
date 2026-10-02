import React from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { LogOut, Store, X } from "lucide-react";

import icon from "../../../ReusedComponents/Navbar/Images/icon.webp";
import "./AdminSidebar.css";

function AdminSidebar({ groups, active, onSelect, counts, open, onClose }) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const name = user?.fullName || user?.username || "Admin";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div
        className={`adm-backdrop ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`adm-sidebar ${open ? "is-open" : ""}`} aria-label="Admin navigation">
        <div className="adm-brand">
          <Link to="/" className="adm-brand-logo" aria-label="Plantify Garden home">
            <img src={icon} alt="" />
          </Link>
          <span className="adm-brand-chip">Admin</span>
          <button type="button" className="adm-sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="adm-nav">
          {groups.map((group) => (
            <div key={group.label} className="adm-nav-group">
              <p className="adm-nav-heading">{group.label}</p>
              <ul>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const count = counts[item.id];
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`adm-nav-link ${active === item.id ? "is-active" : ""}`}
                        aria-current={active === item.id ? "page" : undefined}
                        onClick={() => onSelect(item.id)}
                      >
                        <Icon size={18} strokeWidth={1.8} />
                        <span className="adm-nav-label">{item.label}</span>
                        {count > 0 && (
                          <span className="adm-nav-badge" aria-label={`${count} ${item.badgeLabel}`}>
                            {count > 99 ? "99+" : count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-foot">
          <Link to="/" className="adm-store-link">
            <Store size={17} strokeWidth={1.8} />
            View store
          </Link>

          <div className="adm-user">
            {user?.imageUrl ? (
              <img className="adm-user-avatar" src={user.imageUrl} alt="" />
            ) : (
              <span className="adm-user-avatar">{initials}</span>
            )}
            <div className="adm-user-text">
              <strong>{name}</strong>
              {email && <span>{email}</span>}
            </div>
            <button
              type="button"
              className="adm-user-signout"
              onClick={() => signOut({ redirectUrl: "/" })}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
