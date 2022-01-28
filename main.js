'use strict';

let api_key = 'ff5b777d-752c-472d-8e32-50c047b11312';
let mainUrl = new URL('http://exam-2022-1-api.std-900.ist.mospolytech.ru');

let flag = true;

let db;
let filteredDb;

let setArr;

let subTotal;

async function getListCafe() {
    let url = new URL('/api/restaurants', mainUrl);
    url.searchParams.set('api_key', api_key);

    let response = await fetch(url);

    let json = await response.json();

    if (json.error) {
        showAlert(json.error);
    }
    else {
        return json;
    }

}


function loader(json) {
    db = sortByRating(json);
    filteredDb = db;
    renderCafeElement(db, 1);
    getFilterElement(db);
    pagination();

}
function sortByRating(json) {
    db = json.sort(function (elem1, elem2) {
        return elem2.rate - elem1.rate;
    })
    return db;
}

function renderCafeElement(cafeList, page = 1) {

    let tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';


    for (let i = page * 20 - 20; i < page * 20; i++) {

        if (cafeList.length <= i) continue;
        let newCafeElement = document.getElementById('row-template').cloneNode(true);
        newCafeElement.querySelector('.cafe-name').innerHTML = cafeList[i].name;
        newCafeElement.querySelector('.cafe-type').innerHTML = cafeList[i].typeObject;
        newCafeElement.querySelector('.cafe-address').innerHTML = cafeList[i].address;
        newCafeElement.classList.remove('d-none');
        newCafeElement.id = cafeList[i].id;
        let btn = newCafeElement.querySelector('#btn-choice');
        btn.onclick = choiceBtnHandler;
        btn.href = '#menu';

        tableBody.append(newCafeElement);

    }
}

function getFilterElement(db) {

    let admAreaList = new Set();
    let districtList = new Set();
    let typeObjectList = new Set();
    let socialPrivilegesList = new Set();

    for (let elem of db) {
        admAreaList.add(elem.admArea);
        districtList.add(elem.district);
        typeObjectList.add(elem.typeObject);
        socialPrivilegesList.add(elem.socialPrivileges);
    }

    renderFilterElement(admAreaList, '#admArea');
    renderFilterElement(districtList, '#district');
    renderFilterElement(typeObjectList, '#type');
    renderFilterElement(socialPrivilegesList, '#social');

}

function renderFilterElement(list, type) {
    let folder = document.querySelector(type);
    for (let unit of list) {
        if (unit == '') continue;
        let newOption = document.createElement('option');
        newOption.innerHTML = unit;
        folder.append(newOption);
    }
}

async function getMenuList() {
    let url = new URL('http://webdev-exam-2022-1.std-1678.ist.mospolytech.ru/menu.json');
    let response = await fetch(url);
    let json = await response.json();

    if (json.error) {
        showAlert(json.error);
    }
    else {
        return json;
    }
}

function renderMenu(json) {

    setArr = json;
    let container = document.querySelector('.menu-container');

    for (let unit of json) {
        let newMenuElement = document.querySelector('.menu-unit').cloneNode(true);

        newMenuElement.querySelector('.card-text').innerHTML = unit.name;

        newMenuElement.querySelector(`.${unit.type}`).classList.remove('d-none');
        newMenuElement.querySelector(`.${unit.type}`).src = unit.src;


        newMenuElement.querySelector('strong').id = unit.id;
        newMenuElement.classList.remove('d-none');
        newMenuElement.querySelector('.plus').onclick = plusBtnHandler;
        newMenuElement.querySelector('.minus').onclick = minusBtnHandler;
        // for (let btn of newTaskElement.querySelectorAll('.btn-count')) {
        //     btn.onclick = counterBtnHandler;
        // }
        container.append(newMenuElement);
    }
}

