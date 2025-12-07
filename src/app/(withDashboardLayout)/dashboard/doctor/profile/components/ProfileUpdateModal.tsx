import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ProfileUpdateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
}

const ProfileUpdateModal = ({
  open,
  setOpen,
  data,
}: ProfileUpdateModalProps) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    email: data?.email || "",
    contactNumber: data?.contactNumber || "",
    address: data?.address || "",
    gender: data?.gender || "",
    designation: data?.designation || "",
    qualification: data?.qualification || "",
    experience: data?.experience || "",
    apointmentFee: data?.apointmentFee || "",
    currentWorkingPlace: data?.currentWorkingPlace || "",
    registrationNumber: data?.registrationNumber || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900">
                Professional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        qualification: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="apointmentFee">Appointment Fee ($)</Label>
                  <Input
                    id="apointmentFee"
                    type="number"
                    value={formData.apointmentFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        apointmentFee: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentWorkingPlace">Current Workplace</Label>
                  <Input
                    id="currentWorkingPlace"
                    value={formData.currentWorkingPlace}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentWorkingPlace: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="registrationNumber">
                    Registration Number
                  </Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Specialties Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-900">
              Specialties
            </h3>
            <div className="flex flex-wrap gap-2 p-4 border border-slate-200 rounded-lg">
              <Badge className="px-3 py-1 cursor-pointer hover:bg-blue-600">
                Cardiology
              </Badge>
              <Badge className="px-3 py-1 cursor-pointer hover:bg-blue-600">
                Neurology
              </Badge>
              <Badge className="px-3 py-1 cursor-pointer hover:bg-blue-600">
                Pediatrics
              </Badge>
              <Badge className="px-3 py-1 cursor-pointer hover:bg-blue-600">
                Orthopedics
              </Badge>
              <Badge className="px-3 py-1 cursor-pointer hover:bg-blue-600">
                Dermatology
              </Badge>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-900">
              Availability
            </h3>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <p className="font-medium">Accepting New Patients</p>
                <p className="text-sm text-slate-600">
                  Allow new patients to book appointments
                </p>
              </div>
              <Switch />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default ProfileUpdateModal