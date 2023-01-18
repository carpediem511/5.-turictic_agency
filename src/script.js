
async function getData() {

    const response = await fetch("https://www.bit-by-bit.ru/api/student-projects/tours") //получить запрос

    const tours = await response.json() //прочитать тело запроса

  
    console.log(tours)

    tours.forEach(tour => {

        document.getElementById("tours-all").innerHTML += `
        
        <div class="bg-blue-50 rounded-3xl border-sky-500 border-2 xl:w-1/3">
        <div class="relative">
            <div class="flex justify-center pt-10">
                <img class="drop-shadow-md border" src="${tour.image}">
            </div>

            <div class="title flex flex-col absolute font-attention xl:mx-20 -my-28">
                <div class="text-amber-600 xl:text-5xl">${tour.country}</div>
                <div class="text-current pb-2 mb-2 xl:text-2xl">${tour.city}</div>
            </div>
        </div>

        <div class="flex flex-col info border drop-shadow-lg xl:mx-20 my-10">
        
            <div class="font-basic text-sky-600 text-center font-medium xl:text-2xl pt-10 pb-6">${tour.hotelName}</div>
        
            <div class="pl-6">
                <div class="font-basic text-current pb-2 xl:text-xl pt-10">${tour.startTime}</div>
                <div class="font-basic text-current xl:text-xl pb-10">${tour.endTime}</div>
            </div>
        
            <div class="flex flex-col pb-10 pt-6 px-6">
                <div class="flex">
                    <img src="/images/icon-price.png" class="w-12 h-12">
                    <div class="font-basic text-rose-700 pt-6  pl-2 xl:text-3xl font-bold">${tour.price}</div>
                </div>

                <div class="flex">
                    <img src="/images/icon-rating.png" class="w-12 h-12">
                    <div class="font-basic text-amber-400 pt-4 pl-6 xl:text-2xl font-medium">${tour.rating}</div>
                </div>
            </div>
        </div>
    </div>
        `
    });

}

getData()