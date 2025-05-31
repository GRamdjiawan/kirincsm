// Section type definitions
export type SectionType = "TEXT" | "CAROUSEL" | "GALLERY" | "CARD" | "HERO"

// Content type definitions for each section type
export type BaseContent = {
  title: string
}

export type TextContent = BaseContent & {
  text: string
}

export type CarouselContent = BaseContent & {
  slides: Array<{
    id: string
    imageUrl: string
    caption: string
    subtitle?: string
    url?: string
  }>
  autoplay: boolean
  interval: number
  showArrows: boolean
  showDots: boolean
  animation: "slide" | "fade"
  clickAction: "none" | "link" | "modal"
  height: "small" | "medium" | "large"
  captionStyle: "overlay" | "below" | "white-box"
}

export type GalleryContent = BaseContent & {
  images: Array<{
    id: string
    imageUrl: string
    caption: string
  }>
  columns: number
}

export type CardSectionContent = BaseContent & {
  imageUrl: string
  heading: string
  text: string
  buttonText: string
  buttonUrl: string
}

export type HeroContent = BaseContent & {
  backgroundType: "image" | "video"
  backgroundUrl: string
  overlayOpacity: number
  headline: string
  subtext: string
  buttonText: string
  buttonUrl: string
  buttonStyle: "primary" | "secondary" | "outline" | "gradient"
  textAlignment: "left" | "center" | "right"
  fullHeight: boolean
}

// Union type for all content types
export type SectionContent = TextContent | CarouselContent | GalleryContent | CardSectionContent | HeroContent

// Section interface
export interface Section {
  id: string
  title: string
  type: SectionType
  content: SectionContent
}

export const availablePages = async () => {
  const res = await fetch("http://localhost:8000/api/pages",{credentials: "include"})
  if (!res.ok) {throw new Error("Failed to fetch pages")}
  return res.json()
}

// Helper function to create default content based on section type
export const createDefaultContent = (type: SectionType): SectionContent => {
  switch (type) {
    case "TEXT":
      return {
        title: "Text Section",
        text: "",
      }
    case "CAROUSEL":
      return {
        title: "Carousel Section",
        slides: [
          {
            id: `slide-${Date.now()}-1`,
            imageUrl: "",
            caption: "Slide 1",
            subtitle: "Subtitle for slide 1",
            url: "/slide-1",
          },
        ],
        autoplay: true,
        interval: 15000,
        showArrows: true,
        showDots: true,
        animation: "slide",
        clickAction: "link",
        height: "medium",
        captionStyle: "white-box",
      }
    case "GALLERY":
      return {
        title: "Gallery Section",
        images: [],
        columns: 3,
      }
    case "CARD":
      return {
        title: "Card Section",
        imageUrl: "",
        heading: "",
        text: "",
        buttonText: "",
        buttonUrl: "",
      }
    case "HERO":
      return {
        title: "Hero Section",
        backgroundType: "image",
        backgroundUrl: "",
        overlayOpacity: 50,
        headline: "Welcome to Our Website",
        subtext: "Discover our amazing products and services",
        buttonText: "Get Started",
        buttonUrl: "/contact",
        buttonStyle: "gradient",
        textAlignment: "center",
        fullHeight: true,
      }
    default:
      return {
        title: "Text Section",
        text: "",
      }
  }
}

