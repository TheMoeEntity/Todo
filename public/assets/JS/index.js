const form = document.querySelector("#form")
const toggleBtns = document.querySelectorAll(".toggle")
const switchBtn = document.querySelector("#switchBtn")
const itemCount = document.querySelector("#itemCount")
const header = document.getElementsByTagName("header")[0]
const todoInput = document.getElementById("todoinput")
const toggleBtn = document.querySelector("#toggleWrapper")
let toggleContainer = document.querySelector("#toggle-buttons")
let attribution = document.querySelector("#attribution")
form.children[1].focus()
let allItems = []
let checkedItems = []
let unCheckedItems = []
let isLightMode = false
const todoAll = document.querySelector("#todo-all")
const mainContent = document.querySelector("#main-content")
let topoffset = 90
let marginoffset = 0
let currItems = 0
let isdeleted = false
let isCleared = false
let didgetAll = true
let didgetActive = false
let didgetCompleted = false

let activeBtns = document.querySelectorAll(".active")
window.addEventListener("DOMContentLoaded",()=> {
    Sortable.create(todoAll)

    let lightmode = localStorage.getItem("lightmode")
    if (lightmode == "light") {
        localStorage.setItem("lightmode","light")
        toggleDarkMode(switchBtn)
    } 
})

const addTodoItem = text => {
    let listItem = document.createElement("li")
    listItem.setAttribute("draggable",true)
    listItem.classList.add("todo-item")
    listItem.innerHTML = `
        <div class="circle" onclick="markComplete(this)"></div>
        <input type="text" readonly value="${text}">
        <div><img onclick="deleteItem(this.parentNode.parentNode)" src="assets/images/icon-cross.svg" alt=""></div>
    `
    listItem.setAttribute("data-listChecked",'false')
    listItem.children[0].setAttribute("data-isChecked",'false')
    listItem.children[1].classList.add("inputtag")
    listItem.children[1].style.color = isLightMode ? "rgba(0,0,0,0.7)":"#fff" 
    todoAll.prepend(listItem)
    allItems.push(listItem)
   
    listItem.addEventListener("transitionend", ()=> {
        if (isdeleted) {
            todoAll.removeChild(listItem)
            adjustToggleOffset(false)
            isdeleted = isCleared ? true:false
        }
        
    })

}

const adjustToggleOffset = add => {
    let clientheight = allItems[0].clientHeight ?? 60
    currItems = add ? currItems + 1 : currItems - 1
    itemCount.textContent = currItems
    topoffset = add ? topoffset + 60 : topoffset - 60
    marginoffset = add ? marginoffset + 55 : marginoffset - 55
    toggleContainer.style.top = `${topoffset}px`
    // console.log(clientheight)
    // attribution.style.marginTop = `${marginoffset}px`
    // attribution.style.top = `80vh`
    
}

form.addEventListener("submit",e=> {
    let textValue = e.target.children[1].value
    if (textValue.trim() === "") {return}
    e.preventDefault()
    addTodoItem(textValue)
    e.target.children[1].value = ""
    adjustToggleOffset(true)
    
})

const toggleDarkMode = elem => {

    isLightMode = !isLightMode
    localStorage.setItem("lightmode",isLightMode ? "light":null)
    elem.style.background = isLightMode ?
     "url('/assets/images/icon-moon.svg')" :
     "url('/assets/images/icon-sun.svg')"
    header.style.background = isLightMode ? 
    (screen.width <= 601 ? "url('/assets/images/bg-mobile-light.jpg')":"url('/assets/images/bg-desktop-light.jpg')"):
    (screen.width <= 601 ? "url('/assets/images/bg-mobile-dark.jpg')":"url('/assets/images/bg-desktop-dark.jpg')")
    header.style.backgroundRepeat = "no-repeat"
    todoInput.style.background = isLightMode ? "#fff":"#25273C"
    document.body.style.background =  isLightMode ? "#fff":"#151521"
    todoAll.style.background = isLightMode ? "#fff":"#25273C"
    toggleBtn.style.background = isLightMode ? "#fff":"#25273C"
    form.children[1].style.color = isLightMode ? "rgba(0,0,0,0.7)":"#fff"
    for (const iterator of document.querySelectorAll(".inputtag")) {
        iterator.style.color = isLightMode ? "rgba(0,0,0,0.7)":"#fff"
    }
    for (const iterator of document.querySelectorAll(".todo-item")) {
        iterator.style.background = isLightMode ? "#fff":"#25273C"
    }
}

