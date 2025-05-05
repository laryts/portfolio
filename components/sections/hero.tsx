import { AnimateOnScroll } from "../animate-on-scroll";
import { LightBulb } from "../light-bulb";

type HeroSectionProps = {
  dictionary: any
}

export function HeroSection({ dictionary }: HeroSectionProps) {
  if (!dictionary) {
    return null
  }

  return (
    <>
    <AnimateOnScroll animation="fade" duration={1.2}>
        <div className="absolute left-1/2 -translate-x-1/2 z-10">
          <LightBulb dictionary={dictionary} />
        </div>
      </AnimateOnScroll>
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      

      {/* Efeito de spotlight */}
      <AnimateOnScroll animation="fade" duration={1.2}>
        <div className="spotlight"></div>
      </AnimateOnScroll>

      <div className="name-container mt-32">
        <AnimateOnScroll animation="fade" duration={0.8} className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight name-glow">{dictionary.hero.title}</h1>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade" duration={0.8} delay={0.2} className="relative z-10">
          <h2 className="text-xl md:text-2xl mt-4 text-gray-600 dark:text-gray-400">{dictionary.hero.subtitle}</h2>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll animation="fade" duration={0.8} delay={0.4} className="relative z-10">
        <div className="mt-8">
          <a
            href="#about"
            className="px-6 py-3 rounded-full bg-deep-purple-900 text-white hover:bg-deep-purple-800 transition-colors duration-300"
          >
            {dictionary.hero.cta}
          </a>
        </div>
      </AnimateOnScroll>
    </section>
    </>
  )
}