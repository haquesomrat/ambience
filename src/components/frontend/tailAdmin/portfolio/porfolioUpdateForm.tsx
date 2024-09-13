"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { aboutType, portfolioType } from "@/types/types";
import { useRouter } from "next/navigation";
import { revalidatePortfolio } from "@/constants/revalidate/route";
import { FaImage, FaImages } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { IoMdClose } from "react-icons/io";

export async function deletePortfolio(
  portfolio: portfolioType | undefined,
  router: AppRouterInstance | void
) {
  try {
    await axios.delete(`/api/portfolio/${portfolio?.id}`).catch((error) => {
      console.error(error);
    });
    await axios.delete(`/api/upload`, {
      data: {
        locations: [portfolio?.thumbnail, ...(portfolio?.gallery || [])],
      },
    });
    revalidatePortfolio();
    router;
  } catch (error) {
    console.log(error);
  }
  toast.warn("Succefully Deleted!");
}

const sliderSchema = z.object({
  description: z
    .string()
    .min(2, "description must be at least 2 characters long"),
  title: z.string().min(2, "title must be at least 2 characters long"),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file instanceof File, {
      message: "Exactly one file must be uploaded",
    })
    .optional(),

  gallery: z
    .custom<FileList>((files) => files instanceof FileList)
    .refine((files) => files.length > 0, {
      message: "At least one file must be uploaded",
    })
    .optional(),
});

type portfolioUpdateFormData = z.infer<typeof sliderSchema>;

function PortfolioUpdateForm({
  portfolio,
  isUpdate,
}: {
  portfolio?: portfolioType;
  isUpdate?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<portfolioUpdateFormData>({
    resolver: zodResolver(sliderSchema),
  });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [selectedImagesThumbnail, setSelectedImagesThumbnail] =
    useState<string>(portfolio?.thumbnail || "");
  const [selectedImagesGallery, setSelectedImagesGallery] = useState<string[]>(
    portfolio?.gallery || []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const handleFileChangeThumbnail = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImagesThumbnail(imageUrl);
  };
  const handleFileChangeGallery = (files: FileList) => {
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImagesGallery([...selectedImagesGallery, ...imageUrls]);
  };

  const onSubmit = async (data: portfolioUpdateFormData) => {
    setSubmitLoading(true);
    const filesThumbnail = data.thumbnail;
    const filesGallery = data.gallery ? Array.from(data.gallery) : [];

    try {
      const formData = new FormData();
      const gallery: string[] = portfolio?.gallery || [];
      let thumbnail = portfolio?.thumbnail;

      if (filesThumbnail) {
        thumbnail = `/uploads/portfolio/${filesThumbnail.name}`;
        formData.append(`file_0`, filesThumbnail || "");
        await axios.delete(`/api/upload`, {
          data: { locations: [portfolio?.thumbnail] },
        });
      }
      filesGallery.map((file, index) => {
        if (file) {
          formData.append(`file_${index}`, file);
          gallery.push(`/uploads/portfolio/${file.name}`);
        }
      });

      const res1 = await axios.put(`/api/portfolio/${portfolio?.id}`, {
        gallery: gallery,
        title: data.title,
        description: data.description,
        thumbnail: thumbnail,
      });
      revalidatePortfolio();
      formData.append("targetDIR", "portfolio");
      if (filesThumbnail) {
        const res = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });
        console.log(res1);
        if (!res.ok) throw new Error(await res.text());
      }
      reset({
        description: "",
        title: "",
        gallery: undefined,
        thumbnail: undefined,
      });

      setSelectedImagesGallery([]);
      setSelectedImagesThumbnail("");
      router.push("/admin/portfolio");
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

  async function deleteImages(location: string) {
    if (!portfolio || !portfolio.gallery) {
      console.error("Portfolio or gallery is undefined");
      return;
    }

    const index = selectedImagesGallery.indexOf(location);
    if (index > -1) {
      selectedImagesGallery.splice(index, 1);
    }
    console.log(selectedImagesGallery);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    try {
      const res = await axios.put(`/api/portfolio/${portfolio.id}`, {
        title: portfolio.title,
        description: portfolio.description,
        thumbnail: portfolio.thumbnail,
        gallery: selectedImagesGallery,
      });
      await axios.delete(`/api/upload`, {
        data: { locations: [location] },
      });
      // console.log("Response:", res.data);
    } catch (error) {
      console.log(error);
    }

    revalidatePortfolio();
  }

  return (
    <div>
      <h4 className="text-2xl font-semibold text-black mb-4">
        Update portfolio information
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
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              {errors.title && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="w-full mt-5">
              <label
                htmlFor="description"
                className="mb-3 block text-base font-medium text-black"
              >
                Portfolio<span className="text-rose-500">*</span>
              </label>
              <textarea
                {...register("description")}
                id="description"
                defaultValue={portfolio?.description}
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black text-lg outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              ></textarea>
              {errors.description && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="lg:flex gap-5">
            <>
              <div className="border-2 flex flex-col items-center p-3 min-h-[15.3rem] border-black/40 w-full lg:mb-0 mb-5">
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
                        className="capitalize flex justify-center items-center gap-2 rounded-md lg:text-base text-xs bg-rose-500 px-6 py-2 font-medium text-white hover:bg-opacity-90 cursor-pointer "
                      >
                        <FaImage /> Select thumbnail image
                      </label>
                    </div>
                  )}
                />
                {errors.thumbnail && (
                  <p className="text-rose-600 text-sm mt-2">
                    {errors.thumbnail.message}
                  </p>
                )}

                {/* Display the selected thumbnail images */}
                <div className="flex flex-wrap gap-5 my-3">
                  {selectedImagesThumbnail.length > 0 ? (
                    <Image
                      src={selectedImagesThumbnail}
                      width={250}
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
                        className="capitalize flex justify-center items-center gap-2 rounded-md bg-rose-500 px-6 py-2 lg:text-base text-xs font-medium text-white hover:bg-opacity-90 cursor-pointer"
                      >
                        <FaImages /> Select gallery images
                      </label>
                    </div>
                  )}
                />
                {errors.gallery && (
                  <p className="text-rose-600 text-sm mt-2">
                    {errors.gallery.message}
                  </p>
                )}

                {/* Display the selected gallery images */}
                <div className="flex flex-wrap justify-center gap-5 my-3">
                  {selectedImagesGallery.length > 0 ? (
                    selectedImagesGallery.map((img, index) => (
                      <div
                        className="flex flex-col aspect-square w-40 overflow-hidden items-center gap-3 relative"
                        key={`${img}+${index}`}
                      >
                        <Image
                          src={img}
                          width={150}
                          height={300}
                          alt={`Selected ${index}`}
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => deleteImages(img)}
                          className="absolute top-0 right-0 p-1 bg-rose-500 text-white rounded-full"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center flex justify-center items-center gap-3">
                      <FaImage />
                      <p>No Image Selected</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          </div>
          <div className="flex justify-end gap-5 mt-5">
            <button
              type="button"
              onClick={() => {
                deletePortfolio(portfolio, router.push("/admin/portfolios"));
              }}
              className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
            >
              Delete portfolio
            </button>

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

export default PortfolioUpdateForm;
