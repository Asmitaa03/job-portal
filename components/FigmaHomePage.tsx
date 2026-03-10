"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Users,
  Target,
  Sparkles,
  Building2,
  Globe,
  TrendingUp,
  Heart,
  Home,
  Laptop,
  Calendar,
  Zap,
  PartyPopper,
  Star,
  Coffee,
  Briefcase,
  Check,
  Quote,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Minimal UI primitives aligned to Figma tokens in app/globals.css
function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: "lg" | "sm" | "default" }
) {
  const { className = "", size = "default", ...rest } = props;
  const sizeClasses = size === "lg" ? "px-8 py-3 text-lg" : size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2";
  return (
    <button
      {...rest}
      className={
        `inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all ${sizeClasses} ${className}`
      }
    />
  );
}

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white shadow-sm ${className}`}>{children}</div>
  );
}

export default function FigmaHomePage() {
  const router = useRouter();
  const onNavigate = useCallback(() => router.push("/jobs"), [router]);
  // Figma-like easing used across sections
  const EASE: any = [0.22, 1, 0.36, 1];

  const values = [
    { icon: Target, title: "Innovation First", description: "Pushing boundaries and embracing cutting-edge technologies" },
    { icon: Users, title: "Collaborative Spirit", description: "Building success through teamwork and diverse perspectives" },
    { icon: Award, title: "Excellence Driven", description: "Committed to delivering exceptional results every day" },
    { icon: Sparkles, title: "Growth Mindset", description: "Continuous learning and personal development opportunities" },
  ];

  const stats = [
    { label: "Team Members", value: "500+", icon: Users },
    { label: "Countries", value: "25+", icon: Globe },
    { label: "Growth Rate", value: "150%", icon: TrendingUp },
    { label: "Awards Won", value: "40+", icon: Award },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-400/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-400/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full mb-6 text-white"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">We're Hiring Top Talent!</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
                className="text-5xl lg:text-7xl mb-6"
              >
                <span className="text-slate-900">Build </span>
                <span className="text-blue-600">Your Future </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">With Us</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
                className="text-xl text-slate-600 mb-8 leading-relaxed"
              >
                Join a team where innovation meets passion. We're transforming the industry and we want you to be part of it.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
                className="flex gap-4"
              >
                <Button onClick={onNavigate} size="lg" className="group shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700">
                  Explore Opportunities
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </motion.div>
            </motion.div>

            {/* Right Image with stats card overlay */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Team collaboration image */}
                <img
                  src="https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-fauxels-3184416-IhN52rojTEYAcnLknF6wy9TIU8wM98.jpg"
                  alt="Team collaboration"
                  className="w-full h-auto"
                  onError={(e) => {
                    // Fallback to gradient if image not found
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.className += ' bg-gradient-to-br from-blue-100 to-purple-100 min-h-[500px]';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
              </div>

              {/* Rating card - top right */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8, duration: 0.5, ease: EASE }} 
                className="absolute top-6 right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-10"
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">Rated 5/5 by employees</span>
                </div>
              </motion.div>

              {/* Floating stats card */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1, duration: 0.6, ease: EASE }} 
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 z-10"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">150%</div>
                    <div className="text-sm text-slate-600">Year Growth</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: EASE }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-slate-100">
                  <motion.div
                    whileHover={{ scale: 1.06, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4"
                  >
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <div className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why You'll Love Working Here - Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2 rounded-full mb-6 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Amazing Perks</span>
            </div>
            <h2 className="text-4xl lg:text-5xl mb-4 text-slate-900">Why You'll Love Working Here</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We invest in our people with benefits that matter
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Heart, title: "Health & Wellness", desc: "Comprehensive medical, dental, and vision coverage", color: "red", bgColor: "bg-red-50", textColor: "text-red-700" },
              { icon: Home, title: "Remote Work", desc: "Flexible work from anywhere with home office budget", color: "blue", bgColor: "bg-blue-50", textColor: "text-blue-700" },
              { icon: Laptop, title: "Latest Equipment", desc: "Top-tier laptop and equipment of your choice", color: "purple", bgColor: "bg-purple-50", textColor: "text-purple-700" },
              { icon: Calendar, title: "Unlimited PTO", desc: "Take time off when you need it, no questions asked", color: "green", bgColor: "bg-green-50", textColor: "text-green-700" },
              { icon: Zap, title: "Learning Budget", desc: "$3,000 annual budget for courses and conferences", color: "yellow", bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
              { icon: PartyPopper, title: "Team Events", desc: "Regular team building activities and celebrations", color: "pink", bgColor: "bg-pink-50", textColor: "text-pink-700" },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className={`p-6 ${benefit.bgColor} border-0 h-full`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${benefit.bgColor} rounded-xl mb-4`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.textColor}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${benefit.textColor}`}>{benefit.title}</h3>
                  <p className={`text-sm ${benefit.textColor} opacity-80`}>{benefit.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl mb-4">Our Journey</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Key milestones that shaped who we are today
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-400/50" />

            <div className="space-y-12">
              {[
                { year: "2018", title: "Company Founded", desc: "Started with a vision and 5 passionate individuals" },
                { year: "2020", title: "Series A Funding", desc: "Raised $10M to scale our operations" },
                { year: "2022", title: "Global Expansion", desc: "Opened offices in 5 new countries" },
                { year: "2024", title: "500+ Team Members", desc: "Growing strong with talent worldwide" },
              ].map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative pl-24"
                >
                  {/* Timeline node */}
                  <div className="absolute left-6 top-2 w-4 h-4 bg-purple-400 rounded-full border-4 border-blue-900 z-10" />
                  
                  {/* Milestone card */}
                  <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                    <div className="text-blue-300 text-lg mb-2">{milestone.year}</div>
                    <h3 className="text-2xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-blue-100">{milestone.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-product-school-1299359-2678468-R8M4f7o8aOvYcCQeGxd50pKqGP3FnL.jpg"
                  alt="Workspace"
                  className="w-full h-auto rounded-3xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.className += ' bg-gradient-to-br from-blue-100 to-purple-100 min-h-[400px]';
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full mb-6 text-white border-2 border-purple-500">
                <span className="text-sm font-semibold">Our Mission</span>
              </div>
              <h2 className="text-4xl lg:text-5xl mb-6 text-slate-900">Transforming the Future Together</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                We're dedicated to creating innovative solutions that empower businesses and individuals to achieve their full potential. Through cutting-edge technology and a people-first approach, we're shaping the future of our industry.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Our culture thrives on collaboration, creativity, and continuous growth. We believe in fostering an environment where every team member can contribute their unique perspective and make a real impact.
              </p>
              <div className="space-y-3">
                {["Innovation-driven solutions", "People-first culture", "Global impact"].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-slate-700">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl mb-4">Our Core Values</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: EASE }}
                whileHover={{ y: -8 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                  <motion.div
                    whileHover={{ scale: 1.04, rotate: 360 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl mb-4"
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl mb-3">{value.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Team Says - Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl mb-4 text-slate-900">What Our Team Says</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Real voices from real people who love what they do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "The culture here is incredible. I've grown more in 2 years than I did in 5 years at my previous company. The team genuinely cares about your development.",
                name: "Sarah Johnson",
                role: "Senior Product Designer",
                avatar: "SJ"
              },
              {
                quote: "Best decision of my career. The work-life balance is real, not just a buzzword. Plus, the tech stack is cutting-edge and the problems we solve are fascinating.",
                name: "Michael Chen",
                role: "Engineering Lead",
                avatar: "MC"
              },
              {
                quote: "From day one, I felt welcomed and valued. The collaborative environment encourages creativity and the leadership truly listens to our ideas.",
                name: "Emily Rodriguez",
                role: "Marketing Manager",
                avatar: "ER"
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="p-6 border-slate-200 h-full">
                  <Quote className="w-12 h-12 text-blue-600 mb-4" />
                  <p className="text-slate-700 italic mb-6 leading-relaxed">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Our Company Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl mb-4">Life at Our Company</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Take a peek into our vibrant culture and amazing team
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              "https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-divinetechygirl-1181400-0P2mGAeHa5bV1ZQ2YwC0kw94zTqv9R.jpg",
              "https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-hillaryfox-1595392-XKX0FqD8eLYDiqLhWFyiNFJQfoF9Rs.jpg",
              "https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-divinetechygirl-1181395-kiALb2jWdpaGdsdNfonPYbQgSFdXkK.jpg",
              "https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-fauxels-3183197-TOrhHdDiPbwMSPmTWNrsETRyEr66MO.jpg",
              "https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-fauxels-3184291-Ibrqpx9cGQ3GcetsLVk18qmpk9497E.jpg",
              "https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-fauxels-3184416-IhN52rojTEYAcnLknF6wy9TIU8wM98.jpg",
            ].map((src, i) => {
              return (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.5, ease: EASE }}
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]"
                >
                  <img
                    src={src}
                    alt={`Company life ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.className += ' bg-gradient-to-br from-blue-400 to-purple-400';
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                src="https://1gusdwjl7wnxjsaj.public.blob.vercel-storage.com/sampleimgs/pexels-tirachard-kumtanom-112571-733856-NVWKjHKnbeAvlq0AyIl0pv9zST2fDr.jpg"
                alt="Join us"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-pink-900/95" />
            </div>

            <div className="relative z-10 text-center py-24 px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6"
                >
                  <Sparkles className="w-8 h-8 text-yellow-900" />
                </motion.div>
                <h2 className="text-4xl lg:text-5xl text-white mb-6">Ready to Make an Impact?</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join our team of innovators and help shape the future. Explore our open positions and find your perfect fit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <Button
                    onClick={onNavigate}
                    size="lg"
                    className="group bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    View Open Positions
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <button className="px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors">
                    Learn More
                  </button>
                </div>
                <div className="flex gap-4 justify-center">
                  <button className="px-4 py-2 rounded-full bg-purple-600/80 text-white hover:bg-purple-600 transition-colors inline-flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    Free Coffee & Snacks
                  </button>
                  <button className="px-4 py-2 rounded-full bg-purple-600/80 text-white hover:bg-purple-600 transition-colors inline-flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Career Growth
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


