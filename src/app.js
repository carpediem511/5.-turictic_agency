import { format, differenceInDays } from "date-fns"
import { ru } from "date-fns/locale"
import { doc } from "prettier"

let tours = []
let favoriteTours = [] //массив с любимыми турами

// загрузка данных с БД
async function loadTours() {
  const response = await fetch(
    "https://www.bit-by-bit.ru/api/student-projects/tours"
  )
  const data = await response.json()

  tours = data
  return data
}

// отрисовка туров
function renderTours(tours) {
  document.getElementById("container").innerHTML = ""
  tours.forEach((tour) => {
    const duration = differenceInDays(
      new Date(tour.endTime),
      new Date(tour.startTime)
    )

    document.getElementById("container").innerHTML += `
        <div class="bg-white shadow-lg rounded-xl mt-8 p-4" id="tour">
            <div>
                <div class="h-12">
                     <a class="font-semibold text-yellow-600 hover:underline">${
                       tour.hotelName
                     }</a>
                </div>
                             <p class="font-normal text-sky-900 mb-2 mt-2">
                             ${tour.city ? `<a href="#">${tour.city},</a>` : ""}
                                 <a href="#">${tour.country}</a>
                             </p>
                        </div>
                         <div>
                             <img
                                 class="h-72 w-full mt-4"
                                 src="${tour.image}"
                                 alt=""
                             />
                        </div>
                        <div class="my-5 text-sky-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 
                        0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 
                        11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 
                        2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 
                        2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>

                        <p class="ml-3"> ${duration} дней </p>
                        </div>
                         <div class="my-5 text-sky-800 flex items-center">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 
                                1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                               </svg>
                             <span class="ml-3">${format(
                               new Date(tour.startTime),
                               "dd.MM.yyyy",
                               { locale: ru }
                             )}</span>
                             <span class="mr-1 ml-1"> - </span>
                             <span> ${format(
                               new Date(tour.endTime),
                               "dd.MM.yyyy",
                               { locale: ru }
                             )}</span>

                        </div>

                         <div>
                             <p class="font-normal text-gray-800 text-m">
                             Стоимость тура: ${tour.price.toLocaleString("ru", {
                               style: "currency",
                               currency: "rub",
                               currencyDisplay: "code",
                               minimumFractionDigits: 0,
                             })}
                             </p>
                             <div class="flex items-center mt-3">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-yellow-500 mr-3">
                            <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 
                            1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 
                            3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
                            </svg>

                                <p class="font-normal text-gray-800 text-m">
                                ${tour.rating}
                                </p>
                             </div>
                         </div>
                         <div class="btn-container">
                             <button class="btn" id="openModalButton-${
                               tour.id
                             }"}">Забронировать</button>
                             <button class="btn" id="btnAddFavorite-${
                               tour.id
                             }">Добавить в избранное</button>
                             <button class="btn" id="btnRemoveFromFavorites-${
                               tour.id
                             }">Удалить из избранного</button>
                         </div>
                    </div>
        `
  })

  tours.forEach((tour) => {
    let buttonCancelFromFavorite = document.getElementById(
      `btnRemoveFromFavorites-${tour.id}`
    ) //найти кнопку отмена
    buttonCancelFromFavorite.style.display = "none"

    let buttonAddToFavorite = document.getElementById(
      `btnAddFavorite-${tour.id}`
    ) //нахожу кнопку добавить
    buttonAddToFavorite.addEventListener("click", () => {
      favoriteTours.push(tour) //добавляем тур в любимые
      buttonAddToFavorite.style.display = "none"
      buttonCancelFromFavorite.style.display = "flex"

      buttonCancelFromFavorite.addEventListener("click", () => {
        favoriteTours.splice(tour) //удаляем тур из избранного
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
        return findTour.id === id
      })
      let tourIndex = tours.indexOf(tourDelete)
      tours.splice(tourIndex, 1)
    })
  })
}

// открытие модального окна для бронирования
/*  tours.forEach((tour) => {
        document.getElementById(`openModalButton-${tour.id}`).addEventListener("click", () =>
        openModalWindow(tour.id))
    }) */

const modalWindow = document.getElementById("modalWindow")
const closeModalWindow = document.getElementById("CloseModalWindowButton")
const closeModalXButton = document.getElementById("modal-btn")

closeModalWindow.addEventListener("click", closeModal)
closeModalXButton.addEventListener("click", closeModal)

function closeModal() {
  modalWindow.style.display = "none"
}

let currentId

// НЕ ПОЛУЧИЛОСЬ ОТОБРАЖАТЬ ДАННЫЕ ТУРА
async function openModalWindow(id) {
  const response = await fetch(
    "https://www.bit-by-bit.ru/api/student-projects/tours"
  )
  tours = await response.json()

  modalWindow.style.display = "flex"

  const tour = tours.find((t) => i.id === id)
  document.getElementById("tourCard").innerHTML = ""
  document.getElementById("tourCard").innerHTML += `
    <div>
            <div class="h-12">
                <a class="font-semibold text-yellow-600 hover:underline" id="hotelName">название отеля</a>
            </div>
            <p class="font-normal text-sky-900 mb-2 mt-2" id="country">страна</p>
        </div>
        <div id="image">изображение</div>
        <div class="my-5 text-sky-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
            <span class="ml-3" id="startTime">дата</span>
            <span class="mr-1 ml-1"> - </span>
            <span id="endTime"> дата</span>

        </div>
        <div>
            <p class="font-normal text-gray-800 text-m" id="price">Стоимость тура:</p>
            <div class="flex items-center mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-yellow-500 mr-3">
                    <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
                </svg>
                <p class="font-normal text-gray-800 text-m" id="rating">рейтинг</p>
            </div>
    </div>

    `
  currentId = id
}