// Mock data for sections
export const initialSections: Record<string, Section[]> = {
  "1": [
    {
      id: "s1",
      title: "Hero Banner",
      type: "HERO",
      content: {
        title: "Welcome to our website",
        backgroundType: "image",
        backgroundUrl: "/hero-background.png",
        overlayOpacity: 40,
        headline: "Build Your Digital Presence",
        subtext: "Create stunning websites with our powerful CMS platform",
        buttonText: "Get Started",
        buttonUrl: "/register",
        buttonStyle: "gradient",
        textAlignment: "center",
        fullHeight: true,
      },
    },
    {
      id: "s2",
      title: "About Us",
      type: "TEXT",
      content: {
        title: "About Our Company",
        text: "We are a leading provider of digital solutions with over 10 years of experience in the industry.",
      },
    },
    {
      id: "s3",
      title: "Featured Projects",
      type: "GALLERY",
      content: {
        title: "Our Recent Work",
        images: [
          {
            id: "img-1",
            imageUrl: "/web-design-project.png",
            caption: "Website Redesign",
          },
          {
            id: "img-2",
            imageUrl: "/mobile-app-development.png",
            caption: "Mobile App",
          },
          {
            id: "img-3",
            imageUrl: "/branding-project.png",
            caption: "Brand Identity",
          },
        ],
        columns: 3,
      },
    },
    {
      id: "s4",
      title: "Call to Action",
      type: "CARD",
      content: {
        title: "Get Started Today",
        imageUrl: "/business-meeting-collaboration.png",
        heading: "Ready to transform your business?",
        text: "Contact us today to schedule a free consultation and learn how we can help you achieve your goals.",
        buttonText: "Contact Us",
        buttonUrl: "/contact",
      },
    },
  ],
  "2": [
    {
      id: "s5",
      title: "Our Story",
      type: "TEXT",
      content: {
        title: "Our Journey",
        text: "Founded in 2010, our company has grown from a small startup to a leading provider of digital solutions.",
      },
    },
    {
      id: "s6",
      title: "Team",
      type: "GALLERY",
      content: {
        title: "Meet Our Team",
        images: [
          {
            id: "team-1",
            imageUrl: "/professional-male-headshot.png",
            caption: "John Doe, CEO",
          },
          {
            id: "team-2",
            imageUrl: "/professional-headshot-female.png",
            caption: "Jane Smith, CTO",
          },
          {
            id: "team-3",
            imageUrl: "/diverse-professional-headshots.png",
            caption: "Michael Johnson, Design Lead",
          },
        ],
        columns: 3,
      },
    },
  ],
  "3": [
    {
      id: "s7",
      title: "Services Hero",
      type: "HERO",
      content: {
        title: "Our Services",
        backgroundType: "image",
        backgroundUrl: "/services-hero.png",
        overlayOpacity: 60,
        headline: "Professional Digital Services",
        subtext: "We offer a wide range of digital services to help your business grow",
        buttonText: "View Services",
        buttonUrl: "/services",
        buttonStyle: "primary",
        textAlignment: "left",
        fullHeight: false,
      },
    },
    {
      id: "s8",
      title: "Service Showcase",
      type: "CAROUSEL",
      content: {
        title: "Our Services",
        slides: [
          {
            id: "service-1",
            imageUrl: "/placeholder-sditu.png",
            caption: "Web Design",
            subtitle: "Professional website design services",
            url: "/services/web-design",
          },
          {
            id: "service-2",
            imageUrl: "/mobile-development-service.png",
            caption: "Mobile Development",
            subtitle: "iOS and Android app development",
            url: "/services/mobile-development",
          },
          {
            id: "service-3",
            imageUrl: "/digital-marketing-service.png",
            caption: "Digital Marketing",
            subtitle: "SEO, SEM, and social media marketing",
            url: "/services/digital-marketing",
          },
        ],
        autoplay: true,
        interval: 15000,
        showArrows: true,
        showDots: true,
        animation: "slide",
        clickAction: "link",
        height: "medium",
        captionStyle: "white-box",
      },
    },
  ],
  "4": [
    {
      id: "s9",
      title: "Contact Information",
      type: "TEXT",
      content: {
        title: "Get in Touch",
        text: "Email: info@example.com\nPhone: (123) 456-7890\nAddress: 123 Main St, Anytown, USA",
      },
    },
    {
      id: "s10",
      title: "Office Gallery",
      type: "GALLERY",
      content: {
        title: "Our Offices",
        images: [
          {
            id: "office-1",
            imageUrl: "/modern-office.png",
            caption: "Headquarters",
          },
          {
            id: "office-2",
            imageUrl: "/office-meeting-room.png",
            caption: "Meeting Room",
          },
        ],
        columns: 2,
      },
    },
  ],
  "5": [
    {
      id: "s11",
      title: "Latest Articles",
      type: "CAROUSEL",
      content: {
        title: "From Our Blog",
        slides: [
          {
            id: "blog-1",
            imageUrl: "/digital-marketing-trends.png",
            caption: "Digital Marketing Trends for 2023",
            subtitle: "Stay ahead of the competition with these trends",
            url: "/blog/digital-marketing-trends",
          },
          {
            id: "blog-2",
            imageUrl: "/web-design-inspiration.png",
            caption: "Web Design Inspiration: 10 Stunning Examples",
            subtitle: "Get inspired by these amazing designs",
            url: "/blog/web-design-inspiration",
          },
        ],
        autoplay: true,
        interval: 15000,
        showArrows: true,
        showDots: true,
        animation: "slide",
        clickAction: "link",
        height: "medium",
        captionStyle: "white-box",
      },
    },
  ],
}
