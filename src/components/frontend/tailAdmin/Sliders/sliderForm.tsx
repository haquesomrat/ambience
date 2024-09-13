"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { revalidateSlider } from "@/constants/revalidate/route";
import { ParamsType } from "@/types/types";
import { useRouter } from "next/navigation";
import { FaImages } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdClose } from "react-icons/io";

const sliderSchema = z.object({
  key: z.string().min(2, "Key must be at least 2 characters long"),
  files: z
    .custom<FileList>((files) => files instanceof FileList)
    .refine((files) => files.length > 0, {
      message: "At least one file must be uploaded",
    }),
});

type SliderFormData = z.infer<typeof sliderSchema>;

function SliderForm({
  params,
  imgs,
  isUpdate,
}: {
  params: ParamsType;
  imgs: string[];
  isUpdate?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SliderFormData>({
    resolver: zodResolver(sliderSchema),
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const key = params.key;
  const router = useRouter();

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

  const onSubmit = async (data: SliderFormData) => {
    setLoading(true); // Set loading to true when the submission starts
    const files = selectedFiles;

    try {
      const formData = new FormData();
      if (isUpdate) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
          imgs.push(`/uploads/slider/${data.key}/${file}`);
        });

        await axios.put(`/api/slider/${key}`, {
          key: data.key,
          img: imgs,
        });
        revalidateSlider();
        formData.append("targetDIR", `slider/${data.key}`);

        const res = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error(await res.text());
        reset({
          key: "",
          files: undefined,
        });

        setSelectedFiles([]);
        router.push("/admin/sliders");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const slider = await axios.get(`/api/slider`);
        // console.log(slider.data);
        const sliderObject = slider.data.find(
          (item: any) => item.key === data.key
        );

        let imgs: string[] = [];
        console.log(sliderObject);
        if (sliderObject !== undefined) {
          imgs = sliderObject.img;
        }
        // console.log(imgs);
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
          imgs.push(`/uploads/slider/${data.key}/${file.name}`);
        });
        console.log(imgs);
        if (sliderObject === undefined) {
          await axios.post(`/api/slider/`, {
            key: data.key,
            img: imgs,
          });
        } else {
          await axios.put(`/api/slider/${data.key}`, {
            key: data.key,
            img: imgs,
          });
        }
        revalidateSlider();
        formData.append("targetDIR", `slider/${data.key}`);

        const res = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(await res.text());

        reset({
          key: "",
          files: undefined,
        });

        setSelectedFiles([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      toast.success("Submit Successful!");
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false); // Set loading to false when the submission is done
    }
  };

  async function deleteImages(location: string) {
    const index = imgs.indexOf(location);
    if (index > -1) {
      imgs.splice(index, 1);
    }
    try {
      const res = await axios.put(`/api/slider/${key}`, {
        key: key,
        img: imgs,
      });
      await axios.delete(`/api/upload`, {
        data: { locations: [location] },
      });
      console.log("Response:", res.data);
      revalidateSlider();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteSlider() {
    try {
      axios
        .delete(`/api/slider/${key}`)
        .then((response) => {
          console.log(`${response}`);
          revalidateSlider();
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .delete(`/api/delete-dir`, {
          data: { dir: `/uploads/slider/${key}` },
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
    router.push("/admin/sliders/");
  }

  return (
    <div>
      <h4 className="text-2xl font-semibold text-black">
        {isUpdate ? `Update` : `Add `} Slider
      </h4>
      {isUpdate && (
        <div className="border border-stroke bg-black/20 px-7.5 py-6 shadow-default mt-5">
          <div className="flex justify-between mb-5">
            <h1 className="text-2xl font-semibold text-black capitalize">
              {key} slider
            </h1>
          </div>
          <div className="flex gap-5 overflow-auto">
            {imgs.map((image: string, index: number) => (
              <div
                key={`${image}${index}`}
                className="flex flex-col gap-3 justify-center items-center mb-3"
              >
                <div className="aspect-square w-40 inline-block overflow-hidden">
                  <Image
                    src={image}
                    alt="img-home"
                    width={1500}
                    height={1500}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isUpdate && (
                  <button
                    type="button"
                    onClick={() => deleteImages(image)}
                    className="flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded border border-stroke shadow-default bg-black/20 p-5 mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="md:flex items-center gap-5 mb-5">
            <div className="w-full ">
              <label
                htmlFor="key"
                className="mb-3 block text-base font-medium text-black"
              >
                Slider<span className="text-rose-500">*</span>
              </label>
              <select
                {...register("key")}
                id="key"
                defaultValue={key || "home"}
                className="w-full rounded-lg bg-white border-[1.5px] text-lg border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              >
                <option value="home">Home</option>
                <option value="news">News</option>
                <option value="contact">Contact</option>
              </select>
              {errors.key && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.key.message}
                </p>
              )}
            </div>

            <div className="w-full md:max-w-fit">
              <Controller
                name="files"
                control={control}
                render={({ field }) => (
                  <div>
                    <label
                      htmlFor="sliders"
                      className="mb-3 block text-base font-medium text-black"
                    >
                      Slider Image
                    </label>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      id="sliders"
                      multiple
                      ref={fileInputRef}
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        e.target.files && handleFileChange(e.target.files);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="sliders"
                      className="capitalize flex justify-center items-center gap-2 rounded-md bg-rose-500 px-6 py-2 font-medium text-white hover:bg-opacity-90 cursor-pointer text-sm md:text-base"
                    >
                      <FaImages /> Select images for Sliders
                    </label>
                  </div>
                )}
              />
              {errors.files && (
                <p className="text-rose-600 text-sm mt-2">
                  {errors.files.message}
                </p>
              )}
            </div>
          </div>

          {/* Display the selected images */}
          <div className="flex gap-5 ">
            {selectedFiles.map((file, index) => {
              const imageUrl = URL.createObjectURL(file);
              return (
                <div
                  key={`${imageUrl}-${index}`}
                  className="flex flex-col aspect-square w-40 overflow-hidden items-center gap-3 relative"
                >
                  <Image
                    key={index}
                    src={imageUrl}
                    width={150}
                    height={300}
                    alt={`Selected ${index}`}
                  />
                  <button
                    className="absolute top-0 right-0 p-1 bg-rose-500 text-white rounded-full"
                    onClick={() => handleFileDelete(index)}
                  >
                    <IoMdClose />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-5 mt-5">
            {isUpdate && (
              <button
                onClick={deleteSlider}
                className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Delete Slider
              </button>
            )}
            <button
              type="submit"
              className="rounded-md bg-black px-6 py-2  font-medium text-white hover:bg-opacity-90 flex items-center gap-2"
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
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

export default SliderForm;
