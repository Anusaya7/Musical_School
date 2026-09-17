import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services | Korals Design Pvt Ltd",
  description:
    "Explore architectural design, civil engineering project management, government approval support, land surveying, technical consultancy and project services by Korals Design Pvt Ltd.",
  openGraph: {
    title: "Services | Korals Design Pvt Ltd",
    description:
      "Explore architectural design, civil engineering project management, government approval support, land surveying, technical consultancy and project services by Korals Design Pvt Ltd.",
    url: "https://www.koralsdesign.com/services",
    siteName: "KORALS DESIGN PVT LTD",
    type: "website",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
