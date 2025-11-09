import BookingCard from '../BookingCard';

export default function BookingCardExample() {
  return (
    <div className="p-6 max-w-md">
      <BookingCard pricePerNight={189} rating={4.9} reviewCount={127} />
    </div>
  );
}
