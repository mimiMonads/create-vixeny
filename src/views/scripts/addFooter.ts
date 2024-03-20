export const updateFooterWithCurrentTime = () => {
  const now = new Date();

  const formattedDateTime = now.toLocaleString("default", {
    year: "numeric",

    month: "long",

    day: "numeric",

    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });

  const footer = document.querySelector("footer p");

  if (footer) {
    footer.innerHTML =
      `&copy; ${now.getFullYear()} create-vixeny. Updated on ${formattedDateTime}`;
  }
};
