<script>
	import Header from "./components/Header.svelte";
	import Maincontent from "./components/maincontent.svelte";
	import Todocontainer from "./components/Todocontainer.svelte";
	import { onMount } from "svelte"
	import {ToDoItems} from './stores/store'
	import {CompletedItems} from './stores/completed'
	import {ActiveItems} from './stores/active'
	

	sessionStorage.clear()
	let savestore = false
	$: if (savestore && $ToDoItems && $CompletedItems && $ActiveItems) {
	window.sessionStorage.setItem("store", JSON.stringify($ToDoItems))
	window.sessionStorage.setItem("completed", JSON.stringify($CompletedItems))
	window.sessionStorage.setItem("active", JSON.stringify($ActiveItems))

	}
	onMount(async () => {

		let ses = window.sessionStorage.getItem("store")
		let comp = window.sessionStorage.getItem("completed")
		let active = window.sessionStorage.getItem("active")

		if (ses) {
			$ToDoItems = JSON.parse(ses)
		}
		if (comp) {
			$CompletedItems = JSON.parse(comp)
		}
		if (active) {
			$ActiveItems = JSON.parse(active)
		}

		savestore = true

	})

	let setlight = false
	const handleLightMode = e => {
		setlight = e.detail
	}
</script>

<main id="mainwrapper">
	<Header on:switch-LightMode={handleLightMode} />
	<Maincontent>
		<Todocontainer {setlight} />
	</Maincontent> 
	
</main>
<style>
	main {
		color:whitesmoke
	}
</style>