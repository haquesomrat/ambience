"use client";
import React from "react";
import Link from "next/link";
import { FaqType } from "@/types/types";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { deleteFaq } from "./faqForm";

function FAQTable({ faq }: { faq: FaqType[] }) {
  return (
    <div className="rounded border border-stroke shadow-default overflow-x-auto  bg-black/20 p-5 mt-5">
      <h1 className="text-2xl font-semibold text-black capitalize mb-3">
        FAQ Table
      </h1>
      <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-base text-gray-700 uppercase bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3">
              Question
            </th>
            <th scope="col" className="px-6 py-3">
              Answer
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {faq.map((item) => (
            <tr key={item.id} className="bg-white border-b border-black/20">
              <td className="px-6 py-4">
                {item.question.length > 35
                  ? `${item.question.slice(0, 40)}...`
                  : item.question}
              </td>
              <td className="px-6 py-4">
                {item.answer.length > 75
                  ? `${item.answer.replaceAll(/<[^>]*>/g, "").slice(0, 80)}...`
                  : item.answer.replaceAll(/<[^>]*>/g, "")}
              </td>

              <td className="px-6 py-4 h-32 text-end inline-flex items-center justify-end gap-2">
                <Link
                  href={`/admin/faqs/${item.id}`}
                  className="inline-flex items-center justify-center text-xl rounded bg-black p-1.5 text-white hover:bg-black/85"
                >
                  <MdOutlineEdit />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-xl rounded bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                  onClick={() => {
                    deleteFaq(item);
                  }}
                >
                  <MdOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FAQTable;
