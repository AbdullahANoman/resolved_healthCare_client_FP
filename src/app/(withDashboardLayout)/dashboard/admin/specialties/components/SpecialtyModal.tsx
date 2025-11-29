/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef } from "react";
import { useCreateSpecialtyMutation } from "@/redux/api/specialtiesApi";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";
import { modifyPayload } from "@/utils/modifyPayload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  title: string;
};

const SpecialtyModal = ({ open, setOpen }: TProps) => {
  const [createSpecialty, { isLoading }] = useCreateSpecialtyMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const handleFormSubmit = async (values: FieldValues) => {
    if (!selectedFile) {
      toast.error("Please upload an icon");
      return;
    }

    try {
      // Validate the file before proceeding
      if (!(selectedFile instanceof File)) {
        toast.error("Invalid file. Please upload a valid image file.");
        return;
      }

      console.log("Selected file details:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        isFile: selectedFile instanceof File,
      });

      const formValues = {
        ...values,
        file: selectedFile,
      };

      const data = modifyPayload(formValues);

      const res = await createSpecialty(data).unwrap();

      console.log("Response:", res);

      if (res?.id) {
        toast.success("Specialty created successfully! 🎉", {
          description: `${values.title} has been added to the system.`,
        });
        handleClose();
      }
      if (!res?.success) {
        toast.error("File upload error for deployment issue", {
          description: "Please check the file and try again.",
        });
      }
    } catch (err: any) {
      console.error("Creation error:", err);

      // More specific error messages
      if (err?.message?.includes("file")) {
        toast.error("File upload error", {
          description: "Please check the file and try again.",
        });
      } else {
        toast.error("Failed to create specialty", {
          description:
            err?.data?.message || "Please check the form and try again.",
        });
      }
    }
  };

  const resetForm = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Clean up object URLs
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl(null);
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file (JPEG, PNG, JPG, WEBP).",
      });
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 2MB.",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Create New Specialty
              </DialogTitle>
              <DialogDescription>
                Add a new medical specialty with a representative icon.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Specialty Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Specialty Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Cardiology, Neurology, Orthopedics..."
              className={errors.title ? "border-red-500" : ""}
              {...register("title", {
                required: "Specialty title is required",
                minLength: {
                  value: 2,
                  message: "Title must be at least 2 characters",
                },
              })}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="h-3 w-3" />
                {errors.title.message as string}
              </p>
            )}
          </div>

          {/* Icon Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Specialty Icon *</Label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Selected Icon
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative w-20 h-20 bg-white rounded-lg border-2 border-blue-200 flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="gap-2 w-full"
                    >
                      <Upload className="h-4 w-4" />
                      Change Icon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className="border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                onClick={triggerFileInput}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">
                        Upload Icon
                      </p>
                      <p className="text-sm text-gray-600">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 2MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!selectedFile && (
              <div className="flex items-center gap-2 text-red-600">
                <X className="h-4 w-4" />
                <p className="text-sm">
                  Please upload an icon for the specialty
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Specialty
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialtyModal;
