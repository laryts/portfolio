"use client";

import { useState } from "react";
import { AnimateOnScroll } from "../animate-on-scroll";
import { ExperienceItem } from "../experience-item";

type ExperiencesSectionProps = {
    dictionary: any
}

export function ExperiencesSection({ dictionary }: ExperiencesSectionProps) {
    const [moreExperience, setMoreExperience] = useState(false);
    const experiences = dictionary.experience.roles;
    const length = Object.keys(experiences).length;

    const toggleMoreExperience = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setMoreExperience(!moreExperience);
      if (moreExperience) {
        document.getElementById('xp')?.scrollIntoView({ behavior: 'smooth' });
      }
    }

    return (
        <section
          id="xp"
          className="py-20 px-4 md:px-8 bg-gray-100 dark:bg-dark-purple-900 transition-colors duration-300"
        >
          <div className="max-w-4xl mx-auto">
            <AnimateOnScroll animation="fade" duration={0.8}>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.experience.title}</h2>
            </AnimateOnScroll>
            <div className="space-y-12">
              {experiences.map((experience: any, index: number) => (
                (index <= 2 || moreExperience) && (
                  <AnimateOnScroll 
                    className="transform transition-all duration-500 ease-in-out"
                    animation="slide-up" 
                    duration={0.6} 
                    delay={index/10}
                  >
                    <ExperienceItem
                      role={experience.role}
                      company={experience.company}
                      period={experience.period}
                      description={experience.description}
                      technologies={experience.technologies}
                    />
                  </AnimateOnScroll>
                )
              ))}
            </div>
            <AnimateOnScroll animation="fade" duration={0.6} delay={0.4}>
              <div className="flex justify-center my-8">
              <div className="mt-12 text-center">
              <button
                onClick={toggleMoreExperience}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-deep-purple-900 text-white font-medium hover:bg-deep-purple-800 transition-colors duration-300"
              >
                {moreExperience ? dictionary.experience.viewLess : dictionary.experience.viewAll}
              </button>
            </div>
                {/* <button onClick={toggleMoreExperience} className="text-center text-primary hover:text-primary/80 px-4 py-2 rounded-md dark:text-white dark:hover:text-gray-300">Ver {moreExperience ? "menos" : "mais"}</button> */}
              </div>
            </AnimateOnScroll>
          </div>
        </section>
    )
}
