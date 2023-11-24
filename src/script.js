import { format, differenceInDays } from "date-fns"
import ru from "date-fns/locale/ru"; 
import Swal from "sweetalert2"

let tours = []
let favoriteTours = [] //массив с любимыми турами
let isFavoritesMode = false; // Флаг для определения текущего режима

async function getData() {

  const response = await fetch(    //получить данные с сервера по запросу
    "https://www.bit-by-bit.ru/api/student-projects/tours"
  )

  const data = await response.json() //прочитать данные, полученные с сервера

  tours = data

  return data //данные готовы к использованию
}

async function init() {

  	tours = await getData()
	renderTours(tours)
	
  let allFavoritesTours = document.getElementById("favoriteToursBtn") //находим "показать избранные туры"

 allFavoritesTours.addEventListener("click", () => {
    if (isFavoritesMode) {
      // Пользователь в режиме "Избранное", показываем все туры
      renderTours(tours);
      allFavoritesTours.innerText = "Избранное";
    } else {
      // Пользователь в режиме "Все туры", показываем избранные туры
      if (favoriteTours.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "Вы ещё не добавили в избранное ни одного тура!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        renderTours(favoriteTours);
        saveToLocalStorage();
        allFavoritesTours.innerText = "Все туры";
      }
    }

    // Инвертируем флаг при каждом клике
    isFavoritesMode = !isFavoritesMode;
  });
}


let loader = document.getElementById("loader")
window.addEventListener("load", () => {
  loader.classList.add("hidden")
  setTimeout(() => {
    loader.remove()
  }, 1000)
})

function checkCity(tour) {
  if (tour.city != null && tour.city.length > 0) {
    return tour.city
  } else {
    return " "
  }
}

