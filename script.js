const OPTIONS = {
  method: "GET",
  headers: {
    "Content-type": "application/json;charset=UTF-8",
    "x-api-key": "75053010-f960-43fc-ac2f-cae5b04d5b12"
  }
}

const DOM = {
  search : document.getElementById("search"),
  closeForm : document.querySelector(".close"),
  form : document.getElementById("searchForm"),
  range: document.getElementById("resultRange"),
  rangeDisplay : document.getElementById("rangeDisplay"),
  dogs: document.getElementById("dogs"),
  dogBreeds: document.getElementById("dogBreeds"),
  NEW : function(){
    return {
      img: document.createElement("img"),
      input: document.createElement("input"),
      label : document.createElement("label")
    }    
  },
}

const parseDogBreed = (dog) => {
  dog = /\/breeds\/(.*?)\//gm.exec(dog) 
  return dog[1] ? dog[1].replace("-", " ") : "random dog"
}

const appendToDOM = dog => {
  const { img } = DOM.NEW()
  const { dogs } = DOM  

  img.src = dog
  img.alt = parseDogBreed(dog)

  dogs.append(img)
}

const appendOptionsToDOM = breed => {
  const { input, label } = DOM.NEW();
  const { dogBreeds } = DOM;

  input.type = "checkbox"
  input.value = breed;
  input.key = breed;
  
  label.innerText = breed.charAt(0).toUpperCase() + breed.slice(1);
  label.className = "dogBreedsLabel"
  label.append(input);

  dogBreeds.append(label)
}


// on page load
// fill page with random dogs
(() => {
  Promise.all([
    fetch('https://dog.ceo/api/breeds/image/random/10'), 
    fetch('https://dog.ceo/api/breeds/list/all'),
    fetch('https://api.thecatapi.com/v1/breeds', OPTIONS)
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

const filterSearch = async (queue, qty) => {
  console.log(queue, qty)
  
}

const handleSearch = (queue, qty) => { 
  const fetchQueue = filterSearch(queue, qty) 

  Promise.all(queue.map(u=>fetch(`https://dog.ceo/api/breed/${u.toLowerCase()}/images/random/3`)))
    .then(responses =>
        Promise.all(responses.map(res => res.json()))
    ).then(images => {
      console.log(images)
    })
}



DOM.search.onclick = () => DOM.form.className = " ";
DOM.closeForm.onclick = () => DOM.form.className = "hidden";
DOM.range.onchange = () => DOM.rangeDisplay.innerText = DOM.range.value;
DOM.form.onsubmit = e => {
  e.preventDefault();  
  const queue = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
    .map(i => i.value)    
    
  handleSearch(queue, DOM.range.value);
}

// document.getElementById("searchForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   const value = document.getElementById("resultRange").value;
//   const breeds = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
//     .map(item => item.value)
//     .join(',');

//   console.log(breeds)
//   // fetch(`https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random/${value}`)
//   //   .then(res => res.json())
//   //   .then(res => {
//   //     DOM.dogs.innerHTML = ""
//   //     res.message.map(dog => appendToDOM(dog))
//   //     document.getElementById("current").innerText = breed;
//   //   });
// })
