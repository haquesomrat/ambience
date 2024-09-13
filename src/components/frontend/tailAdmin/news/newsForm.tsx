"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { newsType, userType } from "@/types/types";
import { useRouter } from "next/navigation";
import { revalidateNews } from "@/constants/revalidate/route";
import { FaImage } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import dynamic from "next/dynamic";

let newsSchema;

export async function deleteNews(news: newsType | undefined, router?: void) {
  try {
    axios.delete(`/api/news/${news?.id}`).catch((error) => {
      console.error(error);
    });
    revalidateNews();
    await axios.delete(`/api/upload`, {
      data: { locations: [news?.thumbnail] },
    });
    router;
  } catch (error) {
    console.log(error);
  }
  toast.warn("Successfully Deleted!");
}

function NewsForm({ news, isUpdate }: { news?: newsType; isUpdate?: boolean }) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  if (isUpdate) {
    newsSchema = z.object({
      title: z.string().min(2, "title must be at least 2 characters long"),
      description: z
        .string()
        .min(2, "description must be at least 2 characters long"),
      thumbnail: z
        .instanceof(File)
        .refine((file) => file instanceof File, {
          message: "Exactly one file must be uploaded",
        })
        .optional(),
    });
  } else {
    newsSchema = z.object({
      title: z.string().min(2, "title must be at least 2 characters long"),
      description: z
        .string()
        .min(2, "description must be at least 2 characters long"),
      thumbnail: z.instanceof(File).refine((file) => file instanceof File, {
        message: "Exactly one file must be uploaded",
      }),
    });
  }

  type NewsFormData = z.infer<typeof newsSchema>;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
  });
  const [user, setUser] = useState<userType>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [selectedImagesThumbnail, setSelectedImagesThumbnail] =
    useState<string>(news?.thumbnail || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const handleFileChangeThumbnail = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImagesThumbnail(imageUrl);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/api/auth/user`);
        setUser(res.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const onSubmit = async (data: NewsFormData) => {
    setSubmitLoading(true);
    const filesThumbnail = data.thumbnail;
    let thumbnail;
    const formData = new FormData();
    try {
      if (!isUpdate) {
        if (filesThumbnail) {
          formData.append(`file_0`, filesThumbnail);
          thumbnail = `/uploads/news/${filesThumbnail.name}`;
        }

        const res1 = await axios.post(`/api/news/`, {
          title: data.title,
          description: data.description,
          thumbnail: thumbnail,
          author: user?.name,
          time: new Date(),
        });
        revalidateNews();
        formData.append("targetDIR", "news");

        const res2 = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });
        console.log(res1);
        if (!res2.ok) throw new Error(await res2.text());

        reset({
          title: "",
          description: "",
          thumbnail: undefined,
        });

        setSelectedImagesThumbnail("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        //updating new image and deleteing the old
        if (filesThumbnail) {
          formData.append(`file_0`, filesThumbnail);
          thumbnail = `/uploads/news/${filesThumbnail.name}`;
          formData.append("targetDIR", "news");
          const res = await fetch(`/api/upload`, {
            method: "POST",
            body: formData,
          });
          await axios.delete(`/api/upload`, {
            data: { locations: [news?.thumbnail] },
          });
          if (!res.ok) throw new Error(await res.text());
        } else {
          thumbnail = news?.thumbnail;
        }
        const res1 = await axios.put(`/api/news/${news?.id}`, {
          title: data.title,
          description: data.description,
          thumbnail: thumbnail,
          author: news?.author,
          time: news?.time,
        });
        setSelectedImagesThumbnail("");
        console.log(thumbnail);
        console.log(data);
        reset({
          title: "",
          description: "",
          thumbnail: undefined,
        });
        revalidateNews();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        router.push("/admin/news");
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
      <h4 className="text-2xl font-semibold text-black mb-4 capitalize">
        {isUpdate ? "Update" : "Add"} news information
      </h4>
      <div className="rounded border border-stroke shadow-default bg-black/20 p-5 gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="md:flex gap-5 mb-5">
            <div className="w-full">
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
                  defaultValue={news?.title}
                  type="text"
                  placeholder="Title"
                  className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
                {errors.title && (
                  <p className="text-rose-600 text-sm mt-2">{errors.title.message}</p>
                )}
              </div>

              <div className="w-full mt-5 lg:mb-0 mb-5 ">
                <label
                  htmlFor="description"
                  className="mb-3 block text-base font-medium text-black"
                >
                  Description<span className="text-rose-500">*</span>
                </label>
                <Controller
                  name={`description`}
                  control={control}
                  defaultValue={news?.description}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      {...field}
                      className="bg-white h-48 rounded-lg overflow-hidden"
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-rose-600 text-sm mt-2">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="thumbnail"
                className="mb-3 block text-base font-medium text-black"
              >
                Thumbnail<span className="text-rose-500">*</span>
              </label>
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
                        <FaImage /> {isUpdate ? "Change" : "Select"} thumbnail
                        image
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
            </div>
          </div>

          <div className="flex justify-end gap-5 mt-5">
            {isUpdate && (
              <button
                type="button"
                onClick={() => {
                  deleteNews(news, router.push("/admin/news"));
                }}
                className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Delete News
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
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default NewsForm;
