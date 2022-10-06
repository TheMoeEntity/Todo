<script>
    import {ToDoItems} from '../stores/store'
    import {ActiveItems} from '../stores/active'
    import {CompletedItems} from '../stores/completed'
    import { fade, scale, slide} from 'svelte/transition'
    import Listitem from "./listitem.svelte";
    import {Helper} from '../helper'
    
    let didGetActive = false
    let didGetAll = true
    let didGetCompleted = false
    let helper = new Helper()

    $: currItems = $ActiveItems.length===0 ? "No items":
                $ActiveItems.length===1 ? "1 item left": `${$ActiveItems.length} items left`

    const clearCompleted = () => {
        helper.clearCompleted($CompletedItems)
    }
    const getAll = ()=> {
        didGetAll = true
        didGetActive = false
        didGetCompleted = false
    }
    const getActive = ()=> {
        didGetAll = false
        didGetActive = true
        didGetCompleted = false

    }
    const getCompleted = ()=> {
        didGetAll = false
        didGetActive = false
        didGetCompleted = true
    }
    export let setlight = false
</script>

 <ul id="todo-all" style="background: {setlight===false ? "#25273C":"white"}">
        {#if $ToDoItems.length===0 && didGetAll}
            <div in:fade>
                <center class="{setlight ? "light":null}">You have no items in your to-do </center>
            </div>
            {:else if didGetActive && $ActiveItems.length===0}
            <div in:fade>
                <center class="{setlight ? "light":null}">You have no active items in your to-do </center>
            </div>
            {:else if didGetCompleted && $CompletedItems.length===0}
            <div in:fade>
                <center class="{setlight ? "light":null}">You have no completed to-dos </center>
            </div>

        {/if}

        {#if didGetAll}
            {#each $ToDoItems as todo (todo.id)}
                <div in:scale out:slide>
                    <Listitem {setlight} comp={todo.completed} itemID={todo.id} text={todo.text} />
                </div>    
            {/each}

        {:else if didGetActive}
            {#each ($ActiveItems) as active (active.id)}
                <div in:scale out:slide>
                    <Listitem {setlight} comp={false} itemID={active.id} text={active.text} />
                </div>    
         {/each}

        {:else if didGetCompleted}
            {#each $CompletedItems as comp (comp.id)}
                <div in:scale out:slide>
                    <Listitem {setlight} comp={true} itemID={comp.id} text={comp.text} />
                </div>    
         {/each}

        {/if}

        <div id="todo-actions" class="todo-actions">
            <span><span id="itemCount">{currItems}</span></span>
            <div id="toggleBtns-large">
                <button class="toggle {didGetAll ? "active":null}" data-id="todo-all" data-istoggled=true on:click={()=> getAll()}>All</button>
                <button class="toggle {didGetActive ? "active":null}"  data-id="todo-active" data-istoggled=false on:click={()=> getActive()}>Active</button>
                <button class="toggle {didGetCompleted ? "active":null}" data-id="todo-completed" data-istoggled=false on:click={()=> getCompleted()}>Completed</button>
            </div>
            <button on:click={()=>clearCompleted()}>Clear Completed</button>
        </div>
    </ul>

        <div class="toggle-buttons" id="toggle-buttons">
            <div class="toggleWrapper" id="toggleWrapper" style="background: {setlight===false ? "#25273C":"white"}">
                <button class="toggle {didGetAll ? "active":null}" data-id="todo-all" data-istoggled=true on:click={()=> getAll()}>All</button>
                <button class="toggle {didGetActive ? "active":null}"  data-id="todo-active" data-istoggled=false on:click={()=> getActive()}>Active</button>
                <button class="toggle {didGetCompleted ? "active":null}" data-id="todo-completed" data-istoggled=false on:click={()=> getCompleted()}>Completed</button>
            </div>

            <br><br><br>
            <h4 class="{setlight ? "light":null}">Drag and drop to reorder list</h4>
        </div>


    <style>

        #todo-all {
            transition: background 1s ease;
        }
        center {
            opacity: 0.25;
            padding: 20px;
            border-bottom: 1px solid lightgray;
            font-size: small;
        }
        h4.light {
            color:rgba(0,0,0,0.7)
        }
        center.light {
            color: rgba(0,0,0,0.7);
        }
    </style>