//  dropdown по стране и рейтингу
document
  .querySelectorAll(".dropdown__container")
  .forEach(function (dropdownWrapper) {
    const dropdownBtn = dropdownWrapper.querySelector(".dropdownButton")
    const dropdownList = dropdownWrapper.querySelector(".dropdownList")
    const dropdownListItems = dropdownList.querySelectorAll(
      ".dropdown__list-item"
    )

    // откыть dropdowns
    dropdownBtn.addEventListener("click", function () {
      dropdownList.classList.remove("hidden")
    })

    // заполнить dropdowns выбранным значением и закрыть список
    dropdownListItems.forEach(function (listItem) {
      listItem.addEventListener("click", function () {
        dropdownBtn.innerText = this.innerText
        dropdownList.classList.add("hidden")
      })
    })

    // скрыть dropdown если клик не по кнопке
    document.addEventListener("click", function (event) {
      if (event.target !== dropdownBtn) {
        dropdownList.classList.add("hidden")
      }
    })
  })

// фильтр по странам

function filtredByCountry(tours, country) {
  if (country) {
    const filtredTours = tours.filter((tour) => {
      return tour.country === country
    })
    renderTours(filtredTours)
  } else {
    renderTours(tours)
  }
}

// фильтр по рейтингу

function filtredByRating(tours, rating) {
  if (rating) {
    const filtredTours = tours.filter((tour) => {
      return tour.rating >= rating
    })
    renderTours(filtredTours)
  } else {
    renderTours(tours)
  }
}

// фильтр по цене

function filterByPrice(tours, price) {
  const minPrice = document.getElementById("minPrice").value
  const maxPrice = document.getElementById("maxPrice").value

  const filteredTours = tours.filter((tour) => {
    if (minPrice && maxPrice) {
      return tour.price >= minPrice && tour.price <= maxPrice
    } else if (minPrice) {
      return tour.price >= minPrice
    } else if (maxPrice) {
      return tour.price <= maxPrice
    } else {
      renderTours(tours)
    }
  })

  renderTours(filteredTours)

  document.getElementById("minPrice").value = ""
  document.getElementById("maxPrice").value = ""
}

// загрузка страницы
async function init() {
  const tours = await loadTours()
  renderTours(tours)
  saveToLocalStorage()

  let allFavoritesTours = document.getElementById("favoriteToursBtn") //находим "показать избранные туры"
  allFavoritesTours.addEventListener("click", () => {
    if (favoriteTours == 0) {
      document.getElementById("container").innerHTML =
        "Вы пока не добавили в избранное ни одного тура!"
    } else {
      renderTours(favoriteTours)
      saveToLocalStorage()
    }
  })

  document
    .getElementById("allCountries")
    .addEventListener("click", () => filtredByCountry(tours))
  document
    .getElementById("tailand")
    .addEventListener("click", () => filtredByCountry(tours, "Тайланд"))
  document
    .getElementById("egypt")
    .addEventListener("click", () => filtredByCountry(tours, "Египет"))
  document
    .getElementById("cyprus")
    .addEventListener("click", () => filtredByCountry(tours, "Кипр"))
  document
    .getElementById("maldives")
    .addEventListener("click", () => filtredByCountry(tours, "Мальдивы"))
  document
    .getElementById("indonesia")
    .addEventListener("click", () => filtredByCountry(tours, "Индонезия"))
  document
    .getElementById("mexico")
    .addEventListener("click", () => filtredByCountry(tours, "Мексика"))
  document
    .getElementById("tanzania")
    .addEventListener("click", () => filtredByCountry(tours, "Танзания"))

  document
    .getElementById("allRating")
    .addEventListener("click", () => filtredByRating(tours))
  document
    .getElementById("rating7")
    .addEventListener("click", () => filtredByRating(tours, 7))
  document
    .getElementById("rating8")
    .addEventListener("click", () => filtredByRating(tours, 8))
  document
    .getElementById("rating9")
    .addEventListener("click", () => filtredByRating(tours, 9))

  document
    .getElementById("priceButton")
    .addEventListener("click", () => filterByPrice(tours))
}

// // loader

let loader = document.getElementById("loader")
window.addEventListener("load", () => {
  loader.classList.add("hidden")
  setTimeout(() => {
    loader.remove()
  }, 1000)
})

// отправка формы пронирования. НЕ ЗАВЕРШЕНО
document.getElementById("form").addEventListener("submit", sendFormData)

async function sendFormData(event) {
  event.preventDefault()

  let name = document.getElementById("inputName")
  let phone = document.getElementById("inputTel")
  let email = document.getElementById("inputEmail")
  let comment = document.getElementById("textarea")

  const params = {
    customerName: name.value,
    phone: phone.value,
    email: email.value,
    description: comment.value,
  }

  const url = `https://www.bit-by-bit.ru/api/student-projects/tours/${currentId}`

  let response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(params),
  })
}

function saveToLocalStorage() {
  const toursJson = JSON.stringify(tours)
  localStorage.setItem("tours", toursJson)
}

const toursJson = localStorage.getItem("tours") //преобразование из JSON в JS

if (toursJson) {
  tours = JSON.parse(toursJson)
}

//отобразить все туры по клику
let buttonAllTours = document.getElementById("allToursBtn")

buttonAllTours.addEventListener("click", () => {
  renderTours(tours)
})

loadTours()
init()
