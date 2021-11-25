import axios from "axios";

export default class Weight{
    constructor(){
        this.weightField = document.querySelector('.weight-input')
        this.bmiIndicators = document.querySelectorAll('.bmi-indicator')
        this.bmiTextField = document.querySelector('.bmi-text')
        this.bmiText = ""
        this.getWeightData()
        this.data = [
          ["Date", "Weight"],
          ["30.5", 67],
          ["31.5", 67.5],
          ["01.6", 66.9],
          ["02.6", 67.8],
          ["03.6", 68],
          ["04.6", 68.3]
          ]
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(() => {this.drawChart(this.data)});
        // this.drawChart(data)
        this.events()
    }

    drawChart(data) {
        var data = google.visualization.arrayToDataTable(data);

        var options = {
          title: "Weight",
          hAxis: { title: "Date" },
          vAxis: { title: "Weight (in kgs)" },
          height: 300,
          width: "100%",
          legend: {
            position: "none",
          },
          backgroundColor: "beige",
        };

        var chart = new google.visualization.LineChart(
          document.getElementById("weightgraph")
        );

        chart.draw(data, options);
      }

      events(){
        this.weightField.addEventListener('keypress', (e) => {
            this.newWeightHandler(e)
        })
        // window.addEventListener('resize', this.drawChart(this.data))
      }

      newWeightHandler(e){
        if(e.key === 'Enter'){
            let newWeight = this.weightField.value
            axios.post('/users/setweight', {weight: newWeight}).then(res => {
                this.data = [
                    ["Date", "Weight"],
                    ["30.5", 67],
                    ["31.5", 67.5],
                    ["01.6", 66.9],
                    ["02.6", 67.8],
                    ["03.6", 68],
                    ["04.6", 68.3],
                    ["05.6", newWeight]
                  ]
                google.charts.setOnLoadCallback(() => {this.drawChart(this.data)});
                this.updateBMI(newWeight)
            }).catch(err => {
                console.log(err);
            })
        }
      }

      getWeightData(){
          axios.get('/users/getweights').then(res => {
            //   console.log(res);
              let weight = res.data[res.data.length-1].weight
              console.log(weight);
              this.updateBMI(weight)
          }).catch(err => {
              console.log(err);
          })
      }

      updateBMI(weight){
        let height = 170
        height = height/100
        height = height * height
        let bmi = weight / height
        let bmiLevel = bmi/40*100
        console.log(bmi);
        this.bmiIndicators.forEach(bmiIndicator => {
            bmiIndicator.style.marginLeft = bmiLevel + "%"
        })
        if(bmi <= 18.5){
            this.bmiText = 'UnderWeight'
        }
        else if(bmi <=24.9){
            this.bmiText = 'Healthy'
        }
        else if(bmi <=29.9){
            this.bmiText = 'Overweight'
        }
        else if(bmi <= 34.9){
            this.bmiText = 'Obese'
        }
        else {
            this.bmiText = 'Severely Obese'
        }
        this.bmiTextField.innerHTML = this.bmiText
      }
}