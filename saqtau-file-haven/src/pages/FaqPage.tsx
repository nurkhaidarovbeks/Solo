import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// Removed Button, ArrowLeft, useNavigate

const faqItems = [
  {
    question: "What is Saqtau File Haven?",
    answer: "Saqtau File Haven is a secure cloud storage solution designed to help you store, manage, and share your files effortlessly."
  },
  {
    question: "How secure is my data?",
    answer: "We prioritize your data's security with end-to-end encryption, regular backups, and robust access controls. Your files are safe with us."
  },
  {
    question: "What types of files can I store?",
    answer: "You can store a wide variety of file types, including documents, photos, videos, audio files, and more. Check our terms for any specific restrictions."
  },
  {
    question: "Can I access my files from multiple devices?",
    answer: "Yes! Saqtau File Haven is accessible via web browser on desktops, laptops, tablets, and smartphones. We plan to release dedicated mobile apps in the future."
  },
  {
    question: "How does the 'Free Trial' work?",
    answer: "The Free Trial gives you access to our basic plan features for a limited time or up to a certain storage limit, allowing you to experience Saqtau File Haven before committing to a paid plan."
  },
  {
    question: "How do I upgrade my plan?",
    answer: "You can upgrade your plan at any time from your account dashboard. Simply navigate to the 'Upgrade Plan' section and choose the plan that best suits your needs."
  }
];

const FaqPage = () => {
  // Removed navigate
  return (
    <div className="bg-gradient-to-br from-slate-100 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Removed Back button */}
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-4 pt-8"> {/* Added pt-8 for spacing */}
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Find answers to common questions about Saqtau File Haven.
        </p>

        <Accordion type="single" collapsible className="w-full bg-white p-6 rounded-lg shadow-lg">
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-medium text-gray-700 hover:text-blue-600">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-2 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FaqPage;
