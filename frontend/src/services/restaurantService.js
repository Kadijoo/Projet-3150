export const getRestaurants = async () => {
  const response = await fetch("http://localhost:5000/api/restaurants");
  if (!response.ok) {
    throw new Error("Échec du chargement des restaurants");
  }
  return await response.json();
};
