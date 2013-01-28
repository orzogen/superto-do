$(document).ready(function(){
function uuid() {
   	return (((1+Math.random())*0x10000)|0).toString(8).substring(1);
}
			
var Item = Backbone.Model.extend({
	defaults: {entry: "", id: 0}
});
        	
var Items = Backbone.Collection.extend({
    model: Item,
});

        	
items = new Items();

populateCollectionFromLocalStorage(items);
     	 
     	 
     	 
//--------------------------------------------------------------------------------------
     	 
     	 
// THIS IS TRIGGERED WHEN ADDING AN ITEM    	
$("#add").keydown(function(key){
    var code = key.which; // Get code of pressed key.
    if(code == 13) key.preventDefault();
    
    if(code==13||code==188||code==186){ // If the code indicates a press of enter key, save the item.
    	var entry = $('#add').val(); // Get text of the item from the input field.
    	if (entry!=""){
        	items.add({entry: entry, id: uuid()}); // Generate item and add to list.
        	draw(items); // Draw items.
        	reMapItemDeleteClickHandlers();
        	saveItemsInCollectionToLocalStorage(items);
        }
    }
});

// THIS IS CALLED TO REDRAW THE VIEW
function draw(collection){ 
	$("#list").html(""); // Reset the displayed items.
	
    collection.each(function(item){ // Add a row for each item.
      	$("#list").prepend('<div class="row" ' + 'data-id="' + item.get("id") + '">' + item.get("entry") + '</row>');
    }); 
    
	$("#add").val(""); // Clear the input field.
    reMapItemDeleteClickHandlers(); // Update click handlers for deleting items.
	insertPlaceholderIfEmptyList(items);
}


// REMAPS CLICK BINDING FOR DELETING ITEMS
function reMapItemDeleteClickHandlers(){ 
	$(".row").click(function(){
		var item = items.get($(this).data("id"));
		items.remove(item);
		draw(items);
		saveItemsInCollectionToLocalStorage(items);
	});
}

function insertPlaceholderIfEmptyList(collection){ // Called after drawing view
	if (collection.length == 0){
		$("#list").prepend('<div class="row placeholder">Add Something ↑</div>');
	}
}

function saveItemsInCollectionToLocalStorage(collection){
	localStorage.clear(); // Clear localStorage before rewriting to it.
	collection.each(function(item){
		localStorage.setItem(item.get("id"), item.get("entry"));
	});
}

function populateCollectionFromLocalStorage(collection){
	for (var i = 0; i < localStorage.length; i++){
    	var item = localStorage.getItem(localStorage.key(i));
    	items.add({entry: item, id: localStorage.key(i)});
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