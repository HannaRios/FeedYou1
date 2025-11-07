import axios from "axios";

export async function fetchFeed(tags) {
  try {
    const tagsQuery = tags.join(',');
    const response = await fetch(`http://localhost:4000/api/feed?tags=${tagsQuery}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
}