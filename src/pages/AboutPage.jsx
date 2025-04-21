import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-propagentic-slate-dark">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-propagentic-teal to-teal-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About Propagentic
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Revolutionizing property management through AI-powered maintenance solutions.
            </motion.p>
          </div>
        </div>
        
        {/* Wave SVG at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="currentColor" 
              fillOpacity="1" 
              className="text-white dark:text-propagentic-slate-dark"
              d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,96C1120,96,1280,64,1360,48L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-propagentic-slate-dark dark:text-white mb-6">Our Mission</h2>
                <div className="prose prose-lg dark:prose-invert">
                  <p>
                    At Propagentic, our mission is to transform property maintenance from a reactive burden into a proactive, seamless experience for landlords, contractors, and tenants alike.
                  </p>
                  <p>
                    By harnessing the power of artificial intelligence, we're creating a future where maintenance issues are addressed before they escalate, where communication flows effortlessly between all parties, and where property management becomes more efficient and less stressful.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-propagentic-slate-dark dark:text-white mb-6">Our Vision</h2>
                <div className="prose prose-lg dark:prose-invert">
                  <p>
                    We envision a world where property management is powered by intelligent technology that understands the unique needs of each property and its occupants.
                  </p>
                  <p>
                    Our vision is to be the global leader in AI-driven property maintenance, creating sustainable, well-maintained living spaces while fostering stronger relationships between property owners, service providers, and residents.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="bg-gray-50 dark:bg-propagentic-slate py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-propagentic-slate-dark dark:text-white mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">The principles that guide everything we do</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ValueCard 
                icon={<InnovationIcon />}
                title="Innovation"
                description="We constantly push boundaries to create solutions that have never existed before."
                delay={0}
              />
              <ValueCard 
                icon={<IntegrityIcon />}
                title="Integrity"
                description="We operate with honesty, transparency, and ethical practices in all our relationships."
                delay={0.2}
              />
              <ValueCard 
                icon={<CollaborationIcon />}
                title="Collaboration"
                description="We believe in the power of bringing diverse perspectives together to solve complex problems."
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-propagentic-slate-dark dark:text-white mb-4">Our Team</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">The passionate people behind Propagentic</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <TeamMember 
                name="Sarah Chen"
                title="Founder & CEO"
                bio="With over 15 years in proptech, Sarah founded Propagentic to solve the maintenance challenges she faced as a property manager."
                delay={0}
              />
              <TeamMember 
                name="Michael Torres"
                title="Chief Technology Officer"
                bio="Michael brings expertise in AI and machine learning to create the intelligent systems powering Propagentic's platform."
                delay={0.2}
              />
              <TeamMember 
                name="Alex Johnson"
                title="Head of Customer Success"
                bio="Alex ensures our clients achieve their goals through exceptional implementation and ongoing support."
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-propagentic-teal text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your property management?</h2>
            <p className="text-xl mb-8">Join the growing community of property owners, managers, and contractors who are working smarter, not harder.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                to="/register"
                size="lg"
                variant="light"
                className="font-semibold"
              >
                Sign Up Free
              </Button>
              <Button
                to="/demo"
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const ValueCard = ({ icon, title, description, delay }) => (
  <motion.div 
    className="bg-white dark:bg-propagentic-slate-dark rounded-xl p-6 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="w-12 h-12 rounded-full bg-propagentic-teal/10 flex items-center justify-center text-propagentic-teal mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-propagentic-slate-dark dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const TeamMember = ({ name, title, bio, delay }) => (
  <motion.div 
    className="bg-white dark:bg-propagentic-slate-dark rounded-xl p-6 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-propagentic-slate rounded-full mb-4 flex items-center justify-center text-gray-400 dark:text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-propagentic-slate-dark dark:text-white mb-1 text-center">{name}</h3>
    <p className="text-propagentic-teal text-sm mb-3 text-center">{title}</p>
    <p className="text-gray-600 dark:text-gray-300 text-center">{bio}</p>
  </motion.div>
);

// Icons
const InnovationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
  </svg>
);

const IntegrityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const CollaborationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

export default AboutPage; 