import { Link } from "wouter";
import { MapPin, Star } from "lucide-react";

type ListingCardProps = {
  _id?: string;
  id?: string; // optional, but DB flow should use _id
  title: string;
  location: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  type?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function ListingCard(props: ListingCardProps) {
  const {
    id,
    _id,
    title,
    location,
    price,
    rating,
    reviewCount,
    images = [],
    type,
    onEdit,
    onDelete,
  } = props;

  const listingId = _id || id;

  const imageSrc =
    images.length > 0
      ? images[0]
      : "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg";

  const cardBody = (
    <div className="rounded-xl overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img src={imageSrc} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          {(rating || reviewCount) && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="font-medium">
                {rating ? rating.toFixed(1) : "New"}
              </span>
              {reviewCount !== undefined && (
                <span className="text-muted-foreground">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {type && (
          <p className="text-xs text-muted-foreground line-clamp-1">{type}</p>
        )}

        <div className="flex items-baseline gap-1">
          <span className="font-semibold text-lg">${price}</span>
          <span className="text-xs text-muted-foreground">/ night</span>
        </div>

        {listingId && (onEdit || onDelete) && (
          <div className="mt-3 flex items-center justify-end gap-2">
            {onEdit && (
              <button
                type="button"
                className="text-xs px-2 py-1 rounded border border-primary text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEdit(listingId);
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="text-xs px-2 py-1 rounded border border-destructive text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(listingId);
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const shouldLink = listingId && !onEdit && !onDelete;

  if (shouldLink) {
    return (
      <Link href={`/listing/${listingId}`}>
        <div>{cardBody}</div>
      </Link>
    );
  }

  return cardBody;
}
