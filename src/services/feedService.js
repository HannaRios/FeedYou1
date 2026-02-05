export const fetchFeed = async (email) => {
  const res = await fetch(`http://localhost:4000/api/feed/para-ti/${email}`);
  return res.json();
};
