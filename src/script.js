import { format, differenceInDays } from "date-fns"
import ru from "date-fns/locale/ru"; 
import Swal from "sweetalert2"

const toursContainer = document.getElementById("tours-all");
let tours = [];
let favoriteTours = []; // массив с любимыми турами
let isFavoritesMode = false; // Флаг для определения текущего режима

async function getData() {
  const response = await fetch(
    "https://www.bit-by-bit.ru/api/student-projects/tours"
  );
  const data = await response.json();
  tours = data;
  renderTours(tours);
  return data;
}

async function init() {
  await getData();

  const allFavoritesTours = document.getElementById("favoriteToursBtn");

  allFavoritesTours.addEventListener("click", () => {
    if (isFavoritesMode) {
      renderTours(tours);
      allFavoritesTours.innerText = "Избранное";
    } else {
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
    isFavoritesMode = !isFavoritesMode;
  });
}

const loader = document.getElementById("loader");

window.addEventListener("load", async () => {
  loader.classList.add("hidden");
  setTimeout(() => {
    loader.remove();
  }, 1000);
  await getData();
});

function checkCity(tour) {
  return tour.city != null && tour.city.length > 0 ? tour.city : " ";
}

function renderTours(tours) {


  toursContainer.innerHTML = "";

  tours.forEach((tour) => {
    const duration = differenceInDays(
      new Date(tour.endTime),
      new Date(tour.startTime)
    );
    const city = checkCity(tour);
    const isFavorite = favoriteTours.some((favTour) => favTour.id === tour.id);

	  if (tours.length === 0) {
    toursContainer.innerHTML = `<div><img src="/images/icon-sad_smile.png" class="oups"> <div class="nothing">По вашему запросу не найдено ни одного тура... Попробуйте выбрать другие параметры поиска</div></div>`;
  } else {
    toursContainer.innerHTML += `
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
                              <button id="btnAddFavorite-${tour.id}" class="text-amber-500 font-medium drop-shadow-lg border justify-center border-sky-500 hover:text-white rounded-md px-3 py-2 hover:bg-fuchsia-400 transition-all duration-300" style="${isFavorite ? 'display:none;' : 'display:flex;'}">
          В избранное
        </button>
        <button id="btnRemoveFromFavorites-${tour.id}" class="text-amber-500 font-medium drop-shadow-lg justify-center border border-sky-500 hover:text-white rounded-md px-3 py-2 hover:bg-red-600 transition-all duration-300" style="${isFavorite ? 'display:flex;' : 'display:none;'}">
          Удалить из избранного
        </button>
                        </div>
                    </div>
                </div>
        </div>
            `
    
  }})

  // Добавление обработчиков событий за пределы цикла
  tours.forEach((tour) => {
    const buttonCancelFromFavorite = document.getElementById(
      `btnRemoveFromFavorites-${tour.id}`
    );
    buttonCancelFromFavorite.style.display = "none";

    const buttonAddToFavorite = document.getElementById(
      `btnAddFavorite-${tour.id}`
    );

    buttonAddToFavorite.addEventListener("click", () => {
      favoriteTours.push(tour);
      buttonAddToFavorite.style.display = "none";
      buttonCancelFromFavorite.style.display = "flex";

      buttonCancelFromFavorite.addEventListener("click", () => {
        favoriteTours.splice(favoriteTours.indexOf(tour), 1);
        buttonAddToFavorite.style.display = "flex";
        buttonCancelFromFavorite.style.display = "none";
      });
    });

    const IdOfFavoritesTours = favoriteTours.map((idOfTours) => idOfTours.id);
    const isFavorite = IdOfFavoritesTours.includes(tour.id);

    if (isFavorite) {
      buttonAddToFavorite.style.display = "none";
      buttonCancelFromFavorite.style.display = "flex";
    }

    buttonCancelFromFavorite.addEventListener("click", () => {
      const tourDelete = tours.find((findTour) => findTour.id === tour.id);
      const tourIndex = favoriteTours.indexOf(tourDelete);
      favoriteTours.splice(tourIndex, 1);
      renderTours(tours);

      if (favoriteTours.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "Вы ещё не добавили в избранное ни одного тура!",
          showConfirmButton: true,
        });
      }
    });
  });

  tours.forEach((tour) => {
    document
      .getElementById(`openModalButton-${tour.id}`)
      .addEventListener("click", () => {
        openBookingWindow(tour.id);
      });
  });

  saveToLocalStorage();
}


