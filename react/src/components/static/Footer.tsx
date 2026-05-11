export default function Footer() {
    return (
        <footer id="contact" className="bg-surface text-textPrimary text-center py-6 sm:py-8 px-4 mt-auto border-t border-gray-800">
            <p className="text-xs sm:text-sm mb-4 sm:mb-6">
                &copy; {new Date().getFullYear()} Anthony Premo. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-2 text-xs sm:text-sm">
                {[
                    { text: 'Source Code', href: 'https://github.com/Premo14/personal-website' },
                    { text: 'GitHub', href: 'https://github.com/Premo14' },
                    { text: 'LinkedIn', href: 'https://www.linkedin.com/in/anthony-premo' },
                    { text: 'Email Me', href: 'mailto:ajaipremo@gmail.com' },
                ].map(({ text, href }) => (
                    <a
                        key={text}
                        href={href}
                        target={href.startsWith('http') ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-center rounded-md font-medium whitespace-nowrap border border-brand text-brand hover:bg-brand hover:text-white transition"
                    >
                        {text}
                    </a>
                ))}
            </div>
        </footer>
    );
}
