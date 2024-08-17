import { ELAF_LOGO_URL } from "@/constant/svg";

export const ContactHeader = () => (
    <section className="w-full bg-muted py-8 md:py-12 lg:py-12">
    <div className="container grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col items-start justify-center space-y-2">
        <div className="flex items-center space-x-6">
          <img src={ELAF_LOGO_URL} alt="Company Logo" className="h-40 w-40" />
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Elaf Tender Platform</h1>
            <p className="text-lg text-muted-foreground">
              Streamline your procurement process with our powerful platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
  