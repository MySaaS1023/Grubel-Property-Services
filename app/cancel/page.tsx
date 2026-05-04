import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

export default function CancelPage() {
  return (
    <>
      <PageHero
        eyebrow="Request Service"
        title="Ready when you are."
        description="You can send Grubel Property Services the property details whenever you are ready."
      />
      <section className="bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <Button href="/contact" variant="outline">Request Service</Button>
        </div>
      </section>
    </>
  );
}
