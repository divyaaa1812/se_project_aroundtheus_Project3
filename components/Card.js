const previewImagePopup = document.querySelector("#preview-image-modal");

const openModal = (modal) => {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalByEscape);
  modal.addEventListener("mousedown", closeModalByClick);
};

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalByEscape);
  modal.removeEventListener("mousedown", closeModalByClick);
}

function closeModalByEscape(evt) {
  if (evt.key === "Escape") {
    // search for an opened modal
    const openedModal = document.querySelector(".modal_opened");
    // close it
    closeModal(openedModal);
  }
}

function closeModalByClick(evt) {
  if (
    evt.target === evt.currentTarget ||
    evt.target.classList.contains("modal__close-button")
  ) {
    closeModal(evt.currentTarget); // currentTarget is the modal
  }
}

export default class Card {
  constructor({ name, link }, cardSelector) {
    this._name = name;
    this._link = link;
    this._cardSelector = cardSelector;
  }

  _handleFavIcon() {
    this._favIconElement.classList.toggle("card__fav-icon-selected");
  }

  _handleDelButton() {
    this._cardTemplate.remove();
    this._cardTemplate = null;
  }

  // _openPreviewImage() {
  //   openModal(previewImagePopup);
  //   previewImagePopup
  //     .querySelector("#imagePreview")
  //     .setAttribute("src", this._link);
  //   previewImagePopup
  //     .querySelector("#imagePreview")
  //     .setAttribute("alt", `Photo of ${this._name}`);
  // }

  _setEventListeners() {
    this._favIconElement.addEventListener("click", this._handleFavIcon());
    this._deleteCardButton.addEventListener("click", this._handleDelButton());
    // this._cardImage.addEventListener("click", this._openPreviewImage());
  }

  getCardElement() {
    this._cardTemplate = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    this._deleteCardButton =
      this._cardTemplate.querySelector(".card__del-button");
    this._favIconElement = this._cardTemplate.querySelector(".card__fav-icon");
    this._cardImage = this._cardTemplate.querySelector(".card__image");
    this._cardImage.setAttribute("src", this._link);
    this._cardTemplate.querySelector(".card__title").textContent = this._name;
    this._cardTemplate
      .querySelector(".card__title")
      .setAttribute("alt", `Image of ${this._name}`);
    //call eventlisteners
    this._setEventListeners();
  }
}
