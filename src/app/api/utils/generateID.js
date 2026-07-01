export function generateID(index) {
  try {
    const base = Date.now().toString(36); // Convert current timestamp to base36
    const rand = Math.random().toString(36).slice(2, 4); // Generate a random string of 2 characters
    const suffix = !!index ? (index + 1).toString(36).padStart(2, "0") : ""; // Add a suffix if index is greater than 0
    return `${base}${rand}${suffix === "" ? "" : "-" + suffix}`; // Concatenate base, random string, and suffix
  } catch (err) {
    console.error("Error generating ID:", err.message);
  }
}
