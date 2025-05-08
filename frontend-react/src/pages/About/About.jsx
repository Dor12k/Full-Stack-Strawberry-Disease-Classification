

import { Link } from "react-router-dom";
import { Leaf, Brain, Smartphone, Rocket } from "lucide-react";
import ScrollToTopButton from "../../components/utils/ScrollToTopButton";



const About = () => {


  return (

    <div className="min-h-screen relative bg-gradient-to-br from-red-50 to-green-50 dark:from-[#1b1b1be1] dark:to-[#1a1a1a] text-gray-800 dark:text-gray-100 px-6 py-12">
      
      <section className="max-w-5xl mx-auto space-y-20">

        {/* About Us Section */}
        <div className="text-2xl bg-white dark:bg-[#1b1b1be1] rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-4xl font-extrabold text-red-600 dark:text-red-400 flex items-center gap-3">
            <Leaf className="w-8 h-8" /> About Us
          </h1>
          <p>
            Welcome to <strong>aiStrawberries</strong> 🍓 — your smart companion for growing healthy strawberry plants.
            Whether you're a farmer, a gardening hobbyist, or just curious about how AI meets nature, you're in the right place!
          </p>
          <p>
            Our platform lets you upload a photo of a strawberry leaf and instantly receive a disease diagnosis powered by AI. 🧠
            It's fast, reliable, and made to empower every grower.
          </p>
          <p>
            You'll also find delicious recipes, sustainable agriculture guides, and deep dives into the world of plant health.
            We're not just about strawberries — we’re about growing knowledge, too.
          </p>
          <p>
            Subscribe today and stay ahead with the freshest insights in precision farming and AI. 🌱
          </p>

          <div className="text-right mt-4">
            <a
              href="https://www.aiStrawberries.com"
              className="text-2xl font-semibold text-red-500 hover:text-red-600 hover:underline"
            >
              www.aiStrawberries.com
            </a>
          </div>
        </div>

        {/* Technologies Section */}
        <div className="text-2xl bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg p-8 space-y-6">

          <h2 className="text-4xl font-extrabold text-green-700 dark:text-green-400 flex items-center gap-3">
            <Brain className="w-8 h-8" /> Technologies
          </h2>

          <p>
            This project is powered by a modern full-stack architecture. The backend is built using <strong>Django</strong> and <strong>Python</strong>, while the frontend uses <strong>HTML, CSS, and JavaScript</strong>, developed in <em>Visual Studio Code</em>.
            Later refactored using <strong> Node.js </strong> and <strong> React (with Vite) </strong> and styled with <strong> Tailwind CSS </strong> for a more modern, scalable interface.
          </p>

          <p>
            Our AI model, trained on <strong>Google Colab</strong>, utilizes <strong>TensorFlow</strong>, <strong>OpenCV</strong>, and <strong>NumPy</strong>. It recognizes patterns in diseased leaves to offer accurate diagnoses. Read more about the model{' '}
            <Link to="/articles/2" className="text-green-600 hover:underline font-medium">here</Link>.
          </p>

          <p>
            The website is deployed using <strong>Docker</strong> on <strong>AWS EC2</strong>, with <strong>Nginx</strong> as a reverse proxy. Data is stored in <strong>PostgreSQL</strong> via <strong>AWS RDS</strong>, and files live safely on <strong>AWS S3</strong>. The ML model runs on a <strong>SageMaker</strong> endpoint.
          </p>

          <p>
            Our Android app, built in <strong>Java</strong> via <strong>Android Studio</strong>, features <strong>TensorFlow Lite</strong> for on-device predictions. You can read more about it{' '}
            <Link to="/articles/our-app-for-android-is-now-available" className="text-green-600 hover:underline font-medium">here</Link>.
          </p>

          <div className="text-center mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-full shadow-md transition"
            >
              <Rocket className="w-5 h-5" />
              Join the Journey
            </Link>
          </div>

        </div>

      </section>
      
      <ScrollToTopButton/>
      
    </div>
  );

};

export default About;
