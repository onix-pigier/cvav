'use client';
import { motion } from "framer-motion";
import GithubIcon from "@/components/icons/github-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Heart, Coffee } from "lucide-react";

interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  //socialNetworks: SocialNetworkProps[];
  // passion?: string;
  // location?: string;
}

// interface SocialNetworkProps {
//   name: string;
//   url: string;
// }

export const TeamSection = () => {
  const teamList: TeamProps[] = [
    {
      imageUrl: "https://i.pravatar.cc/250?img=58",
      firstName: "Leo",
      lastName: "Miranda",
      positions: ["Développeur Frontend", "Créateur de cette plateforme"],
      // passion: "Randonnée & Photographie",
      // location: "Abidjan, CI",
      // socialNetworks: [
      //  {
      //    name: "LinkedIn",
      //    url: "https://www.linkedin.com/in/leopoldo-miranda/",
      //  },
      //  {
      //    name: "Github",
      //    url: "https://github.com/leoMirandaa",
      //  },
      //  {
      //    name: "X",
      //    url: "https://x.com/leo_mirand4",
      //  },
      // ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Elizabeth",
      lastName: "Moore",
      positions: ["Designer Expérience"],
    //  passion: "Peinture & Nature",
    //  location: "Grand-Bassam, CI",
    //  socialNetworks: [
    //     {
    //       name: "LinkedIn",
    //       url: "https://www.linkedin.com/in/leopoldo-miranda/",
    //     },
    //     {
    //       name: "X",
    //       url: "https://x.com/leo_mirand4",
    //     },
    //   ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "David",
      lastName: "Diaz",
      positions: ["Ingénieur Machine Learning"],
    //   passion: "Astronomie & Randonnée",
    //   location: "Yamoussoukro, CI",
    //   socialNetworks: [
    //     {
    //       name: "LinkedIn",
    //       url: "https://www.linkedin.com/in/leopoldo-miranda/",
    //     },
    //     {
    //       name: "Github",
    //       url: "https://github.com/leoMirandaa",
    //     },
    //   ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Sarah",
      lastName: "Robinson",
      positions: ["Développeuse Cloud"],
    //   passion: "Yoga & Écriture",
    //   location: "San Pedro, CI",
    //   socialNetworks: [
    //     {
    //       name: "LinkedIn",
    //       url: "https://www.linkedin.com/in/leopoldo-miranda/",
    //     },
    //     {
    //       name: "Github",
    //       url: "https://github.com/leoMirandaa",
    //     },
    //     {
    //       name: "X",
    //       url: "https://x.com/leo_mirand4",
    //     },
    //   ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1616805765352-beedbad46b2a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Michael",
      lastName: "Holland",
      positions: ["Ingénieur DevOps"],
    //   passion: "Escalade & Café Artisanal",
    //   location: "Korhogo, CI",
    //   socialNetworks: [
    //     {
    //       name: "LinkedIn",
    //       url: "https://www.linkedin.com/in/leopoldo-miranda/",
    //     },
    //   ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Zoe",
      lastName: "Garcia",
      positions: ["Développeuse JavaScript"],
    //   passion: "Danse & Cuisine du Monde",
    //   location: "Bouaké, CI",
    //   socialNetworks: [
    //     {
    //       name: "LinkedIn",
    //       url: "https://www.linkedin.com/in/leopoldo-miranda/",
    //     },
    //     {
    //       name: "Github",
    //       url: "https://github.com/leoMirandaa",
    //     },
    //   ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Evan",
      lastName: "James",
      positions: ["Développeur Backend"],
    //   passion: "Musique & Randonnées Nocturnes",
    //   location: "Man, CI",
    //   socialNetworks: [
    //     {
    //       name: "LinkedIn",
    //       url: "https://www.linkedin.com/in/leopoldo-miranda/",
    //     },
    //     {
    //       name: "Github",
    //       url: "https://github.com/leoMirandaa",
    //     },
    //     {
    //       name: "X",
    //       url: "https://x.com/leo_mirand4",
    //     },
    //   ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Pam",
      lastName: "Taylor",
      positions: ["Développeuse Fullstack"],
    //   passion: "Photographie & Jardinage",
    //   location: "Abengourou, CI",
    //   socialNetworks: [
    //     {
    //       name: "X",
    //       url: "https://x.com/leo_mirand4",
    //     },
    //   ],
    },
  ];

  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "Github":
        return <GithubIcon />;
      case "X":
        return <XIcon />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="team" className="w-full py-32 bg-linear-to-br from-slate-50 via-blue-50/20 to-indigo-100/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* En-tête redessiné */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-200/60 shadow-sm mb-8"
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Nôtre équipe</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-light text-slate-900 mb-6 tracking-tight">
            Les Visages
            <span className="block font-serif italic text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mt-2">
              derrière l'Aventure
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Découvrez les rêveurs, les bâtisseurs et les passionnés qui donnent vie 
            à chaque expérience CVAV. Des âmes d'aventuriers unies par l'amour du partage.
          </p>
        </motion.div>

        {/* Grille repensée */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {teamList.map(
            ({ imageUrl, firstName, lastName, positions, /*socialNetworks, passion, location*/ }, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group"
              >
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                  
                  {/* Image avec effet organique */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`${firstName} ${lastName}`}
                      width={300}
                      height={300}
                      className="w-full aspect-[4/5] object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Overlay dégradé subtil */}
                    {/*<div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
                    
                    {/* Badge de localisation  */}
                    {/*location && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium text-slate-700">{location}</span>
                      </div>
                    )} */}
                  </div> 
                  
                  <CardHeader className="pb-3 pt-6 px-6">
                    <CardTitle className="text-xl font-semibold text-slate-900 leading-tight">
                      {firstName}{" "}
                      <span className="text-blue-600 font-light">{lastName}</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 px-6 pb-4 space-y-4">
                    {/* Postes */}
                    <div className="space-y-2">
                      {positions.map((position, index) => (
                        <div
                          key={index}
                          className="text-slate-700 text-sm leading-relaxed font-light"
                        >
                          {position}
                        </div>
                      ))}
                    </div>
                    
                    {/* Passion
                    {passion && (
                      <div className="flex items-start space-x-2 pt-2 border-t border-slate-100">
                        <Heart className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-600 font-light italic">
                          Passion : {passion}
                        </span>
                      </div>
                    )} */}
                  </CardContent>
{/* <CardFooter className="px-6 pb-6 pt-0">
                    <motion.div 
                      className="flex space-x-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {socialNetworks.map(({ name, url }, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            href={url}
                            target="_blank"
                            className="w-9 h-9 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 border border-slate-200/60"
                          >
                            {socialIcon(name)}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardFooter> */}
                </Card>
              </motion.div>
            )
          )}
        </motion.div>

        {/* Citation de fin */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20 pt-8 border-t border-slate-200/60"
        >
          <p className="text-lg text-slate-600 font-light italic max-w-2xl mx-auto">
            "Nous ne sommes pas simplement une équipe, mais une famille d'aventuriers 
            unis par la même passion : créer des souvenirs qui durent toute une vie."
          </p>
        </motion.div>
      </div>
    </section>
  );
};