function renderTours(tours) {
  document.getElementById("tours-all").innerHTML = " "

  tours.forEach((tour) => {
    let duration = differenceInDays(
      new Date(tour.endTime),
      new Date(tour.startTime)
    )

    const city = checkCity(tour)

    if (tours.length === 0) {
      document.getElementById("tours-all").innerHTML =
        '<div><img src="/images/icon-sad_smile.png" class="oups"> <div class="nothing">По вашему запросу не найдено ни одного тура... Попробуйте выбрать другие параметры поиска</div></div>'
    } else {
      document.getElementById("tours-all").innerHTML += `
            <div class="tour bg-blue-50 rounded-3xl border-sky-500 border-2 max-w-md xl:w-1/4 mx-10 my-10" id="tourId">
                <div>
                    <div class="flex justify-center pt-6 max-h-6">
                        <img class="px-8 w-full h-full object-center max-h-48 sm:max-h-54 md:max-h-28 lg:max-h-32 xl:max-h-48" src="${tour.image}">
                    </div>
    
                    <div class="title flex flex-col absolute font-attention">
                        <div class="text-amber-600 pl-2.5 pt-1.5 xl:text-4xl">${tour.country}</div>
                        <div class="text-current mb-2.5 pl-2.5 xl:text-2xl" id="cityId">${city}</div>
                    </div>
                </div>
    
                <div class="flex flex-col info border drop-shadow-lg xl:mx-10 my-10">
                
                    <div class="hotel font-basic text-sky-600 text-center font-semibold px-2 xl:text-2xl pt-6 pb-6">${tour.hotelName}</div>
                
                    <div class="font-basic text-current text-sm text-center pb-6 font-bold xl:pt-6">
                    ${format(new Date(tour.startTime), "dd MMMM y", {locale: ru,})} -
                    ${format(new Date(tour.endTime), "dd MMMM y", {locale: ru,})}
                    <span class="text-sky-900 underline decoration-solid underline-offset-4 text-sm"><br>
                    продолжительность:</span> ${duration} дней
                    </div>
                    </div>
                
                    <div class="flex flex-col pb-10 pt-6 px-2 xl:px-10">
                        <div class="flex">
                            <img src="/images/icon-price.png" class="w-12 h-12">
                            <div class="font-basic text-rose-700 pt-6  pl-2 xl:text-3xl font-bold">${tour.price}</div> 
                            <p class="font-basic text-rose-700 pt-9 pl-2 xl:text-base">рублей</p>
                        </div>
    
                        <div class="flex">
                            <img src="/images/icon-rating.png" class="w-12 h-12">
                            <div class="font-basic text-amber-500 pt-4 pl-2 xl:text-2xl font-medium" id="rating">${tour.rating}</div> 
                            <p class="font-basic text-amber-500 pt-6 pl-2 xl:text-base">по версии TopHotels.com</p>
                        </div>

                        <div class="flex flex-col mt-6 w-3/4 mx-auto">
                            <button id="openModalButton-${tour.id}" class="mb-4 text-rose-700 font-medium drop-shadow-lg justify-center border border-sky-500 hover:text-white hover:bg-orange-500 transition-all duration-300 hover:text-white rounded-md px-2 py-2">Забронировать</button>
                            <button id="btnAddFavorite-${tour.id}" class="text-amber-500 font-medium drop-shadow-lg border justify-center border-sky-500 hover:text-white rounded-md px-3 py-2 hover:bg-fuchsia-400 transition-all duration-300">В избранное</button>
                            <button id="btnRemoveFromFavorites-${tour.id}"class="text-amber-500 font-medium drop-shadow-lg justify-center border border-sky-500 hover:text-white rounded-md px-3 py-2 hover:bg-red-600 transition-all duration-300">Удалить из избранного</button>
                        </div>
                    </div>
                </div>
        </div>
            `
    }
  })

  tours.forEach((tour) => {
    let buttonCancelFromFavorite = document.getElementById(`btnRemoveFromFavorites-${tour.id}`) //найти кнопку удалить из избранного
    buttonCancelFromFavorite.style.display = "none"

    let buttonAddToFavorite = document.getElementById(`btnAddFavorite-${tour.id}`) //нахожу кнопку добавить

    buttonAddToFavorite.addEventListener("click", () => {

      favoriteTours.push(tour) //добавляем тур в любимые
      buttonAddToFavorite.style.display = "none"
      buttonCancelFromFavorite.style.display = "flex"

      buttonCancelFromFavorite.addEventListener("click", () => {

        favoriteTours.splice(favoriteTours.indexOf(tour), 1) //удаляем тур из избранного
        buttonAddToFavorite.style.display = "flex"
        buttonCancelFromFavorite.style.display = "none"
      })
    })

    let IdOfFavoritesTours = favoriteTours.map((idOfTours) => {
      return idOfTours.id
    })

    let isFavorite = IdOfFavoritesTours.includes(tour.id)

    if (isFavorite) {
      buttonAddToFavorite.style.display = "none"
      buttonCancelFromFavorite.style.display = "flex"
    }

    buttonCancelFromFavorite.addEventListener("click", () => {

      let tourDelete = tours.find((findTour) => {
        return findTour.id === tour.id
      })

      let tourIndex = favoriteTours.indexOf(tourDelete)
      favoriteTours.splice(tourIndex, 1)
      renderTours(tours)

      if (favoriteTours.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "Вы ещё не добавили в избранное ни одного тура!",
        showConfirmButton: true,
       
        })
      }
    })
  })

  tours.forEach((tour) => {
    document
      .getElementById(`openModalButton-${tour.id}`)
      .addEventListener("click", () => {
        openBookingWindow(tour.id) //если нажали на кнопку забронировать, то открывается модальное окно
      })
  })
  saveToLocalStorage() 
}



function saveToLocalStorage() {
  const toursJson = JSON.stringify(tours)
  localStorage.setItem("tours", toursJson)
}

const toursJson = localStorage.getItem("tours") //преобразование из JSON в JS

if (toursJson) {
  tours = JSON.parse(toursJson)
}

getData()
init()