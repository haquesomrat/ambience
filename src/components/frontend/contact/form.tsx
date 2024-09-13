"use client";
import React from "react";
import ButtonOverLogo from "../buttonOverLogo";
import { motion } from "framer-motion";
import Input from "./input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "name must be atleast 2 characters"),
  email: z.string(),
  phone: z.string().min(6, "phone must be atleast 6 characters"),
  location: z.string().min(2, "location must be atleast 2 characters"),
  details: z.string().min(2, "details must be atleast 10 characters"),
  iam: z.string().min(2, "details must be atleast 10 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

function Form() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    console.log(data);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Email sent successfully:', result);
      } else {
        console.error('Error sending email:', result);
      }
      reset({
        name:"",
        email:"",
        phone:"",
        location:"",
        details:"",
        iam:""
      })
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      viewport={{ once: true, amount: 0.01 }}
      className="min-w-[48%]"
    >
      <form
        className="flex flex-col font-openSans gap-3 lg:mt-0 mt-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input type="text" placeholder="NAME" {...field} />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
        <Input type="text" placeholder="EMAIL ADDRESS" {...field}/>
      )}
      />
      <Controller
          name="phone"
          control={control}
          render={({ field }) => (
        <Input type="text" placeholder="PHONE NUMBER" {...field}/>
      )}
      />
      <Controller
          name="location"
          control={control}
          render={({ field }) => (
        <Input type="text" placeholder="LOCATION" {...field} />
      )}
      />
      <Controller
          name="details"
          control={control}
          render={({ field }) => (
        <textarea
          className="bg-primary border-none text-[#a7a1a4] h-[4.25rem] text-center px-5 text-[16px] focus-visible:outline-[#a7a1a4] focus-visible:[outline-style:solid] py-2"
          placeholder="DETAILS"
          {...field}
        />
      )}
      />
      <Controller
          name="iam"
          control={control}
          render={({ field }) => (
        <select
          id="dropdown"
          className="bg-primary font-openSans border-none text-[#a7a1a4] text-center leading-3 px-5 text-[16px] focus-visible:outline-none py-2"
        {...field}
        >
          <option value="I AM A...">I AM A...</option>
          <option value="Home Owner">Home Owner</option>
          <option value="Designer">Designer</option>
        </select>
        )}
        />
        <ButtonOverLogo>Submit</ButtonOverLogo>
      </form>
    </motion.div>
  );
}

export default Form;
