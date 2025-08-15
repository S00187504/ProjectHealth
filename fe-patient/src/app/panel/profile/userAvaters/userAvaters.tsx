"use client"
import Image from "next/image";
import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { Input } from "@/components/ui/input";

const UserAvaters: React.FC = () => {
  const [banner, setBanner] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const defaultBanner = "/images/default-banner.jpg";
  const defaultAvatar = "/images/default-avatar.png";

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <section className="flex flex-col items-start ">
      <div className="w-full h-30 sm:h-34 md:h-48 mb-4 relative flex justify-center items-center">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="bannerUpload"
          onChange={(e) => handleImageChange(e, setBanner)}
        />
        <label htmlFor="bannerUpload" className="relative w-full h-full cursor-pointer">
          <Image
            width={100}
            height={100}
            src={banner || defaultBanner}
            alt="Banner"
            className="w-full h-full object-cover bg-[#999999]/20 rounded-lg dark:bg-[#202020]"
          />
          {!banner && (
            <FaCamera className="absolute text-gray-500 text-3xl md:text-4xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </label>
      </div>

      {/* Avatar Section */}
      <div className="relative ml-10">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="avatarUpload"
          onChange={(e) => handleImageChange(e, setAvatar)}
        />
        <label htmlFor="avatarUpload" className="relative cursor-pointer">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#999999]/20 dark:bg-[#202020] flex justify-center items-center">
            <Image
              width={100}
              height={100}
              src={avatar || defaultAvatar}
              alt="P"
              className="w-full h-full object-cover"
            />
            {!avatar && (
              <FaCamera className="absolute text-gray-500 text-xl md:text-2xl" />
            )}
          </div>
        </label>
      </div>

    </section>
  );
};

export default UserAvaters;
