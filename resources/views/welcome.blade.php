<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unified Company Operations Platform</title>
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f3f4f6; }
        .card { background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
        h1 { color: #111827; }
        p { color: #4b5563; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Unified Company Operations Platform</h1>
        <p>The platform is ready. Please log in to continue.</p>
        
        @auth
            <p>Welcome back, {{ auth()->user()->first_name }}!</p>
            <form method="POST" action="/logout">
                @csrf
                <button type="submit" style="background: none; border: none; color: #2563eb; text-decoration: underline; cursor: pointer; padding: 0;">Logout</button>
            </form>
        @else
            <a href="/login" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background-color: #2563eb; color: white; border-radius: 0.375rem; text-decoration: none; font-weight: bold;">Login</a>
        @endauth
    </div>
</body>
</html>
