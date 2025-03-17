<!-- resources/views/layouts/app.blade.php -->
<?php
session_start();
?>

<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="{{ mix('css/app.css') }}" rel="stylesheet" type="text/css" />
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">


</head>

<body>

    <div class="flex w-full bg-[#F0F3F5] overflow-hidden items-start">
        <x-sidebar />
        <div class="flex flex-col w-full">
            <x-navbar />
            <div class="mx-5">
                @yield('content')
            </div>
        </div>
    </div>

    @vite('resources/js/usuarios/usuarios.js')
    @vite('resources/js/peliculas/peliculas.js')
    @vite('resources/js/categorias/categorias.js')

</body>

</html>