function pagination() {
    document.querySelector("#last-pagination").dataset.page = Math.ceil(filteredDb.length / 20);
    let buttons = document.querySelectorAll(".page-link");

    for (let i = 1; i <= 3; i++) {
        if (buttons[i].classList.contains('d-none')) {
            buttons[i].classList.remove('d-none');
        }
        buttons[i].innerHTML = i;
        buttons[i].dataset.page = i;
        if (i > Math.ceil(filteredDb.length / 20)) {
            buttons[i].classList.add('d-none');
        }
    }


}
function pageBtnHandler(event) {
    if (filteredDb.length == 0) return;

    let page = event.target.dataset.page

    if (page) {
        renderCafeElement(filteredDb, page);
    }
    let buttons = document.querySelectorAll(".page-link");

    let maxPage = Math.ceil(filteredDb.length / 20)


    buttons[4].dataset.page = maxPage;
    if (buttons[1].classList.contains('d-none')) {
        buttons[1].classList.remove('d-none')
    }
    if (page == 1) {
        for (let i = 1; i <= 3; i++) {
            buttons[i].innerHTML = i;
            buttons[i].dataset.page = i;

        }
    }
    else if (page == maxPage) {
        if (page - 2 > 0) {
            buttons[1].innerHTML = page - 2;
            buttons[1].dataset.page = page - 2;
        }
        else {
            buttons[1].classList.add('d-none');
        }

        buttons[2].innerHTML = page - 1;
        buttons[2].dataset.page = page - 1;
        buttons[3].innerHTML = page;
        buttons[3].dataset.page = page;
    }
    else {
        buttons[1].innerHTML = page - 1;
        buttons[1].dataset.page = page - 1;
        buttons[2].innerHTML = page;
        buttons[2].dataset.page = page;
        buttons[3].innerHTML = page - (-1);
        buttons[3].dataset.page = page - (-1);
    }
}

function findBtnHandler(event) {
    filteredDb = []
    let form = event.target.closest('form');

    for (let i of db) {
        if (i.socialPrivileges) {
            console.log(i.socialPrivileges, 'bool');
            console.log(form.elements['social'].value, 'bool');
            console.log(i);
        }

        if ((form.elements['admArea'].value == 'Не задано' ||
            form.elements['admArea'].value == i.admArea) &&
            (form.elements['district'].value == 'Не задано' ||
                form.elements['district'].value == i.district) &&
            (form.elements['type'].value == 'Не задано' ||
                form.elements['type'].value == i.typeObject)) {
            if (form.elements['social'].value == 'Не задано') {
                filteredDb.push(i);
            }
            if (form.elements['social'].value == 'true') {
                if (i.socialPrivileges == true) {
                    filteredDb.push(i);
                }


            }

        }
    }
    console.log(filteredDb, 'social');
    pagination();
    renderCafeElement(filteredDb, 1);

}

function getCafeById(id) {
    return db.filter(
        function (db) {
            return db.id == id;
        }
    );
}

function choiceBtnHandler(event) {
    let id = event.target.closest('tr').id;


    let cafe = getCafeById(id);
    document.querySelector(`#set_1`).innerHTML = cafe[0].set_1;
    document.querySelector(`#set_2`).innerHTML = cafe[0].set_2;
    document.querySelector(`#set_3`).innerHTML = cafe[0].set_3;
    document.querySelector(`#set_4`).innerHTML = cafe[0].set_4;
    document.querySelector(`#set_5`).innerHTML = cafe[0].set_5;
    document.querySelector(`#set_6`).innerHTML = cafe[0].set_6;
    document.querySelector(`#set_7`).innerHTML = cafe[0].set_7;
    document.querySelector(`#set_8`).innerHTML = cafe[0].set_8;
    document.querySelector(`#set_9`).innerHTML = cafe[0].set_9;
    document.querySelector(`#set_10`).innerHTML = cafe[0].set_10;

    document.querySelector('#modal-name').innerHTML = cafe[0].name;
    document.querySelector('#modal-address').innerHTML = cafe[0].address;
    document.querySelector('#modal-admArea').innerHTML = cafe[0].admArea;
    document.querySelector('#modal-district').innerHTML = cafe[0].district;
    document.querySelector('#modal-rating').innerHTML = cafe[0].rate;

    document.getElementById('menu').classList.remove('d-none');
    document.getElementById('options').classList.remove('d-none');
    document.getElementById('main-total').classList.remove('d-none');


}

