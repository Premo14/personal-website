import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/90 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <div className="bg-[#050505] border border-white/10 w-full max-w-3xl max-h-[90vh] rounded-none shadow-2xl overflow-hidden pointer-events-auto flex flex-col relative">
                            {/* Decorative line */}
                            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                            
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#050505] sticky top-0 z-10">
                                {title && <h2 className="text-xl font-bold tracking-tighter cursor-default font-display flex items-center gap-2 text-white">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                    {title}
                                </h2>}
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Scrollable Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
