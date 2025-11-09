import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export default function SearchFilters() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPropertyTypes([...propertyTypes, type]);
    } else {
      setPropertyTypes(propertyTypes.filter((t) => t !== type));
    }
    console.log("Property types:", checked ? [...propertyTypes, type] : propertyTypes.filter((t) => t !== type));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity]);
    } else {
      setAmenities(amenities.filter((a) => a !== amenity));
    }
    console.log("Amenities:", checked ? [...amenities, amenity] : amenities.filter((a) => a !== amenity));
  };

  const handleClearFilters = () => {
    setPriceRange([0, 1000]);
    setPropertyTypes([]);
    setAmenities([]);
    console.log("Filters cleared");
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleClearFilters} data-testid="button-clear-filters">
          Clear all
        </Button>
      </div>

      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000}
          step={10}
          className="mb-2"
          data-testid="slider-price"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span data-testid="text-price-min">${priceRange[0]}</span>
          <span data-testid="text-price-max">${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Property Type</h3>
        <div className="space-y-3">
          {["Entire place", "Private room", "Shared room", "Hotel room"].map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type}`}
                checked={propertyTypes.includes(type)}
                onCheckedChange={(checked) => handlePropertyTypeChange(type, checked as boolean)}
                data-testid={`checkbox-type-${type.toLowerCase().replace(/\s/g, "-")}`}
              />
              <Label htmlFor={`type-${type}`} className="cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Amenities</h3>
        <div className="space-y-3">
          {["WiFi", "Kitchen", "Parking", "Air conditioning", "Pool", "Gym"].map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={amenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/\s/g, "-")}`}
              />
              <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" data-testid="button-apply-filters">
        Apply Filters
      </Button>
    </Card>
  );
}