function getSetById(setId) {
    return setArr.filter(
        function (setArr) {
            return setArr.id == setId;
        }
    );
}

function plusBtnHandler(event) {
    let counter = event.target.closest('.counters').querySelector('.counter');
    counter.value = Number(counter.value) + 1;

    let setId = event.target.closest('.card-bottom').querySelector('strong').id;
    let set = getSetById(setId);

    let arr = document.querySelectorAll(`#modal-${set[0].id}`);

    if (arr.length == 0) {
        let orderContainer = document.querySelector('.order-container');
        let newModalSet = document.querySelector('.modal-set-template').cloneNode(true);
        newModalSet.classList.remove('d-none');
        newModalSet.querySelector('.modal-card-body').id = `modal-${set[0].id}`;
        newModalSet.querySelector('.modal-set-name').innerHTML = set[0].name;
        newModalSet.querySelector(`.${set[0].type}`).classList.remove('d-none');
        newModalSet.querySelector('.set-price').innerHTML = document.querySelector(`#${set[0].id}`).innerHTML;
        newModalSet.querySelector('.set-number').innerHTML = counter.value;
        newModalSet.querySelector('.sub-total').innerHTML = counter.value * document.querySelector(`#${set[0].id}`).innerHTML;
        orderContainer.append(newModalSet);
    }
    else {

        document.querySelector(`#modal-${set[0].id}`).querySelector('.set-number').innerHTML = counter.value;
        document.querySelector(`#modal-${set[0].id}`).querySelector('.sub-total').innerHTML
            = counter.value * document.querySelector(`#${set[0].id}`).innerHTML;

    }

    let sumArr = document.querySelectorAll('.sub-total');
    let totalMain = 0;
    for (let i of sumArr) {
        totalMain += Number(i.innerHTML);
    }

    document.getElementById('main-total').querySelector('span').innerHTML = totalMain;
}

function minusBtnHandler(event) {
    let counter = event.target.closest('.counters').querySelector('.counter');
    let setId = event.target.closest('.card-bottom').querySelector('strong').id;
    let set = getSetById(setId);
    counter.value = counter.value - 1;
    if (counter.value <= 0) {
        counter.value = 0;
        document.querySelector(`#modal-${set[0].id}`).closest('.card').remove();

    }
    else {
        document.querySelector(`#modal-${set[0].id}`).querySelector('.set-number').innerHTML = counter.value;
        document.querySelector(`#modal-${set[0].id}`).querySelector('.sub-total').innerHTML
            = counter.value * document.querySelector(`#${set[0].id}`).innerHTML;
    }

    let sumArr = document.querySelectorAll('.sub-total');
    let totalMain = 0;
    for (let i of sumArr) {
        totalMain
            += Number(i.innerHTML);
    }

    document.getElementById('main-total').querySelector('span').innerHTML = totalMain;

}


