const parseDogBreed = (dog) => {
  dog = /\/breeds\/(.*?)\//gm.exec(dog) 
  return dog[1] ? dog[1].replace("-", " ") : "random dog"
}

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const clearDom = () => document.getElementById("dogs").innerHTML = ""

const appendToDOM = dog => {
  const img = document.createElement("img");

  img.src = dog
  img.alt = parseDogBreed(dog)

  document.getElementById("dogs").append(img)
}

const appendOptionsToDOM = breed => {
  const option = document.createElement("option");
  option.innerText = capitalize(breed);
  option.key = breed;
  
  document.getElementById("selectBreed").append(option)
}

// on page load
// fill page with random dogs
(() => {
  Promise.all([
    fetch('https://dog.ceo/api/breeds/image/random/10'), 
    fetch('https://dog.ceo/api/breeds/list/all')
  ])  
  .then(async([images, breeds]) =>  {
    return {
      images: await images.json(),
      breeds: await breeds.json()      
    }
  })  
  .then(({images, breeds}) => {
    images.message.map(dog => appendToDOM(dog))
    Object.keys(breeds.message).map(breed => appendOptionsToDOM(breed))
  })
})();

document.getElementById("search").addEventListener("click", () => {  
  document.getElementById("searchForm").setAttribute("class", "display")
})

document.querySelector(".close").addEventListener("click", () => {  
  document.getElementById("searchForm").setAttribute("class", "hidden")
})

document.querySelector(".close").addEventListener("click", () => {  
  document.getElementById("searchForm").setAttribute("class", "hidden")
})

document.getElementById("qtyOfResults").addEventListener("change", () => {
  const value = document.getElementById("qtyOfResults").value;
  document.getElementById("count").innerText = value;
})

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const value = document.getElementById("qtyOfResults").value;
  const breed = document.getElementById("selectBreed").value;
  fetch(`https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random/${value}`)
    .then(res => res.json())
    .then(res => {
      clearDom();
      res.message.map(dog => appendToDOM(dog))
      document.getElementById("current").innerText = breed;
    });
})

const date = new Date();
const year = date.getFullYear();
document.getElementById("date").innerText = year;