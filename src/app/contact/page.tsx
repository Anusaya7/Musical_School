import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Koral's Design Pvt Ltd | Pune",
  description:
    "Contact Koral's Design Pvt Ltd in Pune for architectural planning, engineering, project management, approvals, surveying and related professional services.",
  openGraph: {
    title: "Contact Koral's Design Pvt Ltd | Pune",
    description:
      "Contact Koral's Design Pvt Ltd in Pune for architectural planning, engineering, project management, approvals, surveying and related professional services.",
    url: "https://www.koralsdesign.com/contact",
    siteName: "KORALS DESIGN PVT LTD",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
