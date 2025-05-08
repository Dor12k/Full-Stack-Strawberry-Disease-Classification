
// Utility function to combine multiple class names into a single string.
// It filters out any falsy values (like null, undefined, false, '') 
// and joins the rest with spaces.
// Useful when conditionally applying Tailwind or CSS classes.

export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  