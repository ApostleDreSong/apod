export function saveToLocalStorage (response){
  localStorage.setItem("photoOfTheDay", JSON.stringify(response));
  return 'saved';
};
