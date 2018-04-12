(function(){

	/*====Modal====*/
	var modal = {
		currentCat: null,
		adminView: false,
		cats: [
			{
				clickCount: 0,
				name: 'Fluff',
				imgSrc: 'img/cat_picture1.jpg'
			},
			{
				clickCount: 0,
				name: 'Silky',
				imgSrc: 'img/cat_picture2.jpeg'
			},
			{
				clickCount: 0,
				name: 'Taco',
				imgSrc: 'img/cat_picture3.jpeg'
			},
			{
				clickCount: 0,
				name: 'Melly',
				imgSrc: 'img/cat_picture4.jpeg'
			},
			{
				clickCount: 0,
				name: 'Waffle',
				imgSrc: 'img/cat_picture5.jpeg'
			}
			]
	};

	/*====Octopus====*/
	var octopus = {
		init : function(){
			//Set current cat to first one on the list
			modal.currentCat = modal.cats[0];
			//Tell views to initialize
			catListView.init();
			catDetailedView.init();
			formView.init();
		},

		getCurrentCat: function(){
			return modal.currentCat;
		},

		getCats: function(){
			return modal.cats;
		},

		setCurrentCat: function(catToBeSet){
			modal.currentCat = catToBeSet;
		},

		incrementCounter: function(){
			//increment count of current cat
			++modal.currentCat.clickCount;
			//render detailed view and form
			catDetailedView.render();
			formView.render();
		},

		getAdminDisplay: function(){
			return modal.adminView;
		},

		openView: function(){
			modal.adminView = true;
		},

		closeView: function(){
			modal.adminView = false;
		},

		saveCurrentCat: function(){
			//update current cat with new data
			modal.currentCat.name = formView.name.value;
			modal.currentCat.imgSrc = formView.imgURL.value;
			modal.currentCat.clickCount  = formView.clicks.value
			//render the view
			catDetailedView.render();
			catListView.render();
			//close form
			formView.closeForm();
		},
	};

	/*====View: Part 1/3====*/
	var catListView = {
		init: function(){
			//store the DOM elements for easy access
			this.catListElement = document.querySelector('.cat-list');
			//render the view
			this.render();
		},

		render: function(){
			//get the list of cats
			let cats = octopus.getCats();
			//empty cat list
			this.catListElement.innerHTML = '';
			//create a docFrag and add the cat list HTML to it.
			let docFragElement = document.createDocumentFragment();
			//For each cat repeat the following
			cats.forEach(function(cat){
				let catToListElement = document.createElement('li');
				catToListElement.textContent = cat.name;
				//Create an event listener for each cat on the list.
				catToListElement.addEventListener('click', (function(cat){
					return function(){
						//set current cat to cat just clicked
						octopus.setCurrentCat(cat);
						//render detailed and form views
						catDetailedView.render();
						formView.render();
					};
				}(cat)));
				//Add each cat to the list
				docFragElement.appendChild(catToListElement);
			});
			//Add docfrag to the catlistElement.(docFrag reduces reflow).
			this.catListElement.appendChild(docFragElement);
		}
	};

	/*====View: Part 2/3====*/
	var catDetailedView = {
		init: function(){
			//store pointers to our DOM elements for easy access later
			this.catElement = document.querySelector('.cat');
			this.catNameElement = document.querySelector('.cat-name');
			this.catCountElement = document.querySelector('.cat-count');
			this.catImgElement  = document.querySelector('.cat-img');
			//on click incriment the current cats counter
			this.catImgElement.addEventListener('click', function(){
				octopus.incrementCounter();
			});
			//render this view
			this.render();
		},

		render: function(){
			//Update the DOM elements
			let currentCat = octopus.getCurrentCat();
			this.catNameElement.textContent = currentCat.name;
			this.catCountElement.textContent = 'Clicks count: ' + currentCat.clickCount;
			this.catImgElement.src = currentCat.imgSrc;
		}
	};

	/*====View: Part 3/3====*/
	var formView = {
		init: function(){
			//store pointers to our DOM elements for easy access later
			this.name = document.querySelector('.name-input');
			this.imgURL = document.querySelector('.imgurl-input');
			this.clicks = document.querySelector('.clicks-input');
			this.form = document.querySelector('.admin-form');
			this.adminButton = document.querySelector('.admin-button');
			this.saveButton = document.querySelector('.save-button');
			this.cancelButton = document.querySelector('.cancel-button');
			//Hide Form Element as default
			if(!octopus.getAdminDisplay())
				this.form.style.display = "none";
			//Event listeners
			//If admin button is clicked display form.
			//(Below demonstrates passing 'this' into the eventListener)
			this.adminButton.addEventListener('click', (function(that){
					return function(){
						//If the Form is hidden, display it and update the form visibility in the modal
						if(!octopus.getAdminDisplay()){
							that.form.style.display = "block";
							octopus.openView();
						}
					}
			}(this)));
			//If cancel button is clicked reset data and display form
			this.closeForm = function(){
				//If the Form is displayed, update the form visibility in the modal
				if(octopus.getAdminDisplay){
					this.form.style.display = "none";
					//re-render the form incase user made any unsaved changes
					this.render();
					//close the form view
					octopus.closeView();
				}
			};
			//Event Listener that runs function per above
			//(Below demostrates using bind the provide value 'this' to the function)
			this.cancelButton.addEventListener('click', this.closeForm.bind(this));

			//If save button is pressed form data to the cat selected and updates the cat.
			this.saveButton.addEventListener('click', function(){
				octopus.saveCurrentCat();
			});
			this.render();
		},

		render: function(){
			let cat = octopus.getCurrentCat();
			this.name.value = cat.name;
			this.imgURL.value = cat.imgSrc;
			this.clicks.value = cat.clickCount;
		}
	}

	//Init function of controller/octopus to get things rolling.
	octopus.init();
}());