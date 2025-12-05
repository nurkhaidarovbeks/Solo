import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react"; // Removed ArrowLeft and Button
// Removed useNavigate as it's not used anymore

const testimonials = [
  {
    name: "Jane Doe",
    role: "Freelance Designer",
    testimonial: "Saqtau File Haven has revolutionized how I manage my client projects. The interface is intuitive and the storage is reliable!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=1" 
  },
  {
    name: "John Smith",
    role: "Software Developer",
    testimonial: "I love the seamless integration and the robust security features. Knowing my code and assets are safe is a huge plus.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    name: "Alice Brown",
    role: "Marketing Manager",
    testimonial: "The collaboration tools are fantastic for our team. Sharing and commenting on files has never been easier.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=3"
  },
];

const TestimonialsPage = () => {
  // Removed navigate
  return (
    <div className="bg-gradient-to-br from-slate-100 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Removed Back button */}
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-4 pt-8"> {/* Added pt-8 for spacing */}
          What Our Users Say
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Real stories from satisfied Saqtau File Haven users.
        </p>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg bg-white">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full" />
                <div>
                  <CardTitle className="text-xl text-gray-700">{testimonial.name}</CardTitle>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                     <Star key={i + testimonial.rating} className="h-5 w-5 text-gray-300 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
