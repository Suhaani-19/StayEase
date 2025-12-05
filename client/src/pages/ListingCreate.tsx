import AddListingForm from "@/components/AddListingForm";
import Header from "@/components/Header";

export default function ListingCreate() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>

        <AddListingForm />
      </main>
    </div>
  );
}
