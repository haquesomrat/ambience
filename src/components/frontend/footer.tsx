import Link from "next/link";
import CopyRight from "./copyRight";
import Social from "./footer/social";
import ContactInfo from "./contact/contactInfo";

function Footer() {
  return (
    <div className="text-center mt-10">
      <CopyRight />
      <div className="bg-primary font-openSans text-lg tracking-[2px] font-semibold text-[#a7a1a4] mt-16 py-4">
        <ContactInfo footer />
        <Social className="pt-2" />
        <div className="flex  justify-center items-center p-2">
          <div className=" py-1 bg-gray-500 w-20"></div>
        </div>
        <div className="p-1 flex sm:flex-row flex-col justify-center items-center sm:gap-3">
          <div className="footer-description footer-link-text">
            © 1992 - {new Date().getFullYear()} AMBIANCE
          </div>
          <div className="footer-description footer-link-text px-1 "> . </div>
          <a
            className="footer-description footer-link-text uppercase"
            href="https://clickandco.co/"
          >
            All Rights Reserved
          </a>
        </div>
        <div className="py-1">
          <Link
            className="footer-description footer-link-text uppercase"
            href="/terms-of-services"
          >
            Terms Of services
          </Link>
        </div>
        <div className="py-1">
          <Link
            className="footer-description footer-link-text uppercase"
            href="/privacy-information"
          >
            PRIVACY Information
          </Link>
        </div>
        <div>
          <Link
            className="footer-description footer-link-text p-1"
            href="/signin"
          >
            PROTECTED
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
