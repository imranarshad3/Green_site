import {
  ArrowUpRightIcon,
  CheckIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AccountAddress.css";

const defaultAddresses = [
  {
    id: 1,
    type: "Home",
    name: "Imran Khan",
    address: "House 24, Street 8",
    area: "Model Town",
    city: "Lahore",
    postalCode: "54700",
    country: "Pakistan",
    phone: "+92 300 0000000",
    isDefault: true
  },
  {
    id: 2,
    type: "Office",
    name: "Imran Khan",
    address: "Office 14, Main Boulevard",
    area: "Gulberg III",
    city: "Lahore",
    postalCode: "54660",
    country: "Pakistan",
    phone: "+92 300 0000000",
    isDefault: false
  }
];

function AccountAddress({
  addresses = defaultAddresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault
}) {
  const [addressList, setAddressList] = useState(addresses);

  const handleDelete = (id) => {
    setAddressList((current) =>
      current.filter((address) => address.id !== id)
    );

    onDelete?.(id);
  };

  const handleDefault = (id) => {
    setAddressList((current) =>
      current.map((address) => ({
        ...address,
        isDefault: address.id === id
      }))
    );

    onSetDefault?.(id);
  };

  return (
    <section className="account-addresses-section">
      <div className="account-addresses-container">

        <div className="account-addresses-heading">

          <div>
            <p className="account-addresses-kicker">
              DELIVERY DETAILS
            </p>

            <h2>
              Your
              <span> addresses.</span>
            </h2>

            <p className="account-addresses-description">
              Save your favourite delivery spots so every
              Plantify order arrives exactly where it should.
            </p>
          </div>

          <button
            type="button"
            className="account-address-add"
            onClick={onAdd}
          >
            <PlusIcon size={15} />
            Add new address
          </button>

        </div>

        {addressList.length > 0 ? (
          <div className="account-addresses-grid">

            {addressList.map((address) => (
              <article
                className={`account-address-card ${
                  address.isDefault ? "is-default" : ""
                }`}
                key={address.id}
              >

                <div className="account-address-card-top">

                  <div className="account-address-icon">
                    <MapPinIcon size={19} />
                  </div>

                  <div className="account-address-actions">

                    <button
                      type="button"
                      onClick={() => onEdit?.(address)}
                      aria-label={`Edit ${address.type} address`}
                    >
                      <PencilIcon size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(address.id)}
                      aria-label={`Delete ${address.type} address`}
                    >
                      <Trash2Icon size={14} />
                    </button>

                  </div>

                </div>

                <div className="account-address-content">

                  <div className="account-address-title">

                    <h3>
                      {address.type}
                    </h3>

                    {address.isDefault && (
                      <span className="account-address-default">
                        <CheckIcon size={11} />
                        Default
                      </span>
                    )}

                  </div>

                  <p className="account-address-name">
                    {address.name}
                  </p>

                  <p className="account-address-text">
                    {address.address}
                    <br />
                    {address.area}
                    <br />
                    {address.city}, {address.postalCode}
                    <br />
                    {address.country}
                  </p>

                  <p className="account-address-phone">
                    {address.phone}
                  </p>

                </div>

                {!address.isDefault && (
                  <button
                    type="button"
                    className="account-address-set-default"
                    onClick={() => handleDefault(address.id)}
                  >
                    Set as default
                    <ArrowUpRightIcon size={13} />
                  </button>
                )}

              </article>
            ))}

            <button
              type="button"
              className="account-address-new-card"
              onClick={onAdd}
            >
              <span className="account-address-new-icon">
                <PlusIcon size={20} />
              </span>

              <span className="account-address-new-title">
                Add another address
              </span>

              <span className="account-address-new-description">
                Save another place for your next delivery.
              </span>
            </button>

          </div>
        ) : (
          <div className="account-address-empty">

            <div className="account-address-empty-icon">
              <MapPinIcon size={22} />
            </div>

            <p>
              NO SAVED ADDRESSES
            </p>

            <h3>
              Where should we deliver?
            </h3>

            <span>
              Add your first delivery address and make
              your next Plantify order effortless.
            </span>

            <button
              type="button"
              onClick={onAdd}
            >
              <PlusIcon size={15} />
              Add address
            </button>

          </div>
        )}

        <div className="account-addresses-footer">
          <p>
            Your saved addresses are used only for your deliveries.
          </p>

          <Link to="/contact">
            Need help?
            <ArrowUpRightIcon size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default AccountAddress;
