$(document).ready(function(){
function uuid() {
   	return (((1+Math.random())*0x10000)|0).toString(8).substring(1);
}
			
const Item = Backbone.Model.extend({
	defaults: {entry: "", id: 0, important: false}
});
        	
const Items = Backbone.Collection.extend({
    model: Item,
});

        	
items = new Items();

populateCollectionFromLocalStorage(items);
     	 
     	 
     	 
//--------------------------------------------------------------------------------------
     	 
     	 
// THIS IS TRIGGERED WHEN ADDING AN ITEM    	
$("#add").keydown(function(key){
    const code = key.which; // Get code of pressed key.
    
    if(code==13){ // If the code indicates a press of enter key, save the item.
        key.preventDefault();
    	const entry = $('#add').val(); // Get text of the item from the input field.
    	if (entry!=""){
    	    const important = (entry.match(/.+\*/)) ? true : false;
    	    if(important){entry = entry.slice(0, -1);}
        	items.add({entry: entry, id: uuid(), important: important}); // Generate item and add to list.
        	saveItemsInCollectionToLocalStorage(items);
        	draw(items); // Draw items.
        }
    }
});

// THIS IS CALLED TO REDRAW THE VIEW
function draw(collection){ 
	$("#important").html(""); 
	$("#placehold-container").html("");
	$("#normal").html(""); // Reset the displayed items.
	
    collection.each(function(item){ // Add a row for each item.
        if(item.get("important")){
            $("#important").prepend('<div class="row" ' + 'data-id="' + item.get("id") + '">' + item.get("entry") + '</row>');
            console.log("imp");
        }
        else{
      	    $("#normal").prepend('<div class="row" ' + 'data-id="' + item.get("id") + '">' + item.get("entry") + '</row>');
      	}
    }); 
    
	$("#add").val(""); // Clear the input field.
    reMapItemDeleteClickHandlers(); // Update click handlers for deleting items.
	insertPlaceholderIfEmptyList(items);
}


// REMAPS CLICK BINDING FOR DELETING ITEMS
function reMapItemDeleteClickHandlers(){ 
	$(".row").click(function(){
		const item = items.get($(this).data("id"));
		items.remove(item);
		saveItemsInCollectionToLocalStorage(items);
		$("#add").focus();
		draw(items);
	});
}

function insertPlaceholderIfEmptyList(collection){ // Called after drawing view
	if (collection.length == 0){
		$("#placehold-container").prepend('<div class="row placeholder">Add Something above, and append "*" for important items.</div>');
	}
}

function saveItemsInCollectionToLocalStorage(collection){
	localStorage.clear(); // Clear localStorage before rewriting to it.
	collection.each(function(item){
	    const itemData = JSON.stringify({entry: item.get("entry"), important: item.get("important")});
		localStorage.setItem(item.get("id"), itemData);
	});
}

function populateCollectionFromLocalStorage(collection){
	for (let i = 0; i < localStorage.length; i++){
    	var item = JSON.parse(localStorage.getItem(localStorage.key(i)));
    	items.add({entry: item.entry, id: localStorage.key(i), important: item.important});
	}
	draw(items);
}
});



/* This code will be used to handle editing items inline.

$(".row").click(function(){
	var entry = $(this).val(); // Get text of the item from the input field.
	var id = $(this).data("id");
	var inputTag = "<input class='row editRow' data-id='" + id || "" + "' value='" + entry || "" + "'";
	$(this).replaceWith(inputTag || "<input>");
	console.log("g");
});

$(".editRow").keydown(function(){
	var code = key.which; // Get code of pressed key.
    if(code == 13) key.preventDefault();
    
    if(code==13||code==188||code==186){ // If the code indicates a press of enter key, save the item.
    	var entry = $(this).val(); 
		var id = $(this).data("id");
    	if (entry!=""){
        	items.get(id).set({entry: entry}); // change model of item corresponding to row.
        	draw(items); // Draw items.
        	updateItemDeleteClickHandlers();
        	saveItemsInCollectionToLocalStorage(items);
        }
        $(this).replaceWith('<div class="row" ' + 'data-id="' + id + '">' + entry + '</row>');
    }
});
9*/