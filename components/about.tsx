 "use client";
import { motion, Variants } from "framer-motion";
import { 
  CalendarDays, 
  UsersRound, 
  TargetIcon, 
  Award, 
  HeartHandshake, 
  Users,
  Brain,
  Gem,
  Mountain,
  Compass,
  Shield,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  // Correction avec le type Variants explicite
  const gentleFade: Variants = {
    initial: { opacity: 0, y: 40 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.2,
        ease: "easeOut"
      } 
    }
  };

  const staggeredChildren: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const stats = [
    { 
      icon: UsersRound, 
      number: "500+", 
      label: "Membres Actifs",
      color: "from-amber-500 to-orange-500"
    },
    { 
      icon: CalendarDays, 
      number: "2007", 
      label: "Fondation",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: TargetIcon, 
      number: "50+", 
      label: "Événements",
      color: "from-amber-500 to-orange-500"
    },
    { 
      icon: Award, 
      number: "15", 
      label: "Villes",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: "Cœur Vaillant",
      description: "Chaque pas est guidé par la passion et l'authenticité des rencontres.",
    },
    {
      icon: Users,
      title: "Groupe Solidaire",
      description: "Nous portons ensemble les sacs à dos et les rêves de chacun.",
    },
    {
      icon: Brain,
      title: "Innovation Créative",
      description: "L'imagination est notre seule véritable limite.",
    },
    {
      icon: Gem,
      title: "Excellence Bienveillante",
      description: "Nous visons haut, mais jamais au détriment de l'humain.",
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-amber-50/20 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-blue-500/5" />
        
        <div className="max-w-4xl mx-auto px-6 relative">
          <motion.div
            initial="initial"
            animate="animate"
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-200/60 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-slate-700">Notre histoire vous attend</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
                Notre
                <span className="block text-transparent bg-linear-to-r from-amber-500 to-blue-500 bg-clip-text">
                  Chemin
                </span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
              >
                Depuis <span className="text-amber-600 font-semibold">2007</span>, nous transformons chaque 
                rencontre en <span className="text-blue-600 font-semibold">aventure mémorable</span> et 
                chaque paysage en <span className="text-amber-600 font-semibold">souvenir éternel</span>.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={staggeredChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={gentleFade}
                className="group text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="relative mb-3"
                >
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-slate-800">{stat.number}</div>
                  <div className="text-xs text-slate-600 font-medium leading-tight">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p className="text-xl italic text-slate-600 border-l-4 border-amber-400 pl-4 py-1">
                "Tout a commencé par une simple question : et si l'aventure était avant tout une histoire de regards qui se croisent et de mains qui se serrent ?"
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <Mountain className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
                    <p className="text-slate-700 text-sm">
                      Notre <span className="font-semibold text-amber-700">mission</span> : créer des expériences qui 
                      <span className="text-amber-600"> transforment</span> sans jamais dénaturer.
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <Compass className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <p className="text-slate-700 text-sm">
                      Notre <span className="font-semibold text-blue-700">vision</span> : repousser les limites 
                      de <span className="text-blue-600">l'aventure humaine</span>.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <Users className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
                    <p className="text-slate-700 text-sm">
                      Notre <span className="font-semibold text-amber-700">richesse</span> : la 
                      <span className="text-amber-600"> diversité</span> de nos membres et 
                      l'<span className="text-orange-600">authenticité</span> des échanges.
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <Shield className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <p className="text-slate-700 text-sm">
                      Notre <span className="font-semibold text-blue-700">engagement</span> : 
                      <span className="text-blue-600"> sécurité</span> et 
                      <span className="text-cyan-600"> bienveillance</span> avant tout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-linear-to-br from-amber-50/30 via-transparent to-blue-50/30" />
        
        <div className="max-w-5xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Nos Valeurs
              <span className="block text-transparent bg-linear-to-r from-amber-500 to-blue-500 bg-clip-text text-2xl mt-2">
                Fondatrices
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggeredChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={gentleFade}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  <div className="flex items-start space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        index % 2 === 0 
                          ? 'bg-linear-to-br from-amber-500 to-orange-500' 
                          : 'bg-linear-to-br from-blue-500 to-cyan-500'
                      }`}
                    >
                      <value.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{value.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}