function doubling(event) {
    let double = document.getElementById('x2');

    if (double.checked == true) {
        if (double.classList.contains('pass') == false) {
            console.log('doubling');
            double.setAttribute('checked', 'cheked');
            document.getElementById('plug').classList.add('d-none');
            let flag = false;
            let setArr = document.querySelectorAll('.modal-card-body');
            for (let i of setArr) {
                i.querySelector('.set-number').innerHTML = Number(i.querySelector('.set-number').innerHTML) * 2;
                i.querySelector('.sub-total').innerHTML
                    = Number(i.querySelector('.set-number').innerHTML)
                    * Number(i.querySelector('.set-price').innerHTML);

            }
            document.getElementById('modal-x2').closest('li').classList.remove('d-none');

            let sumArr = document.querySelectorAll('.sub-total');
            let totalMain = 0;
            for (let i of sumArr) {
                totalMain += Number(i.innerHTML);
            }

            document.getElementById('modal-total').innerHTML = ((totalMain / 2 * 1.6) + 300).toFixed(2);
            document.getElementById('main-total').querySelector('span').innerHTML = ((totalMain / 2 * 1.6) + 300).toFixed(2);

            document.getElementById('x2').classList.add('pass');

            return flag;
        }
        else {
            let sumArr = document.querySelectorAll('.sub-total');
            let totalMain = 0;
            for (let i of sumArr) {
                totalMain += Number(i.innerHTML);
            }

            document.getElementById('modal-total').innerHTML = ((totalMain / 2 * 1.6) + 300).toFixed(2);
            document.getElementById('main-total').querySelector('span').innerHTML = ((totalMain / 2 * 1.6) + 300).toFixed(2);
        }

    }
    else {
        let sumArr = document.querySelectorAll('.sub-total');
        let totalMain = 0;
        for (let i of sumArr) {
            totalMain += Number(i.innerHTML);
        }

        document.getElementById('modal-total').innerHTML = totalMain + 300;
        document.getElementById('main-total').querySelector('span').innerHTML = totalMain + 300;
        return flag;
    }

}

function cold() {
    let cold = document.getElementById('cold');
    if (cold.checked == true) {
        if (document.getElementById('plug').classList.contains('d-none') != true) {
            document.getElementById('plug').classList.add('d-none');
        }
        document.getElementById('modal-cold').closest('li').classList.remove('d-none');
        if (document.getElementById('modal-total').innerHTML == '...') {
            let sumArr = document.querySelectorAll('.sub-total');
            let totalMain = 0;
            for (let i of sumArr) {
                totalMain += Number(i.innerHTML);
            }

            document.getElementById('modal-total').innerHTML = totalMain + 300;
            document.getElementById('main-total').querySelector('span').innerHTML = totalMain + 300;
        }

        document.getElementById('modal-cold').innerHTML
            = (Number(document.getElementById('modal-total').innerHTML) * 0.7).toFixed(2);
    }
}

function orderBtnHandler(event) {
    cold();
}

function showAlert(msg, category = 'alert-danger') {
    let alertsContainer = document.querySelector('.alerts');
    let newAlertElement = document.getElementById('alerts-template').cloneNode(true);
    if (msg == undefined) {
        return;
    }
    newAlertElement.querySelector('.msg').innerHTML = msg;
    newAlertElement.classList.add(category);
    newAlertElement.classList.add('sticky-top');
    newAlertElement.classList.remove('d-none');
    alertsContainer.append(newAlertElement);
}

function acceptBtnHandler(event) {

    if (document.querySelectorAll('.modal-card-body').length == 1) {
        showAlert('Выберите блюда!', 'alert-danger');
    }
    else if (document.querySelector('#modal-name').innerHTML == '') {
        showAlert('Выберите предприятие общественного питания', 'alert-danger');
    }
    else {
        showAlert('Заказ оформлен', 'alert-success')
    }

}

window.onload = function () {
    getListCafe()
        .then(loader)
        .catch(showAlert)


    getMenuList()
        .then(renderMenu)
        .catch(showAlert)

    document.querySelector('.pagination').onclick = pageBtnHandler;
    document.querySelector('#btn-find').onclick = findBtnHandler;
    document.querySelector('#btn-choice').onclick = choiceBtnHandler;
    document.querySelector('#x2').onclick = doubling;
    // document.querySelector('#cold').onclick = coldHandler;
    document.querySelector('#order').onclick = orderBtnHandler;
    // document.querySelector('.plus').onclick = plusBtnHandler;
    // document.querySelector('.minus').onclick = minusBtnHandler;
    document.getElementById('accept-btn').onclick = acceptBtnHandler;
}