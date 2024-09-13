"use client";
import { revalidateSetting } from "@/constants/revalidate/route";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const formSchema = z.object({
  key: z.string().min(2, "Key is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export async function siteDeleteHandler(id: string, router?: void) {
  axios
    .delete(`/api/setting/${id}`)
    .then((response) => {
      console.log(`${response}`);
      revalidateSetting();
      router;
    })
    .catch((error) => {
      console.error(error);
    });
  toast.warn("Contact Deleted!");
}
type FormSchema = z.infer<typeof formSchema>;

function SiteForm({
  site,
  isUpdate = false,
}: {
  site?: {
    id: string;
    name: string;
    description: string;
    key: string;
  };
  isUpdate?: boolean;
}) {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setSubmitLoading(true);
    if (isUpdate) {
      try {
        const res = await axios.put(`/api/setting/${site?.id}`, {
          key: data.key,
          name: data.name,
          description: data.description,
        });
        revalidateSetting();
        router.push("/admin/site");
        // Handle successful response (e.g., redirect or show success message)
        toast.success("Submit Successful!");
      } catch (error) {
        console.log("Error:", error);
        // Handle error (e.g., show error message)
      } finally {
        setSubmitLoading(false);
      }
    } else {
      console.log(data);
      try {
        const res = await axios.post(`/api/setting/`, {
          key: data.key,
          name: data.name,
          description: data.description,
        });
        revalidateSetting();
        console.log("Response:", res.data);
        // Handle successful response (e.g., redirect or show success message)
        toast.success("Submit Successful!");
      } catch (error) {
        console.log("Error:", error);
        // Handle error (e.g., show error message)
      } finally {
        setSubmitLoading(false);
      }
      reset({
        key: "",
        name: "",
        description: "",
      });
    }
  };

  return (
    <div className="rounded border border-stroke shadow-default bg-black/20">
      <form onSubmit={handleSubmit(onSubmit)} className="py-4 px-6.5">
        <div className="mb-4">
          <label className="mb-3 block text-base font-medium text-black">
            Setting<span className="text-rose-500">*</span>
          </label>
          <Controller
            name="key"
            control={control}
            defaultValue={site?.key || "contact"}
            render={({ field }) => (
              <select
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent pe-28 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                {...field}
              >
                <option value="contact">Contact</option>
                <option value="other">Other</option>
              </select>
            )}
          />
          {errors.key && (
            <div className="text-rose-600 text-sm mb-3 rounded-lg mt-1 max-w-fit">
              {errors.key.message}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row md:flex-row gap-5 w-full mb-4">
          <div className="w-full">
            <label className="mb-3 block text-base font-medium text-black">
              Name<span className="text-rose-500">*</span>
            </label>
            <Controller
              name={`name`}
              control={control}
              defaultValue={site?.name}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                  {...field}
                />
              )}
            />
            {errors.name && (
              <div className="text-rose-600 text-sm mb-3 rounded-lg mt-1 max-w-fit">
                {errors.name.message}
              </div>
            )}
          </div>
          <div className="w-full">
            <label className="mb-3 block text-base font-medium text-black">
              Description<span className="text-rose-500">*</span>
            </label>
            <Controller
              name={`description`}
              control={control}
              defaultValue={site?.description}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="description"
                  className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                  {...field}
                />
              )}
            />
            {errors.description && (
              <div className="text-rose-600 text-sm mb-3 rounded-lg mt-1 max-w-fit">
                {errors.description.message}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 gap-4">
          {isUpdate && (
            <button
              type="button"
              onClick={() =>
                siteDeleteHandler(site?.id || "", router.push("/admin/site"))
              }
              className="flex rounded-md bg-rose-600 px-6 py-2 text-center font-medium text-white hover:bg-gray-300"
            >
              Delete
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
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default SiteForm;