const modalWindow = document.getElementById("openModalWindow");
const tourInfoContainer = document.getElementById("tour-info");
const cancelRequestButton = document.getElementById("cancelRequest");
const form = document.getElementById("form");

// Функция открытия модального окна бронирования
function openBookingWindow(id) {
  const selectedTour = tours.find((t) => t.id === id);
  const startTimeFormatted = selectedTour.startTime ? new Date(selectedTour.startTime) : null;
  const endTimeFormatted = selectedTour.endTime ? new Date(selectedTour.endTime) : null;

  const startTimeString = startTimeFormatted ? format(startTimeFormatted, "dd MMMM y", { locale: ru }) : "";
  const endTimeString = endTimeFormatted ? format(endTimeFormatted, "dd MMMM y", { locale: ru }) : "";

  modalWindow.style.display = "flex";
  tourInfoContainer.innerHTML = `
<div class="modal fixed top-0 left-0 flex items-center justify-center w-full h-full bg-blue-500 bg-opacity-50">
  <div class="bg-blue-500 p-4 md:p-7 rounded-xl shadow-xl mx-auto">
    <section class="bg-white p-4 md:p-8 rounded-xl flex flex-col md:flex-row">
      <div class="w-full md:w-1/2">
        <h2 class="text-2xl font-bold mb-4 text-rose-500">Вы выбрали тур:</h2>
        <div class="flex m-2 flex-col items-center">
          <img class="rounded w-52" src="${selectedTour.image}">
        </div>
        <div class="text-slate-700 text-start">Страна тура:</div>
        <p class="text-sm shadow-sm text-start select-none text-amber-700 my-0 sm:mb-3 w-full pl-1">${selectedTour.country}</p>
        <div class="text-slate-700 text-start">Город тура:</div>
        <p class="text-sm shadow-sm text-start text-amber-700 my-0 sm:mb-3 w-full pl-1">${selectedTour.city}</p>
        <div class="text-slate-700 text-start">Название отеля:</div>
        <p class="text-sm shadow-sm text-start text-amber-700 my-0 sm:mb-3 w-full pl-1">${selectedTour.hotelName}</p>
        <div class="text-slate-700 text-start">Бронируемые даты поездки:</div>
        <p class="text-sm shadow-sm text-start text-amber-700 my-0 sm:mb-3 w-full pl-1">
          ${startTimeString} - ${endTimeString}
        </p>
        <button id="sendRequest" class="button-modal mt-16 p-1 border-yellow-500 bg-sky-100 border rounded-md text-sm cursor-pointer hover:text-white hover:transition-all hover:duration-300" type="submit">
          Отправить запрос
        </button>
      </div>
      <div class="w-full md:w-1/2">
        <h3 class="text-xl font-bold text-rose-500 mb-4 md:mb-6">Пожалуйста, введите Ваши данные для бронирования:</h3>
        <form id="form" class="flex flex-col">
          <div class="form_req">
            <div class="flex items-center mb-2">
              <img src="/images/icon-press-pass.png" class="w-6 h-6" alt="Иконка" />
              <label for="customerName" class="ml-2 text-amber-500">ФИО*</label>
            </div>
            <input id="customerName" type="text" class="border p-1 rounded-md mb-2 form-input _req" placeholder="Обязательно для заполнения" />
            <div class="flex items-center mb-2">
              <img src="/images/phone-call.png" class="w-6 h-6" alt="Иконка" />
              <label for="customerPhone" class="ml-2 text-amber-500">Номер телефона*</label>
            </div>
            <input id="customerPhone" type="tel" class="border p-1 rounded-md mb-2 form-input _req" placeholder="Обязательно для заполнения" />
            <div class="flex items-center mb-2">
              <img src="/images/icon-email.png" class="w-6 h-6" alt="Иконка" />
              <label for="customerEmail" class="ml-2 text-amber-500">Адрес электронной почты*</label>
            </div>
            <input id="customerEmail" type="email" class="border p-1 rounded-md mb-2 form-input _req _email" placeholder="Обязательно для заполнения" />
            <div class="flex items-center mb-2">
              <img src="/images/icon-comment.png" class="w-6 h-6" alt="Иконка" />
              <label for="customerComment" class="ml-2 text-amber-500">Комментарий*</label>
            </div>
            <textarea id="customerComment" name="customerComment" rows="4" class="border rounded-md p-1 mb-4 form-input" placeholder="Здесь можно оставить комментарий"></textarea>
          </div>
        </form>
        <div class="flex justify-end mt-1 gap-1">
          <button id="clearFormButton" type="reset" class="button-modal p-1 border bg-sky-100 border-yellow-500 rounded-md text-sm cursor-pointer hover:bg-red-600 hover:transition-all hover:duration-300">
            Очистить форму
          </button>
          <button id="cancelModalButton" type="button" class="button-modal p-1 border bg-sky-100 border-yellow-500 rounded-md text-sm cursor-pointer hover:bg-red-600 hover:transition-all hover:duration-300">
            Отменить
          </button>
       
        </div>
      </div>
    </section>
  </div>
</div>
`;

  const buttonSendRequest = document.getElementById("sendRequest");
  const cancelRequestButton = document.getElementById("cancelModalButton");
  const clearFormButton = document.getElementById("clearFormButton");

  if (buttonSendRequest) {
    buttonSendRequest.addEventListener("click", (e) => submitFormData(e, selectedTour));
    cancelRequestButton.addEventListener("click", closeModalWindow);
  }

  if (clearFormButton) {
    clearFormButton.addEventListener("click", () => {
      const form = document.getElementById("form");
      if (form) {
        form.reset();
      }
    });
  }

  const cancelModalButton = document.getElementById("cancelModalButton");
  if (cancelModalButton) {
    cancelModalButton.addEventListener("click", () => {
      closeModalWindow();
    });
  }
}

