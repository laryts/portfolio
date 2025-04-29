import { AnimateOnScroll } from "./animate-on-scroll";

type FooterProps = {
    dictionary: any
}

export function Footer({ dictionary }: FooterProps) {
    return (
        <footer className="py-8 px-4 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          <AnimateOnScroll animation="fade" duration={0.6}>
            <p>
              © {new Date().getFullYear()} Larissa Soares. {dictionary.footer.copyright}
            </p>
          </AnimateOnScroll>
        </footer>
    )
}