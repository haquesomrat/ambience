"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

// Define dummy FAQ data
const dummyFAQData = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy. If you are not satisfied with your purchase, you can return it within 30 days for a full refund or exchange.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You can track your order using the tracking number sent to your email once your order has shipped. You can also track it in the 'Orders' section of your account.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we offer international shipping to most countries. Shipping costs and delivery times vary based on the destination.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can contact our customer support team through the 'Contact Us' page on our website, or by emailing support@example.com.",
  },
  {
    question: "Do you offer gift cards?",
    answer:
      "Yes, we offer gift cards that can be purchased on our website. They can be used to pay for purchases or given as gifts.",
  },
];

function AccordionComponent() {
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[] | undefined
  >(dummyFAQData);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Simulate fetching FAQ data
    const fetchFAQData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setQuestions(dummyFAQData);
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
                backgroundColor: "#efece8", // Custom color
                border: "1px solid #c5c3c1", // Custom border
              }}
              className="accordion accordion__button flex items-center justify-start gap-3 select-none"
            >
              <div className="w-[90%]">{item.question}</div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p
              className="prose max-w-none prose-headings:font-normal prose-headings:uppercase text-justify text-[16px] font-openSans leading-8 tracking-[2px] font-semibold opacity-80"
              dangerouslySetInnerHTML={{ __html: item.answer || "" }}
            />
          </AccordionItemPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default AccordionComponent;
