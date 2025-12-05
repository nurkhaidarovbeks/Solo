import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react"; // Removed ArrowLeft
import { useNavigate } from "react-router-dom";

// Dummy plan data, can be fetched from API if dynamic
const plans = [
  {
    name: "Free Tier",
    price: "$0",
    priceSuffix: "/ month",
    description: "Get started with our basic features.",
    features: ["1 GB Storage", "Basic File Sharing", "Community Support"],
    buttonText: "Start Free Trial",
    buttonAction: (navigate: Function) => navigate("/register"), // Navigate to register page
    variant: "default" as "default",
  },
  {
    name: "Premium",
    price: "$9.99",
    priceSuffix: "/ month",
    description: "Unlock all features and more storage.",
    features: ["100 GB Storage", "Advanced File Sharing", "Priority Support", "Version History"],
    buttonText: "Choose Premium", // Changed text
    buttonAction: (navigate: Function) => navigate("/register"), // Navigate to register page, user can upgrade after login
    variant: "primary" as "primary", 
  },
];

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-slate-100 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Removed Back button */}
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-4 pt-8"> {/* Added pt-8 for spacing from navbar */}
          Find the Perfect Plan
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Choose the plan that’s right for you and your storage needs.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`shadow-xl flex flex-col ${plan.variant === "primary" ? "border-2 border-blue-500 bg-blue-50" : "border-gray-200"}`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-3xl font-semibold ${plan.variant === "primary" ? "text-blue-700" : "text-gray-700"}`}>{plan.name}</CardTitle>
                <CardDescription className={`${plan.variant === "primary" ? "text-blue-600" : "text-gray-500"}`}>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${plan.variant === "primary" ? "text-blue-600" : "text-gray-800"}`}>{plan.price}</span>
                  <span className="text-gray-500">{plan.priceSuffix}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-700">
                      <CheckCircle className={`h-5 w-5 mr-2 ${plan.variant === "primary" ? "text-blue-500" : "text-green-500"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className={`w-full shadow-md ${plan.variant === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 hover:bg-gray-800 text-white"}`}
                  onClick={() => plan.buttonAction(navigate)}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button variant="link" onClick={() => navigate("/features")} className="text-blue-600 hover:text-blue-700 text-lg">
                Learn more about our features
            </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
