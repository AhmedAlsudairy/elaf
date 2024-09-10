import React from "react";
import { ContactForm } from "./contact-form";
import { ContactDetails } from "./contact-detailes";
import { ContactHeader } from "./contact-header";


export default function ContactSection() {
  return (
    <div >
      <ContactHeader />
      <ContactForm />
      <ContactDetails />
    </div>
  );
}
