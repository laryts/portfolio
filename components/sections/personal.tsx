"use client"

import { Camera, Book, Coffee, Mountain, Heart, MessageCircle } from "lucide-react"
import { AnimateOnScroll } from "../animate-on-scroll"
import Image from "next/image"

type PersonalSectionProps = {
  dictionary: any
}

export function PersonalSection({ dictionary }: PersonalSectionProps) {
  const { personal } = dictionary

  // Map hobby names to icons
  const getHobbyIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "photography":
      case "fotografia":
        return <Camera className="w-6 h-6 text-deep-purple-600 dark:text-deep-purple-400" />
      case "reading":
      case "leitura":
        return <Book className="w-6 h-6 text-deep-purple-600 dark:text-deep-purple-400" />
      case "cooking":
      case "culinária":
        return <Coffee className="w-6 h-6 text-deep-purple-600 dark:text-deep-purple-400" />
      case "hiking":
      case "trilhas":
        return <Mountain className="w-6 h-6 text-deep-purple-600 dark:text-deep-purple-400" />
      default:
        return <Heart className="w-6 h-6 text-deep-purple-600 dark:text-deep-purple-400" />
    }
  }

  return (
    <section id="personal" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <AnimateOnScroll animation="fade" duration={0.8}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{personal.title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">{personal.subtitle}</p>
      </AnimateOnScroll>

      {/* Cat Lover Section */}
      <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.1}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-deep-purple-200 dark:border-deep-purple-900">
                <Image src="/images/joey-and-jack.jpg" alt="My cats" fill className="object-cover" />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-pink-500" fill="currentColor" />
                {personal.catLover.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{personal.catLover.description}</p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Hobbies Section */}
      <AnimateOnScroll animation="fade" duration={0.8} delay={0.2}>
        <h3 className="text-2xl font-bold mb-6">{personal.hobbies.title}</h3>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {personal.hobbies.items.map((hobby: any, index: number) => (
          <AnimateOnScroll key={hobby.name} animation="slide-up" duration={0.6} delay={0.1 * (index + 1)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md h-full">
              <div className="flex items-start">
                <div className="mr-4 mt-1">{getHobbyIcon(hobby.name)}</div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">{hobby.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{hobby.description}</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Talk Topics Section */}
      <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.3}>
        <div className="bg-deep-purple-50 dark:bg-deep-purple-900/30 rounded-lg p-6 shadow-md">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-deep-purple-600 dark:text-deep-purple-400" />
            {personal.talkTopics.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{personal.talkTopics.description}</p>
          <div className="flex flex-wrap gap-2">
            {personal.talkTopics.topics.map((topic: string) => (
              <span
                key={topic}
                className="px-3 py-1 bg-deep-purple-100 dark:bg-deep-purple-800 text-deep-purple-800 dark:text-deep-purple-200 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  )
}
