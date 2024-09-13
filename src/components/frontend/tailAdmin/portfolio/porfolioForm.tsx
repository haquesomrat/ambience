"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { portfolioType } from "@/types/types";
import { revalidatePortfolio } from "@/constants/revalidate/route";
import { FaImage, FaImages } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdClose } from "react-icons/io";

const sliderSchema = z.object({
  description: z
    .string()
    .min(2, "Description must be at least 2 characters long"),
  title: z.string().min(2, "Title must be at least 2 characters long"),
  thumbnail: z.instanceof(File).refine((file) => file instanceof File, {
    message: "Exactly one file must be uploaded",
  }),
  gallery: z
    .custom<FileList>((files) => files instanceof FileList)
    .refine((files) => files.length > 0, {
      message: "At least one file must be uploaded",
    }),
});

type portfolioFormData = z.infer<typeof sliderSchema>;

function PortfolioForm({ portfolio }: { portfolio?: portfolioType }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<portfolioFormData>({
    resolver: zodResolver(sliderSchema),
  });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [selectedImagesThumbnail, setSelectedImagesThumbnail] =
    useState<string>(portfolio?.thumbnail || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChangeThumbnail = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImagesThumbnail(imageUrl);
  };

  const handleFileChangeGallery = (files: FileList) => {
    const newFiles = Array.from(files);
    setSelectedGalleryFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileDelete = (index: number) => {
    setSelectedGalleryFiles((prevFiles) => [
      ...prevFiles.slice(0, index),
      ...prevFiles.slice(index + 1),
    ]);
  };

  const onSubmit = async (data: portfolioFormData) => {
    setSubmitLoading(true);
    const filesThumbnail = data.thumbnail;
    const filesGallery = selectedGalleryFiles;

    try {
      const formData = new FormData();
      const gallery: string[] = [];

      formData.append(`file_0`, filesThumbnail);
      const thumbnail = `/uploads/portfolio/${filesThumbnail.name}`;
      filesGallery.forEach((file, index) => {
        formData.append(`file_${index + 1}`, file);
        gallery.push(`/uploads/portfolio/${file.name}`);
      });

      const res1 = await axios.post(`/api/portfolio/`, {
        title: data.title,
        description: data.description,
        thumbnail: thumbnail,
        gallery: gallery,
      });
      revalidatePortfolio();
      formData.append("targetDIR", "portfolio");

      const res2 = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });
      console.log(res1);
      if (!res2.ok) throw new Error(await res2.text());

      reset({
        description: "",
        title: "",
        thumbnail: undefined,
        gallery: undefined,
      });

      setSelectedGalleryFiles([]);
      setSelectedImagesThumbnail("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Submit Successful!");
    } catch (e: any) {
      console.error(e);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <h4 className="text-2xl font-semibold text-black mb-4">
        Add portfolio information
      </h4>
      <div className="rounded border border-stroke shadow-default bg-black/20 p-5 gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="gap-5 mb-5">
            <div className="w-full">
              <label
                htmlFor="title"
                className="mb-3 block text-base font-medium text-black"
              >
                Title<span className="text-rose-500">*</span>
              </label>
              <input
                {...register("title")}
                id="title"
                defaultValue={portfolio?.title}
                type="text"
                placeholder="Title"
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-lg text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              {errors.title && (
                <p className="text-rose-600 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="w-full mt-5">
              <label
                htmlFor="description"
                className="mb-3 block text-base font-medium text-black"
              >
                Description<span className="text-rose-500">*</span>
              </label>
              <textarea
                {...register("description")}
                id="description"
                placeholder="Description"
                rows={4}
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black text-lg outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              ></textarea>
              {errors.description && (
                <p className="text-rose-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="md:flex gap-5">
            <>
              <div className="border-2 flex flex-col items-center p-3 h-[18rem] md:mb-0 mb-5 border-black/40 w-full">
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        id="thumbnail"
                        onChange={(e) => {
                          const file = e.target.files
                            ? e.target.files[0]
                            : null;
                          field.onChange(file);
                          file && handleFileChangeThumbnail(file);
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="thumbnail"
                        className="capitalize flex justify-center lg:text-base text-xs items-center gap-2 rounded-md bg-rose-500 px-6 py-2 font-medium text-white hover:bg-opacity-90 cursor-pointer "
                      >
                        <FaImage /> Select thumbnail image
                      </label>
                    </div>
                  )}
                />
                {errors.thumbnail && (
                  <p className="text-rose-600 text-sm mt-1">
                    {errors.thumbnail.message}
                  </p>
                )}

                {/* Display the selected thumbnail images */}
                <div className="flex flex-wrap gap-5 my-3">
                  {selectedImagesThumbnail.length > 0 ? (
                    <Image
                      src={selectedImagesThumbnail}
                      width={150}
                      height={300}
                      alt={`Selected image`}
                    />
                  ) : (
                    <div className="text-center flex justify-center items-center gap-3">
                      <FaImage />
                      <p>No Image Selected</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-2 flex flex-col items-center p-3 h-[18rem] overflow-auto border-black/40 w-full">
                <Controller
                  name="gallery"
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
                          e.target.files &&
                            handleFileChangeGallery(e.target.files);
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="gallery"
                        className="capitalize flex justify-center lg:text-base text-xs items-center gap-2 rounded-md bg-rose-500 px-6 py-2 font-medium text-white hover:bg-opacity-90 cursor-pointer"
                      >
                        <FaImages /> Select gallery images
                      </label>
                    </div>
                  )}
                />
                {errors.gallery && (
                  <p className="text-rose-600 text-sm mt-1">
                    {errors.gallery.message}
                  </p>
                )}

                {/* Display the selected gallery images */}
                <div className="flex flex-wrap justify-center gap-5 my-3 relative">
                  {selectedGalleryFiles.length > 0 ? (
                    selectedGalleryFiles.map((file, index) => {
                      const imageUrl = URL.createObjectURL(file);
                      return (
                        <div
                          key={`${imageUrl}-${index}`}
                          className="flex flex-col aspect-square w-40 overflow-hidden items-center gap-3 relative"
                        >
                          <Image
                            src={imageUrl}
                            width={150}
                            height={150}
                            alt={`Selected ${index}`}
                            className="w-full h-full object-cover rounded"
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
                    })
                  ) : (
                    <div className="text-center flex justify-center items-center gap-3">
                      <FaImages />
                      <p>No Images Selected</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          </div>
          <div className="flex justify-end gap-5 mt-5">
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
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default PortfolioForm;
