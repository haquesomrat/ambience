export interface ParamsType {
  key?: string;
  id?: string;
}
export interface menuType {
  id: string;
  key: string;
  items: {
    name: string;
    link: string;
  }[];
}

export interface sliderType {
  id: string;
  key: string;
  img: string[];
}

export interface FaqType {
  id: string;
  question: string;
  answer: string;
}

export interface settingType {
  id: string;
  key: string;
  name: string;
  description: string;
}
export interface GalleryType {
  id: string;
  imgs: string[];
  status: string;
}

export type aboutType = {
  id: string;
  avatar: string[];
  title: string;
  subTitle: string;
  description: string;
  status: string;
};
export type newsType = {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  author: string;
  time: string;
};
export type portfolioType = {
  id: string;
  description: string;
  title: string;
  thumbnail: string;
  gallery: string[];
};
export type userType = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  phone: string;
};
export type serviceType = {
  id: string;
  thumbnail: string;
  title: string;
  subTitle: string;
  description: string;
  linkId: string;
  link: {
    id: string;
    text: string;
    plainUrl: string;
  };
};
