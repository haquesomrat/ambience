"use client";
import { revalidateService } from "@/constants/revalidate/route";
import { serviceType } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaImage, FaSpinner } from "react-icons/fa";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export async function deleteService(
  service: serviceType | undefined,
  router?: void
) {
  try {
    await axios.delete(`/api/service/${service?.id}`);
    console.log(`delete successful`);
    await axios.delete(`/api/upload`, {
      data: { locations: [service?.thumbnail] },
    });
    revalidateService();
    router;
  } catch (error) {
    console.log(error);
  }
  toast.warn("Service Deleted!");
}

function ServiceForm({
  service,
  isUpdate,
}: {
  service?: serviceType;
  isUpdate?: boolean;
}) {
  let serviceSchema;
  if (isUpdate) {
    serviceSchema = z.object({
      title: z.string().min(2, "title must be at least 2 characters long"),
      subTitle: z
        .string()
        .min(2, "sub title must be at least 2 characters long"),
      description: z
        .string()
        .min(2, "description must be at least 2 characters long"),
      linkTitle: z
        .string()
        .min(2, "Link title must be at least 2 characters long"),
      link: z.string().min(2, "Link must be at least 2 characters long"),
      thumbnail: z
        .instanceof(File)
        .refine((file) => file instanceof File, {
          message: "Exactly one file must be uploaded",
        })
        .optional(),
    });
  } else {
    serviceSchema = z.object({
      title: z.string().min(2, "title must be at least 2 characters long"),
      subTitle: z
        .string()
        .min(2, "sub title must be at least 2 characters long"),
      description: z
        .string()
        .min(2, "description must be at least 2 characters long"),
      linkTitle: z
        .string()
        .min(2, "Link title must be at least 2 characters long"),
      link: z.string().min(1, "Link must be at least 1 characters long"),
      thumbnail: z.instanceof(File).refine((file) => file instanceof File, {
        message: "Exactly one file must be uploaded",
      }),
    });
  }

  type ServiceFormData = z.infer<typeof serviceSchema>;
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });
  const [selectedImages, setSelectedImages] = useState<string>(
    service?.thumbnail || ""
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImages(imageUrl);
  };

  const onSubmit = async (data: ServiceFormData) => {
    setSubmitLoading(true);
    const fileThumbnail = data.thumbnail;
    const formData = new FormData();

    let thumbnail = service?.thumbnail;
    try {
      if (!isUpdate) {
        const thumbnail = `/uploads/service/${fileThumbnail?.name}`;
        console.log(thumbnail);
        formData.append(`file_0`, fileThumbnail || "");
        formData.append("targetDIR", "service");
        const res1 = await axios.post(`/api/service/`, {
          thumbnail: thumbnail,
          title: data.title,
          subTitle: data.subTitle,
          description: data.description,
          plainUrl: data.link,
          text: data.linkTitle,
        });

        const res2 = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });
        console.log(res1);
        if (!res2.ok) throw new Error(await res2.text());

        reset({
          title: "",
          subTitle: "",
          description: "",
          linkTitle: "",
          link: "",
          thumbnail: undefined,
        });
        setSelectedImages("");
        revalidateService();
      } else {
        formData.append(`file_0`, fileThumbnail || "");
        formData.append("targetDIR", "service");

        console.log(fileThumbnail);
        console.log(thumbnail);
        if (fileThumbnail) {
          thumbnail = `/uploads/service/${fileThumbnail.name}`;
          await axios.delete(`/api/upload`, {
            data: { locations: [service?.thumbnail] },
          });
          const res = await fetch(`/api/upload`, {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error(await res.text());
        }
        if (service?.thumbnail) {
          const res2 = await axios.put(`/api/service/${service?.id}`, {
            thumbnail: thumbnail,
            title: data.title,
            subTitle: data.subTitle,
            description: data.description,
            text: data.linkTitle,
            plainUrl: data.link,
          });
          console.log(res2);
        }

        reset({
          title: "",
          subTitle: "",
          description: "",
          linkTitle: "",
          link: "",
          thumbnail: undefined,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        revalidateService();
        router.push(`/admin/services`);
      }
      // console.log(data);
      toast.success("Submit Successful!");
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <h4 className="text-2xl font-semibold text-black mb-4">
        {isUpdate ? `Update` : `Add a`} Service
      </h4>
      <div className="rounded border border-stroke shadow-default bg-black/20 p-5 gap-5 text-black-2 font-medium">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="md:flex gap-5 mb-5">
            <div className="w-full lg:pb-0 pb-5">
              <label
                htmlFor="title"
                className="mb-3 block text-base font-medium text-black"
              >
                Service Title
              </label>
              <input
                {...register("title")}
                id="title"
                defaultValue={service?.title}
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
            <div className="w-full">
              <label
                htmlFor="subTitle"
                className="mb-3 block text-base font-medium text-black"
              >
                Service Sub Title
              </label>
              <input
                {...register("subTitle")}
                id="subTitle"
                defaultValue={service?.subTitle}
                type="text"
                placeholder="Sub Title"
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              {errors.subTitle && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.subTitle.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="desc"
              className="mb-3 block text-base font-medium text-black"
            >
              Service Descirption
            </label>
            <textarea
              {...register("description")}
              id="desc"
              defaultValue={service?.description}
              placeholder="Description"
              className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter mb-4"
            />
            {errors.description && (
              <p className="text-rose-600 text-sm mt-2">
                {errors.description.message}
              </p>
            )}
          </div>

          <>
            <div className="border-2 flex flex-col items-center p-3 min-h-[15.3rem] border-black/40 w-full">
              <Controller
                name="thumbnail"
                control={control}
                render={({ field }) => (
                  <div className="flex">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      id="thumbnail"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        field.onChange(file);
                        file && handleFileChange(file);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="thumbnail"
                      className="capitalize flex justify-center items-center gap-2 rounded-md bg-rose-500 px-6 py-2 font-medium text-white hover:bg-opacity-90 cursor-pointer w-fit"
                    >
                      <FaImage /> Select an image for thumbnail
                    </label>
                  </div>
                )}
              />
              {selectedImages.length > 0 ? (
                <div
                  key={selectedImages}
                  className="flex flex-col items-center gap-3 py-3"
                >
                  <Image
                    src={`${selectedImages}`}
                    width={150}
                    height={300}
                    alt={`Selected ${selectedImages}`}
                  />
                </div>
              ) : (
                <div className="text-center flex justify-center items-center gap-3 py-3">
                  <FaImage />
                  <p>No Image Selected</p>
                </div>
              )}
              {errors.thumbnail && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
          </>

          <div className="lg:flex gap-5 my-5">
            <div className="w-full lg:pb-0 pb-5">
              <label
                htmlFor="link-title"
                className="mb-3 block text-base font-medium text-black"
              >
                Link Title
              </label>
              <input
                {...register("linkTitle")}
                id="link-title"
                defaultValue={service?.link.text}
                type="text"
                placeholder="Link Title"
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              {errors.linkTitle && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.linkTitle.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="link"
                className="mb-3 block text-base font-medium text-black"
              >
                Link
              </label>
              <input
                {...register("link")}
                id="link"
                defaultValue={service?.link.plainUrl}
                type="text"
                placeholder="Link"
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              {errors.link && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.link.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-5 mt-5">
            {isUpdate && (
              <button
                type="button"
                onClick={() =>
                  deleteService(service, router.push(`/admin/services`))
                }
                className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Delete Service
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

export default ServiceForm;
