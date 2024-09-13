"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { aboutType } from "@/types/types";
import { useRouter } from "next/navigation";
import { revalidateAbout } from "@/constants/revalidate/route";
import { FaImage, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import ToggleSwitch from "@/components/toggleSwitch";

export async function deleteAbout(about: aboutType | undefined, router?: void) {
  try {
    await axios.delete(`/api/about/${about?.id}`).catch((error) => {
      console.error(error);
    });

    revalidateAbout();
    await axios.delete(`/api/upload`, {
      data: { location: about?.avatar },
    });
    router;
  } catch (error) {
    console.log(error);
  }
  toast.warn("Successfully Deleted!");
}

let sliderSchema;
function AboutForm({
  about,
  isUpdate,
}: {
  about?: aboutType;
  isUpdate?: boolean;
}) {
  if (!isUpdate) {
    sliderSchema = z.object({
      title: z.string().min(2, "title must be at least 2 characters long"),
      subTitle: z
        .string()
        .min(2, "sub title must be at least 2 characters long"),
      description: z
        .string()
        .min(2, "description title must be at least 2 characters long"),

      avatar: z
        .custom<FileList>((files) => files instanceof FileList)
        .refine((files) => files.length > 0, {
          message: "At least one file must be uploaded",
        }),
    });
  } else {
    sliderSchema = z.object({
      title: z.string().min(2, "title must be at least 2 characters long"),
      subTitle: z
        .string()
        .min(2, "sub title must be at least 2 characters long"),
      description: z
        .string()
        .min(2, "description title must be at least 2 characters long"),

      avatar: z
        .custom<FileList>((files) => files instanceof FileList)
        .refine((files) => files.length > 0, {
          message: "At least one file must be uploaded",
        })
        .optional(),
    });
  }
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  type SliderFormData = z.infer<typeof sliderSchema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SliderFormData>({
    resolver: zodResolver(sliderSchema),
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
  };

  const handleFileChange = (files: FileList) => {
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages(imageUrls);
  };

  const onSubmit = async (data: SliderFormData) => {
    setSubmitLoading(true);
    const files = data.avatar ? Array.from(data.avatar) : [];
    console.log(isChecked);

    try {
      const formData = new FormData();
      let avatar: string[] = [];
      if (isUpdate) {
        console.log(about?.avatar);

        if (data.avatar) {
          files.forEach((file, index) => {
            formData.append(`file_${index}`, file);
            avatar.push(`/uploads/about/${file.name}`);
          });

          formData.append("targetDIR", "about");

          const res = await fetch(`/api/upload`, {
            method: "POST",
            body: formData,
          });

          await axios.delete(`/api/upload`, {
            data: { locations: [about?.avatar] },
          });
          if (!res.ok) throw new Error(await res.text());
        } else {
          avatar = about?.avatar || [];
        }
        const res1 = await axios.put(`/api/about/${about?.id}`, {
          avatar: avatar,
          title: data.title,
          subTitle: data.subTitle,
          description: data.description,
          status: isChecked ? "active" : "inactive",
        });
        setSelectedImages([]);

        router.push("/admin/about");
        revalidateAbout();
        reset({
          avatar: undefined,
          title: "",
          subTitle: "",
          description: "",
        });
        console.log(res1);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const avatar: string[] = [];

        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
          avatar.push(`/uploads/about/${file.name}`);
        });

        const res1 = await axios.post(`/api/about/`, {
          avatar: avatar,
          title: data.title,
          subTitle: data.subTitle,
          description: data.description,
          status: isChecked ? "active" : "inactive",
        });
        revalidateAbout();
        formData.append("targetDIR", "about");

        const res2 = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });
        console.log(res1);
        if (!res2.ok) throw new Error(await res2.text());

        reset({
          avatar: undefined,
          title: "",
          subTitle: "",
          description: "",
        });

        setSelectedImages([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
        Create new author
      </h4>
      <div className="rounded border border-stroke shadow-default bg-black/20 p-5 gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {isUpdate && (
            <div className="flex flex-col items-center gap-5 m-5">
              {selectedImages.length > 0 ? (
                selectedImages.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    width={250}
                    height={300}
                    alt={`Selected ${index}`}
                  />
                ))
              ) : (
                <Image
                  src={about?.avatar[0] || ""}
                  alt="img-home"
                  width={250}
                  height={300}
                />
              )}
              <div>
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        id="file-upload"
                        ref={fileInputRef}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          e.target.files && handleFileChange(e.target.files);
                        }}
                        className="hidden "
                      />
                      <label
                        htmlFor="file-upload"
                        className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 cursor-pointer"
                      >
                        Change Avatar
                      </label>
                    </div>
                  )}
                />
                {errors.avatar && (
                  <p className="text-rose-600 text-sm mt-2">
                    {errors.avatar.message}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="md:flex gap-5 mb-5">
            <div className="w-full lg:mb-0 mb-5">
              <label
                htmlFor="title"
                className="mb-3 block text-base font-medium text-black"
              >
                Title<span className="text-rose-500">*</span>
              </label>
              <input
                {...register("title")}
                defaultValue={about?.title}
                id="title"
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
                Sub Title<span className="text-rose-500">*</span>
              </label>
              <input
                {...register("subTitle")}
                defaultValue={about?.subTitle}
                id="subTitle"
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
          <div className="w-full mb-4">
            <label
              htmlFor="desc"
              className="mb-3 block text-base font-medium text-black"
            >
              Description<span className="text-rose-500">*</span>
            </label>
            <textarea
              {...register("description")}
              id="desc"
              defaultValue={about?.description}
              placeholder="Description"
              className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
            />
            {errors.description && (
              <p className="text-rose-600 text-sm mt-2 ">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex justify-center items-end gap-5">
            <div>
              {!isUpdate && (
                <>
                  <Controller
                    name="avatar"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.webp"
                          id="file-upload"
                          ref={fileInputRef}
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            e.target.files && handleFileChange(e.target.files);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload"
                          className="capitalize rounded-md  flex justify-center items-center gap-2 bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 cursor-pointer md:w-fit"
                        >
                          <FaImage /> Upload Avatar
                        </label>
                      </div>
                    )}
                  />
                  {errors.avatar && (
                    <p className="text-rose-600 text-sm mt-2">
                      {errors.avatar.message}
                    </p>
                  )}

                  {/* Display the selected images */}
                </>
              )}
            </div>
            <div>
              <label className="mb-3 block text-base font-medium text-black">
                Status
              </label>
              <ToggleSwitch
                isChecked={isChecked}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>
          </div>
          <div className="flex justify-center gap-5 mt-5">
            {selectedImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                width={150}
                height={300}
                alt={`Selected ${index}`}
              />
            ))}
          </div>
          <div className="flex justify-end gap-5 mt-5">
            {isUpdate && (
              <button
                type="button"
                onClick={() => {
                  deleteAbout(about, router.push("/admin/about"));
                }}
                className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Delete About
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
      <ToastContainer autoClose={2000} position="bottom-right" />
    </div>
  );
}

export default AboutForm;
