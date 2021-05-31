import axios from "axios";

export default class Posts{
    constructor(){
        this.newPostBtn = document.querySelector(".newpost-create")
        this.newPostCloseBtn = document.querySelector(".newpost-modal-close")
        this.newPostModal = document.querySelector(".newpost-modal")
        this.form = document.querySelector('.newpost-form')
        this.title = document.querySelector('.newpost-title')
        this.body = document.querySelector('.newpost-body')
        this.postSection = document.querySelector('.posts')
        this.events()
    }

    events(){
        this.newPostBtn.addEventListener("click", () => {
            this.newPostModal.style.display = "block";
          });
        this.newPostCloseBtn.addEventListener("click", () => {
            this.newPostModal.style.display = "none";
          });
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.newPostHandler()
        })
    }

    newPostHandler(){
        console.log("HEELLLLLO");
        let post = {
            title: this.title.value,
            body: this.body.value
        }
        axios.post('/posts/newpost', post).then(res => {
            this.newPostModal.style.display = "none";
            this.postSection.insertAdjacentHTML('beforeend', '<br>')
            let postDiv = document.createElement('div')
            postDiv.className='post'
            postDiv.innerHTML = `
                <h2 class="post-title"> ${post.title} </h2>
                <p class="post-author">Posted by You on Now</p>
                <p class="post-content">
                ${post.body}
                </p>`
            // this.postSection.insertAdjacentHTML('beforeend',postDiv)
            this.postSection.appendChild(postDiv)
        })
    }
}