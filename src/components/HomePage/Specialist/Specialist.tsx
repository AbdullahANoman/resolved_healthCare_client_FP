import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const Specialist = async () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const res = await fetch(`${API_BASE_URL}/specialties`, {
    next: {
      revalidate: 30,
    },
  });
  const { data: specialties } = await res.json();

  return (
    <div className="max-w-7xl mx-auto">
      <section className="py-16 md:py-24 ">
        <div className="container px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              Medical Specialties
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Explore Treatments Across{" "}
              <span className="text-primary">Specialties</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced doctors across all specialties providing exceptional
              care
            </p>
          </div>

          {/* Specialties Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {specialties.slice(0, 6).map((specialty: any) => (
              <Link
                key={specialty.id}
                href={`/doctors?specialties=${specialty.title}`}
                className="group"
              >
                <Card className="h-full border-2 border-transparent hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {/* Icon Container */}
                    <div className="mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <div className="relative w-12 h-12 md:w-16 md:h-16">
                        <Image
                          src={specialty.icon}
                          alt={specialty.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 48px, 64px"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {specialty.title}
                    </h3>

                    {/* Description if available */}
                    {specialty.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {specialty.description}
                      </p>
                    )}

                    {/* View Doctors Button */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                      >
                        View Doctors
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link href="/doctors">
              <Button size="lg" className="group">
                View All Specialties
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Specialist;
