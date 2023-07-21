import Api from "../components/Api.js";
import PopupWithForm from "./PopupWithForm.js";
const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/cohort-3-en",
  headers: {
    authorization: "b685d3e0-616a-4dae-bc5b-53892a4f7953",
    "Content-Type": "application/json",
  },
});
const deleteCardYesButton = document.querySelector("#delete-confirm-button");

export default class Card {
  constructor(cardData, cardSelector, handleCardClick) {
    this._cardData = cardData;
    this._id = cardData._id;
    this._name = cardData.name;
    this._link = cardData.link;
    this._owner = cardData.owner._id;
    this._cardId = cardData._id;
    this._likes = cardData.likes;
    this._cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
  }

  _handleFavIconClick = () => {
    //variable to register if current user liked the image or not
    const currentUserLike = this._likes.find((user) => {
      return user._id === "f50447686616d1fa985ca0e1";
    });
    const didCurrentUserLikeThisCard = currentUserLike ? true : false;
    if (didCurrentUserLikeThisCard) {
      // 1. remove current user from this._likes array
      // 2. Make a call to network to remove the users like for this card
      api.unLikeACard(this._cardId).then((data) => {
        this._favCountElement.textContent = data.likes.length;
        this._favIconElement.classList.remove("card__fav-icon-selected");
      });
    } else {
      // 1. Make a call to network to add the users like for this card
      api.likeACard(this._cardId).then((data) => {
        this._favCountElement.textContent = data.likes.length;
        // 2. Update te state of the like button
        this._favIconElement.classList.toggle("card__fav-icon-selected");
      });
    }
  };

  _handleCardDeleteButton = () => {
    const deleteCardPopup = new PopupWithForm(
      "#delete-image-confirm-modal",
      this._handleDeleteCardFormSubmit
    );
    deleteCardPopup.openModal();
    deleteCardYesButton.addEventListener(
      "click",
      this._handleDeleteCardFormSubmit
    );
  };

  _handleDeleteCardFormSubmit = () => {
    const deleteCardPopup = new PopupWithForm(
      "#delete-image-confirm-modal",
      this._handleDeleteCardFormSubmit
    );
    deleteCardPopup.closeModal();
    deleteCardYesButton.removeEventListener(
      "click",
      this._handleDeleteCardFormSubmit
    );
    api.deleteCard(this._cardId).then(() => {
      window.alert("Hurray!! Delete Successful");
    });
    this._cardElement.remove();
  };

  _onCardClick = (ev) => {
    this._handleCardClick(this._cardData);
  };

  _setEventListeners() {
    this._favIconElement.addEventListener("click", this._handleFavIconClick);
    this._cardElement
      .querySelector(".card__image")
      .addEventListener("click", this._onCardClick);
  }

  getCardElement() {
    this._cardTemplate = document.querySelector(this._cardSelector);
    this._cardElement = this._cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);
    this._favCountElement = this._cardElement.querySelector(".card__fav_count");
    this._favCountElement.textContent = this._likes.length;
    if (this._owner === "f50447686616d1fa985ca0e1") {
      this._deleteCardIcon =
        this._cardElement.querySelector(".card__del-button");
      this._deleteCardIcon.addEventListener(
        "click",
        this._handleCardDeleteButton
      );
    } else {
      this._cardElement
        .querySelector(".card__del-button")
        .classList.add("card__del-button-hidden");
    }
    this._favIconElement = this._cardElement.querySelector(".card__fav-icon");
    if (this._likes.length > 0) {
      this._favIconElement.classList.add("card__fav-icon-selected");
    } else {
      this._favIconElement.classList.add("card__fav-icon");
    }
    this._addNewCardTitle = this._cardElement.querySelector(".card__title");
    this._addNewCardLink = this._cardElement.querySelector(".card__image");
    this._addNewCardTitle.textContent = this._name;
    this._addNewCardLink.setAttribute("src", `${this._link}`);
    this._addNewCardLink.setAttribute("alt", `Image of ${this._name}`);
    //call eventlistener
    this._setEventListeners();
    //return the card element that is created
    return this._cardElement;
  }
}
