
import { MessageCircle } from "lucide-react";

function WhatsAppButton() {
  const phoneNumber = "91XXXXXXXXXX";
  const message = "Hello! I want to know more about the latest results.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/20 transition duration-300 hover:scale-110 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-green-300 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
    >
      <MessageCircle size={30} strokeWidth={2.2} />
      <span className="absolute -right-1 -top-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-green-500" />
      </span>
    </a>
  );
}

export default WhatsAppButton;
