const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL desde Vite:", API_URL);

export const fetchFeed = async (email) => {
  try {
    const res = await fetch(
      `${API_URL}/api/feed/para-ti/${email}`
    );

    const data = await res.json();
    console.log("Feed recibido correctamente:", data);

    return data;

  } catch (error) {

    console.error("Error fetchFeed:", error);

    return [];

  }

};

export const fetchFeedSeguidos = async (email) => {
  try {
    const res = await fetch(
      `${API_URL}/api/feed/seguidos/${email}`
    );

    const data = await res.json();
    console.log("Feed de seguidos:", data);

    return data;

  } catch (error) {

    console.error("Error fetchFeedSeguidos:", error);

    return [];
  }
};

