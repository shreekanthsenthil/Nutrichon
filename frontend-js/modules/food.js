import axios from "axios";

export default class Food{
    constructor(){
        this.breakfastAddBtn = document.querySelector(".breakfast-add")
        this.lunchAddBtn = document.querySelector(".lunch-add")
        this.dinnerAddBtn = document.querySelector(".dinner-add")
        this.snackAddBtn = document.querySelector(".snack-add")
        this.addFoodCloseBtn = document.querySelector(".add-food-modal-close")  
        this.searchField = document.querySelector('.search-field')
        this.breakfastArea = document.querySelector('.breakfast-foods')
        this.lunchArea = document.querySelector('.lunch-foods')
        this.dinnerArea = document.querySelector('.dinner-foods')
        this.snackArea = document.querySelector('.snack-foods')
        this.foodSearchModal = document.querySelector(".add-food-modal")
        this.totalCaloriesField = document.querySelector('.total-calorie-num')
        this.addFoodType = ""
        this.typingTimer
        this.previousValue = ""
        this.totalCalories = 0
        this.searchResultArea = document.querySelector('.food-result-area')
        this.activeAddArea
        this.events()
        this.circle = document.querySelector(".progress-ring__circle");
        this.circumference = 0

        this.circle2 = document.querySelector(".progress-ring__circle2");
        this.circleInitial()
        this.initializeFoodData()
           
    }

    circleInitial(){
        let radius = this.circle.r.baseVal.value;
        this.circumference = radius * 2 * Math.PI;
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = 62;

        let radius2 = this.circle2.r.baseVal.value;
        let circumference2 = radius2 * 2 * Math.PI;
        this.circle2.style.strokeDasharray = `${circumference2} ${circumference2}`;
        this.circle2.style.strokeDashoffset = 0;
    }

    events(){
        this.breakfastAddBtn.addEventListener("click", () => {
            this.foodSearchModal.style.display = "block";
            this.activeAddArea = this.breakfastArea
            this.addFoodType = "breakfast"
        });
        this.lunchAddBtn.addEventListener("click", () => {
            this.foodSearchModal.style.display = "block";
            this.activeAddArea = this.lunchArea
            this.addFoodType = "lunch"
        });
        this.dinnerAddBtn.addEventListener("click", () => {
            this.foodSearchModal.style.display = "block";
            this.activeAddArea = this.dinnerArea
            this.addFoodType = "dinner"
        });
        this.snackAddBtn.addEventListener("click", () => {
            this.foodSearchModal.style.display = "block";
            this.activeAddArea = this.snackArea
            this.addFoodType = "snack"
        });
        
        this.addFoodCloseBtn.addEventListener("click", () => {
            this.foodSearchModal.style.display = "none";
        });

        this.searchField.addEventListener('keyup', () => {
            this.keyPressHandler()
        })
    }

    keyPressHandler(){
        let value = this.searchField.value

        if(value == ""){
            clearTimeout(this.typingTimer)
            this.renderBlankHTML()
        }

        if(value !="" && value != this.previousValue){
            clearTimeout(this.typingTimer)
            this.typingTimer = setTimeout(() => {this.sendRequest()}, 750)
        }
        this.previousValue = value
    }

    sendRequest() {
        console.log("Sending request")
        axios.post('/food/search', {searchTerm: this.searchField.value}).then((response) => {
            console.log(response.data)
            this.renderHTML(response.data)
        }).catch((e) => {
            console.log(e)
            alert("FAIL")
        })
    }

    renderHTML(foods){
        if(foods.length){
            this.searchResultArea.innerHTML = `
            ${foods.map(food => {
                return `
                <div class="food">
                <p>${food.fooditem} <span>(${food.calories} Cal)</span> </p>
                    <button class="add-food" data-name="${food.fooditem}" data-calories="${food.calories}">Add</button>
                </div>
                `
            }).join('') }
            `
            this.addBtnListener()
        } else {
            this.searchResultArea.innerHTML = `<p class="alert alert-danger text-center shadow-sm">Sorry, we could not find any results for that search</p>`
        }
    }

    renderBlankHTML(){
        this.searchResultArea.innerHTML = `<p class="alert alert-danger text-center center shadow-sm">Please type Food Name to search</p>`
    }
    addBtnListener(){
        let addBtns = document.querySelectorAll('.add-food')
        addBtns.forEach(addBtn => {
            addBtn.addEventListener('click', e => {
                console.log(e);
                this.addFood(e.target)
            })
        })
    }
    
