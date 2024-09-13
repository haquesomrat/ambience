"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Link from "next/link";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalData: number;
  route: string;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  hasNextPage,
  hasPrevPage,
  totalData,
  route,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "6";
  const totalPages = Math.ceil(totalData / Number(per_page));

  const pageNumbers: any[] = [];
  for (let i: number = Number(page) - 1; i <= Number(page) + 1; i++) {
    if (i < 1) continue;
    if (i > totalPages) break;
    pageNumbers.push(i);
  }
  if (totalPages > 3) {
    if (pageNumbers.length < 3) {
      if (pageNumbers.at(-1) === 2) {
        pageNumbers.push(3);
      }
      if (pageNumbers.at(-1) === totalPages) {
        pageNumbers.unshift(totalPages - 2);
      }
    }
  }

  return (
    <div className="flex items-center gap-4 text-lightText">
      <button
        className={`${
          !hasPrevPage ? `opacity-50` : `opacity-100`
        } p-1 rounded-full bg-primary text-3xl`}
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(
            `/${route}?page=${Number(page) - 1}&per_page=${per_page}#gallery`
          );
        }}
      >
        <MdKeyboardArrowLeft />
      </button>



      {Number(page) > 3  ? (
      <>
      
        <Link
          href={`/${route}?page=${Number(page)}&per_page=${per_page}#gallery`}
          className="text-xl font-semibold"
        >
          {1}
        </Link>
        ...
      </>
      ) :
      Number(page) > 2?
      <Link
          href={`/${route}?page=${Number(page)}&per_page=${per_page}#gallery`}
          className="text-xl font-semibold"
        >
          {1}
        </Link>
      :
      <>
      </>
      }

      {pageNumbers.map((pageNumber, i) => (
        <Link
          href={`/${route}?page=${Number(
            pageNumber
          )}&per_page=${per_page}#gallery`}
          className={`text-xl font-semibold ${
            Number(page) === pageNumber
              ? "text-black underline decoration-1"
              : ""
          }`}
          key={i}
        >
          {pageNumber}
        </Link>
      ))}
      {Number(page) < totalPages - 2  ? (
        <>
        ...
        <Link
          href={`/${route}?page=${Number(
            totalPages
          )}&per_page=${per_page}#gallery`}
          className="text-xl font-semibold"
        >
          {totalPages}
        </Link>
      </>
      ) : Number(page) < totalPages - 1 ?
      <Link
      href={`/${route}?page=${Number(
        totalPages
        )}&per_page=${per_page}#gallery`}
        className="text-xl font-semibold"
        >
          {totalPages}
        </Link>
      : (
        <></> 
      )}

      <button
        className={`${
          !hasNextPage ? `opacity-50` : `opacity-100`
        } p-1 rounded-full bg-primary text-3xl`}
        disabled={!hasNextPage}
        onClick={() => {
          router.push(
            `/${route}?page=${Number(page) + 1}&per_page=${per_page}#gallery`
          );
        }}
      >
        <MdKeyboardArrowRight />
      </button>
    </div>
  );
};

export default PaginationControls;