screen.orientation.addEventListener('change', e => {
    
    if (isLightMode) {
        if (e.currentTarget.type === 'landscape-primary') {
            header.style.background = "url('/assets/images/bg-desktop-light.jpg')"
        } else if (e.currentTarget.type === 'portrait-primary') {
            header.style.background = "url('/assets/images/bg-mobile-light.jpg')"
        }
    }

  })

const deleteItem = elem => {
    elem.classList.add("removed")
    isdeleted = true
}

const markComplete = (elem) => {

    let completed = document.querySelectorAll("[data-isChecked='true']")
    let isChecked = elem.getAttribute("data-isChecked")
    let isCheckedBool = isChecked === 'true'
    isCheckedBool = !isCheckedBool
    elem.setAttribute("data-isChecked",isCheckedBool)
    if (elem.getAttribute("data-isChecked") === "true") {
        elem.classList.add("checked")
        elem.parentNode.children[1].style.textDecoration = "line-through"
        elem.parentNode.setAttribute("data-listChecked",'true')
        elem.parentNode.children[1].style.opacity = '0.25'
        itemCount.textContent = `${(todoAll.children.length-1)-(completed.length+1)}`
        
    } else {
        elem.classList.remove("checked")
        elem.parentNode.setAttribute("data-listChecked",'false')
        elem.parentNode.children[1].style.textDecoration = "none"
        elem.parentNode.children[1].style.opacity = '1'
        itemCount.textContent = `${((todoAll.children.length-1)-(completed.length+1))+2}`
    }

}

const clearCompleted = () => {

    if (didgetAll && (!didgetActive && !didgetCompleted)) {
        let completed = document.querySelectorAll("[data-isChecked='true']")
        completed.forEach(elem => {
            elem.parentNode.classList.add("removed")
            isdeleted = true
            isCleared = true
        });
        setTimeout(()=> {
            isdeleted = false
            isCleared = false
        },900)
    }
}


const getAll = (elem)=> {
    didgetActive = false
    didgetAll = true
    didgetCompleted = false

    document.querySelectorAll(".active").forEach(el => {
        el.classList.remove("active")
        
    })
    elem.classList.add("active")

    unCheckedItems.forEach(element => {
        todoAll.prepend(element)
    });
    checkedItems.forEach(element => {
        todoAll.prepend(element)
    });
}

const getActive = (elem)=> {
    document.querySelectorAll(".active").forEach(el => {
        el.classList.remove("active")
        
    })
    elem.classList.add("active")

    if (didgetCompleted) {
       
        unCheckedItems.forEach(element => {
            todoAll.prepend(element)
        });

        let completed = document.querySelectorAll("[data-listChecked='true']")
        checkedItems = completed
        completed.forEach(element => {
            element.remove()
        });
    
    } else {
        let unChecked = document.querySelectorAll("[data-listChecked='false']")
        if (unChecked.length === 0) {
            return
        }
        let completed = document.querySelectorAll("[data-listChecked='true']")
        checkedItems = completed
        completed.forEach(element => {
            element.remove()
        });
    }

    didgetActive = true
    didgetAll = false
    didgetCompleted = false
   
}


const getCompleted = (elem)=> {
    
    let completed = document.querySelectorAll("[data-listChecked='true']")
    document.querySelectorAll(".active").forEach(el => {
        el.classList.remove("active")  
    })
    elem.classList.add("active")    

    if (didgetActive) {
        
        let unChecked = document.querySelectorAll("[data-listChecked='false']")
        unCheckedItems = unChecked

        unChecked.forEach(element => {
            element.remove()
        });

        checkedItems.forEach(element => {
            todoAll.prepend(element)
        });
         
    } else {
        if (completed.length === 0) {
            return
        }
        let unChecked = document.querySelectorAll("[data-listChecked='false']")
        unCheckedItems = unChecked
        unChecked.forEach(element => {
            element.remove()
        });
    }

    didgetActive = false
    didgetAll = false
    didgetCompleted = true
}
