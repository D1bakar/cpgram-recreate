const BASE_URL = "https://cpgram.usersynax.dev";

export default function sitemap() {
  // Only the public locale homepages; admin routes excluded on purpose.
  return [
    { url: `${BASE_URL}/en`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/hi`, changeFrequency: "weekly", priority: 1 },
  ];
}
