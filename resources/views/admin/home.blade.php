@extends('layouts.app')

@section('content')
<div>

    <div class="flex justify-between gap-5 my-5">
        <!-- Card 1: Total Películas -->
        <div
            class="w-full h-32 text-[#FF5252] bg-info mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-around h-full text-gray-800">
                <div class="text-center text-[#ffffff]">
                    <div class="text-4xl font-bold">150</div>
                    <div class="text-lg">Total Películas</div>
                </div>
            </div>
        </div>

        <!-- Card 2: Películas Nuevas -->
        <div class="w-full h-32 bg-accent mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-around h-full text-gray-800">
                <div class="text-center text-[#ffffff]">
                    <div class="text-4xl font-bold">30</div>
                    <div class="text-lg">Películas Nuevas</div>
                </div>
            </div>
        </div>

        <!-- Card 3: Vistas Hoy -->
        <div
            class="w-full h-32 text-[#ffffff] bg-success mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-around h-full text-gray-800">
                <div class="text-center text-[#ffffff]">
                    <div class="text-4xl font-bold">120</div>
                    <div class="text-lg">Vistas Hoy</div>
                </div>
            </div>
        </div>

            <!-- Card 2: Películas Nuevas -->
            <div class="w-full h-32 bg-accent mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div class="flex items-center justify-around h-full text-gray-800">
                    <div class="text-center text-[#ffffff]">
                        <div class="text-4xl font-bold">30</div>
                        <div class="text-lg">Películas Nuevas</div>
                    </div>
                </div>
            </div>
    
    </div>

    
    <div class="flex gap-5 my-3">



        <!-- Featured Movie -->
        <div class="w-[600px]">
            <div class="relative rounded-lg overflow-hidden">
                <img class="w-full"
                    src="https://c4.wallpaperflare.com/wallpaper/621/286/348/keanu-reeves-keanu-reeves-parabellum-john-wick-john-wick-hd-wallpaper-preview.jpg"
                    alt="Featured Movie" class="w-full">
                <div class="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white w-full">
                    <h2 class="text-2xl font-semibold">BatBoy: Work From Home</h2>
                    <p>Action, Adventure, Comedy</p>
                </div>
                <button class="absolute bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded-lg">Watch Now</button>
            </div>
        </div>
        <!-- Continue Watching -->
        <div class="flex flex-col w-full">
            <h3 class="text-xl font-semibold mb-1">Continue Watching</h3>
            <div class="flex flex-col justify-between gap-4">
                <div class="bg-white p-3 rounded-lg shadow-md flex items-center gap-3">
                    <img src="https://c4.wallpaperflare.com/wallpaper/814/781/141/movie-john-wick-chapter-3-parabellum-keanu-reeves-hd-wallpaper-preview.jpg"
                        alt="Movie Thumbnail" class="w-24 rounded-lg">
                    <div>
                        <h4 class="text-lg font-semibold">James Bondary Ep. 4</h4>
                        <p class="text-gray-500">Action, Drama</p>
                        <div class="h-2 bg-gray-200 rounded-full mt-2">
                            <div class="h-2 bg-red-500 rounded-full" style="width: 69%;"></div>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-md flex items-center gap-3">
                    <img src="https://c4.wallpaperflare.com/wallpaper/425/76/841/john-wick-john-wick-chapter-2-keanu-reeves-movies-wallpaper-preview.jpg"
                        alt="Movie Thumbnail" class="w-24 rounded-lg">
                    <div>
                        <h4 class="text-lg font-semibold">Slice of Life Ep. 4</h4>
                        <p class="text-gray-500">Slice of Life</p>
                        <div class="h-2 bg-gray-200 rounded-full mt-2">
                            <div class="h-2 bg-red-500 rounded-full" style="width: 69%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


</div>
@endsection