import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode"; // Import the ModeToggle component

/**
 * Home Page / Landing Page
 * 
 * This is the main landing page for the Practice Manager application.
 * It includes:
 * - Navigation bar with login/signup options and theme toggle
 * - Hero section with call-to-action buttons
 * - Features section highlighting key benefits
 * - Footer with copyright information
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="p-4 flex justify-between items-center">
        <div className="font-bold text-xl">Practice Manager</div>
        <div className="flex gap-4 items-center">
          <ModeToggle /> {/* Add the theme toggle */}
          <Link href="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Health, <span className="text-green-500">Our Priority</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Schedule appointments, manage your health records, and connect with healthcare professionals all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <Button className="px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src="/doctor.jpeg"
              alt="Healthcare Professional"
              fill
              className="object-cover rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Scheduling",
                description: "Book appointments with just a few clicks, anytime and anywhere."
              },
              {
                title: "Secure Records",
                description: "Your medical information is protected with the highest security standards."
              },
              {
                title: "Expert Care",
                description: "Connect with qualified healthcare professionals dedicated to your wellbeing."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 p-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Practice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