// Функция закрытия модального окна
function closeModalWindow() {
  modalWindow.style.display = "none";

  // Сбросить форму
  const form = document.getElementById("form");
  if (form) {
    form.reset();
  }
}


// Функция отправки данных формы
async function submitFormData(e, selectedTour) {
  const error = formValidate(form);

  const customerNameValue = document.getElementById("customerName").value;
  const customerPhoneValue = document.getElementById("customerPhone").value;
  const customerEmailValue = document.getElementById("customerEmail").value;
  const customerCommentValue = document.getElementById("customerComment").value;

  const formData = {
    customerName: customerNameValue,
    phone: customerPhoneValue,
    email: customerEmailValue,
    description: customerCommentValue,
  };

  if (error === 0) {
    const url = `https://www.bit-by-bit.ru/api/student-projects/tours/${selectedTour.id}`

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Спасибо! Ваш запрос успешно отправлен!",
          text: "В ближайшее время наш менеджер с вами свяжется!",
        });

        closeModalWindow();
      } else {
        throw new Error("Что-то пошло не так...");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Что-то пошло не так...",
        text: "Попробуйте ещё раз!",
      });
      closeModalWindow();
    }
  }
}

// Функция валидации формы
function formValidate() {
  let error = 0;
  let formReq = document.querySelectorAll("._req")

  for (let index = 0; index < formReq.length; index++) {
    const input = formReq[index];
    formRemoveError(input);

    if (input.classList.contains("_email")) {
      if (emailTest(input)) {
        formAddError(input);
        error++;
      }
    } else {
      if (input.value === "") {
        formAddError(input);
        error++;
      }
    }
  }
  return error;
}

// Добавление класса ошибки к элементу формы
function formAddError(input) {
  input.parentElement.classList.add("_error");
  input.classList.add("_error");
}

// Удаление класса ошибки у элемента формы
function formRemoveError(input) {
  input.parentElement.classList.remove("_error");
  input.classList.remove("_error");
}

// Тест на валидность email
function emailTest(input) {
  return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(input.value);
}

