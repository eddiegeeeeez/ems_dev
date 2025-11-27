"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Search,
  Users,
  MapPin,
  ArrowRight,
  Building2,
  Star,
} from "lucide-react"

export function LandingPage({ onSignIn }: { onSignIn?: () => void }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/40 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#c41e3a] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900">UM Events</div>
                <div className="text-xs text-gray-600">University of Mindanao</div>
              </div>
            </div>
            <Button 
              className="bg-[#c41e3a] hover:bg-[#c41e3a]/90 text-white text-sm px-6 py-2 rounded-full font-medium transition-colors" 
              onClick={onSignIn}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 relative overflow-hidden bg-gradient-to-b from-[#8b1a3a] to-[#c41e3a]">
        {/* Background Image with Gradient Blur */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/um-campus-hero.jpg")',
              filter: 'blur(1px) brightness(0.4)',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Large Typography */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
                Your Campus
                <br />
                <span className="text-[#ff6b9d]">Experience</span> Starts Here
              </h1>
              <p className="text-xl sm:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light">
                Discover events, connect with peers, and make the most of your University of Mindanao journey
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#ff6b9d]">250+</div>
                <p className="text-sm text-gray-100 font-light">Active Events</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#4caf50]">15K+</div>
                <p className="text-sm text-gray-100 font-light">Students</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-200">80+</div>
                <p className="text-sm text-gray-100 font-light">Organizations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 bg-gray-100/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-[#c41e3a]" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900">University of Mindanao Facilities</h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              World-class venues to host your events and create memorable experiences
            </p>
          </div>

          {/* Main Facilities Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Convention Center */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200/50 hover:border-[#c41e3a]/50 hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#c41e3a]/20 to-[#c41e3a]/5 relative overflow-hidden">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Convention Center</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-xs font-medium bg-[#c41e3a] text-white px-3 py-1.5 rounded-full">
                    Premium Venue
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">UM Convention Center</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  State-of-the-art facility with modern audio-visual equipment, perfect for conferences, seminars, and large-scale events
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <Users className="w-4 h-4" />
                    2,000 capacity
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4" />
                    Matina Campus
                  </div>
                </div>
              </div>
            </div>

            {/* Sports Complex */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200/50 hover:border-[#4caf50]/50 hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#4caf50]/20 to-[#4caf50]/5 relative overflow-hidden">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sports Complex</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-xs font-medium bg-[#4caf50] text-white px-3 py-1.5 rounded-full">
                    Sports Facility
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">UM Sports Complex</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  Multi-purpose sports arena with basketball courts, volleyball courts, and indoor facilities for athletic events
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <Users className="w-4 h-4" />
                    1,500 capacity
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4" />
                    Davao Campus
                  </div>
                </div>
              </div>
            </div>

            {/* Performing Arts Theater */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200/50 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/20 to-blue-500/5 relative overflow-hidden">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Performing Arts Theater</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-full">
                    Theater
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">UM Performing Arts Theater</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  Professional theater with acoustic excellence, ideal for cultural shows, performances, and artistic events
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <Users className="w-4 h-4" />
                    800 capacity
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4" />
                    Matina Campus
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Facilities */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Open Grounds */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200/50 hover:border-orange-500/50 hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="aspect-[16/9] bg-gradient-to-br from-orange-500/20 to-orange-500/5 relative overflow-hidden">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Open Grounds</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-xs font-medium bg-orange-500 text-white px-3 py-1.5 rounded-full">
                    Outdoor Venue
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">UM Open Grounds</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  Spacious outdoor amphitheater perfect for festivals, concerts, and community gatherings under the open sky
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <Users className="w-4 h-4" />
                    3,000+ capacity
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4" />
                    Matina Campus
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Halls */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200/50 hover:border-[#c41e3a]/50 hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="aspect-[16/9] bg-gradient-to-br from-[#c41e3a]/20 to-[#c41e3a]/5 relative overflow-hidden">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Academic Halls</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-xs font-medium bg-[#c41e3a] text-white px-3 py-1.5 rounded-full">
                    Academic
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">UM Academic Halls</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  Multiple well-equipped lecture halls with modern technology, suitable for seminars, workshops, and academic conferences
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <Users className="w-4 h-4" />
                    100-500 capacity
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4" />
                    All Campuses
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-gray-100/50 to-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-12 text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
              Ready to <span className="text-[#c41e3a]">Get Involved?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Join thousands of UM students discovering and participating in amazing campus events every day
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              className="bg-[#c41e3a] hover:bg-[#c41e3a]/90 text-white text-base px-10 py-4 rounded-full font-medium transition-colors inline-flex items-center gap-2" 
              onClick={onSignIn}
            >
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-900 hover:bg-gray-100 text-base px-10 py-4 rounded-full"
              onClick={onSignIn}
            >
              Sign In Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/40 py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#c41e3a] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900">UM Events</div>
                <div className="text-xs text-gray-600">University of Mindanao</div>
              </div>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                About
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
