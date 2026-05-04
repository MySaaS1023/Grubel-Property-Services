import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

export default function SuccessPage() {
  return (
    <>
      <PageHero
        eyebrow="Request Received"
        title="Thank you. Grubel Property Services will follow up soon."
        description="Grubel Property Services has received your request. Please keep an eye on your email or phone for follow-up details."
      />
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Button href="/contact">Request More Service</Button>
        </div>
      </section>
    </>
  );
}
