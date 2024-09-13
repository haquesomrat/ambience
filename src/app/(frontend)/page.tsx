"use client";
import Hero from "@/components/frontend/home/hero";
import Slider from "@/components/frontend/home/slider";
// import { serviceType, sliderType } from "@/types/types";
// import axios from "axios";
// import { useEffect, useState } from "react";
import Loading from "./loading";
import { fakeServiceData, fakeSliderData } from "@/lib/fake-data";

export default function Home() {
  // const [slider, setSlider] = useState<sliderType>(fakeSliderData);
  // const [services, setServices] = useState<serviceType[]>(fakeServiceData);
  // const [slider, setSlider] = useState<sliderType | null>(null);
  // const [services, setServices] = useState<serviceType[] | null>(null);
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const res = await axios.get(`/api/slider/home`);
  //       const res2 = await axios.get(`/api/service`);
  //       setSlider(res.data);
  //       setServices(res2.data);
  //     } catch (err) {
  //       console.log("Error fetching slider data");
  //       setSlider(fakeSliderData);
  //       setServices(fakeServiceData);
  //     }
  //   };
  //   getData();
  // }, []);
  // console.log(slider, services);

  // if (!slider || !services) {
  //   return <Loading />;
  // }
  if (!fakeSliderData || !fakeServiceData) {
    return <Loading />;
  }

  return (
    <main className="container mx-auto flex flex-col items-center justify-center mt-5">
      <Slider slider={fakeSliderData} />
      {fakeServiceData?.map((data, i) => (
        <Hero
          key={i}
          heading={data.title}
          subHeading={data.subTitle}
          description={data.description}
          img={data.thumbnail}
          link={data.link.plainUrl}
          linkHeader={data.link.text}
          index={i + 1}
        />
      ))}
    </main>
  );
}
