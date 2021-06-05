import Profile from "./modules/profile";
import Weight from "./modules/weight";
import Posts from "./modules/posts";
import Food from "./modules/food";

if(document.querySelector('.edit-profile')){
    new Profile()
}

if(document.querySelector('.home-page')){
    new Weight()
    new Posts()
    new Food()
}