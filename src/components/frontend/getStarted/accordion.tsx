"use client";

import { getFAQData } from "@/constants/admin/faqData";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

function AccordionComponent() {
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[] | undefined
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch FAQ data client-side
    const fetchFAQData = async () => {
      try {
        const FaqData = await getFAQData();
        console.log("Fetched FAQ Data: ", FaqData); // Log the data to inspect its structure
        setQuestions(FaqData);
      } catch (error) {
        console.error("Failed to fetch FAQ data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQData();
  }, []);

  if (loading) {
    return <p>Loading FAQs...</p>;
  }

  if (!questions || questions.length === 0) {
    return <p>No FAQs available.</p>;
  }

  return (
    <Accordion allowZeroExpanded>
      {questions.map((item, i) => (
        <AccordionItem key={i}>
          <AccordionItemHeading>
            <AccordionItemButton
              style={{
                backgroundColor: "#efece8", // You can add a custom color here if needed
                border: "1px solid #c5c3c1", // Remove default borders if any
              }}
              className="accordion accordion__button flex items-center justify-start gap-3 select-none"
            >
              <div className="w-[90%] ">{item.question}</div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p
              className="prose max-w-none prose-headings:font-normal prose-headings:uppercase text-justify text-[16px] font-openSans leading-8 tracking-[2px] font-semibold  opacity-80"
              dangerouslySetInnerHTML={{ __html: item.answer || "" }}
            />
          </AccordionItemPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default AccordionComponent;
