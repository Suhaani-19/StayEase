import ListingCard from '../ListingCard';
import cabinImage from '@assets/generated_images/Mountain_cabin_listing_photo_0428adcd.png';
import villaImage from '@assets/generated_images/Beachfront_villa_listing_photo_b95534bf.png';

export default function ListingCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <ListingCard
        id="1"
        title="Cozy Mountain Cabin"
        location="Aspen, Colorado"
        price={189}
        rating={4.9}
        reviewCount={127}
        images={[cabinImage, villaImage]}
        type="Entire cabin"
      />
      <ListingCard
        id="2"
        title="Luxury Beachfront Villa"
        location="Malibu, California"
        price={450}
        rating={4.8}
        reviewCount={89}
        images={[villaImage, cabinImage]}
        type="Entire villa"
      />
    </div>
  );
}
