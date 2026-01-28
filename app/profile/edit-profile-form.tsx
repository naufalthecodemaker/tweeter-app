"use client";

import { useState, useRef } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoading } from "@/lib/loading-context";
import { useRouter } from "next/navigation";

interface EditProfileFormProps {
  currentDisplayName: string;
  currentBio: string;
}

export function EditProfileForm({
  currentDisplayName,
  currentBio,
}: EditProfileFormProps) {
  // state buat nampung error ama status loading lokal
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // referensi form buat manipulasi elemen form klo perlu
  const formRef = useRef<HTMLFormElement>(null);
  
  // hook buat kontrol loading overlay global ama navigasi
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  // fungsi buat kirim update data ke server
  const handleSubmit = async (formData: FormData) => {
    setError(""); // reset error sbelum proses
    setLoading(true); // aktifin spinner di tombol
    startLoading(); // tampilin loading overlay biar user ga klik-klik lg

    // panggil server action buat update data di database Neon
    const result = await updateProfileAction(formData);

    if (result.error) {
      // klo gagal, tampilin notif error ama berentiin loading
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
      stopLoading(); // tutup overlay
    } else {
      // klo sukses, kasih tau user
      toast.success(result.message);
      
      // refresh page biar data profil yg baru langsung muncul
      router.refresh();
      
      // kasih jeda dikit biar transisinya halus pas loading ilang
      setTimeout(() => {
        setLoading(false);
        stopLoading();
      }, 1000); // 1 detik 
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* hubungin form ke handleSubmit lewat prop action */}
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </label>
            <Input
              id="displayName"
              name="displayName" // name utk diambil di server action
              type="text"
              defaultValue={currentDisplayName}
              placeholder="Your name"
              maxLength={100}
              disabled={loading} // kunci input pas lagi proses update
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={currentBio}
              placeholder="Tell us about yourself..."
              className="resize-none"
              maxLength={160}
              rows={3}
              disabled={loading}
            />
          </div>

          {/* nampilin box error klo ada validasi yg gagal */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}