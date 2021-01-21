const KEY = '75053010-f960-43fc-ac2f-cae5b04d5b12'

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
  const option = document.createElement("input");
  const label = document.createElement("label");
  const dogBreeds = document.getElementById("dogBreeds");

  option.type = "checkbox"
  option.value = breed;
  option.key = breed;
  
  label.innerText = breed.charAt(0).toUpperCase() + breed.slice(1);
  label.className = "dogBreedsLabel"
  label.append(option);

  document.getElementById("dogBreeds").append(label)
}

// on page load
// fill page with random dogs
(() => {
  Promise.all([
    fetch('https://dog.ceo/api/breeds/image/random/10'), 
    fetch('https://dog.ceo/api/breeds/list/all'),
    fetch('https://api.thecatapi.com/v1/breeds', {
      method: "GET",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        "x-api-key": "75053010-f960-43fc-ac2f-cae5b04d5b12"
      }
    })
  ])  
  .then(async([images, dogBreeds, catBreeds]) =>  {
    return {
      images: await images.json(),
      dogBreeds: await dogBreeds.json(),
      catBreeds: await catBreeds.json()      
    }
  })  
  .then(({images, dogBreeds, catBreeds}) => {
    images.message.map(dog => appendToDOM(dog))
    Object.keys(dogBreeds.message).map(dogBreed => appendOptionsToDOM(dogBreed))
    console.log(catBreeds)
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
  const breeds = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
    .map(item => item.value)
    .join(',');

  console.log(breeds)
  // fetch(`https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random/${value}`)
  //   .then(res => res.json())
  //   .then(res => {
  //     clearDom();
  //     res.message.map(dog => appendToDOM(dog))
  //     document.getElementById("current").innerText = breed;
  //   });
})

const date = new Date();
const year = date.getFullYear();
document.getElementById("date").innerText = year;