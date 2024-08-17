import { FacebookIcon, LinkedinIcon, LocateIcon, MailIcon, PhoneIcon, TwitterIcon, X } from "lucide-react";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";

export const ContactDetails = () => (
  <section className="w-full bg-background py-8 md:py-12 lg:py-16">
  <div className="container grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Contact Information</h2>
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <LocateIcon className="h-6 w-6 text-muted-foreground" />
          <p className="text-muted-foreground">
           sohar oman
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <PhoneIcon className="h-6 w-6 text-muted-foreground" />
          <p className="text-muted-foreground">0096895656005</p>
        </div>
        <div className="flex items-center space-x-4">
          <MailIcon className="h-6 w-6 text-muted-foreground" />
          <p className="text-muted-foreground">info@elaftender.com</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
          <TwitterIcon className="h-6 w-6" />
        </Link>
        <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
          <LinkedinIcon className="h-6 w-6" />
        </Link>
        <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
          <FacebookIcon className="h-6 w-6" />
        </Link>
      </div>
    </div>
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Our Location</h2>
      <div className="rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113815.77225197365!2d56.61494920447613!3d24.367982403771315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e9f03d8db3798d7%3A0x6e84950af256f51e!2sSohar%2C%20Oman!5e0!3m2!1sen!2s!4v1692274392172!5m2!1sen!2s&markers=color:red%7Clabel:S%7C24.367982403771315,56.61494920447613"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</section>

);
