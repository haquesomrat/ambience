import { menuType, serviceType, sliderType } from "@/types/types";

export const fakeSliderData: sliderType = {
  id: "1",
  key: "slider1",
  img: [
    // "/uploads/slider/home/img-vas.png",
    "/uploads/slider/home/kips-5.webp",
    "/uploads/slider/home/lake-lifee.webp",
    "/uploads/slider/home/LauraLeeClark_Kips23_9141.webp",
  ],
};

export const fakeServiceData: serviceType[] = [
  {
    id: "1",
    thumbnail: "/uploads/service/interior-design-1.png",
    title: "Service One",
    subTitle: "Best Service for You",
    description: "This is a description for Service One.",
    linkId: "link-1",
    link: {
      id: "link-1",
      text: "Learn More",
      plainUrl: "/uploads/service/interior-design-1.png",
    },
  },
  {
    id: "2",
    thumbnail: "/uploads/service/interior-design-2.png",
    title: "Service Two",
    subTitle: "Another Great Service",
    description: "This is a description for Service Two.",
    linkId: "link-2",
    link: {
      id: "link-2",
      text: "Discover More",
      plainUrl: "/uploads/service/interior-design-2.png",
    },
  },
  {
    id: "3",
    thumbnail: "/uploads/service/interior-design-3.png",
    title: "Service Three",
    subTitle: "Quality Service Guaranteed",
    description: "This is a description for Service Three.",
    linkId: "link-3",
    link: {
      id: "link-3",
      text: "Explore More",
      plainUrl: "/uploads/service/interior-design-3.png",
    },
  },
  {
    id: "4",
    thumbnail: "/uploads/service/interior-design-1.png",
    title: "Service Four",
    subTitle: "Quality Service Guaranteed",
    description: "This is a description for Service Three.",
    linkId: "link-3",
    link: {
      id: "link-3",
      text: "Explore More",
      plainUrl: "/uploads/service/interior-design-1.png",
    },
  },
];

export const fakeMenuData: menuType = {
  id: "menu1",
  key: "mainMenu",
  items: [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Portfolio",
      link: "/portfolio",
    },
    {
      name: "News",
      link: "/news",
    },
    {
      name: "Get Started",
      link: "/get-started",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ],
};
