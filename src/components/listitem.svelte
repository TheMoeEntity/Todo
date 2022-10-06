<script>
    import {ToDoItems} from '../stores/store'
    import {CompletedItems} from '../stores/completed'
    import {ActiveItems} from '../stores/active'
    import {Helper} from '../helper'
    export let text
    export let itemID
    export let comp=false
    let currToDo = $ToDoItems.filter(item => item.id === itemID)
    let circle
    let list
    let input
    let helper = new Helper()
    $: isChecked = currToDo[0]?.completed ?? false
	const markComplete = () => {
        isChecked = !isChecked
        
        
        if (isChecked) {
            circle.classList.add("checked")
            input.classList.add('strike')
            comp=true
            currToDo[0].completed = true
            ToDoItems.update((currentItem)=> {
                let updatedItems = currentItem
                return updatedItems
            })

            CompletedItems.update((currentItem)=> {

                return [
                    {
                        id: itemID,
                        item: list,
                        text: text,
                        completed: false
                    },
                    ...currentItem
                ]
            })

            ActiveItems.update(_currentItem => {
                let allActive = $ToDoItems.filter(item => item.completed === false)
                return allActive
            })
            helper.updateActive($ToDoItems)


            
        } else {
            circle.classList.remove("checked")
            input.classList.remove('strike')
            comp = false
            CompletedItems.update((currentItem)=> {
                return currentItem.filter(item => item.id != itemID)
            })
            currToDo[0].completed = false
            ActiveItems.update((currentItem)=> {
                return [
                    {
                        id: itemID,
                        date: new Date(),
                        text: text,
                        completed: false
                    },
                    ...currentItem
                ]
            })
        } 
    }

    const deleteItem = () => {
        ToDoItems.update((currentItem)=> {
            return currentItem.filter(item => item.id != itemID)
        })
        
    }
   export let setlight
</script>

    <li class="todo-item"  bind:this={list} data-isChecked={isChecked}  draggable=true>
        <div class="circle {comp ? "checked":null}" bind:this={circle} on:click={()=> markComplete()}></div>
        <input style="color:{setlight ? "rgba(0,0,0,0.7)":"#fff"}" class=" {comp ? "strike":null}" bind:this={input}  readonly value={text}>
        <div><img on:click={()=> deleteItem()} src="assets/images/icon-cross.svg" alt=""></div>
    </li>

<style>
    input {
        transition: opacity 0.25s ease, color 1s ease;
        font-size: 12px;
    }
    .circle {
        transition: background 0.3s ease;
    }
    .strike {
        text-decoration: line-through;
        opacity: 0.25;
    }
	.circle.checked {
        /* Created with https://www.css-gradient.com */
        background: url('/assets/images/icon-check.svg'), #58DDFF;
        background: url('/assets/images/icon-check.svg'), -webkit-radial-gradient(top left, #58DDFF, #C058F3);
        background: url('/assets/images/icon-check.svg'), -moz-radial-gradient(top left, #58DDFF, #C058F3);
        background: url('/assets/images/icon-check.svg'), radial-gradient(to bottom right, #58DDFF, #C058F3);
        background-position: center;
        background-clip: padding-box;
        transition: background 0.3s ease;
    }   
</style>