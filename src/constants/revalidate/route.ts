"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function revalidateMenu() {
  revalidateTag("menu");
}
export async function revalidateFAQ() {
  revalidateTag("faq");
}
export async function revalidateSetting() {
  revalidateTag("setting");
}
export async function revalidateSlider() {
  revalidateTag("slider");
}
export async function revalidateAbout() {
  revalidateTag("about");
}
export async function revalidatePortfolio() {
  revalidateTag("portfolio");
}
export async function revalidateNews() {
  revalidateTag("news");
}
export async function revalidateGallery() {
  revalidateTag("gallery");
}
export async function revalidateUser() {
  revalidateTag("user");
}
export async function revalidatePrivacyTerm() {
  revalidateTag("privacyTerms");
}
export async function revalidateService() {
  revalidateTag("service");
}
