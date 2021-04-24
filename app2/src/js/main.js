document.addEventListener('DOMContentLoaded', () => {

  const UTILS = {
    time: {
      hoursInADay: 24,
      minutesInAHour: 60,
      secondsInAMinute: 60,
      millisecondsInASecond: 1000,
    },
  };
  const HIDDEN_CLASSNAME = 'hide';
  const SHOWN_CLASSNAME = 'show';
  const FADE_CLASSNAME = 'fade';

  const tabsContainer = document.querySelector('.tabcontainer');
  const tabs = tabsContainer.querySelectorAll('.tabheader__item');
  const tabsContent = tabsContainer.querySelectorAll('.tabcontent');
  const tabsParent = tabsContainer.querySelector('.tabheader__items');


  function hideTabContent () {
    tabsContent.forEach(item => {
      item.classList.add(HIDDEN_CLASSNAME);
      item.classList.remove(SHOWN_CLASSNAME, FADE_CLASSNAME);
    });

    tabs.forEach(tab => {
      tab.classList.remove('tabheader__item_active');
    });
  }
  
  function showTabContent(i = 0) {
    tabsContent[i].classList.add(SHOWN_CLASSNAME, FADE_CLASSNAME);
    tabsContent[i].classList.remove(HIDDEN_CLASSNAME);
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent(0);

  tabsParent.addEventListener('click', (evt) => {
    const target = evt.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer

  const deadline = '2021-04-15';

  function getNumberWithZero(number) {
    if (number >= 0 && number < 10) {
      return `0${number}`;
    } else {
      return number;
    }
  }

  function getTimerSpread(endtime) {
      const timerSpread = Date.parse(endtime) - Date.parse(new Date());
      const days = Math.floor(timerSpread / (UTILS.time.millisecondsInASecond * UTILS.time.secondsInAMinute * UTILS.time.minutesInAHour * UTILS.time.hoursInADay));
      const hours = Math.floor((timerSpread / (UTILS.time.millisecondsInASecond * UTILS.time.secondsInAMinute)) % UTILS.time.hoursInADay);
      const minutes = Math.floor((timerSpread / UTILS.time.millisecondsInASecond / UTILS.time.secondsInAMinute) % UTILS.time.minutesInAHour);
      const seconds = Math.floor((timerSpread / UTILS.time.millisecondsInASecond) % UTILS.time.secondsInAMinute);

      return {
        'total': timerSpread,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
  }
  
  function setTimer(selector, endtime) {
    const timer = document.querySelector(selector);
    const days = timer.querySelector('#days');
    const hours = timer.querySelector('#hours');
    const minutes = timer.querySelector('#minutes');
    const seconds = timer.querySelector('#seconds');
    const timeInterval = setInterval(updateTimer, UTILS.time.millisecondsInASecond);

    updateTimer();

    function updateTimer() {
      const timerSpread = getTimerSpread(endtime);

      days.textContent = getNumberWithZero(timerSpread.days);
      hours.textContent = getNumberWithZero(timerSpread.hours);
      minutes.textContent = getNumberWithZero(timerSpread.minutes);
      seconds.textContent = getNumberWithZero(timerSpread.seconds);

      if (timerSpread.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setTimer('.timer', deadline);


  // Modal

  const modal = document.querySelector('.modal');
  const openModalBtns = document.querySelectorAll('[data-modal-open]');
  const closeModalBtn = document.querySelector('[data-modal-close]');

  function closeModal () {
    modal.classList.remove(SHOWN_CLASSNAME, FADE_CLASSNAME);
    modal.classList.add(HIDDEN_CLASSNAME);
    document.body.style.overflowY = 'visible';
  }

  function openModal () {
    modal.classList.remove(HIDDEN_CLASSNAME);
    modal.classList.add(SHOWN_CLASSNAME, FADE_CLASSNAME);
    document.body.style.overflowY = 'hidden';
    clearInterval(modalTimerId);
  }

  function showModalByScroll () {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll)
    }
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal.classList.contains(HIDDEN_CLASSNAME)) {
        openModal();
      }
    });
  });

  closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (evt) => {
    if (evt.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.code === 'Escape') {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 5000);

  window.addEventListener('scroll', showModalByScroll);

  // adding content

  const menuCardsContainer = document.querySelector('.menu .container');

  const clearElement = (element) => {
    while(element.firstChild) {
      element.firstChild.remove();
    }
  };

  clearElement(menuCardsContainer);

  class MenuCard {
    constructor(src, alt, title, description, price, parentSelector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.description = description;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.moneyTransferValue = 75.22;
      this.changeCurrencyValue();
    }

    changeCurrencyValue() {
      this.price *= this.moneyTransferValue;
    }

    render() {
      const element = document.createElement('div');
      element.classList.add('menu__item');
      element.innerHTML = `
                  <img src=${this.src} alt=${this.alt}>
                  <h3 class="menu__item-subtitle">${this.title}</h3>
                  <div class="menu__item-descr">${this.description}</div>
                  <div class="menu__item-divider"></div>
                  <div class="menu__item-price">
                      <div class="menu__item-cost">Цена:</div>
                      <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                  </div>
            `;
      this.parent.append(element);
    }
  }

  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    "Меню \"Фитнес\"",
    "Меню \"Фитнес\" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
      9,
    ".menu .container"
  ).render();

  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    "Меню “Премиум”",
    "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
      23,
    ".menu .container"
  ).render();

  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    "Меню \"Постное\"",
    "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
      15,
    ".menu .container"
  ).render();
});