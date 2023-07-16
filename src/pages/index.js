import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Api from "../components/Api.js";
import "../pages/index.css";

// const cardData = [
//   {
//     name: "Yosemite Valley",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
//   },
//   {
//     name: "Lake Louise",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
//   },
//   {
//     name: "Bald Mountains",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
//   },
//   {
//     name: "Latemar",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
//   },
//   {
//     name: "Vanoise National Park",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
//   },
//   {
//     name: "Lago di Braies",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
//   },
// ];

export const settings = {
  inputElementSelector: ".modal__text-input",
  submitButtonSelector: ".modal__button",
  inactiveButtonSelector: "modal__button_disabled",
  inputErrorSelector: "modal__input-error_visible",
  errorSelectorHide: "modal__input-error-hide",
  errorSelector: "modal__input-error",
};

const editProfileModalFormElement = document.querySelector("#edit-profile");
const addNewCardModalFormElement = document.querySelector("#add-new-card");

/*Declare Elements */
const editProfileButton = document.querySelector(".js-profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const cardsList = document.querySelector(".cards__list");
//Extract title and subtitle elements
const profileTitle = document.querySelector(".profile__title");
const profileSubtitle = document.querySelector(".profile__subtitle");
const profileAvatar = document.querySelector(".profile__image");
//Extract input fields from edit profile modal
const profileTitleInputField = document.querySelector("#profile-title-input");
const profileSubtitleInputField = document.querySelector(
  "#profile-subtitle-input"
);

const newCardPopup = new PopupWithForm(
  "#add-new-card",
  handleAddNewCardFormSubmit
);
const addProfilePopup = new PopupWithForm(
  "#edit-profile",
  handleProfileFormSubmit
);
const userInfo = new UserInfo({
  name: profileTitle,
  subtitle: profileSubtitle,
});
const cardImagePopup = new PopupWithImage(
  "#preview-image-modal",
  ".modal-preview-image"
);
//instantiate FormValidator class
const addNewCardFormValidator = new FormValidator(
  settings,
  addNewCardModalFormElement
);
const editProfileFormValidator = new FormValidator(
  settings,
  editProfileModalFormElement
);
const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/cohort-3-en",
  headers: {
    authorization: "b685d3e0-616a-4dae-bc5b-53892a4f7953",
    "Content-Type": "application/json",
  },
});
function createCard(item) {
  // create instance of Card class
  const card = new Card(item, "#card-template", onCardClick);
  //create a card by calling getCardElement method from Card class
  const cardElement = card.getCardElement();
  //return the card
  return cardElement;
}
//render initial items from server
// Promise.all([api.getUserInfo(), api.getInitialCards()])
//   .then(([userInfo, initialCard]) => {
//     console.log(userInfo);
//     console.log(initialCard);

//     // process the result
//     initialCard.forEach((item) => {
//       const cardItem = createCard(item);
//       section.appendItem(cardItem);
//     });
//   })
//   .catch((err) => console.log(err));

api
  .renderData()
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  })
  .catch((err) => {
    console.error(err); // log the error to the console
  });

api.getUserInfo().then((data) => {
  const name = data.name;
  const subtitle = data.subtitle;
  userInfo.setUserInfo({ name, subtitle });
});

api
  .getInitialCards()
  .then((data) => {
    // process the result
    data.forEach((item) => {
      const cardItem = createCard(item);
      section.appendItem(cardItem);
    });
  })
  .catch((err) => {
    console.error(err); // log the error to the console
  });

const section = new Section(
  { items: api.getInitialCards, renderer: createCard },
  cardsList
);

function handleOpenEditProfileForm() {
  editProfileFormValidator.disableButton();
  api.getUserInfo().then((result) => {
    // process the result
    profileTitleInputField.value = result.name;
    profileSubtitleInputField.value = result.subtitle;
  });
  addProfilePopup.openModal();
}

function handleAddNewCardButton() {
  addNewCardFormValidator.disableButton();
  newCardPopup.openModal();
}

function handleProfileFormSubmit(inputValues) {
  // userInfo.setUserInfo(inputValues);
  api.editUserInfo(inputValues);
  userInfo.setUserInfo(inputValues);
  addProfilePopup.closeModal();
}

function handleAddNewCardFormSubmit(inputValues) {
  //create a new card with input values from user
  const card = createCard(inputValues);
  //Attach new card to begining of container
  section.prependItem(card);
  //close popup after submit
  newCardPopup.closeModal();
}

function onCardClick(card) {
  cardImagePopup.openModal(card);
}

/* Event Listeners */
editProfileButton.addEventListener("click", handleOpenEditProfileForm);
addNewCardButton.addEventListener("click", handleAddNewCardButton);

//start form validations
editProfileFormValidator.enableValidation();
addNewCardFormValidator.enableValidation();
