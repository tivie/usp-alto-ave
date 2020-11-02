function addLoadingStatus(ev) {
  ev.currentTarget.disabled = true;
  ev.currentTarget.children[0].classList.remove("d-none");
}
