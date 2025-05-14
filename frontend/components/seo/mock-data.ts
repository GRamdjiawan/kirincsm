// Mock pages data with SEO information
export const pages = [
  {
    id: "page1",
    title: "Homepage",
    url: "https://example.com/",
    meta_title: "Example.com | Your Digital Solution Partner",
    meta_description:
      "Example.com provides cutting-edge digital solutions for businesses of all sizes. Explore our services and start your digital transformation today.",
    keywords: "digital solutions, web development, digital transformation",
    og_image_url: "https://example.com/images/og-home.jpg",
    status: "optimized",
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "page2",
    title: "About Us",
    url: "https://example.com/about",
    meta_title: "About Example.com | Our Story and Mission",
    meta_description:
      "Learn about Example.com's journey, our mission, and the team behind our success. Discover why we're the right partner for your business.",
    keywords: "about us, company history, mission statement",
    og_image_url: "https://example.com/images/og-about.jpg",
    status: "optimized",
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: "page3",
    title: "Services",
    url: "https://example.com/services",
    meta_title: "Our Services | Web Development, Design & More",
    meta_description: "",
    keywords: "services, web development, web design, digital marketing",
    og_image_url: "",
    status: "needs-review",
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
  },
  {
    id: "page4",
    title: "Contact Us",
    url: "https://example.com/contact",
    meta_title: "",
    meta_description: "",
    keywords: "",
    og_image_url: "",
    status: "not-optimized",
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
  },
  {
    id: "page5",
    title: "Blog",
    url: "https://example.com/blog",
    meta_title: "Blog | Latest Insights & Industry News",
    meta_description:
      "Stay updated with the latest industry insights, trends, and news on our blog. Expert articles on web development, design, and digital marketing.",
    keywords: "blog, insights, industry news, web development trends",
    og_image_url: "https://example.com/images/og-blog.jpg",
    status: "optimized",
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
  },
  {
    id: "page6",
    title: "Pricing",
    url: "https://example.com/pricing",
    meta_title: "Pricing | Affordable Plans for Every Business",
    meta_description: "",
    keywords: "pricing, plans, affordable solutions",
    og_image_url: "https://example.com/images/og-pricing.jpg",
    status: "needs-review",
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },
]
