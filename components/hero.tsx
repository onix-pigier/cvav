"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const enter = { 
    hidden: { opacity: 0, y: 24 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } } 
  };

  const imageAnimation = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className=" w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          
          {/* Colonne de gauche - Texte */}
          <motion.div
            initial="hidden"
            animate="show"
            className="text-left space-y-8"
          >
            {/* Badge avec animation */}
            <motion.div variants={enter}>
              <Badge variant="outline" className="text-sm py-2 border-blue-300">
                <span className="mr-2 text-blue-500">
                  <Badge className="bg-blue-500 text-white">Nouveau</Badge>
                </span>
                <span className="text-gray-700">L&apos;aventure commence maintenant !</span>
              </Badge>
            </motion.div>

            {/* Titre principal avec linear */}
            <motion.div variants={enter} transition={{ delay: 0.1 }}>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Vivez des aventures
                <span className="block text-transparent bg-linear-to-r from-gray-400 to-blue-600 bg-clip-text">
                  inoubliables
                </span>
                avec les CVAV
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={enter}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
            >
              Où chaque moment vécu avec cette communauté devient un souvenir éternel. 
              Rejoignez-nous pour des expériences uniques et mémorables.
            </motion.p>

            {/* Boutons avec animations */}
            <motion.div
              variants={enter}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button className="font-bold group/arrow bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 h-12">
                Explorer
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Button>

              <Button
                asChild
                variant="secondary"
                className="font-bold border-blue-300 text-blue-500 hover:bg-blue-50 px-8 py-3 h-12"
              >
                <Link href="/login">
                  Administration
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Colonne de droite - Image */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={imageAnimation}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            {/* Effet de glow bleu derrière l'image */}
            <div className="absolute -top-8 -right-8 w-full h-full bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
            
            {/* Container de l'image avec animations */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border-2 border-gray-200 shadow-2xl"
            >
              <Image
                width={600}
                height={400}
                className="w-full h-auto"
                src="/photo1.png"
                alt="Aventure CVAV - Moments inoubliables"
                priority
              />
              
              {/* Overlay linear subtil */}
              <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>

            {/* Effet de bordure animée au hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-linear-to-r from-blue-400/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-5"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// "use client";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";

// export default function Hero() {
//   const enter = { 
//     hidden: { opacity: 0, y: 24 }, 
//     show: { opacity: 1, y: 0, transition: { duration: 0.6 } } 
//   };

//   const imageAnimation = {
//     hidden: { opacity: 0, x: 50 },
//     show: { opacity: 1, x: 0, transition: { duration: 0.8 } }
//   };

//   return (
//     <section className="w-full bg-linear-to-br from-blue-50 via-white to-emerald-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          
//           {/* Colonne de gauche - Texte */}
//           <motion.div
//             initial="hidden"
//             animate="show"
//             className="text-left space-y-8"
//           >
//             {/* Badge avec couleurs triadiques */}
//             <motion.div variants={enter}>
//               <Badge variant="outline" className="text-sm py-2 border-blue-300 bg-blue-50/80">
//                 <span className="mr-2 text-blue-500">
//                   <Badge className="bg-linear-to-r from-blue-300 to-emerald-400 text-white shadow-lg">
//                     Nouveau
//                   </Badge>
//                 </span>
//                 <span className="text-gray-700 font-medium">L&apos;aventure commence maintenant !</span>
//               </Badge>
//             </motion.div>

//             {/* Titre principal avec linear triadique */}
//             <motion.div variants={enter} transition={{ delay: 0.1 }}>
//               <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
//                 Vivez des aventures
//                 <span className="block text-transparent bg-linear-to-r from-blue-300 via-emerald-400 to-amber-300 bg-clip-text">
//                   inoubliables
//                 </span>
//                 avec les CVAV
//               </h1>
//             </motion.div>

//             {/* Description avec accent de couleur */}
//             <motion.p
//               variants={enter}
//               transition={{ delay: 0.2 }}
//               className="text-xl text-gray-600 leading-relaxed max-w-lg"
//             >
//               Où chaque moment vécu avec cette communauté devient un{' '}
//               <span className="text-emerald-500 font-semibold">souvenir éternel</span>. 
//               Rejoignez-nous pour des expériences{' '}
//               <span className="text-amber-500 font-semibold">uniques et mémorables</span>.
//             </motion.p>

//             {/* Boutons avec schéma opposé */}
//             <motion.div
//               variants={enter}
//               transition={{ delay: 0.3 }}
//               className="flex flex-col sm:flex-row gap-4"
//             >
//               {/* Bouton primaire - Bleu principal */}
//               <Button className="font-bold group/arrow bg-linear-to-r from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-600 text-white px-8 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300">
//                 Explorer
//                 <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
//               </Button>

//               {/* Bouton secondaire - Orange opposé */}
//               <Button
//                 asChild
//                 variant="secondary"
//                 className="font-bold border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:border-amber-400 px-8 py-3 h-12 shadow-md transition-all duration-300"
//               >
//                 <Link href="/login">
//                   Administration
//                 </Link>
//               </Button>
//             </motion.div>
//           </motion.div>

//           {/* Colonne de droite - Image avec effets de couleurs imbriquées */}
//           <motion.div
//             initial="hidden"
//             animate="show"
//             variants={imageAnimation}
//             transition={{ delay: 0.4 }}
//             className="relative group"
//           >
//             {/* Effets de glow avec couleurs triadiques */}
//             <div className="absolute -top-8 -right-8 w-full h-full bg-blue-300/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
//             <div className="absolute -bottom-8 -left-8 w-1/2 h-1/2 bg-emerald-300/20 rounded-full blur-3xl -z-10 animate-pulse-slow delay-1000"></div>
//             <div className="absolute top-1/2 left-1/4 w-1/3 h-1/3 bg-amber-300/20 rounded-full blur-3xl -z-10 animate-pulse-slow delay-500"></div>
            
//             {/* Container de l'image avec bordures linear */}
//             <motion.div
//               whileHover={{ scale: 1.03, rotate: 0.5 }}
//               transition={{ duration: 0.3 }}
//               className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-linear-to-br from-blue-300/30 via-emerald-300/20 to-amber-300/10 p-1 shadow-2xl"
//             >
//               <div className="relative overflow-hidden rounded-xl border border-white/20">
//                 <Image
//                   width={600}
//                   height={400}
//                   className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
//                   src="/photo1.png"
//                   alt="Aventure CVAV - Moments inoubliables"
//                   priority
//                 />
                
//                 {/* Overlay linear triadique au hover */}
//                 <div className="absolute inset-0 bg-linear-to-t from-blue-300/10 via-emerald-300/5 to-amber-300/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
//               </div>
//             </motion.div>

//             {/* Points de couleur flottants */}
//             <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-300 rounded-full opacity-70 group-hover:scale-150 transition-transform duration-300"></div>
//             <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-300 rounded-full opacity-70 group-hover:scale-150 transition-transform duration-300 delay-100"></div>
//             <div className="absolute top-4 -right-4 w-4 h-4 bg-amber-300 rounded-full opacity-70 group-hover:scale-150 transition-transform duration-300 delay-200"></div>
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   );
// }