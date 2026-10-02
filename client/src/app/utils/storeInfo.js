export const STORE = {
  name: "Plantify Garden",
  phone: "0300 1223344",
  phoneHref: "tel:+923001223344",
  email: "order@platify.co",
  addressLines: ["69-C, Block C3, Gulberg III", "Lahore, Punjab, Pakistan"],
  hours: "Open every day, 11am – 5:30pm",
};

export const GUARANTEE_DAYS = 14;
export const RETURN_DAYS = 14;

export const STORE_ADDRESS = STORE.addressLines.join(", ");

export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`;

export const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;
