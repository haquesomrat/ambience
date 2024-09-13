"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ParamsType } from "@/types/types";
import { revalidateMenu } from "@/constants/revalidate/route";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  link: z.string().min(1, "Link is required"),
});

const formSchema = z.object({
  key: z.string().min(2, "Menu is required"),
  items: z.array(itemSchema),
});

type FormSchema = z.infer<typeof formSchema>;

function MenuForm({
  items,
  params,
  isUpdate = false,
}: {
  items: { name: string; link: string }[];
  params: ParamsType;
  isUpdate?: boolean;
}) {
  const router = useRouter();
  const key = params.key;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { key, items },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  useEffect(() => {
    reset({ key, items });
  }, [items, reset, key]);

  async function deleteHandler() {
    axios
      .delete(`/api/menu/${key}`)
      .then((response) => {
        console.log(`${response}`);
        router.push("/admin/menus/");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setSubmitLoading(true);
    if (isUpdate) {
      try {
        const res = await axios.put(`/api/menu/${key}`, {
          key: data.key,
          items: data.items,
        });
        revalidateMenu();
        router.push("/admin/menus");
        toast.success("Submit Successful!");
        // Handle successful response (e.g., redirect or show success message)
      } catch (error) {
        console.log("Error:", error);
        // Handle error (e.g., show error message)
      } finally {
        setSubmitLoading(false);
      }
    } else {
      try {
        const menu = await axios.get("/api/menu/");
        console.log(menu.data);
        // if key is avaiable assign that to menuObject
        const menuObject = menu.data.find((item: any) => item.key === data.key);

        let menuItems: { name: string; link: string }[] = [];

        if (menuObject !== undefined) {
          menuItems = menuObject.items;
          menuItems.push(...data.items);

          const res = await axios.put(`/api/menu/${menuObject.key}`, {
            key: data.key,
            items: menuItems,
          });
          console.log("Response:", res.data);
        } else {
          const res = await axios.post(`/api/menu/`, {
            key: data.key,
            items: data.items,
          });
          console.log("Response:", res.data);
        }
        revalidateMenu();
        toast.success("Submit Successful!");
        // // Handle successful response (e.g., redirect or show success message)
      } catch (error) {
        console.log("Error:", error);
        // Handle error (e.g., show error message)
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  return (
    <div className="rounded border border-stroke shadow-default bg-black/20">
      <form onSubmit={handleSubmit(onSubmit)} className="py-4 px-6.5">
        <div className="mb-4">
          <label
            htmlFor="key"
            className="mb-3 block text-sm font-medium text-black"
          >
            Menu For<span className="text-rose-500">*</span>
          </label>

          <select
            {...register("key")}
            id="key"
            defaultValue={key === "" ? "nav" : key}
            className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <option value="nav">Nav</option>
            <option value="social">Social</option>
          </select>

          {errors.key && (
            <div className="text-rose-600 text-sm mb-3 rounded-lg mt-1 max-w-fit">
              {errors.key.message}
            </div>
          )}
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex md:flex-row flex-col gap-3 w-full mb-4"
          >
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black">
                Name<span className="text-rose-500">*</span>
              </label>
              <Controller
                name={`items.${index}.name`}
                control={control}
                defaultValue={field.name}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    {...field}
                  />
                )}
              />
              {errors.items?.[index]?.name && (
                <div className="text-rose-600 text-sm mb-3 rounded-lg mt-1 max-w-fit">
                  {errors.items[index]?.name?.message}
                </div>
              )}
            </div>
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black">
                Link<span className="text-rose-500">*</span>
              </label>
              <Controller
                name={`items.${index}.link`}
                control={control}
                defaultValue={field.link}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="Link"
                    className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                    {...field}
                  />
                )}
              />
              {errors.items?.[index]?.link && (
                <div className="text-rose-600 text-sm mb-3 rounded-lg mt-1 max-w-fit">
                  {errors.items[index]?.link?.message}
                </div>
              )}
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-between pt-4">
          <div>
            {isUpdate && (
              <button
                type="button"
                onClick={deleteHandler}
                className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Delete {key}
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => append({ name: "", link: "" })}
              className="flex rounded-md bg-green-600 px-6 py-2 text-center font-medium text-white hover:bg-gray-300"
            >
              Add Item
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
        </div>
      </form>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default MenuForm;
