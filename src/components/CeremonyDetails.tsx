import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "./ui/use-mobile";
import { motion, Variants } from "framer-motion";
import { X, Shirt, BookOpen, Music } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle, // Keeping for a11y, will use VisuallyHidden or similar
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle, // Keeping for a11y
} from "./ui/drawer";
import { Button } from "./ui/button";

interface CeremonyDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CeremonyDetails({
  open,
  onOpenChange,
}: CeremonyDetailsProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(false);

  // Reset animation state when opening
  useEffect(() => {
    if (open) {
      setActive(true);
    } else {
      const timer = setTimeout(() => setActive(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  /* 
     Fixing scrolling: 
     1. Ensure parent container allows scrolling with touch support
     2. Add overscroll-contain to prevent body scroll chaining
     3. Ensure flex layout correctly constrains height
  */
  const Content = (
    <div className="flex flex-col h-full bg-stone-50 overflow-hidden rounded-2xl">
      <div className="flex-1 overflow-y-auto overscroll-y-contain px-5 pb-10 pt-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        <motion.div
          className="max-w-3xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-3 mt-2">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-tight">
              {t("ceremony.title")}
            </h2>
            <p className="text-stone-500 font-medium italic text-lg">
              {t("ceremony.subtitle")}
            </p>
            <div className="w-16 h-0.5 bg-stone-300 mx-auto rounded-full mt-6" />
          </motion.div>

          {/* Video Section */}
          <motion.div variants={itemVariants} className="w-full">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-black">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/p8m8Fq8eKXI?rel=0&modestbranding=1"
                title="Traditional Latin Mass"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-center text-xs text-stone-400 mt-2 font-medium tracking-wide uppercase">
              {t("ceremony.videoCaption")}
            </p>
          </motion.div>

          {/* Atmosphere / Historical Context */}
          <motion.div variants={itemVariants} className="prose prose-stone max-w-none text-center">
             <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4 text-stone-600">
                <Music className="w-5 h-5" />
             </div>
            <p className="text-lg leading-relaxed text-stone-700 font-serif">
              {t("ceremony.atmosphere")}
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attire Card */}
             <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-start gap-4 hover:border-stone-300 transition-colors">
                <div className="bg-stone-100 p-2.5 rounded-full text-stone-600">
                   <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-stone-800 mb-2">
                    {t("ceremony.attireTitle")}
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {t("ceremony.attire")}
                  </p>
                </div>
             </motion.div>

            {/* Missalette Card */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-start gap-4 hover:border-stone-300 transition-colors">
                <div className="bg-stone-100 p-2.5 rounded-full text-stone-600">
                   <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-stone-800 mb-2">
                    {t("ceremony.missaletteTitle")}
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {t("ceremony.missalette")}
                  </p>
                </div>
             </motion.div>
          </div>
          


        </motion.div>
      </div>
      
      {/* Mobile Close Button (Fixed at bottom) */}
      {isMobile && (
          <div className="p-4 border-t border-stone-200 bg-white/80 backdrop-blur-sm z-10 shrink-0">
            <DrawerClose asChild>
                <Button variant="outline" className="w-full text-stone-600 border-stone-300 hover:bg-stone-50">
                    Close
                </Button>
            </DrawerClose>
          </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[92vh] bg-stone-50 rounded-t-[20px] flex flex-col max-h-[96vh] mt-24 is-drawer-content">
           <div className="sr-only"><DrawerTitle>{t("ceremony.title")}</DrawerTitle></div>
           <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-stone-300 my-4" />
          {Content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="block p-0 overflow-hidden bg-stone-50 border-none shadow-2xl rounded-2xl max-w-4xl h-[85vh] flex flex-col">
         <div className="sr-only"><DialogTitle>{t("ceremony.title")}</DialogTitle></div>
         <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-white/80 p-2 text-stone-500 hover:text-stone-900 transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
         </DialogClose>
        {Content}
      </DialogContent>
    </Dialog>
  );
}
