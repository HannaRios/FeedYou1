export async function fetchFeed() {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await fetch("http://localhost:4000/api/feed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: user.email
    })
  });

  const data = await response.json();
  return data.results;
}
