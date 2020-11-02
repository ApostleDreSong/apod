export function saveToLocalStorage (response){
  window.localStorage.setItem("photoOfTheDay", JSON.stringify(response));
  return 'saved';
};
