export const updateFooterWithCurrentTime = () => {
  // Get the current date and time

  const now = new Date();

  // Format the date and time as you prefer, here it's in a simple YYYY-MM-DD HH:MM format

  const formattedDateTime = now.toLocaleString("default", {
    year: "numeric",

    month: "long",

    day: "numeric",

    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });

  // Find the footer element by its tag

  const footer = document.querySelector("footer p");

  if (footer) {
    // Update the footer content with the current date and time

    footer.innerHTML =
      `&copy; ${now.getFullYear()} create-vixeny. Updated on ${formattedDateTime}`;
  }
};
