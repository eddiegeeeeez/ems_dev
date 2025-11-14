<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Discover and manage campus events at the University of Mindanao. Connect with students, faculty, and campus organizations.">
    
    <title>@yield('title', 'UM Events - University of Mindanao Event Management')</title>
    
    <!-- Favicon Icons -->
    <link rel="icon" type="image/svg+xml" href="/icon.svg">
    <link rel="apple-touch-icon" href="/apple-icon.png">
    
    <!-- Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        :root {
            --primary: #c41e3a;
            --primary-foreground: #ffffff;
            --secondary: #4caf50;
            --accent: #ff9800;
            --foreground: #1a1a1a;
            --muted-foreground: #666666;
            --background: #ffffff;
            --muted: #f5f5f5;
            --border: #e0e0e0;
        }
        
        body {
            font-family: 'Geist', sans-serif;
        }
        
        code {
            font-family: 'Geist Mono', monospace;
        }
    </style>
</head>
<body class="font-sans antialiased bg-background text-foreground">
    @yield('content')
    
    <!-- Analytics -->
    <script async src="https://cdn.vercel-analytics.com/v1/web.js"></script>
</body>
</html>
