export default function robots() {
  return {
    rules: {
      // Disallow everything — this is a hackathon mock, not the real CPGRAMS.
      // To allow only the public homepage later, scope like:
      //   rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
      userAgent: "*",
      disallow: "/",
    },
    // sitemap: "https://cpgram.usersynax.dev/sitemap.xml",
  };
}
