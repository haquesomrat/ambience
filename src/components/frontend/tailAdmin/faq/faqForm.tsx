"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { FaqType, ParamsType } from "@/types/types";
import { revalidateFAQ } from "@/constants/revalidate/route";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import dynamic from "next/dynamic";

const faqSchema = z.object({
  question: z.string().min(1, "Name is required"),
  answer: z.string().min(1, "Link is required"),
});

export async function deleteFaq(faq: FaqType, router: void) {
  axios
    .delete(`/api/faq/${faq?.id}`)
    .then((response) => {
      console.log(`${response}`);
      router;
    })
    .catch((error) => {
      console.error(error);
    });
  revalidateFAQ();
  toast.warn("Successfully Deleted!");
}

type FormSchema = z.infer<typeof faqSchema>;

function FaqForm({ faq, isUpdate }: { faq?: FaqType; isUpdate?: boolean }) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(faqSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setSubmitLoading(true);
    if (isUpdate) {
      try {
        const res = await axios.put(`/api/faq/${faq?.id}`, data);
        revalidateFAQ();
        router.push("/admin/faqs");
        // Handle successful response (e.g., redirect or show success message)
      } catch (error) {
        console.log("Error:", error);
        // Handle error (e.g., show error message)
      }
    } else {
      try {
        const res = await axios.post(`/api/faq/`, data);
        revalidateFAQ();
        console.log("Response:", res.data);
        // Handle successful response (e.g., redirect or show success message)
      } catch (error) {
        console.log("Error:", error);
        // Handle error (e.g., show error message)
      }
      reset({
        question: "",
        answer: "",
      });
    }
    toast.success("Submit Successful!");
    setSubmitLoading(false);
  };

  return (
    <div className="rounded border border-stroke shadow-default bg-black/20 p-5 ">
      <h4 className="text-2xl font-semibold text-black mb-4">
        {isUpdate ? `Update FAQ` : `Add FAQ`}
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="mb-4">
          <label className="mb-3 block text-sm font-medium text-black">
            Question<span className="text-rose-500">*</span>
          </label>
          <Controller
            name="question"
            defaultValue={faq?.question}
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Question"
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                {...field}
              />
            )}
          />
          {errors.question && (
            <div className="text-rose-600 text-sm mb-3 rounded-lg mt-1 max-w-fit">
              {errors.question.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-3 block text-sm font-medium text-black">
            Answer<span className="text-rose-500">*</span>
          </label>
          <Controller
            name={`answer`}
            control={control}
            defaultValue={faq?.answer}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                {...field}
                className="bg-white h-48 rounded-lg overflow-hidden"
              />
            )}
          />
          {errors.answer && (
            <div className="text-rose-600 text-sm mb-3 rounded-lg mt-1 max-w-fit">
              {errors.answer.message}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {isUpdate && faq && (
              <button
                type="button"
                onClick={() => {
                  deleteFaq(faq, router.push("/admin/faqs"));
                }}
                className="capitalize flex rounded-md bg-rose-500 px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-4">
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

export default FaqForm;
