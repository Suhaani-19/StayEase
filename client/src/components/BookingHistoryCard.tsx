import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users } from "lucide-react";
import { useLocation } from "wouter";

interface BookingHistoryCardProps {
  id: string;
  propertyName: string;
  location: string;
  image: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
  onCancel?: (id: string) => void;
}

export default function BookingHistoryCard({
  id,
  propertyName,
  location,
  image,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  status,
  onCancel,
}: BookingHistoryCardProps) {
  const [, navigate] = useLocation(); // ✅ Wouter navigation

  const statusColors = {
    upcoming: "bg-primary/10 text-primary",
    completed: "bg-green-500/10 text-green-700 dark:text-green-400",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="relative w-full md:w-48 h-48 md:h-32 overflow-hidden rounded-md">
          <img
            src={image}
            alt={propertyName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-semibold text-lg mb-1">
                {propertyName}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>

            <Badge className={statusColors[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Check-in</div>
                <div className="font-medium">{checkIn}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Check-out</div>
                <div className="font-medium">{checkOut}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Guests</div>
                <div className="font-medium">{guests}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="text-muted-foreground text-sm">
                Total:{" "}
              </span>
              <span className="text-xl font-semibold">
                ${totalPrice}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/booking/${id}`)} // ✅ FIXED SPA NAV
              >
                View Details
              </Button>

              {status === "upcoming" && onCancel && (
                <Button
                  variant="ghost"
                  onClick={() => onCancel(id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
//redeploy