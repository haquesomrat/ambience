import { settingType } from "@/types/types";
import Link from "next/link";
import React from "react";

function PrivacyTable({
  privacyTerms,
  privacy,
  terms,
}: {
  privacyTerms: { id: string; description: string; key: string };
  privacy?: boolean;
  terms?: boolean;
}) {
  return (
    <div className="relative overflow-x-auto mt-5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            key={privacyTerms.id}
            className="bg-white border-b border-black/20"
          >
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              {privacyTerms.key}
            </th>
            <td className="px-6 py-4">
              {privacyTerms.description.slice(0, 200)}...
            </td>
            <td className="px-6 py-4">
              {privacy && (
                <Link
                  href={`/admin/privacy/${privacyTerms.key}`}
                  className="inline-flex items-center justify-center bg-black px-4 py-1 text-center font-medium text-white hover:bg-opacity-90 "
                >
                  Edit
                </Link>
              )}
              {terms && (
                <Link
                  href={`/admin/terms-of-services/${privacyTerms.key}`}
                  className="inline-flex items-center justify-center bg-black px-4 py-1 text-center font-medium text-white hover:bg-opacity-90 "
                >
                  Edit
                </Link>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PrivacyTable;
