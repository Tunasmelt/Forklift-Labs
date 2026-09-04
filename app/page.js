import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Labs from "@/components/Labs";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Gallery />
        <Labs />
        <About />
        <Contact />
      </main>
    </>
  );
}
