"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { revalidateGallery } from "@/constants/revalidate/route";
import { ParamsType } from "@/types/types";
import { useRouter } from "next/navigation";
import { FaImage, FaImages, FaSpinner } from "react-icons/fa";
import ToggleSwitch from "@/components/toggleSwitch";
import { IoMdClose } from "react-icons/io";

const gallerySchema = z.object({
  files: z
    .custom<FileList>((files) => files instanceof FileList)
    .refine((files) => files.length > 0, {
      message: "At least one file must be uploaded",
    }),
});

type galleryFormData = z.infer<typeof gallerySchema>;

function GalleryForm({
  gallery,
  isUpdate,
}: {
  gallery?: { id: string; imgs: string[] };
  isUpdate?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<galleryFormData>({
    resolver: zodResolver(gallerySchema),
  });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
  };

  const handleFileChange = (files: FileList) => {
    const newFiles = Array.from(files);

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const handleFileDelete = (index: number) => {
    setSelectedFiles((prevFiles) => [
      ...prevFiles.slice(0, index),
      ...prevFiles.slice(index + 1),
    ]);
  };

  const onSubmit = async (data: galleryFormData) => {
    setSubmitLoading(true);
    const files = selectedFiles;

    try {
      const formData = new FormData();
      if (isUpdate) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
          gallery?.imgs.push(`/uploads/about/gallery/${file.name}`);
        });

        await axios.put(`/api/gallery/${gallery?.id}`, {
          imgs: gallery?.imgs,
        });
        revalidateGallery();
        formData.append("targetDIR", `about/gallery`);

        const res = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error(await res.text());
        reset({
          files: undefined,
        });

        setSelectedFiles([]);
        router.push("/admin/about");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const imgs: string[] = [];

        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
          imgs.push(`/uploads/about/gallery/${file.name}`);
        });

        await axios.post(`/api/gallery/`, {
          imgs: imgs,
          status: isChecked ? "active" : "inactive",
        });
        revalidateGallery();
        formData.append("targetDIR", `about/gallery`);

        const res = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(await res.text());

        reset({
          files: undefined,
        });
        setSelectedFiles([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setSubmitLoading(false);
    }
  };

  async function deleteImages(location: string) {
    const index = gallery?.imgs.indexOf(location) || 0;
    if (index > -1) {
      // only splice array when item is found
      gallery?.imgs.splice(index, 1); // 2nd parameter means remove one item only
    }
    try {
      // console.log(gallery, location);
      const res = await axios.put(`/api/gallery/${gallery?.id}`, {
        imgs: gallery?.imgs,
        status: isChecked ? "active" : "inactive",
      });
      await axios.delete(`/api/upload`, {
        data: { locations: [location] },
      });
      console.log("Response:", res.data);
      revalidateGallery();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteGallery() {
    try {
      axios
        .delete(`/api/upload`, {
          data: { locations: gallery?.imgs },
        })
        .catch((error) => {
          console.error(error);
        });
      axios
        .delete(`/api/gallery/${gallery?.id}`)
        .then((response) => {
          console.log(`${response}`);
          revalidateGallery();
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
    router.push("/admin/about/");
  }

  return (
    <div>
      <h4 className="text-2xl font-semibold text-black mt-5">
        {isUpdate ? `Update` : `Create new`} gallery
      </h4>
      {isUpdate && (
        <div className="border border-stroke bg-black/20 px-7.5 py-6 shadow-default mt-5 overflow-auto">
          <div className="flex justify-between mb-5">
            <h1 className="text-2xl font-semibold text-black capitalize">
              Gallery Images
            </h1>
          </div>
          <div className="flex flex-wrap justify-center gap-5 my-3 relative">
            {gallery?.imgs.map((image: string) => (
              <div
                key={image}
                className="flex flex-col aspect-square w-40 overflow-hidden items-center gap-3 relative"
              >
                <Image
                  src={image}
                  alt="img-home"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover rounded"
                />
                {isUpdate && (
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 bg-rose-500 text-white rounded-full"
                    onClick={() => deleteImages(image)}
                  >
                    <IoMdClose />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded border border-stroke shadow-default bg-black/20 p-5 mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="md:flex items-end gap-5 mb-5">
            <div className="border-2 flex flex-col items-center p-3 min-h-[15.3rem] md:mb-0 mb-5 border-black/40 w-full">
              <Controller
                name="files"
                control={control}
                render={({ field }) => (
                  <div>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      id="gallery"
                      multiple
                      ref={fileInputRef}
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        e.target.files && handleFileChange(e.target.files);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="gallery"
                      className="capitalize flex justify-center items-center gap-2 rounded-md bg-rose-500 px-6 py-2 font-medium text-white hover:bg-opacity-90 cursor-pointer text-sm md:text-base"
                    >
                      <FaImages /> Select Gallery Images
                    </label>
                  </div>
                )}
              />
              {errors.files && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.files.message}
                </p>
              )}
              {/* Display the selected images */}
              {selectedFiles.length > 0 ? (
                <div className="flex flex-wrap gap-5 mt-5 items-center overflow-auto justify-center">
                  {selectedFiles.map((file, index) => {
                    const imgUrl = URL.createObjectURL(file);
                    return (
                      <div
                        key={index}
                        className="flex flex-col aspect-square w-40 overflow-hidden items-center gap-3 relative"
                      >
                        <Image
                          src={imgUrl}
                          width={150}
                          height={300}
                          className="w-full h-full object-cover"
                          alt={`Selected ${index}`}
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 p-1 bg-rose-500 text-white rounded-full"
                          onClick={() => handleFileDelete(index)}
                        >
                          <IoMdClose />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center flex justify-center items-center gap-3 mt-5">
                  <FaImage />
                  <p>No Image Selected</p>
                </div>
              )}
            </div>
          </div>

          <label className="mb-3 block text-base font-medium text-black">
            Status
          </label>
          <div className="flex justify-between gap-5 mt-5">
            <div>
              <ToggleSwitch
                isChecked={isChecked}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>
            {isUpdate && (
              <button
                onClick={deleteGallery}
                className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Delete Gallery
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md bg-black px-6 py-2 font-medium text-white hover:bg-opacity-90 "
            >
              {submitLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GalleryForm;
