import React from "react";
import { ContactHeader } from "./contact-header";
import { ContactForm } from "./contact-form";
import { ContactDetails } from "./contact-detailes";

export default function ContactSection() {
  return (
    <div className="w-full">
      <ContactHeader />
      <ContactForm />
      <ContactDetails />
    </div>
  );
}
