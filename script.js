const DOM = {
  search : document.getElementById("search"),
  closeForm : document.querySelector(".close"),
  form : document.getElementById("searchForm"),
  range: document.getElementById("resultRange"),
  rangeDisplay : document.getElementById("rangeDisplay"),
  dogs: document.getElementById("dogs"),  
  breeds: document.getElementById("breeds"),
  NEW : function(){
    return {
      img: document.createElement("img"),
      input: document.createElement("input"),
      label: document.createElement("label")
    }    
  },
}

const parseDogBreed = dog => {
  // extracts dog breed from URL
  dog = /\/breeds\/(.*?)\//gm.exec(dog) 
  return dog[1] ? dog[1].replace("-", " ") : "random dog"
}

const appendToDOM = dog => {
  const { img } = DOM.NEW()
  const { dogs } = DOM  
  
  // creates img element
  img.src = dog
  img.alt = parseDogBreed(dog)

  // write to DOM
  dogs.append(img)
}

const appendOptionsToDOM = (breed) => {
  const { input, label } = DOM.NEW();
  const { breeds } = DOM;

  // create checkbox input
  input.type = "checkbox"
  input.className = "checkbox"
  input.value = breed;
  input.key = breed;
  
  // create label and append checkbox INSIDE label
  label.innerText = breed.charAt(0).toUpperCase() + breed.slice(1);
  label.className = "breedsLabel"
  label.append(input);    

  // append breed to list of breeds on DOM
  breeds.append(label);
};

const noDuplicates = (n, list) => {
  // prevents duplicates 
  const copy = Array.from(list);
  return Array.from(Array(n), () => copy.splice(Math.floor(copy.length * Math.random()), 1)[0]);
};


const handleSearch = async (queue, qty) => { 
  const urls = []  
  queue.map((i) => urls.push(`https://dog.ceo/api/breed/${i.toLowerCase()}/images/random/${qty}`));
  
  Promise.all(urls.map(url =>
    fetch(url).then(data => data.json())
  )).then(data => {
    const { dogs } = DOM;

    // clear previous pictures on DOM
    dogs.innerHTML = "";
    
    let array = [], images = []        
    // dynamically concat and flatten 2 or more arrays 
    for (let i = 0; i < data.length; i++) array.push(data[i].message)    
    array = array.flat()    
    
    // extract non-duplicate random index from array. 
    for (let j = 0; j < qty; j++) images.push(noDuplicates(qty, array))
    
    // write to DOM
    for (let k = 0; k < qty; k++) appendToDOM(images[k][0])  
  })

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
      breeds: await breeds.json(),      
    }
  })  
  .then(({images, breeds}) => {    
    images.message.map(dog => appendToDOM(dog))
    Object.keys(breeds.message).map(dog => appendOptionsToDOM(dog))    
  })
})();

// global event listeners
(() => {
  const { search, form, closeForm, range, rangeDisplay } = DOM;

  search.onclick = () => form.className = " ";
  closeForm.onclick = () => form.className = "hidden";
  range.onchange = () => rangeDisplay.innerText = range.value;
  form.onsubmit = e => {
    e.preventDefault();  
    const queue = Array.from(document.querySelectorAll('.checkbox:checked'))
      .map(i => i.value)    
    
    handleSearch(queue, range.value) 
  }
})();