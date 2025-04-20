export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/def.png";
  
  // If path already has the full URL, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Otherwise, combine with the API URL
  return `${process.env.REACT_APP_API_URL}${imagePath}`;
};

// Any other helper functions you have...