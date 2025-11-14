@extends('layouts.hero')

@section('title', 'UM Events - Home')

@section('content')
<main class="min-h-screen bg-background">
    {{-- NAVBAR --}}
    <nav class="border-b border-border/40">
        <div class="mx-auto max-w-7xl px-6 lg:px-12">
            <div class="flex items-center justify-between py-6">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">
                        <svg class="h-6 w-6 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 10v6m0 0l-8.5 4.35a2 2 0 01-1.998 0L2 16m20-6V8a2 2 0 00-2-2H4a2 2 0 00-2 2v2m20 0l-9-4.35a2 2 0 00-2 0l-9 4.35"/>
                        </svg>
                    </div>
                    <div>
                        <div class="font-bold text-xl text-foreground">UM Events</div>
                        <div class="text-xs text-muted-foreground">University of Mindanao</div>
                    </div>
                </div>
                <div class="flex items-center gap-8">
                    <a href="#" class="text-sm text-foreground hover:text-primary transition-colors font-medium">Discover</a>
                    <a href="#" class="text-sm text-foreground hover:text-primary transition-colors font-medium">Calendar</a>
                    <a href="#" class="text-sm text-foreground hover:text-primary transition-colors font-medium">About</a>
                    <a href="{{ route('login') }}" class="rounded-full px-6 py-2 bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Sign In
                    </a>
                </div>
            </div>
        </div>
    </nav>

    {{-- HERO SECTION --}}
    <section class="py-24 lg:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-12">
            <div class="max-w-4xl mx-auto text-center space-y-12">
                {{-- Badge --}}
                <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary/20 border border-secondary/30 animate-on-scroll">
                    <svg class="h-4 w-4 text-secondary fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27l5.18 3.73-1.64-6.03L20 10.92l-6.19-.51L12 5l-1.81 5.41L4 10.92l4.46 4.05L6.82 21z" />
                    </svg>
                    <span class="text-sm font-medium text-foreground">Trusted by 15,000+ students</span>
                </div>

                {{-- Heading --}}
                <div class="space-y-6 animate-on-scroll animate-on-scroll-delay-1">
                    <h1 class="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                        Your Campus
                        <br />
                        <span class="text-primary">Experience</span> Starts Here
                    </h1>
                    <p class="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                        Discover events, connect with peers, and make the most of your University of Mindanao journey
                    </p>
                </div>

                {{-- Stats --}}
                <div class="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto animate-on-scroll animate-on-scroll-delay-2">
                    <div class="space-y-2">
                        <div class="text-4xl font-bold text-primary">250+</div>
                        <p class="text-sm text-muted-foreground font-light">Active Events</p>
                    </div>
                    <div class="space-y-2">
                        <div class="text-4xl font-bold text-secondary">15K+</div>
                        <p class="text-sm text-muted-foreground font-light">Students</p>
                    </div>
                    <div class="space-y-2">
                        <div class="text-4xl font-bold text-accent">80+</div>
                        <p class="text-sm text-muted-foreground font-light">Organizations</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {{-- FACILITIES SECTION --}}
    <section class="py-24 bg-muted/30">
        <div class="mx-auto max-w-7xl px-6 lg:px-12">
            <div class="text-center mb-16 space-y-4 animate-on-scroll">
                <div class="inline-flex items-center justify-center mb-4">
                    <svg class="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h2 class="text-5xl font-extrabold text-foreground">University of Mindanao Facilities</h2>
                <p class="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                    World-class venues to host your events and create memorable experiences
                </p>
            </div>

            {{-- Featured Facilities (3 columns) --}}
            <div class="grid lg:grid-cols-3 gap-8 mb-12">
                {{-- Convention Center --}}
                <div class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 animate-on-scroll animate-on-scroll-delay-1">
                    <div class="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                        <img src="/modern-university-convention-center-interior-with-.jpg" alt="UM Convention Center" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>
                        <div class="absolute bottom-6 left-6">
                            <span class="text-xs font-medium text-primary bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full">Premium Venue</span>
                        </div>
                    </div>
                    <div class="p-8 space-y-4">
                        <h3 class="text-2xl font-bold text-foreground">UM Convention Center</h3>
                        <p class="text-muted-foreground leading-relaxed font-light">
                            State-of-the-art facility with modern audio-visual equipment, perfect for conferences, seminars, and large-scale events
                        </p>
                        <div class="flex flex-wrap gap-3 pt-4">
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                2,000 capacity
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                Matina Campus
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Sports Complex --}}
                <div class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-secondary/50 hover:shadow-2xl transition-all duration-500 animate-on-scroll animate-on-scroll-delay-2">
                    <div class="aspect-[4/3] bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center relative overflow-hidden">
                        <img src="/university-sports-gymnasium-with-basketball-court.jpg" alt="UM Sports Complex" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>
                        <div class="absolute bottom-6 left-6">
                            <span class="text-xs font-medium text-secondary bg-secondary/90 text-secondary-foreground px-3 py-1.5 rounded-full">Sports Facility</span>
                        </div>
                    </div>
                    <div class="p-8 space-y-4">
                        <h3 class="text-2xl font-bold text-foreground">UM Sports Complex</h3>
                        <p class="text-muted-foreground leading-relaxed font-light">
                            Multi-purpose sports arena with basketball courts, volleyball courts, and indoor facilities for athletic events
                        </p>
                        <div class="flex flex-wrap gap-3 pt-4">
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                1,500 capacity
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                Davao Campus
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Performing Arts Theater --}}
                <div class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-accent/50 hover:shadow-2xl transition-all duration-500 animate-on-scroll animate-on-scroll-delay-3">
                    <div class="aspect-[4/3] bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center relative overflow-hidden">
                        <img src="/modern-university-auditorium-with-red-seats-and-st.jpg" alt="UM Performing Arts Theater" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>
                        <div class="absolute bottom-6 left-6">
                            <span class="text-xs font-medium text-accent bg-accent/90 text-accent-foreground px-3 py-1.5 rounded-full">Theater</span>
                        </div>
                    </div>
                    <div class="p-8 space-y-4">
                        <h3 class="text-2xl font-bold text-foreground">UM Performing Arts Theater</h3>
                        <p class="text-muted-foreground leading-relaxed font-light">
                            Professional theater with acoustic excellence, ideal for cultural shows, performances, and artistic events
                        </p>
                        <div class="flex flex-wrap gap-3 pt-4">
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                800 capacity
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                Matina Campus
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Additional Facilities (2 columns) --}}
            <div class="grid lg:grid-cols-2 gap-8">
                {{-- Open Grounds --}}
                <div class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-chart-4/50 hover:shadow-2xl transition-all duration-500 animate-on-scroll animate-on-scroll-delay-1">
                    <div class="aspect-[16/9] bg-gradient-to-br from-blue-400/20 to-blue-400/5 flex items-center justify-center relative overflow-hidden">
                        <img src="/university-outdoor-amphitheater-with-grass-lawn.jpg" alt="UM Open Grounds" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>
                        <div class="absolute bottom-6 left-6">
                            <span class="text-xs font-medium text-blue-600 bg-blue-600/90 text-white px-3 py-1.5 rounded-full">Outdoor Venue</span>
                        </div>
                    </div>
                    <div class="p-8 space-y-4">
                        <h3 class="text-2xl font-bold text-foreground">UM Open Grounds</h3>
                        <p class="text-muted-foreground leading-relaxed font-light">
                            Spacious outdoor amphitheater perfect for festivals, concerts, and community gatherings under the open sky
                        </p>
                        <div class="flex flex-wrap gap-3 pt-4">
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                3,000+ capacity
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                Matina Campus
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Academic Halls --}}
                <div class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 animate-on-scroll animate-on-scroll-delay-2">
                    <div class="aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                        <img src="/modern-university-lecture-hall-with-projector-and-.jpg" alt="UM Academic Hall" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>
                        <div class="absolute bottom-6 left-6">
                            <span class="text-xs font-medium text-primary bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full">Academic</span>
                        </div>
                    </div>
                    <div class="p-8 space-y-4">
                        <h3 class="text-2xl font-bold text-foreground">UM Academic Halls</h3>
                        <p class="text-muted-foreground leading-relaxed font-light">
                            Multiple well-equipped lecture halls with modern technology, suitable for seminars, workshops, and academic conferences
                        </p>
                        <div class="flex flex-wrap gap-3 pt-4">
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                100-500 capacity
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                All Campuses
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {{-- CTA SECTION --}}
    <section class="py-32 bg-gradient-to-b from-muted/30 to-background">
        <div class="mx-auto max-w-4xl px-6 lg:px-12 text-center space-y-8">
            <div class="space-y-6 animate-on-scroll">
                <h2 class="text-5xl sm:text-6xl font-extrabold text-foreground leading-tight">
                    Ready to <span class="text-primary">Get Involved?</span>
                </h2>
                <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                    Join thousands of UM students discovering and participating in amazing campus events every day
                </p>
            </div>
            <a href="{{ route('login') }}" class="inline-flex items-center gap-2 rounded-full px-10 py-6 bg-primary text-white text-base font-semibold hover:bg-primary/90 transition-colors animate-on-scroll animate-on-scroll-delay-1">
                Start Exploring
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </a>
        </div>
    </section>

    {{-- FOOTER --}}
    <footer class="border-t border-border/40 py-12">
        <div class="mx-auto max-w-7xl px-6 lg:px-12">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
                        <svg class="h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 10v6m0 0l-8.5 4.35a2 2 0 01-1.998 0L2 16m20-6V8a2 2 0 00-2-2H4a2 2 0 00-2 2v2m20 0l-9-4.35a2 2 0 00-2 0l-9 4.35"/>
                        </svg>
                    </div>
                    <div>
                        <div class="font-bold text-foreground">UM Events</div>
                        <div class="text-xs text-muted-foreground">University of Mindanao</div>
                    </div>
                </div>
                <div class="flex gap-8 text-sm text-muted-foreground">
                    <a href="#" class="hover:text-foreground transition-colors">About</a>
                    <a href="#" class="hover:text-foreground transition-colors">Contact</a>
                    <a href="#" class="hover:text-foreground transition-colors">Privacy</a>
                </div>
            </div>
        </div>
    </footer>
</main>
@endsection