const countriesFilter = document.getElementById("countriesFilter");
const ratingStarsContainer = document.getElementById("ratingStars");
const inputElement = document.getElementById("input");
const lowPriceButton = document.getElementById("lowPrice");
const highPriceButton = document.getElementById("highPrice");
let selectedStar = null;

ratingStarsContainer.addEventListener("click", handleStarClick);
ratingStarsContainer.addEventListener("mouseover", handleStarMouseover);
ratingStarsContainer.addEventListener("mouseout", handleStarMouseout);

countriesFilter.addEventListener("change", () => filterByCountry());
ratingStarsContainer.addEventListener("click", handleStarClick);
inputElement.addEventListener("input", updateInputResult);
lowPriceButton.addEventListener("click", sortByLowPrice);
highPriceButton.addEventListener("click", sortByHighPrice);

const durationInput = document.getElementById("input");
durationInput.addEventListener("change", () => filterByDuration());

function filterByCountry() {
  const countriesFieldset = Array.from(document.querySelectorAll("#countriesFilter .checkbox"));
  const checkedCountries = countriesFieldset.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.name);

  const filteredTours = checkedCountries.length > 0
    ? tours.filter((tour) => checkedCountries.includes(tour.country))
    : tours;

  renderTours(filteredTours);
}

function handleStarClick(event) {
  const clickedStar = event.target;

  if (clickedStar.tagName === "IMG") {
    selectedStar = clickedStar;
    filterByRating();
  }
}

function handleStarMouseover(event) {
  const hoveredStar = event.target;

  if (hoveredStar.tagName === "IMG") {
    const stars = Array.from(ratingStarsContainer.getElementsByTagName("IMG"));
    const hoveredIndex = stars.indexOf(hoveredStar);
    
    stars.forEach((star, index) => {
      if (index <= hoveredIndex) {
        star.src = "/images/icon-chooseStar.png";
      } else {
        star.src = "/images/icon-emptyStar.png";
      }
    });
  }
}

function handleStarMouseout(event) {
  const outStar = event.target;

  if (outStar.tagName === "IMG" && outStar !== selectedStar) {
    const stars = Array.from(ratingStarsContainer.getElementsByTagName("IMG"));
    
    stars.forEach((star) => {
      star.src = "/images/icon-emptyStar.png";
    });
  }
}

function filterByRating() {
  const minRating = selectedStar.dataset.minrating;
  const maxRating = selectedStar.dataset.maxrating;

  const filteredTours = tours.filter((tour) => tour.rating >= minRating && tour.rating <= maxRating);

  if (filteredTours.length > 0) {
    renderTours(filteredTours);
  } else {
    renderNoToursFound();
  }
}

function updateInputResult() {
  const getValue = inputElement.value;
  document.getElementById("inputResult").innerHTML = `Вы выбрали ${getValue} дней`;
}

function sortByLowPrice(event) {
	  event.preventDefault();
  const filteredTours = [...tours].sort((a, b) => a.price - b.price);
  renderTours(filteredTours);
}

function sortByHighPrice(event) {
	  event.preventDefault();
  const filteredTours = [...tours].sort((a, b) => b.price - a.price);
  renderTours(filteredTours);
}

function filterByDuration() {
  const getDataOfInput = durationInput.value;

  const filteredTours = tours.filter((tour) => {
    const difference = differenceInDays(new Date(tour.endTime), new Date(tour.startTime));
    return difference == getDataOfInput;
  });

  if (filteredTours.length > 0) {
    renderTours(filteredTours);
  } else {
    renderNoToursFound();
  }
}

function renderNoToursFound() {
  document.getElementById("tours-all").innerHTML =
    '<div><img src="/images/icon-sad_smile.png" class="oups"> <div class="nothing">По вашему запросу не найдено ни одного тура... Попробуйте выбрать другие параметры поиска</div></div>';
}

function saveToLocalStorage() {
  const toursJson = JSON.stringify(tours);
  localStorage.setItem("tours", toursJson);
}

const toursJson = localStorage.getItem("tours");

if (toursJson) {
  tours = JSON.parse(toursJson);
}

getData();
init();