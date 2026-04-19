export const site = {
  name: "Teddy Bears Kenya",
  tagline: "Hugs in Every Bear · Kenya's #1 Teddy Gift Shop",
  phone: "+254 700 123 456",
  phoneRaw: "254700123456",
  email: "hello@teddybears.co.ke",
  address: "Westlands, Nairobi",
  whatsappMsg: "Hi Teddy Bears Kenya! I'd love to send a hug 🧸",
};

export const whatsappLink = (msg = site.whatsappMsg) =>
  `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(msg)}`;
