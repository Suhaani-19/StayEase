import BookingHistoryCard from '../BookingHistoryCard';
import cabinImage from '@assets/generated_images/Mountain_cabin_listing_photo_0428adcd.png';
import villaImage from '@assets/generated_images/Beachfront_villa_listing_photo_b95534bf.png';

export default function BookingHistoryCardExample() {
  return (
    <div className="space-y-4 p-6">
      <BookingHistoryCard
        id="1"
        propertyName="Cozy Mountain Cabin"
        location="Aspen, Colorado"
        image={cabinImage}
        checkIn="Dec 15, 2024"
        checkOut="Dec 20, 2024"
        guests={4}
        totalPrice={945}
        status="upcoming"
      />
      <BookingHistoryCard
        id="2"
        propertyName="Luxury Beachfront Villa"
        location="Malibu, California"
        image={villaImage}
        checkIn="Nov 1, 2024"
        checkOut="Nov 5, 2024"
        guests={2}
        totalPrice={1800}
        status="completed"
      />
    </div>
  );
}
