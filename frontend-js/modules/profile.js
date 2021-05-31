import axios from "axios"

export default class Profile{
    constructor() {
        this.nameField = document.querySelector('.name-field')
        this.passwordField = document.querySelector('.password-field')
        this.phoneField = document.querySelector('.phone-field')
        this.genderField = document.querySelector('.gender-field')
        this.heightFeild = document.querySelector('.height-field')
        this.cancelButton = document.querySelector('.cancel-button')
        this.submitButton = document.querySelector('.submit-button')
        this.events()
    }
    
    events(){
        this.cancelButton.onclick = () => {
            this.cancelHandler()
        }
        this.submitButton.onclick = () => {
            this.submitHandler()
        }
    }

    cancelHandler(){
        window.location.href = "/"
    }

    validateForm(){
        let phone = this.phoneField.value
        let gender = this.genderField.value
        let re = /^[6-9]\d{9}$/
        let phoneValid = re.test(String(phone))
        re = /^male$|^female$/i
        let genderValid = re.test(String(gender))
        if(phoneValid != true) {
            alert("Enter a valid Phone Number")
        }
        if(genderValid != true) {
            alert("Enter a valid Gender")
        }
        return genderValid && phoneValid
    }

    submitHandler(){
        if(this.validateForm()){
            axios.post('/users/updateuser', {
              name: this.nameField.value,
              password: this.passwordField.value,
              phone: this.phoneField.value,
              gender: this.genderField.value,
              height: this.heightFeild.value  
            }).then(response => {
                window.location.href='/'
            }).catch(e => {
                console.log(e);
            })
        }
    }

    
}
