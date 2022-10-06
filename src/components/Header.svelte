<script>
    import {ToDoItems} from '../stores/store'
    import {createEventDispatcher} from 'svelte'
    import {Helper} from '../helper'

    let helper = new Helper()
    let todo = ""
    let isLightMode = false
    const dispatch = createEventDispatcher()
    const toggleLightMode = () => {
        isLightMode = !isLightMode
        localStorage.setItem("lightmode",isLightMode ? "light":null)
        document.body.style.background =  isLightMode ? "#fff":"#151521"
        dispatch('switch-LightMode', isLightMode)
    }
    const call = () => {
        ToDoItems.update((currentItem)=> {
            
                return [
                    {
                        id: $ToDoItems.length+1,
                        date: new Date(),
                        text: todo,
                        completed: false
                    },
                    ...currentItem
                ]
            })
            helper.updateActive($ToDoItems)
            todo = "" 
    }

</script>


<header class="{isLightMode ? "lightmode":"dark"}">

    <div class="toolbar">

        <div class="title-and-switch">
            <h1>T O D O</h1>
            
            <button style="background: {
                isLightMode ? "url('/assets/images/icon-moon.svg')" :"url('/assets/images/icon-sun.svg')"
            }" 
            on:click={()=>toggleLightMode()}
            id="switchBtn"></button>
        </div>
        <div style="background:{isLightMode ? "#fff":"#25273C"}" class="todoinput">
            <form id="form" on:submit|preventDefault={call}>
                <div class="circle"></div>
                <input style="color:{isLightMode ? "rgba(0,0,0,0.7)":"#fff"}" type="text" bind:value={todo} id="" placeholder="Create a new todo...">
            </form>
        </div>

    </div>
</header>




<style>
    header {
        width: 100%;
        height: 200px;
        background-repeat: no-repeat;
    }
    header.lightmode {
        background: url(/assets/images/bg-mobile-light.jpg);
    }
    @media screen and (max-width:600px) {
        header {
            background: url(/assets/images/bg-mobile-dark.jpg);
        }
    }
    @media screen and (min-width:601px) {
    header {
        background: url(/assets/images/bg-desktop-dark.jpg);
        background-repeat: no-repeat;
        height: 300px;
    }
    header.lightmode {
        background: url(/assets/images/bg-desktop-light.jpg);
    }
    input {
        width:87%;
    }
    .toolbar>div {
        height: 36%;
    }
    .toolbar {
        max-width: 650px;
    }

}
</style>