    addFood(food){
        axios.post('/food/addfood', {food: food.dataset.name, calorie: food.dataset.calories, type: this.addFoodType}).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
        let foodHTML = `
        <div class="meal-food" data-food=${food.dataset.name} data-calories=${food.dataset.calories} data-quantity='1' data-type=${this.addFoodType}>
            <p>${food.dataset.name}</p>
            <div class="meal-food-quantity">
              <span class="food-cal">${food.dataset.calories} Cal</span>
              <button class="meal-food-quantity-minus "><i class="fas fa-minus-circle counter-decrease"></i></button>
              <span class="meal-food-quantity-number counter">1</span>
              <button class="meal-food-quantity-plus "><i class="fas fa-plus-circle counter-increase"></i></button>
            </div>
          </div>
        `
        this.activeAddArea.insertAdjacentHTML('beforeend', foodHTML)
        this.foodSearchModal.style.display = "none";
        this.updateCalorie()
        this.counterEvent()
    }

    updateCalorie(){
        let meals = document.querySelectorAll('.meal-food')
        this.totalCalories = 0
        meals.forEach(meal => {
            let quantity = parseInt(meal.dataset.quantity)
            let calorie = parseInt(meal.dataset.calories)
            // console.log(calorie);
            let calories = quantity * calorie
            this.totalCalories+=calories
        })
        this.totalCaloriesField.innerHTML = `<span>${this.totalCalories}</span> of 2500 Calories Consumed`
        let percent = parseInt(this.totalCalories/2500 * 100)
        console.log(percent);
        let offset = this.circumference - percent / 100 * this.circumference;
        this.circle.style.strokeDashoffset = offset;      
        console.log(this.circle.style.strokeDashoffset);
    }

    counterEvent(){
        let increase = document.querySelectorAll('.counter-increase')
        increase.forEach(inc => inc.addEventListener('click', e => this.increaseHandler(e.target)))

        let decrease = document.querySelectorAll('.counter-decrease')
        decrease.forEach(dec => dec.addEventListener('click', e => this.decreaseHandler(e.target)))
    }

    increaseHandler(e){
        let parent = e.parentElement.parentElement.parentElement
        let quantity = parseInt(parent.dataset.quantity) + 1
        let type = parent.dataset.type
        let food = parent.dataset.food
        // console.log(parseInt(parent.dataset.quantity));
        parent.dataset.quantity = quantity
        let counter = parent.querySelector('.counter')
        counter.innerText = quantity
        axios.post('/food/setquantity', {type: type, food: food, quantity: quantity}).then(res => {
            console.log(res);
        }).catch(err => console.log(err))
        this.updateCalorie()
    }

    decreaseHandler(e){
        let parent = e.parentElement.parentElement.parentElement
        let type = parent.dataset.type
        let food = parent.dataset.food
        let quantity = parseInt(parent.dataset.quantity) - 1
        if(quantity <= 0){
            parent.remove()
        } else {
            parent.dataset.quantity = quantity
            let counter = parent.querySelector('.counter')
            console.log(counter.innerText);
            counter.innerText = quantity
        }
        axios.post('/food/setquantity', {type: type, food: food, quantity: quantity}).then(res => {
            console.log(res);
        }).catch(err => console.log(err))
        this.updateCalorie()
    }
    initializeFoodData(){
        axios.get('/food/getfooddata').then(res => {
            console.log(res);
            if(res.data){
                let foodData = res.data
                let breakfast = foodData.breakfast
                let lunch = foodData.lunch
                let dinner = foodData.dinner
                let snack = foodData.snack
                breakfast.forEach(food => {
                    this.addFoodInitial(food, this.breakfastArea, 'breakfast')
                })
                lunch.forEach(food => {
                    this.addFoodInitial(food, this.lunchArea, 'lunch')
                })
                dinner.forEach(food => {
                    this.addFoodInitial(food, this.dinnerArea, 'dinner')
                })
                snack.forEach(food => {
                    this.addFoodInitial(food, this.snackArea, 'snack')
                })
                this.counterEvent()
                this.updateCalorie()
            }
        }).catch(err => console.log(err))
    }

    addFoodInitial(food, activeArea, type){
        if(food.quantity >=1){
            let tCal = parseInt(food.calorie) * parseInt(food.quantity) 
            let foodHTML = `
            <div class="meal-food" data-food=${food.food} data-calories=${food.calorie} data-quantity='${food.quantity}' data-type=${type}>
                <p>${food.food}</p>
                <div class="meal-food-quantity">
                <span class="food-cal">${tCal} Cal</span>
                <button class="meal-food-quantity-minus "><i class="fas fa-minus-circle counter-decrease"></i></button>
                <span class="meal-food-quantity-number counter">${food.quantity}</span>
                <button class="meal-food-quantity-plus "><i class="fas fa-plus-circle counter-increase"></i></button>
                </div>
            </div>
            `
            activeArea.insertAdjacentHTML('beforeend', foodHTML)
        }
    }
}
