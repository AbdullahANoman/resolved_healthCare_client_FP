"use client";
import { useState } from "react";
import {
  useDeleteSpecialtyMutation,
  useGetAllSpecialtiesQuery,
} from "@/redux/api/specialtiesApi";
import Image from "next/image";
import { toast } from "sonner";
import { Specialty } from "@/types/doctor";
import SpecialtyModal from "./components/SpecialtyModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Trash2,
  MoreVertical,
  Grid3X3,
  List,
  Loader2,
  Stethoscope,
} from "lucide-react";
import LottieLoader from "@/components/Shared/Loader/LottieLoader";

const SpecialtiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data, isLoading, error, refetch } = useGetAllSpecialtiesQuery({});
  const [deleteSpecialty, { isLoading: isDeleting }] =
    useDeleteSpecialtyMutation();

  const filteredData =
    data?.filter((specialty: Specialty) =>
      specialty.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDeleteClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSpecialty) return;

    try {
      const res = await deleteSpecialty(selectedSpecialty.id).unwrap();
      if (res?.id) {
        toast.success("Specialty deleted successfully!");
        refetch();
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to delete specialty");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedSpecialty(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedSpecialty(null);
  };

  if (isLoading) {
    return (
      <div className="flex bg-white items-center justify-center min-h-screen">
        <LottieLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Specialties</h1>
          <p className="text-muted-foreground">
            Manage medical specialties and their icons
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-purple-700 hover:bg-purple-800"
        >
          <Plus className="h-4 w-4" />
          Create Specialty
        </Button>
      </div>

      {/* Search and Controls */}
      <Card className="shadow-md border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border/70 focus:border-purple-300 transition-colors duration-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 bg-muted/50">
                {filteredData.length}{" "}
                {filteredData.length === 1 ? "specialty" : "specialties"}
              </Badge>

              <div className="flex border border-border/70 rounded-lg bg-muted/30">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-r-none h-9 px-3 transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm hover:from-purple-700 hover:to-purple-800"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={`rounded-l-none h-9 px-3 transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm hover:from-purple-700 hover:to-purple-800"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "No specialties found" : "No specialties yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first specialty"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Specialty
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map((specialty: Specialty) => (
            <Card
              key={specialty.id}
              className="group hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="relative w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Image
                      src={specialty.icon}
                      alt={specialty.title}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(specialty)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {specialty.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Medical Specialty
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(specialty)}
                  className="w-full mt-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Specialties List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((specialty: Specialty) => (
                  <TableRow key={specialty.id}>
                    <TableCell>
                      <div className="relative w-8 h-8">
                        <Image
                          src={specialty.icon}
                          alt={specialty.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {specialty.title}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(specialty)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <SpecialtyModal open={isModalOpen} setOpen={setIsModalOpen} />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={selectedSpecialty?.title || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SpecialtiesPage;
