
async function getData() {

    const response = await fetch("https://www.bit-by-bit.ru/api/student-projects/tours") //получить запрос

    const tours = await response.json() //прочитать тело запроса

  
    console.log(tours)

    tours.forEach(tour => {

        document.getElementById("tours-all").innerHTML += `
        
        <div class="tour bg-blue-50 rounded-3xl border-sky-500 border-2 max-w-md xl:w-1/4 mx-10 my-10">
            <div>
                <div class="flex justify-center pt-6 w-full img">
                    <img class="border px-8" src="${tour.image}">
                </div>

                <div class="title flex flex-col absolute font-attention w-7/12">
                    <div class="text-amber-600 pl-2.5 pt-1.5 xl:text-4xl">${tour.country}</div>
                    <div class="text-current mb-2.5 pl-2.5 xl:text-2xl">${tour.city}</div>
                </div>
            </div>

            <div class="flex flex-col info border drop-shadow-lg xl:mx-10 my-10">
            
                <div class="font-basic text-sky-600 text-center font-semibold px-2 xl:text-2xl pt-6 pb-6">${tour.hotelName}</div>
            
                <div class="pl-6">
                    <div class="font-basic text-current pb-2 xl:text-xl pt-6>${tour.startTime}</div>
                    <div class="font-basic text-current xl:text-xl pb-6">${tour.endTime}</div>
                </div>
            
                <div class="flex flex-col pb-10 pt-6 px-6">
                    <div class="flex">
                        <img src="/images/icon-price.png" class="w-12 h-12">
                        <div class="font-basic text-rose-700 pt-6  pl-2 xl:text-3xl font-bold">${tour.price}</div> 
                        <p class="font-basic text-rose-700 pt-9 pl-2 xl:text-base">рублей</p>
                    </div>

                    <div class="flex">
                        <img src="/images/icon-rating.png" class="w-12 h-12">
                        <div class="font-basic text-amber-500 pt-4 pl-2 xl:text-2xl font-medium">${tour.rating}</div> 
                        <p class="font-basic text-amber-500 pt-6 pl-2 xl:text-base">по версии TopHotels.com</p>
                    </div>
                </div>
            </div>
    </div>
        `
    });

  

}

getData()