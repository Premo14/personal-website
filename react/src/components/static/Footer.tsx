export default function Footer() {
    return (
        <footer id="contact" className="bg-[#050505] text-white text-center py-12 px-6 mt-auto border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start">
                    <div className="text-xl font-bold tracking-tighter cursor-default font-display flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        AP<span className="text-gray-500">.</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">
                        &copy; {new Date().getFullYear()} Anthony Premo
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-mono uppercase tracking-widest">
                    {[
                        { text: 'Source', href: 'https://github.com/Premo14/personal-website' },
                        { text: 'GitHub', href: 'https://github.com/Premo14' },
                        { text: 'LinkedIn', href: 'https://www.linkedin.com/in/anthony-premo' },
                        { text: 'Email', href: 'mailto:ajaipremo@gmail.com' },
                    ].map(({ text, href }) => (
                        <a
                            key={text}
                            href={href}
                            target={href.startsWith('http') || href.startsWith('mailto') ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-center text-gray-400 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                        >
                            {text}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
